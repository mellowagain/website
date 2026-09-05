"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";
import { MapLocation } from "@/components/nier-map";
import { FlightsTab } from "@/components/custom/flights";
import { formatDate, formatDuration, formatNumber, tripsTo, tripsVia, type Trip } from "@/lib/flights";
import { places, servingAirports, visitedPlaces, type Place } from "@/lib/places";

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

/** ZRH → AMS → BRU, with rail legs marked by a dashed arrow. */
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

interface PlaceTrips {
    trips: Trip[];
    /** true when I only ever changed planes here */
    transit: boolean;
}

function PlaceRow({
    place,
    trips,
    transit,
    expanded,
    onToggle,
}: {
    place: Place;
    trips: Trip[];
    transit: boolean;
    expanded: boolean;
    onToggle: () => void;
}) {
    const Row = trips.length > 0 ? "button" : "div";
    const label = transit ? (trips.length === 1 ? "transit" : "transits") : trips.length === 1 ? "flown trip" : "flown trips";

    return (
        <>
            <Row
                {...(trips.length > 0 ? { onClick: onToggle, "aria-expanded": expanded } : {})}
                className="group flex w-full items-baseline justify-between gap-4 border-b border-border/15 py-2 text-left transition-colors last:border-b-0 hover:bg-background/30"
            >
                <div className="flex min-w-0 items-baseline gap-3">
                    <span
                        className={`nier-bullet mt-px inline-block h-1.5 w-1.5 shrink-0 border ${
                            trips.length > 0 ? "border-foreground/40" : "border-transparent"
                        } ${expanded ? "nier-bullet-active bg-foreground/25" : "bg-transparent"}`}
                        aria-hidden="true"
                    />
                    <span className="font-sans text-sm text-foreground/90">{place.name}</span>
                    <span className="truncate font-sans text-[11px] text-muted-foreground/40">{place.note}</span>
                </div>
                <div className="flex shrink-0 items-baseline gap-3">
                    {trips.length > 0 && (
                        <span className="font-mono text-[10px] text-muted-foreground/40">
                            {trips.length} {label}
                        </span>
                    )}
                    <span className="font-mono text-xs text-muted-foreground/50">{place.year}</span>
                </div>
            </Row>

            {expanded && (
                <div className="flex flex-col border-b border-border/15 bg-background/20 px-3 py-1.5">
                    {trips.map((trip) => (
                        <div key={trip.start} className="flex flex-wrap items-baseline gap-x-3 py-1">
                            <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground/50">{formatDate(trip.start)}</span>
                            <TripChain trip={trip} />
                            <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                                {trip.legs.length} {trip.legs.length === 1 ? "leg" : "legs"} · {formatDuration(trip.duration)} ·{" "}
                                {formatNumber(trip.distance)} km
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function PlacesTab() {
    const [expandedPlace, setExpandedPlace] = useState<string | null>(null);

    // Which flights got me to which place -- matched by the airports that serve it
    const tripsByPlace = useMemo(() => {
        const map = new Map<string, PlaceTrips>();

        for (const group of places) {
            for (const place of group.locations) {
                const codes = servingAirports(place, group.category);
                const arrivals = codes.length ? tripsTo(codes) : [];
                // Doha was only ever a stopover, so fall back to the trips that passed through
                map.set(place.name, arrivals.length ? { trips: arrivals, transit: false } : { trips: tripsVia(codes), transit: true });
            }
        }

        return map;
    }, []);

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
                                trips={tripsByPlace.get(place.name)?.trips ?? []}
                                transit={tripsByPlace.get(place.name)?.transit ?? false}
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
