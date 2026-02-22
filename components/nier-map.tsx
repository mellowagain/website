"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const CENTER: [number, number] = [46.8122345, 7.5648249]
const DEFAULT_ZOOM = 5

export interface MapLocation {
  name: string
  coords: [number, number]
  note: string
  year: string
}

// Custom diamond marker SVG matching the Nier aesthetic
function createDiamondIcon(isHome: boolean) {
  const size = isHome ? 14 : 10
  const color = isHome ? "#c8bfa8" : "#7a7468"
  return L.divIcon({
    className: "nier-marker",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 10 10" style="filter: drop-shadow(0 0 3px ${color}40);">
      <rect x="1" y="1" width="8" height="8" fill="${color}" stroke="${isHome ? "#c8bfa8" : "#5a5548"}" stroke-width="0.5" transform="rotate(45 5 5)" />
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export function NierLeafletMap({locations}: {locations: MapLocation[]}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    })

    // Dark-themed tiles (CartoDB Dark Matter, desaturated)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      { maxZoom: 18, subdomains: "abcd" }
    ).addTo(map)

    // Labels layer (lighter, on top)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
      { maxZoom: 18, subdomains: "abcd", opacity: 0.5 }
    ).addTo(map)

    // Add zoom control bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map)

    // Attribution
    L.control.attribution({ position: "bottomleft", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#7a7468">OSM</a> &copy; <a href="https://carto.com/" style="color:#7a7468">CARTO</a>')
      .addTo(map)

    // Add markers
    locations.forEach((loc) => {
      const isHome = loc.name === "Zurich, Switzerland"
      const marker = L.marker(loc.coords, { icon: createDiamondIcon(isHome) })
      marker.addTo(map)

      marker.bindPopup(
        `<div style="font-family:serif;background:#222220;color:#c8bfa8;padding:8px 12px;border:1px solid #3a3830;min-width:140px;">
          <div style="font-size:13px;font-weight:600;letter-spacing:0.05em;margin-bottom:4px;">${loc.name}</div>
          <div style="font-size:11px;color:#7a7468;margin-bottom:2px;">${loc.year}</div>
          <div style="font-size:11px;color:#9a9488;">${loc.note}</div>
        </div>`,
        {
          closeButton: false,
          className: "nier-popup",
          offset: [0, -4],
        }
      )
    })

    mapInstance.current = map
    setReady(true)

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent/30">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
            Loading map...
          </span>
        </div>
      )}
    </div>
  )
}
