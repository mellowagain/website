"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_CENTER: [number, number] = [40, 10];
const FALLBACK_ZOOM = 2;
const ARC_SEGMENTS = 64;

export interface FlightRoute {
    from: [number, number];
    to: [number, number];
    label: string;
    count: number;
    mode: "flight" | "rail";
}

export interface FlightPoint {
    code: string;
    name: string;
    city: string;
    coords: [number, number];
    count: number;
}

// routes bend the way they do on FR24 rather than cutting straight across the projection
function greatCircle(from: [number, number], to: [number, number]): [number, number][] {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const [lat1, lon1] = [toRad(from[0]), toRad(from[1])];
    const [lat2, lon2] = [toRad(to[0]), toRad(to[1])];

    const delta =
        2 *
        Math.asin(
            Math.min(1, Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2))
        );
    if (delta === 0) return [from];

    const points: [number, number][] = [];
    let previousLon = from[1];

    for (let i = 0; i <= ARC_SEGMENTS; i++) {
        const f = i / ARC_SEGMENTS;
        const a = Math.sin((1 - f) * delta) / Math.sin(delta);
        const b = Math.sin(f * delta) / Math.sin(delta);

        const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
        const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
        const z = a * Math.sin(lat1) + b * Math.sin(lat2);

        const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
        let lon = toDeg(Math.atan2(y, x));

        // keep the line continuous across +-180
        while (lon - previousLon > 180) lon -= 360;
        while (previousLon - lon > 180) lon += 360;
        previousLon = lon;

        points.push([lat, lon]);
    }

    return points;
}

function createAirportIcon(count: number, busiest: number) {
    const size = 8 + Math.round(8 * Math.sqrt(count / Math.max(busiest, 1)));
    const major = count / Math.max(busiest, 1) > 0.25;
    const color = major ? "#c8bfa8" : "#9a9488";

    return L.divIcon({
        className: "nier-marker",
        html: `<svg width="${size}" height="${size}" viewBox="0 0 10 10" style="filter: drop-shadow(0 0 3px ${color}40);">
      <rect x="1" y="1" width="8" height="8" fill="${color}" fill-opacity="${major ? 0.9 : 0.6}" stroke="${color}" stroke-width="0.6" transform="rotate(45 5 5)" />
    </svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
}

function popup(title: string, subtitle: string, detail: string) {
    return `<div style="font-family:serif;background:#222220;color:#c8bfa8;padding:8px 12px;border:1px solid #3a3830;min-width:150px;">
      <div style="font-size:13px;font-weight:600;letter-spacing:0.05em;margin-bottom:4px;">${title}</div>
      <div style="font-size:11px;color:#7a7468;margin-bottom:2px;">${subtitle}</div>
      <div style="font-size:11px;color:#9a9488;">${detail}</div>
    </div>`;
}

export function NierFlightMap({ routes, points }: { routes: FlightRoute[]; points: FlightPoint[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);
    const [ready, setReady] = useState(false);

    // Set up the map once
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            center: FALLBACK_CENTER,
            zoom: FALLBACK_ZOOM,
            zoomControl: false,
            attributionControl: false,
            worldCopyJump: true,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png?key=cb1_2ygv_1_c5413c0ee978ff0265cb95c5", {
            maxZoom: 18,
            subdomains: "abcd",
        }).addTo(map);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png?key=cb1_2ygv_1_c5413c0ee978ff0265cb95c5", {
            maxZoom: 18,
            subdomains: "abcd",
            opacity: 0.4,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.control
            .attribution({ position: "bottomleft", prefix: false })
            .addAttribution(
                '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#7a7468">OSM</a> &copy; <a href="https://carto.com/" style="color:#7a7468">CARTO</a>'
            )
            .addTo(map);

        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setReady(true);

        return () => {
            map.remove();
            mapRef.current = null;
            layerRef.current = null;
        };
    }, []);

    // Redraw routes and markers whenever the filter changes
    useEffect(() => {
        const map = mapRef.current;
        const layer = layerRef.current;
        if (!map || !layer) return;

        layer.clearLayers();

        const busiestRoute = Math.max(1, ...routes.map((route) => route.count));
        const busiestAirport = Math.max(1, ...points.map((point) => point.count));

        for (const route of routes) {
            const arc = greatCircle(route.from, route.to);
            if (arc.length < 2) continue;

            const share = route.count / busiestRoute;
            L.polyline(arc, {
                color: route.mode === "rail" ? "#7a7468" : "#c8bfa8",
                weight: 0.8 + share * 2.2,
                opacity: 0.3 + share * 0.5,
                dashArray: route.mode === "rail" ? "3 5" : undefined,
            })
                .bindPopup(popup(route.label, route.mode === "rail" ? "rail segment" : "route", `${route.count}x flown`), {
                    closeButton: false,
                    className: "nier-popup",
                })
                .addTo(layer);
        }

        for (const point of points) {
            L.marker(point.coords, { icon: createAirportIcon(point.count, busiestAirport) })
                .bindPopup(popup(`${point.city} (${point.code})`, point.name, `${point.count} visit${point.count === 1 ? "" : "s"}`), {
                    closeButton: false,
                    className: "nier-popup",
                    offset: [0, -4],
                })
                .addTo(layer);
        }

        if (points.length) {
            map.fitBounds(L.latLngBounds(points.map((point) => point.coords)), { padding: [40, 40], maxZoom: 6 });
        }
    }, [routes, points]);

    return (
        <div className="relative h-full w-full">
            <div ref={containerRef} className="h-full w-full" />
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent/30">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Loading map...</span>
                </div>
            )}
        </div>
    );
}
