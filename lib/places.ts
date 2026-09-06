import { airportsNear, tripsVia, visitsTo, type Trip, type Visit } from "@/lib/flights";

/**
 * Pins a place to specific flights when the airport alone gets it wrong: Delft
 * shares Schiphol with every Amsterdam trip, and Plymouth was a Heathrow flight
 * that would otherwise read as a visit to London.
 */
export interface PlaceMatch {
    airports: string[];
    from?: string;
    to?: string;
}

export interface Place {
    name: string;
    coords: [number, number];
    year: string;
    note: string;
    match?: PlaceMatch;
}

export interface PlaceGroup {
    category: string;
    locations: Place[];
}

/** An airport this far from a place is close enough to count as the way there. */
const PLACE_RADIUS_KM = 100;

export const places: PlaceGroup[] = [
    {
        category: "Lived",
        locations: [
            {
                name: "Zurich, Switzerland",
                coords: [47.3774925, 8.4955363],
                year: "2025 -- present",
                note: "Current home base",
            },
            {
                name: "Zug, Switzerland",
                coords: [47.1354895, 8.4845202],
                year: "2023 -- 2025",
                note: "Flat share",
            },
            {
                name: "Aarau, Switzerland",
                coords: [47.3909865, 8.0493671],
                year: "2003 -- 2023",
                note: "at my parents",
            },
        ],
    },
    {
        category: "Visited -- Europe",
        locations: [
            {
                name: "Amsterdam, Netherlands",
                coords: [52.3547418, 4.8215612],
                year: "2022, 2023, 2024, 2025",
                note: "Work, Vacation w/ friends",
            },
            {
                name: "Brussels, Belgium",
                coords: [50.8551696, 4.3342174],
                year: "2022, 2023, 2024, 2025, 2026",
                note: "EuroRust 2023, FOSDEM 2025, Visiting friends",
            },
            {
                name: "Berlin, Germany",
                coords: [52.5069712, 13.2599517],
                year: "2025",
                note: "Work",
            },
            {
                name: "Las Palmas de Gran Canaria, Spain",
                coords: [28.1173971, -15.4602166],
                year: "2018, 2024",
                note: "Vacation w/ parents, Work",
            },
            {
                name: "Vienna, Austria",
                coords: [48.220318, 16.2972431],
                year: "2024",
                note: "EuroRust 2024",
            },
            {
                name: "Delft, Netherlands",
                coords: [51.9995595, 4.3430983],
                year: "2024",
                note: "RustNL 2024",
                match: { airports: ["AMS"], from: "2024-04-30", to: "2024-05-15" },
            },
            {
                name: "Cophenhagen, Denmark",
                coords: [55.6713089, 12.5526248],
                year: "2024",
                note: "Visiting friends",
            },
            {
                name: "Gothenburg, Sweden",
                coords: [57.7010685, 11.7290356],
                year: "2022, 2024",
                note: "Visiting friends",
            },
            {
                name: "Milan, Italy",
                coords: [45.4021925, 8.9640265],
                year: "2023",
                note: "Day trip",
            },
            {
                name: "Athens, Greece",
                coords: [37.9908692, 23.7177398],
                year: "2023",
                note: "Day trip",
            },
            {
                name: "London, UK",
                coords: [51.5287398, -0.2664005],
                year: "2022",
                note: "Day trip",
            },
            {
                name: "Düsseldorf, Germany",
                coords: [51.238527, 6.7319286],
                year: "2022",
                note: "Dokomi 2022",
            },
            {
                name: "Plymouth, UK",
                coords: [50.3884916, -4.1537691],
                year: "2019",
                note: "Language exchange",
                match: { airports: ["LHR"], from: "2019-01-01", to: "2020-12-31" },
            },
            {
                name: "Lisbon, Portugal",
                coords: [38.7441392, -9.2009351],
                year: "2018",
                note: "Vacation w/ parents",
            },
        ],
    },
    {
        category: "Visited -- Asia",
        locations: [
            {
                name: "Hong Kong",
                coords: [22.3529584, 113.9745952],
                year: "2024",
                note: "Vacation",
            },
            {
                name: "Manila, Philippines",
                coords: [14.5993341, 120.958884],
                year: "2019, 2023",
                note: "Visiting family",
            },
            {
                name: "Doha, Qatar",
                coords: [25.2841414, 51.4295968],
                year: "2019",
                note: "Transit on my way to the Philippines",
            },
        ],
    },
    {
        category: "Visited -- America",
        locations: [
            {
                name: "New York City, USA",
                coords: [40.6972846, -74.1443092],
                year: "2023",
                note: "Vacation w/ friends",
            },
        ],
    },
    {
        category: "Want to Visit",
        locations: [
            {
                name: "Taiwan",
                coords: [23.4827208, 118.1806062],
                year: "---",
                note: "MRT system, night markets",
            },
            {
                name: "Vietnam",
                coords: [15.7405956, 100.6205835],
                year: "---",
                note: "Hanoi train street",
            },
            {
                name: "South Korea",
                coords: [35.8140741, 126.554378],
                year: "---",
                note: "Transit, food",
            },
            {
                name: "Singapore",
                coords: [1.3141703, 103.76185],
                year: "---",
                note: "MRT system",
            },
            {
                name: "Japan",
                coords: [33.0671831, 126.5639527],
                year: "---",
                note: "Transit, food",
            },
            {
                name: "Iceland",
                coords: [64.8432404, -21.8847476],
                year: "---",
                note: "Northern lights",
            },
        ],
    },
];

export const visitedPlaces = places.filter((group) => group.category !== "Want to Visit");

/**
 * The airports that serve a place, so a visit can be matched up with the flights
 * that got me there. Only for places I actually went to -- everything within
 * reach of home would otherwise pull in every flight back to Zurich.
 */
export function servingAirports(place: Place, category: string): string[] {
    if (!category.startsWith("Visited")) return [];
    return place.match?.airports ?? airportsNear(place.coords, PLACE_RADIUS_KM);
}

export interface PlaceVisits {
    visits: Visit[];
    /** places I only ever changed planes at, listed by the trips that passed through */
    transits: Trip[];
}

/**
 * Matches every visited place up with the journeys there. Pinned places go
 * first and claim their trips, so the Delft flights don't show up a second time
 * under Amsterdam and the Heathrow trip stays with Plymouth.
 */
export function visitsByPlace(): Map<string, PlaceVisits> {
    const entries = places
        .filter((group) => group.category.startsWith("Visited"))
        .flatMap((group) => group.locations.map((place) => ({ place, category: group.category })));

    const claimed = new Set<Trip>();
    const result = new Map<string, PlaceVisits>();

    for (const pinned of [true, false]) {
        for (const { place, category } of entries.filter((entry) => Boolean(entry.place.match) === pinned)) {
            const codes = servingAirports(place, category);
            const visits = visitsTo(codes, { from: place.match?.from, to: place.match?.to, exclude: claimed });

            for (const visit of visits) {
                claimed.add(visit.outbound);
                if (visit.inbound) claimed.add(visit.inbound);
            }

            // Doha was only ever a stopover on the way to Manila, so fall back to what passed through
            result.set(place.name, { visits, transits: visits.length ? [] : tripsVia(codes) });
        }
    }

    return result;
}
