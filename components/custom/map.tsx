"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";
import { MapLocation } from "@/components/nier-map";
import { FlightsTab } from "@/components/custom/flights";
import { formatDate, formatDateRange, formatDuration, formatNumber, type Trip, type Visit } from "@/lib/flights";
import { places, visitedPlaces, visitsByPlace, type Place, type PlaceVisits } from "@/lib/places";

const NierLeafletMap = dynamic(() => import("@/components/nier-map").then((mod) => mod.NierLeafletMap), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center bg-accent/20">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Loading map...</span>
        </div>
    ),
});

const TABS = [
    { id: "places", label: "Places" },
    { id: "flights", label: "Flights" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const mapLocations: MapLocation[] = visitedPlaces.flatMap(({ locations }) => locations as MapLocation[]);

function TripChain({ trip }: { trip: Trip }) {
    return (
        <span className="font-sans text-xs tracking-wide text-foreground/80">
            {trip.legs[0].from}
            {trip.legs.map((leg, i) => (
                <span key={i}>
                    <span className="px-1 text-muted-foreground/40">{leg.mode === "rail" ? "⇢" : "→"}</span>
                    {leg.to}
                </span>
            ))}
        </span>
    );
}

function VisitEntry({ visit }: { visit: Visit }) {
    return (
        <div className="flex flex-col gap-1 py-1.5 md:flex-row md:items-baseline md:gap-3">
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground/50 md:w-36">
                {formatDateRange(visit.start, visit.end)}
            </span>

            <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                    <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/35">out</span>
                    <TripChain trip={visit.outbound} />
                </div>
                {visit.inbound && (
                    <div className="flex items-baseline gap-2">
                        <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/35">back</span>
                        <TripChain trip={visit.inbound} />
                    </div>
                )}
            </div>

            <span className="font-mono text-[10px] text-muted-foreground/40 md:ml-auto md:text-right">
                {[visit.days > 0 ? `${visit.days} ${visit.days === 1 ? "day" : "days"}` : null, formatNumber(visit.distance) + " km"]
                    .filter(Boolean)
                    .join(" · ")}
            </span>
        </div>
    );
}

function TransitEntry({ trip }: { trip: Trip }) {
    return (
        <div className="flex flex-col gap-1 py-1.5 md:flex-row md:items-baseline md:gap-3">
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground/50 md:w-36">{formatDate(trip.start)}</span>
            <div className="flex items-baseline gap-2">
                <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/35">via</span>
                <TripChain trip={trip} />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/40 md:ml-auto">{formatDuration(trip.duration)}</span>
        </div>
    );
}

function PlaceRow({ place, entry, expanded, onToggle }: { place: Place; entry?: PlaceVisits; expanded: boolean; onToggle: () => void }) {
    const visits = entry?.visits ?? [];
    const transits = entry?.transits ?? [];
    const count = visits.length || transits.length;
    const label = visits.length ? (visits.length === 1 ? "visit" : "visits") : transits.length === 1 ? "transit" : "transits";
    const Row = count > 0 ? "button" : "div";

    return (
        <>
            <Row
                {...(count > 0 ? { onClick: onToggle, "aria-expanded": expanded } : {})}
                className="group flex w-full flex-col gap-0.5 border-b border-border/15 py-2 text-left transition-colors last:border-b-0 hover:bg-background/30 md:flex-row md:items-baseline md:justify-between md:gap-4"
            >
                <div className="flex min-w-0 items-baseline gap-3">
                    <span
                        className={`nier-bullet mt-px inline-block h-1.5 w-1.5 shrink-0 border ${
                            count > 0 ? "border-foreground/40" : "border-transparent"
                        } ${expanded ? "nier-bullet-active bg-foreground/25" : "bg-transparent"}`}
                        aria-hidden="true"
                    />
                    <span className="font-sans text-sm text-foreground/90">{place.name}</span>
                    <span className="truncate font-sans text-[11px] text-muted-foreground/40 max-md:hidden">{place.note}</span>
                </div>

                <div className="flex shrink-0 items-baseline gap-3 pl-[1.125rem] md:pl-0">
                    <span className="font-sans text-[11px] text-muted-foreground/40 md:hidden">{place.note}</span>
                    {count > 0 && (
                        <span className="ml-auto font-mono text-[10px] text-muted-foreground/40 md:ml-0">
                            {count} {label}
                        </span>
                    )}
                    <span className="font-mono text-xs text-muted-foreground/50">{place.year}</span>
                </div>
            </Row>

            {expanded && (
                <div className="flex flex-col border-b border-border/15 bg-background/20 px-3 py-1">
                    {visits.map((visit) => (
                        <VisitEntry key={visit.start} visit={visit} />
                    ))}
                    {transits.map((trip) => (
                        <TransitEntry key={trip.start} trip={trip} />
                    ))}
                </div>
            )}
        </>
    );
}

function PlacesTab() {
    const [expandedPlace, setExpandedPlace] = useState<string | null>(null);

    // matched by the airports that serve each place
    const visits = useMemo(() => visitsByPlace(), []);

    const focus = useMemo(() => places.flatMap((g) => g.locations).find((place) => place.name === expandedPlace)?.coords, [expandedPlace]);

    return (
        <div className="flex flex-col gap-6">
            <p className="font-sans text-sm leading-relaxed text-foreground/70">
                Places I&apos;ve called home and places I&apos;ve visited. Mostly motivated by transit infrastructure, cities, and the
                occasional conference. Zoom out to see all places as markers, or open a visited place to see the flights that got me there.
            </p>

            <NierWindow title="Map">
                <div className="h-[400px] w-full overflow-hidden lg:h-[500px]">
                    <NierLeafletMap locations={mapLocations} focus={focus ?? null} />
                </div>
            </NierWindow>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <NierWindow title="Countries">
                    <p className="text-center font-sans text-2xl font-light text-foreground/80">17</p>
                </NierWindow>
                <NierWindow title="Cities">
                    <p className="text-center font-sans text-2xl font-light text-foreground/80">203</p>
                </NierWindow>
                <NierWindow title="Distance Travelled">
                    <p className="text-center font-sans text-2xl font-light text-foreground/80">242&apos;810 km</p>
                </NierWindow>
            </div>

            {places.map((group) => (
                <NierWindow key={group.category} title={group.category}>
                    <div className="flex flex-col">
                        {group.locations.map((place) => (
                            <PlaceRow
                                key={place.name}
                                place={place}
                                entry={visits.get(place.name)}
                                expanded={expandedPlace === place.name}
                                onToggle={() => setExpandedPlace(expandedPlace === place.name ? null : place.name)}
                            />
                        ))}
                    </div>
                </NierWindow>
            ))}
        </div>
    );
}

export default function TravelMap() {
    const [tab, setTab] = useState<TabId>("places");

    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                <div className="flex items-stretch border-b border-border/30">
                    {TABS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            aria-current={tab === item.id ? "page" : undefined}
                            className={`group -mb-px flex items-center gap-2.5 border-b px-4 py-2.5 font-sans text-xs uppercase tracking-[0.25em] transition-colors ${
                                tab === item.id
                                    ? "border-foreground/50 bg-accent/40 text-foreground"
                                    : "border-transparent text-muted-foreground/55 hover:bg-accent/20 hover:text-foreground/80"
                            }`}
                        >
                            <span
                                className={`nier-bullet inline-block h-2.5 w-2.5 border border-foreground/40 ${
                                    tab === item.id ? "nier-bullet-active bg-foreground/25" : "bg-transparent"
                                }`}
                                aria-hidden="true"
                            />
                            {item.label}
                        </button>
                    ))}
                </div>

                {tab === "places" ? <PlacesTab /> : <FlightsTab />}
            </div>
        </NierShell>
    );
}
