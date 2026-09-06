"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { NierWindow } from "@/components/nier-window";
import type { FlightPoint, FlightRoute } from "@/components/nier-flight-map";
import {
    aircraftDetail,
    airportLabel,
    computeStats,
    coordsOf,
    distanceKm,
    EARTH_CIRCUMFERENCE_KM,
    flights as allFlights,
    flightsGenerated,
    formatDate,
    formatDuration,
    formatNumber,
    getAirport,
    routeKey,
    routeLabel,
    years,
    type Flight,
    type Tally,
} from "@/lib/flights";

const NierFlightMap = dynamic(() => import("@/components/nier-flight-map").then((mod) => mod.NierFlightMap), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center bg-accent/20">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Loading map...</span>
        </div>
    ),
});

const ALL = "all";
const availableYears = years();

const CABINS: Record<string, string> = {
    economy: "Economy",
    "premium-economy": "Premium",
    business: "Business",
    first: "First",
    private: "Private",
};

const MOON_KM = 384_400;
const MARS_KM = 225_000_000;
const COMPARISON_INTERVAL_MS = 4500;

function toPoint(code: string): FlightPoint | null {
    const airport = getAirport(code);
    const coords = coordsOf(code);
    if (!airport || !coords) return null;

    return { code, name: airport.name, city: airport.city, coords, count: 0 };
}

function share(distance: number, target: number): string {
    const ratio = distance / target;
    if (ratio >= 1) return `${ratio.toFixed(1)}x`;
    if (ratio >= 0.01) return `${Math.round(ratio * 100)}%`;
    return `${(ratio * 100).toFixed(2)}%`;
}

// the same distance, restated every few seconds
function DistanceComparison({ distance, hop }: { distance: number; hop: Tally | undefined }) {
    const comparisons = useMemo(() => {
        const list = [
            `${share(distance, EARTH_CIRCUMFERENCE_KM)} around the earth`,
            `${share(distance, MOON_KM)} of the way to the moon`,
            `${share(distance, MARS_KM)} of the way to Mars`,
        ];

        if (hop && hop.distance > 0) {
            list.push(`${Math.round(distance / (hop.distance / hop.count))}x the ${hop.label} hop`);
        }

        return list;
    }, [distance, hop]);

    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick((value) => value + 1), COMPARISON_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    const index = tick % comparisons.length;

    return (
        <span key={index} className="animate-in fade-in duration-1000">
            {comparisons[index]}
        </span>
    );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: React.ReactNode }) {
    return (
        <NierWindow title={label}>
            <p className="text-center font-sans text-2xl font-light text-foreground/80">{value}</p>
            {hint && <p className="mt-1 truncate text-center font-sans text-[11px] text-muted-foreground/50">{hint}</p>}
        </NierWindow>
    );
}

function BarList({ items, limit = 12, detail }: { items: Tally[]; limit?: number; detail?: (item: Tally) => React.ReactNode }) {
    const [expanded, setExpanded] = useState(false);
    const [openItem, setOpenItem] = useState<string | null>(null);
    const max = Math.max(1, ...items.map((item) => item.count));
    const visible = expanded ? items : items.slice(0, limit);

    return (
        <>
            <div className="flex flex-col">
                {visible.map((item) => {
                    const open = openItem === item.key;
                    const Row = detail ? "button" : "div";

                    return (
                        <div key={item.key} className="border-b border-border/15 py-2 last:border-b-0">
                            <Row
                                {...(detail ? { onClick: () => setOpenItem(open ? null : item.key), "aria-expanded": open } : {})}
                                className="group flex w-full items-baseline justify-between gap-4 text-left"
                            >
                                <div className="flex min-w-0 items-baseline gap-2">
                                    {detail && (
                                        <span
                                            className={`nier-bullet inline-block h-1.5 w-1.5 shrink-0 border border-foreground/40 ${
                                                open ? "nier-bullet-active bg-foreground/25" : "bg-transparent"
                                            }`}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="truncate font-sans text-sm capitalize text-foreground/90">{item.label}</span>
                                    {item.sublabel && (
                                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/40">{item.sublabel}</span>
                                    )}
                                </div>
                                <span className="shrink-0 font-mono text-xs text-muted-foreground/60">{item.count}</span>
                            </Row>

                            <div className="mt-1.5 h-px w-full bg-border/20" aria-hidden="true">
                                <div className="h-px bg-foreground/40" style={{ width: `${(item.count / max) * 100}%` }} />
                            </div>

                            {open && detail && <div className="mt-2 bg-background/20 px-3 py-1.5">{detail(item)}</div>}
                        </div>
                    );
                })}
                {items.length === 0 && <p className="py-2 font-sans text-sm text-muted-foreground/50">Nothing logged.</p>}
            </div>

            {items.length > limit && <ShowAllButton expanded={expanded} total={items.length} onToggle={() => setExpanded(!expanded)} />}
        </>
    );
}

function AircraftDetail({ item, list }: { item: Tally; list: Flight[] }) {
    const detail = useMemo(() => aircraftDetail(list, item.key), [list, item.key]);

    return (
        <div className="flex flex-col gap-2">
            {detail.registrations.length > 0 && (
                <div className="flex flex-col">
                    <span className="py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                        {detail.registrations.length} {detail.registrations.length === 1 ? "tail number" : "tail numbers"}
                    </span>
                    {detail.registrations.map((tail) => (
                        <div key={tail.registration} className="flex items-baseline gap-3 py-0.5">
                            <span className="w-20 shrink-0 font-mono text-xs text-foreground/75">{tail.registration}</span>
                            <span className="truncate font-sans text-[11px] text-muted-foreground/55">{tail.airline ?? "--"}</span>
                            <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground/40">{tail.count}x</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col border-t border-border/15 pt-1">
                {detail.longest && (
                    <Fact
                        label="Longest flight"
                        value={`${detail.longest.from} → ${detail.longest.to}`}
                        detail={flightDetail(detail.longest)}
                    />
                )}
                {detail.shortest && (
                    <Fact
                        label="Shortest flight"
                        value={`${detail.shortest.from} → ${detail.shortest.to}`}
                        detail={flightDetail(detail.shortest)}
                    />
                )}
                {detail.topRoute && <Fact label="Most flown route" value={detail.topRoute.label} detail={`${detail.topRoute.count}x`} />}
            </div>
        </div>
    );
}

function Fact({ label, value, detail }: { label: string; value: string; detail: string }) {
    return (
        <div className="flex items-baseline gap-3 py-0.5">
            <span className="shrink-0 font-sans text-[11px] text-muted-foreground/50">{label}</span>
            <span className="truncate font-sans text-[11px] text-foreground/75">{value}</span>
            <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground/45">{detail}</span>
        </div>
    );
}

// 9'590 km · 12h 30m
function flightDetail(flight: Flight): string {
    return [
        distanceKm(flight.from, flight.to) ? `${formatNumber(distanceKm(flight.from, flight.to) ?? 0)} km` : null,
        flight.duration ? formatDuration(flight.duration) : null,
    ]
        .filter(Boolean)
        .join(" · ");
}

function ShowAllButton({ expanded, total, onToggle }: { expanded: boolean; total: number; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className="mt-3 w-full border border-border/30 py-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:bg-accent/30 hover:text-foreground/80"
        >
            {expanded ? "Show less" : `Show all ${total}`}
        </button>
    );
}

// label sits above the route on narrow screens, beside it from md up
function Superlative({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-border/15 py-2 last:border-b-0 md:flex-row md:items-baseline md:justify-between md:gap-4">
            <span className="shrink-0 font-sans text-sm tracking-wide text-muted-foreground">{label}</span>
            <div className="flex min-w-0 items-baseline gap-3 md:flex-1 md:justify-end">
                <span className="font-sans text-sm text-foreground/90 md:truncate">{value}</span>
                {detail && <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground/45 md:ml-0">{detail}</span>}
            </div>
        </div>
    );
}

function FlightRow({ flight }: { flight: Flight }) {
    const distance = distanceKm(flight.from, flight.to);
    const rail = flight.mode === "rail";
    // Air France sells the TGV legs as economy or business and seats you in first class either way
    const cabin = rail ? "1st class" : flight.class ? (CABINS[flight.class] ?? flight.class) : null;
    const extras = [flight.seat?.number, flight.registration].filter(Boolean);

    return (
        <div className="border-b border-border/15 py-2.5 last:border-b-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground/50">{formatDate(flight.date)}</span>
                <span className="w-16 shrink-0 font-mono text-xs text-foreground/60">{flight.number ?? "--"}</span>
                <span className="font-sans text-sm tracking-wide text-foreground/90">
                    {flight.from}
                    <span className="px-1.5 text-muted-foreground/40">{rail ? "⇢" : "→"}</span>
                    {flight.to}
                </span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground/50">
                    {[flight.duration ? formatDuration(flight.duration) : null, distance ? `${formatNumber(distance)} km` : null]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
            </div>

            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 md:pl-[11.5rem]">
                <span
                    className={`shrink-0 border px-1 font-mono text-[11px] uppercase tracking-wider ${
                        rail ? "border-border/30 text-muted-foreground/45" : "border-border/50 text-muted-foreground/70"
                    }`}
                >
                    {rail ? "rail" : (flight.aircraft?.code ?? "n/a")}
                </span>
                <span className="font-sans text-xs text-muted-foreground/70">{flight.aircraft?.name ?? "High-speed rail"}</span>
                {flight.airline && (
                    <>
                        <span className="text-muted-foreground/25" aria-hidden="true">
                            ·
                        </span>
                        <span className="font-sans text-xs text-muted-foreground/60">{flight.airline.name}</span>
                    </>
                )}
                {flight.note && <span className="font-sans text-xs italic text-muted-foreground/40">({flight.note})</span>}
                <span className="ml-auto flex shrink-0 items-baseline gap-2.5">
                    {cabin && (
                        <span
                            className={`font-mono text-[11px] uppercase tracking-wider ${
                                !rail && flight.class === "economy" ? "text-muted-foreground/40" : "text-foreground/75"
                            }`}
                        >
                            {cabin}
                        </span>
                    )}
                    {extras.length > 0 && <span className="font-mono text-xs text-muted-foreground/60">{extras.join(" · ")}</span>}
                </span>
            </div>
        </div>
    );
}

export function FlightsTab() {
    const [year, setYear] = useState<string>(ALL);
    const [showAllFlights, setShowAllFlights] = useState(false);

    const selected = useMemo(() => (year === ALL ? allFlights : allFlights.filter((flight) => flight.date.startsWith(year))), [year]);
    const stats = useMemo(() => computeStats(selected), [selected]);

    const { routes, points } = useMemo(() => {
        const routeMap = new Map<string, FlightRoute>();
        const pointMap = new Map<string, FlightPoint>();

        for (const flight of selected) {
            const from = toPoint(flight.from);
            const to = toPoint(flight.to);
            if (!from || !to) continue;

            for (const stop of [from, to]) {
                const point = pointMap.get(stop.code) ?? stop;
                point.count += 1;
                pointMap.set(stop.code, point);
            }

            if (flight.from === flight.to) continue;

            const key = routeKey(flight.from, flight.to);
            const route = routeMap.get(key) ?? {
                from: from.coords,
                to: to.coords,
                label: routeLabel(flight.from, flight.to),
                count: 0,
                mode: flight.mode,
            };
            route.count += 1;
            routeMap.set(key, route);
        }

        return { routes: [...routeMap.values()], points: [...pointMap.values()] };
    }, [selected]);

    const visibleFlights = showAllFlights ? selected : selected.slice(0, 25);
    const maxYearDistance = Math.max(1, ...stats.perYear.map((entry) => entry.distance));

    return (
        <div className="flex flex-col gap-6">
            <p className="font-sans text-sm leading-relaxed text-foreground/70">
                Every flight I&apos;ve taken since 2017, logged in my Flightradar24 flight diary and exported into this page. Mostly Zurich
                and Amsterdam, mostly KLM, mostly a window seat. Train segments sold under a flight number are logged too, but kept out of
                the flight totals.
            </p>

            {/* Year filter */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {[ALL, ...availableYears].map((option) => (
                    <button
                        key={option}
                        onClick={() => setYear(option)}
                        aria-pressed={year === option}
                        className={`group flex items-center gap-2 px-3 py-1.5 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
                            year === option ? "bg-accent/60 text-foreground" : "text-muted-foreground/60 hover:bg-accent/30"
                        }`}
                    >
                        <span
                            className={`nier-bullet inline-block h-2 w-2 border border-foreground/40 ${
                                year === option ? "nier-bullet-active bg-foreground/25" : "bg-transparent"
                            }`}
                            aria-hidden="true"
                        />
                        {option === ALL ? "All" : option}
                    </button>
                ))}
            </div>

            <NierWindow title={year === ALL ? "Route map" : `Route map -- ${year}`}>
                <div className="h-[400px] w-full overflow-hidden lg:h-[520px]">
                    <NierFlightMap routes={routes} points={points} />
                </div>
            </NierWindow>

            {/* Headline stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Stat
                    label="Flights"
                    value={String(stats.flights)}
                    hint={stats.railSegments ? `+${stats.railSegments} by rail` : undefined}
                />
                <Stat
                    label="Distance"
                    value={`${formatNumber(stats.distance)} km`}
                    hint={<DistanceComparison distance={stats.distance} hop={stats.routes[0]} />}
                />
                <Stat label="Time in the air" value={formatDuration(stats.duration)} />
                <Stat label="Airports" value={String(stats.airports)} />
                <Stat label="Countries" value={String(stats.countries)} />
                <Stat label="Airlines" value={String(stats.airlines.length)} hint={`${stats.aircraft.length} aircraft types`} />
            </div>

            {/* Flights per year */}
            {year === ALL && (
                <NierWindow title="Per year">
                    <div className="flex items-end gap-2 pt-2 md:gap-3">
                        {stats.perYear.map((entry) => (
                            <button
                                key={entry.year}
                                onClick={() => setYear(entry.year)}
                                className="group flex flex-1 flex-col items-center gap-2"
                                title={`${entry.count} flights, ${formatNumber(entry.distance)} km`}
                            >
                                <span className="font-mono text-[11px] text-muted-foreground/60">{entry.count}</span>
                                <span
                                    className="w-full bg-foreground/25 transition-colors group-hover:bg-foreground/50"
                                    style={{ height: `${Math.max(3, (entry.distance / maxYearDistance) * 120)}px` }}
                                />
                                <span className="font-mono text-[11px] text-muted-foreground/45">{entry.year}</span>
                            </button>
                        ))}
                    </div>
                    <p className="mt-3 text-center font-sans text-[11px] text-muted-foreground/40">
                        Bar height is distance flown, the number above is flights.
                    </p>
                </NierWindow>
            )}

            {/* Superlatives */}
            <NierWindow title="Records">
                <div className="flex flex-col">
                    {stats.longest && (
                        <Superlative
                            label="Longest flight"
                            value={`${airportLabel(stats.longest.from)} → ${airportLabel(stats.longest.to)}`}
                            detail={flightDetail(stats.longest)}
                        />
                    )}
                    {stats.shortest && (
                        <Superlative
                            label="Shortest flight"
                            value={`${airportLabel(stats.shortest.from)} → ${airportLabel(stats.shortest.to)}`}
                            detail={flightDetail(stats.shortest)}
                        />
                    )}
                    {stats.routes[0] && (
                        <Superlative label="Most flown route" value={stats.routes[0].label} detail={`${stats.routes[0].count}x`} />
                    )}
                    {stats.topAirports[0] && (
                        <Superlative
                            label="Most visited airport"
                            value={`${stats.topAirports[0].label} (${stats.topAirports[0].key})`}
                            detail={`${stats.topAirports[0].count} visits`}
                        />
                    )}
                    {stats.firstFlight && (
                        <Superlative
                            label="First flight"
                            value={`${airportLabel(stats.firstFlight.from)} → ${airportLabel(stats.firstFlight.to)}`}
                            detail={formatDate(stats.firstFlight.date)}
                        />
                    )}
                    {stats.lastFlight && (
                        <Superlative
                            label="Most recent"
                            value={`${airportLabel(stats.lastFlight.from)} → ${airportLabel(stats.lastFlight.to)}`}
                            detail={formatDate(stats.lastFlight.date)}
                        />
                    )}
                </div>
            </NierWindow>

            {/* Tallies */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <NierWindow title="Airlines">
                    <BarList items={stats.airlines} />
                </NierWindow>
                <NierWindow title="Aircraft">
                    <BarList items={stats.aircraft} detail={(item) => <AircraftDetail item={item} list={selected} />} />
                </NierWindow>
                <NierWindow title="Airports">
                    <BarList items={stats.topAirports} />
                </NierWindow>
                <NierWindow title="Routes">
                    <BarList items={stats.routes} />
                </NierWindow>
            </div>

            {/* Log */}
            <NierWindow title={`Log -- ${selected.length} segments`}>
                <div className="flex flex-col">
                    {visibleFlights.map((flight, i) => (
                        <FlightRow key={`${flight.date}-${flight.number}-${i}`} flight={flight} />
                    ))}
                </div>
                {selected.length > 25 && (
                    <ShowAllButton expanded={showAllFlights} total={selected.length} onToggle={() => setShowAllFlights(!showAllFlights)} />
                )}
            </NierWindow>

            <p className="font-sans text-[11px] text-muted-foreground/40">
                Exported from my.flightradar24.com on {formatDate(flightsGenerated)}. Distances are great circle between airports, so the
                real number is a little higher.
            </p>
        </div>
    );
}
