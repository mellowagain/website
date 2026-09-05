import airportData from "@/data/airports.json";
import flightData from "@/data/flights.json";

export type AirportKind = "airport" | "rail" | "unknown";
export type FlightMode = "flight" | "rail";

export interface Airport {
    iata: string | null;
    icao: string | null;
    name: string;
    city: string;
    country: string | null;
    countryName: string | null;
    lat: number | null;
    lon: number | null;
    kind: AirportKind;
}

export interface Flight {
    date: string;
    number: string | null;
    from: string;
    to: string;
    depTime: string | null;
    arrTime: string | null;
    /** minutes */
    duration: number | null;
    airline: { name: string; iata: string | null; icao: string | null } | null;
    aircraft: { name: string; code: string | null } | null;
    registration: string | null;
    seat: { number: string | null; type: string | null } | null;
    class: string | null;
    reason: string | null;
    note: string | null;
    mode: FlightMode;
}

export const airports = airportData as Record<string, Airport>;
export const flights = (flightData.flights as Flight[]).slice().reverse(); // newest first
export const flightsGenerated = flightData.generated;

export const EARTH_CIRCUMFERENCE_KM = 40075;
const EARTH_RADIUS_KM = 6371;

export function getAirport(code: string): Airport | null {
    return airports[code] ?? null;
}

/** Great circle distance in km, null if either end is missing coordinates. */
export function distanceKm(from: string, to: string): number | null {
    const a = getAirport(from);
    const b = getAirport(to);
    if (!a || !b || a.lat === null || a.lon === null || b.lat === null || b.lon === null) return null;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Route key that treats ZRH-AMS and AMS-ZRH as the same city pair. */
export function routeKey(from: string, to: string): string {
    return [from, to].sort().join("-");
}

export function flightYear(flight: Flight): string {
    return flight.date.slice(0, 4);
}

export function years(list: Flight[] = flights): string[] {
    return [...new Set(list.map(flightYear))].sort((a, b) => b.localeCompare(a));
}

/** 242810 -> "242'810", matching the Swiss grouping used elsewhere on the site. */
export function formatNumber(value: number): string {
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}

/** 1370 -> "22h 50m", 24h+ -> "2d 6h" */
export function formatDuration(minutes: number): string {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = Math.round(minutes % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins.toString().padStart(2, "0")}m`;
    return `${mins}m`;
}

export function formatDate(date: string): string {
    const [year, month, day] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[Number(month) - 1]} ${year}`;
}

export function airportLabel(code: string): string {
    const airport = getAirport(code);
    return airport ? `${airport.city} (${code})` : code;
}

export interface Tally {
    key: string;
    label: string;
    sublabel?: string;
    count: number;
    distance: number;
}

function tally(list: Flight[], pick: (flight: Flight) => { key: string; label: string; sublabel?: string } | null): Tally[] {
    const map = new Map<string, Tally>();

    for (const flight of list) {
        const item = pick(flight);
        if (!item) continue;

        const existing = map.get(item.key) ?? { ...item, count: 0, distance: 0 };
        existing.count += 1;
        existing.distance += distanceKm(flight.from, flight.to) ?? 0;
        map.set(item.key, existing);
    }

    return [...map.values()].sort((a, b) => b.count - a.count || b.distance - a.distance || a.label.localeCompare(b.label));
}

/** How often each airport was touched, counting departures and arrivals separately. */
function countVisits(list: Flight[]): Tally[] {
    const map = new Map<string, Tally>();

    for (const flight of list) {
        for (const code of [flight.from, flight.to]) {
            const entry = map.get(code) ?? { key: code, label: getAirport(code)?.city ?? code, sublabel: code, count: 0, distance: 0 };
            entry.count += 1;
            map.set(code, entry);
        }
    }

    return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export interface FlightStats {
    flights: number;
    railSegments: number;
    distance: number;
    duration: number;
    airports: number;
    countries: number;
    airlines: Tally[];
    aircraft: Tally[];
    topAirports: Tally[];
    routes: Tally[];
    classes: Tally[];
    perYear: { year: string; count: number; distance: number }[];
    longest: Flight | null;
    shortest: Flight | null;
    firstFlight: Flight | null;
    lastFlight: Flight | null;
    timesAroundEarth: number;
}

export function computeStats(list: Flight[]): FlightStats {
    const air = list.filter((flight) => flight.mode === "flight");
    const withDistance = air.map((flight) => ({ flight, distance: distanceKm(flight.from, flight.to) ?? 0 }));

    const visited = new Set<string>();
    const countries = new Set<string>();
    for (const flight of list) {
        for (const code of [flight.from, flight.to]) {
            visited.add(code);
            const country = getAirport(code)?.country;
            if (country) countries.add(country);
        }
    }

    const perYear = new Map<string, { year: string; count: number; distance: number }>();
    for (const { flight, distance } of withDistance) {
        const year = flightYear(flight);
        const bucket = perYear.get(year) ?? { year, count: 0, distance: 0 };
        bucket.count += 1;
        bucket.distance += distance;
        perYear.set(year, bucket);
    }

    const ranked = withDistance.filter(({ distance }) => distance > 0).sort((a, b) => b.distance - a.distance);
    const chronological = air.slice().sort((a, b) => a.date.localeCompare(b.date));
    const distance = withDistance.reduce((sum, entry) => sum + entry.distance, 0);

    return {
        flights: air.length,
        railSegments: list.length - air.length,
        distance,
        duration: air.reduce((sum, flight) => sum + (flight.duration ?? 0), 0),
        airports: visited.size,
        countries: countries.size,
        airlines: tally(air, (flight) =>
            flight.airline
                ? {
                      key: flight.airline.icao ?? flight.airline.name,
                      label: flight.airline.name,
                      sublabel: flight.airline.iata ?? undefined,
                  }
                : null
        ),
        aircraft: tally(air, (flight) =>
            flight.aircraft
                ? {
                      key: flight.aircraft.code ?? flight.aircraft.name,
                      label: flight.aircraft.name,
                      sublabel: flight.aircraft.code ?? undefined,
                  }
                : null
        ),
        topAirports: countVisits(list),
        routes: tally(list, (flight) => ({
            key: routeKey(flight.from, flight.to),
            label: routeKey(flight.from, flight.to).replace("-", " ↔ "),
            sublabel: [getAirport(flight.from)?.city, getAirport(flight.to)?.city].filter(Boolean).sort().join(" / "),
        })),
        classes: tally(air, (flight) => (flight.class ? { key: flight.class, label: flight.class.replace("-", " ") } : null)),
        perYear: [...perYear.values()].sort((a, b) => a.year.localeCompare(b.year)),
        longest: ranked[0]?.flight ?? null,
        shortest: ranked[ranked.length - 1]?.flight ?? null,
        firstFlight: chronological[0] ?? null,
        lastFlight: chronological[chronological.length - 1] ?? null,
        timesAroundEarth: distance / EARTH_CIRCUMFERENCE_KM,
    };
}
