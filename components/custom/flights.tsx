"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";
import type { FlightPoint, FlightRoute } from "@/components/nier-flight-map";
import {
    airportLabel,
    computeStats,
    distanceKm,
    flights as allFlights,
    flightsGenerated,
    formatDate,
    formatDuration,
    formatNumber,
    getAirport,
    routeKey,
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

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <NierWindow title={label}>
            <p className="text-center font-sans text-2xl font-light text-foreground/80">{value}</p>
            {hint && <p className="mt-1 text-center font-sans text-[11px] text-muted-foreground/50">{hint}</p>}
        </NierWindow>
    );
}

function BarList({ items, unit = "" }: { items: Tally[]; unit?: string }) {
    const max = Math.max(1, ...items.map((item) => item.count));

    return (
        <div className="flex flex-col">
            {items.map((item) => (
                <div key={item.key} className="group border-b border-border/15 py-2 last:border-b-0">
                    <div className="flex items-baseline justify-between gap-4">
                        <div className="flex min-w-0 items-baseline gap-2">
                            <span className="truncate font-sans text-sm capitalize text-foreground/90">{item.label}</span>
                            {item.sublabel && (
                                <span className="shrink-0 font-mono text-[10px] text-muted-foreground/40">{item.sublabel}</span>
                            )}
                        </div>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                            {item.count}
                            {unit}
                        </span>
                    </div>
                    <div className="mt-1.5 h-px w-full bg-border/20" aria-hidden="true">
                        <div className="h-px bg-foreground/40" style={{ width: `${(item.count / max) * 100}%` }} />
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="py-2 font-sans text-sm text-muted-foreground/50">Nothing logged.</p>}
        </div>
    );
}

function Superlative({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4 border-b border-border/15 py-2 last:border-b-0">
            <span className="shrink-0 font-sans text-sm tracking-wide text-muted-foreground">{label}</span>
            <div className="flex min-w-0 flex-1 items-baseline justify-end gap-3">
                <span className="truncate font-sans text-sm text-foreground/90">{value}</span>
                {detail && <span className="shrink-0 font-mono text-[11px] text-muted-foreground/45">{detail}</span>}
            </div>
        </div>
    );
}

function FlightRow({ flight }: { flight: Flight }) {
    const distance = distanceKm(flight.from, flight.to);

    return (
        <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-border/15 py-2.5 last:border-b-0 md:grid-cols-[6.5rem_5rem_1fr_auto]">
            <span className="font-mono text-xs text-muted-foreground/60">{formatDate(flight.date)}</span>

            <span className="font-mono text-xs text-foreground/70 max-md:order-3">
                {flight.number ?? "--"}
                {flight.mode === "rail" && <span className="ml-1 text-muted-foreground/40">rail</span>}
            </span>

            <span className="font-sans text-sm text-foreground/90 max-md:order-2">
                {flight.from} <span className="text-muted-foreground/40">&rarr;</span> {flight.to}
                <span className="ml-2 font-sans text-[11px] text-muted-foreground/40">
                    {[flight.airline?.name, flight.aircraft?.name].filter(Boolean).join(" · ")}
                    {flight.registration && ` · ${flight.registration}`}
                </span>
            </span>

            <span className="text-right font-mono text-xs text-muted-foreground/50 max-md:order-4">
                {flight.duration ? formatDuration(flight.duration) : "--"}
                {distance ? ` · ${formatNumber(distance)} km` : ""}
            </span>
        </div>
    );
}

export default function Flights() {
    const [year, setYear] = useState<string>(ALL);
    const [showAllFlights, setShowAllFlights] = useState(false);

    const selected = useMemo(() => (year === ALL ? allFlights : allFlights.filter((flight) => flight.date.startsWith(year))), [year]);
    const stats = useMemo(() => computeStats(selected), [selected]);

    const { routes, points } = useMemo(() => {
        const routeMap = new Map<string, FlightRoute>();
        const pointMap = new Map<string, FlightPoint>();

        for (const flight of selected) {
            const from = getAirport(flight.from);
            const to = getAirport(flight.to);
            if (!from?.lat || !from?.lon || !to?.lat || !to?.lon) continue;

            for (const [code, airport] of [
                [flight.from, from],
                [flight.to, to],
            ] as const) {
                const point = pointMap.get(code) ?? {
                    code,
                    name: airport.name,
                    city: airport.city,
                    country: airport.countryName,
                    coords: [airport.lat as number, airport.lon as number] as [number, number],
                    count: 0,
                };
                point.count += 1;
                pointMap.set(code, point);
            }

            if (flight.from === flight.to) continue;

            const key = routeKey(flight.from, flight.to);
            const route = routeMap.get(key) ?? {
                from: [from.lat, from.lon] as [number, number],
                to: [to.lat, to.lon] as [number, number],
                label: key.replace("-", " ↔ "),
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
        <NierShell>
            <div className="flex flex-col gap-6">
                <p className="font-sans text-sm leading-relaxed text-foreground/70">
                    Every flight I&apos;ve taken since 2017, logged in my Flightradar24 flight diary and exported into this page. Mostly
                    Zurich and Amsterdam, mostly KLM, mostly a window seat. Train segments booked under a flight number are logged too, but
                    kept out of the flight totals.
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
                        hint={`${stats.timesAroundEarth.toFixed(1)}x around the earth`}
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
                                detail={`${formatNumber(distanceKm(stats.longest.from, stats.longest.to) ?? 0)} km`}
                            />
                        )}
                        {stats.shortest && (
                            <Superlative
                                label="Shortest flight"
                                value={`${airportLabel(stats.shortest.from)} → ${airportLabel(stats.shortest.to)}`}
                                detail={`${formatNumber(distanceKm(stats.shortest.from, stats.shortest.to) ?? 0)} km`}
                            />
                        )}
                        {stats.routes[0] && (
                            <Superlative label="Most flown route" value={stats.routes[0].label} detail={`${stats.routes[0].count}x`} />
                        )}
                        {stats.topAirports[0] && (
                            <Superlative
                                label="Home base"
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
                        <BarList items={stats.aircraft.slice(0, 12)} />
                    </NierWindow>
                    <NierWindow title="Airports">
                        <BarList items={stats.topAirports.slice(0, 12)} />
                    </NierWindow>
                    <NierWindow title="Routes">
                        <BarList items={stats.routes.slice(0, 12)} />
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
                        <button
                            onClick={() => setShowAllFlights((value) => !value)}
                            className="mt-3 w-full border border-border/30 py-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:bg-accent/30 hover:text-foreground/80"
                        >
                            {showAllFlights ? "Show less" : `Show all ${selected.length}`}
                        </button>
                    )}
                </NierWindow>

                <p className="font-sans text-[11px] text-muted-foreground/40">
                    Exported from my.flightradar24.com on {formatDate(flightsGenerated)}. Distances are great circle between airports, so
                    the real number is a little higher.
                </p>
            </div>
        </NierShell>
    );
}
