#!/usr/bin/env node
/**
 * Converts a my.flightradar24.com flight diary CSV export into the JSON format
 * used by /flights (`data/flights.json`), and keeps the airport lookup table
 * (`data/airports.json`) in sync.
 *
 *   node scripts/import-flightdiary.mjs flightdiary_2026_09_06_00_32.csv
 *
 * Airports that are not in the lookup table yet are resolved against the
 * OurAirports dataset (network). Entries already present are never overwritten,
 * so manual corrections survive re-imports. Rail stations (FR24 logs Thalys/TGV
 * segments as flights) are not in that dataset and have to be filled in by hand;
 * the script writes a stub and tells you which ones.
 *
 * Details the export is missing (a seat number never filled in on FR24) go in
 * `data/flight-overrides.json`, keyed by "<date> <flight number>". Whatever a
 * key holds is merged over the flight built from the CSV, so those corrections
 * survive re-imports too.
 *
 * Flags:
 *   --out <file>        output flight log      (default data/flights.json)
 *   --airports <file>   airport lookup table   (default data/airports.json)
 *   --overrides <file>  per-flight corrections (default data/flight-overrides.json)
 *   --offline           never hit the network, stub unknown airports instead
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const OURAIRPORTS_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";

// FR24 stores these as integers in the export
const SEAT_TYPES = { 1: "window", 2: "middle", 3: "aisle" };
const FLIGHT_CLASSES = { 1: "economy", 2: "business", 3: "first", 4: "premium-economy", 5: "private" };
const FLIGHT_REASONS = { 1: "leisure", 2: "business", 3: "crew", 4: "other" };

function parseArgs(argv) {
    const args = {
        csv: null,
        out: "data/flights.json",
        airports: "data/airports.json",
        overrides: "data/flight-overrides.json",
        offline: false,
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--out") args.out = argv[++i];
        else if (arg === "--airports") args.airports = argv[++i];
        else if (arg === "--overrides") args.overrides = argv[++i];
        else if (arg === "--offline") args.offline = true;
        else if (arg.startsWith("-")) fail(`unknown flag: ${arg}`);
        else args.csv = arg;
    }

    if (!args.csv) fail("usage: node scripts/import-flightdiary.mjs <flightdiary.csv> [--out data/flights.json] [--offline]");
    return args;
}

function fail(message) {
    console.error(`error: ${message}`);
    process.exit(1);
}

/** Minimal RFC 4180 parser -- the FR24 export quotes any field containing a comma or space. */
function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (quoted) {
            if (char !== '"') {
                field += char;
            } else if (text[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                quoted = false;
            }
            continue;
        }

        if (char === '"') {
            quoted = true;
        } else if (char === ",") {
            row.push(field);
            field = "";
        } else if (char === "\n") {
            row.push(field);
            rows.push(row);
            row = [];
            field = "";
        } else if (char !== "\r") {
            field += char;
        }
    }

    if (field !== "" || row.length) {
        row.push(field);
        rows.push(row);
    }

    // FR24 exports start with a blank line
    return rows.filter((r) => r.length > 1);
}

function csvToObjects(text) {
    const [header, ...rows] = parseCsv(text);
    return rows.map((row) => Object.fromEntries(header.map((column, i) => [column, (row[i] ?? "").trim()])));
}

/** "Zurich / Kloten (ZRH/LSZH)" -> { code, icao, city, name } */
function parseAirport(value) {
    const match = value.match(/^(.*?)\s*\(([^/]*)\/([^)]*)\)\s*$/);
    if (!match) fail(`cannot parse airport: ${JSON.stringify(value)}`);

    const [, label, iata, icao] = match;
    const [city, ...rest] = label.split(" / ");
    const code = iata.trim() || icao.trim();
    if (!code) fail(`airport without a code: ${JSON.stringify(value)}`);

    return { code, iata: iata.trim() || null, icao: icao.trim() || null, city: city.trim(), name: rest.join(" / ").trim() || city.trim() };
}

/** "Qatar Airways (QR/QTR)" -> { name, iata, icao }, or null when unset. */
function parseAirline(value) {
    const match = value.match(/^(.*?)\s*\(([^/]*)\/([^)]*)\)\s*$/);
    if (!match) return value.trim() ? { name: value.trim(), iata: null, icao: null } : null;

    const [, name, iata, icao] = match;
    if (!name.trim() && !iata.trim() && !icao.trim()) return null;
    return { name: name.trim(), iata: iata.trim() || null, icao: icao.trim() || null };
}

/** "Airbus A350-900 (A359)" -> { name, code }, or null for rail segments. */
function parseAircraft(value) {
    const match = value.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    if (!match) return value.trim() ? { name: value.trim(), code: null } : null;

    const [, name, code] = match;
    if (!name.trim() && !code.trim()) return null;
    // "Embraer Embraer E195-E2" -- FR24 doubles up the manufacturer on a few types
    return { name: name.trim().replace(/^(\S+) \1 /, "$1 "), code: code.trim() || null };
}

/** "05:50:00" -> 350 minutes */
function parseDuration(value) {
    const match = value.match(/^(\d+):(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, hours, minutes, seconds] = match;
    return Number(hours) * 60 + Number(minutes) + Math.round(Number(seconds) / 60);
}

/** "09:25:00" -> "09:25" */
function parseTime(value) {
    const match = value.match(/^(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : null;
}

function countryName(code) {
    if (!code) return null;
    try {
        return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
    } catch {
        return code;
    }
}

async function fetchOurAirports() {
    console.log(`  fetching ${OURAIRPORTS_URL} ...`);
    const response = await fetch(OURAIRPORTS_URL);
    if (!response.ok) fail(`OurAirports responded with ${response.status} ${response.statusText}`);

    const byIcao = new Map();
    const byIata = new Map();

    for (const row of csvToObjects(await response.text())) {
        if (row.icao_code) byIcao.set(row.icao_code, row);
        if (row.ident) byIcao.set(row.ident, row);
        if (row.iata_code) byIata.set(row.iata_code, row);
    }

    return { byIcao, byIata };
}

function toAirportEntry(stop, row) {
    if (!row) {
        return {
            iata: stop.iata,
            icao: stop.icao,
            name: stop.name,
            city: stop.city,
            country: null,
            countryName: null,
            lat: null,
            lon: null,
            kind: "unknown",
        };
    }

    return {
        iata: row.iata_code || stop.iata,
        icao: row.icao_code || row.ident || stop.icao,
        name: row.name || stop.name,
        // FR24 city names read better than OurAirports municipalities ("Paris" over "Roissy-en-France")
        city: stop.city || row.municipality,
        country: row.iso_country || null,
        countryName: countryName(row.iso_country),
        lat: Number(row.latitude_deg),
        lon: Number(row.longitude_deg),
        kind: "airport",
    };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const outPath = path.resolve(args.out);
    const airportsPath = path.resolve(args.airports);
    const overridesPath = path.resolve(args.overrides);

    const rows = csvToObjects(fs.readFileSync(path.resolve(args.csv), "utf8"));
    console.log(`read ${rows.length} rows from ${args.csv}`);

    const airports = fs.existsSync(airportsPath) ? JSON.parse(fs.readFileSync(airportsPath, "utf8")) : {};

    // Collect every stop first so we only hit the network when something is new
    const stops = new Map();
    for (const row of rows) {
        for (const stop of [parseAirport(row.From), parseAirport(row.To)]) {
            if (!stops.has(stop.code)) stops.set(stop.code, stop);
        }
    }

    const missing = [...stops.values()].filter((stop) => !airports[stop.code]);
    if (missing.length) {
        console.log(`${missing.length} unknown airport(s): ${missing.map((s) => s.code).join(", ")}`);
        const dataset = args.offline ? null : await fetchOurAirports();

        for (const stop of missing) {
            const row = dataset && ((stop.icao && dataset.byIcao.get(stop.icao)) || (stop.iata && dataset.byIata.get(stop.iata)));
            airports[stop.code] = toAirportEntry(stop, row);
        }
    }

    const unresolved = [...stops.keys()].filter((code) => airports[code].lat === null || airports[code].lon === null);

    const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, "utf8")) : {};
    const applied = new Set();

    const flights = rows.map((row) => {
        const from = parseAirport(row.From);
        const to = parseAirport(row.To);
        const rail = airports[from.code].kind === "rail" || airports[to.code].kind === "rail";
        const key = `${row.Date} ${row["Flight number"]}`;
        if (overrides[key]) applied.add(key);

        return {
            date: row.Date,
            number: row["Flight number"] || null,
            from: from.code,
            to: to.code,
            depTime: parseTime(row["Dep time"]),
            arrTime: parseTime(row["Arr time"]),
            duration: parseDuration(row.Duration),
            airline: parseAirline(row.Airline),
            aircraft: parseAircraft(row.Aircraft),
            registration: row.Registration || null,
            seat:
                row["Seat number"] || SEAT_TYPES[row["Seat type"]]
                    ? { number: row["Seat number"] || null, type: SEAT_TYPES[row["Seat type"]] ?? null }
                    : null,
            class: FLIGHT_CLASSES[row["Flight class"]] ?? null,
            reason: FLIGHT_REASONS[row["Flight reason"]] ?? null,
            note: row.Note || null,
            mode: rail ? "rail" : "flight",
            ...overrides[key],
        };
    });

    flights.sort((a, b) => a.date.localeCompare(b.date) || (a.depTime ?? "").localeCompare(b.depTime ?? ""));

    const sortedAirports = Object.fromEntries(Object.entries(airports).sort(([a], [b]) => a.localeCompare(b)));

    await writeJson(airportsPath, sortedAirports);
    await writeJson(outPath, {
        source: path.basename(args.csv),
        generated: new Date().toISOString().slice(0, 10),
        flights,
    });

    console.log(`wrote ${flights.length} flights to ${path.relative(process.cwd(), outPath)}`);
    console.log(`wrote ${Object.keys(sortedAirports).length} airports to ${path.relative(process.cwd(), airportsPath)}`);
    if (applied.size) console.log(`applied ${applied.size} override(s)`);

    const stale = Object.keys(overrides).filter((key) => !applied.has(key));
    if (stale.length) console.warn(`\nwarning: no flight matches ${stale.join(", ")} in ${path.relative(process.cwd(), overridesPath)}`);

    if (unresolved.length) {
        console.error(`\nwarning: no coordinates for ${unresolved.join(", ")}`);
        console.error(`add lat/lon (and kind: "rail" for train stations) to ${path.relative(process.cwd(), airportsPath)} by hand.`);
        process.exit(1);
    }
}

/** Written through prettier so `pnpm run format:check` stays happy in CI. */
async function writeJson(file, value) {
    let output = JSON.stringify(value, null, 4) + "\n";

    try {
        const prettier = await import("prettier");
        const config = (await prettier.resolveConfig(file)) ?? {};
        output = await prettier.format(output, { ...config, filepath: file });
    } catch {
        console.warn(`  prettier unavailable, writing ${path.basename(file)} unformatted`);
    }

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, output);
}

await main();
