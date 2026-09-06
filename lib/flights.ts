import { format, isSameYear, parseISO } from "date-fns";
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

const airports = airportData as Record<string, Airport>;
export const flights = (flightData.flights as Flight[]).slice().reverse(); // newest first
export const flightsGenerated = flightData.generated;

export const EARTH_CIRCUMFERENCE_KM = 40075;
const EARTH_RADIUS_KM = 6371;

export function getAirport(code: string): Airport | null {
    return airports[code] ?? null;
}

function haversine(a: [number, number], b: [number, number]): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function coordsOf(code: string): [number, number] | null {
    const airport = getAirport(code);
    return airport && airport.lat !== null && airport.lon !== null ? [airport.lat, airport.lon] : null;
}

export function distanceKm(from: string, to: string): number | null {
    const a = coordsOf(from);
    const b = coordsOf(to);

    return a && b ? haversine(a, b) : null;
}

// nearest first
export function airportsNear(coords: [number, number], radius: number): string[] {
    return Object.keys(airports)
        .flatMap((code) => {
            const position = coordsOf(code);
            return position ? [{ code, distance: haversine(coords, position) }] : [];
        })
        .filter((entry) => entry.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .map((entry) => entry.code);
}

// both directions of a route are the same city pair
export function routeKey(from: string, to: string): string {
    return [from, to].sort().join("-");
}

export function routeLabel(from: string, to: string): string {
    return [from, to].sort().join(" ↔ ");
}

function flightYear(flight: Flight): string {
    return flight.date.slice(0, 4);
}

export function years(list: Flight[] = flights): string[] {
    return [...new Set(list.map(flightYear))].sort((a, b) => b.localeCompare(a));
}

// 242810 -> 242'810
export function formatNumber(value: number): string {
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}

// 1370 -> 22h 50m, 24h+ -> 2d 6h
export function formatDuration(minutes: number): string {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = Math.round(minutes % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins.toString().padStart(2, "0")}m`;
    return `${mins}m`;
}

export function formatDate(date: string): string {
    return format(parseISO(date), "dd MMM yyyy");
}

// 22 Sep -- 05 Oct 2023
export function formatDateRange(start: string, end: string): string {
    if (start === end) return formatDate(start);

    const from = parseISO(start);
    return `${format(from, isSameYear(from, parseISO(end)) ? "dd MMM" : "dd MMM yyyy")} – ${formatDate(end)}`;
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

// departures and arrivals count separately
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

// both directions of a route are the same distance, so time breaks the tie
function byDistanceThenDuration(a: { flight: Flight; distance: number }, b: { flight: Flight; distance: number }): number {
    return b.distance - a.distance || (b.flight.duration ?? 0) - (a.flight.duration ?? 0);
}

function aircraftKey(flight: Flight): string | null {
    return flight.aircraft ? (flight.aircraft.code ?? flight.aircraft.name) : null;
}

export interface AircraftDetail {
    registrations: { registration: string; airline: string | null; count: number }[];
    longest: Flight | null;
    shortest: Flight | null;
    topRoute: Tally | null;
}

export function aircraftDetail(list: Flight[], key: string): AircraftDetail {
    const flown = list.filter((flight) => aircraftKey(flight) === key);

    const tails = new Map<string, { registration: string; airline: string | null; count: number }>();
    for (const flight of flown) {
        if (!flight.registration) continue;
        const tail = tails.get(flight.registration) ?? {
            registration: flight.registration,
            airline: flight.airline?.name ?? null,
            count: 0,
        };
        tail.count += 1;
        tails.set(flight.registration, tail);
    }

    const ranked = flown
        .map((flight) => ({ flight, distance: distanceKm(flight.from, flight.to) ?? 0 }))
        .filter((entry) => entry.distance > 0)
        .sort(byDistanceThenDuration);

    return {
        registrations: [...tails.values()].sort((a, b) => b.count - a.count || a.registration.localeCompare(b.registration)),
        longest: ranked[0]?.flight ?? null,
        shortest: ranked[ranked.length - 1]?.flight ?? null,
        topRoute:
            tally(flown, (flight) => ({ key: routeKey(flight.from, flight.to), label: routeLabel(flight.from, flight.to) }))[0] ?? null,
    };
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
    perYear: { year: string; count: number; distance: number }[];
    longest: Flight | null;
    shortest: Flight | null;
    firstFlight: Flight | null;
    lastFlight: Flight | null;
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

    const ranked = withDistance.filter(({ distance }) => distance > 0).sort(byDistanceThenDuration);
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
        aircraft: tally(air, (flight) => {
            const key = aircraftKey(flight);
            return key && flight.aircraft ? { key, label: flight.aircraft.name, sublabel: flight.aircraft.code ?? undefined } : null;
        }),
        topAirports: countVisits(list),
        routes: tally(list, (flight) => ({
            key: routeKey(flight.from, flight.to),
            label: routeLabel(flight.from, flight.to),
            sublabel: [getAirport(flight.from)?.city, getAirport(flight.to)?.city].filter(Boolean).sort().join(" / "),
        })),
        perYear: [...perYear.values()].sort((a, b) => a.year.localeCompare(b.year)),
        longest: ranked[0]?.flight ?? null,
        shortest: ranked[ranked.length - 1]?.flight ?? null,
        firstFlight: chronological[0] ?? null,
        lastFlight: chronological[chronological.length - 1] ?? null,
    };
}

export interface Trip {
    legs: Flight[];
    from: string;
    to: string;
    // not the last stop when the trip came back to where it started
    destination: string;
    start: string;
    end: string;
    duration: number;
    distance: number;
}

function daysBetween(from: string, to: string): number {
    return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

function minutesOfDay(time: string | null): number | null {
    return time ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null;
}

// longer than this at the same airport is a stay, not a connection
const MAX_LAYOVER_MINUTES = 12 * 60;

// both times are local to the same airport, so they compare directly
function connects(previous: Flight, leg: Flight): boolean {
    if (previous.to !== leg.from) return false;

    const gap = daysBetween(previous.date, leg.date);
    if (gap < 0 || gap > 1) return false;

    const departure = minutesOfDay(leg.depTime);
    const arrival = minutesOfDay(previous.arrTime);
    const previousDeparture = minutesOfDay(previous.depTime);
    if (departure === null || arrival === null || previousDeparture === null) return gap === 0;

    // landed the morning after it took off
    const overnight = arrival < previousDeparture ? 1440 : 0;
    const layover = gap * 1440 + departure - (overnight + arrival);

    return layover >= 0 && layover <= MAX_LAYOVER_MINUTES;
}

// ZRH -> AMS -> BRU on one evening is a single trip to Brussels
function groupTrips(list: Flight[]): Trip[] {
    const chronological = list.slice().sort((a, b) => a.date.localeCompare(b.date) || (a.depTime ?? "").localeCompare(b.depTime ?? ""));
    const result: Trip[] = [];

    for (const leg of chronological) {
        const current = result[result.length - 1];
        const previous = current?.legs[current.legs.length - 1];

        if (current && previous && connects(previous, leg)) {
            current.legs.push(leg);
            current.to = leg.to;
            current.end = leg.date;
            current.duration += leg.duration ?? 0;
            current.distance += distanceKm(leg.from, leg.to) ?? 0;
            continue;
        }

        result.push({
            legs: [leg],
            from: leg.from,
            to: leg.to,
            destination: leg.to,
            start: leg.date,
            end: leg.date,
            duration: leg.duration ?? 0,
            distance: distanceKm(leg.from, leg.to) ?? 0,
        });
    }

    return result.map((trip) => ({ ...trip, destination: turnaround(trip) }));
}

// a trip that came home again (MXP -> ATH -> MXP) was going to its far end
function turnaround(trip: Trip): string {
    if (trip.from !== trip.to) return trip.to;

    const stops = trip.legs.map((leg) => leg.to).filter((code) => code !== trip.from);
    return stops.reduce(
        (furthest, code) => ((distanceKm(trip.from, code) ?? 0) > (distanceKm(trip.from, furthest) ?? 0) ? code : furthest),
        stops[0] ?? trip.to
    );
}

export const trips = groupTrips(flightData.flights as Flight[]);

export interface Visit {
    outbound: Trip;
    inbound: Trip | null;
    start: string;
    end: string;
    distance: number;
    days: number;
}

export interface VisitOptions {
    // only count journeys that set off between these dates
    from?: string;
    to?: string;
    // trips already claimed by a more specific place
    exclude?: Set<Trip>;
}

// a journey home later than this belongs to some other trip
const RETURN_WINDOW_DAYS = 45;

// the way back rarely mirrors the way out (New York was out via CDG, back via AMS),
// so it is whichever trip next sets off from where this one landed
export function visitsTo(codes: string[], options: VisitOptions = {}): Visit[] {
    const visits: Visit[] = [];

    trips.forEach((outbound, index) => {
        if (!codes.includes(outbound.destination) || codes.includes(outbound.from)) return;
        if (options.from && outbound.start < options.from) return;
        if (options.to && outbound.start > options.to) return;
        if (options.exclude?.has(outbound)) return;

        const inbound =
            trips
                .slice(index + 1)
                .find((trip) => codes.includes(trip.from) && daysBetween(outbound.end, trip.start) <= RETURN_WINDOW_DAYS) ?? null;

        visits.push({
            outbound,
            inbound,
            start: outbound.start,
            end: inbound?.end ?? outbound.end,
            distance: outbound.distance + (inbound?.distance ?? 0),
            days: daysBetween(outbound.end, inbound?.start ?? outbound.end),
        });
    });

    return visits.reverse();
}

export function tripsVia(codes: string[]): Trip[] {
    return trips
        .filter(
            (trip) => !codes.includes(trip.from) && !codes.includes(trip.destination) && trip.legs.some((leg) => codes.includes(leg.to))
        )
        .reverse();
}
