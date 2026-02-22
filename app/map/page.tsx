"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { NierShell } from "@/components/nier-shell"
import { NierWindow, NierStatRow } from "@/components/nier-window"
import {$constructor} from "zod/v4/core";
import {MapLocation} from "@/components/nier-map";

const NierLeafletMap = dynamic(
    () => import("@/components/nier-map").then((mod) => mod.NierLeafletMap),
    {
      ssr: false,
      loading: () => (
          <div className="flex h-full items-center justify-center bg-accent/20">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
              Loading map...
            </span>
          </div>
      ),
    }
)

const places = [
  {
    category: "Lived",
    locations: [
      { name: "Zurich, Switzerland", coords: [47.3774925,8.4955363], year: "2025 -- present", note: "Current home base" },
      { name: "Zug, Switzerland", coords: [47.1354895,8.4845202], year: "2023 -- 2025", note: "Flat share" },
      { name: "Aarau, Switzerland", coords: [47.3909865,8.0493671], year: "2003 -- 2023", note: "at my parents" },
    ],
  },
  {
    category: "Visited -- Europe",
    locations: [
      { name: "Amsterdam, Netherlands", coords: [52.3547418,4.8215612], year: "2022, 2023, 2024, 2025", note: "Work" },
      { name: "Brussels, Belgium", coords: [50.8551696,4.3342174], year: "2023, 2024, 2025", note: "EuroRust 2023, FOSDEM 2025, Visiting friends" },
      { name: "Berlin, Germany", coords: [52.5069712,13.2599517], year: "2025", note: "Work" },
      { name: "Las Palmas de Gran Canaria, Spain", coords: [28.1173971,-15.4602166], year: "2018, 2024", note: "Vacation w/ parents, Work" },
      { name: "Vienna, Austria", coords: [48.220318,16.2972431], year: "2024", note: "EuroRust 2024" },
      { name: "Delft, Netherlands", coords: [51.9995595,4.3430983], year: "2024", note: "RustNL 2024" },
      { name: "Cophenhagen, Denmark", coords: [55.6713089,12.5526248], year: "2023", note: "Visiting friends" },
      { name: "Gothenburg, Sweden", coords: [57.7010685,11.7290356], year: "2022, 2023", note: "Visiting friends" },
      { name: "Milan, Italy", coords: [45.4021925,8.9640265], year: "2023", note: "Day trip" },
      { name: "Athens, Greece", coords: [37.9908692,23.7177398], year: "2023", note: "Day trip" },
      { name: "London, UK", coords: [51.5287398,-0.2664005], year: "2023", note: "Day trip" },
      { name: "Düsseldorf, Germany", coords: [51.238527,6.7319286], year: "2021", note: "Dokomi 2021" },
      { name: "Plymouth, UK", coords: [50.3884916,-4.1537691], year: "2020", note: "Language exchange" },
      { name: "Lisbon, Portugal", coords: [38.7441392,-9.2009351], year: "2018", note: "Vacation w/ parents" },

    ],
  },
  {
    category: "Visited -- Asia",
    locations: [
      { name: "Hong Kong", coords: [22.3529584,113.9745952], year: "2024", note: "Vacation" },
      { name: "Manila, Philippines", coords: [14.5993341,120.958884], year: "2019, 2023", note: "Visiting family" },
      { name: "Doha, Qatar", coords: [25.2841414,51.4295968], year: "2019", note: "Transit on my way to the Philippines" },
    ],
  },
  {
    category: "Visited -- America",
    locations: [
      { name: "New York City, USA", coords: [40.6972846,-74.1443092], year: "2023", note: "Vacation w/ friends" },
    ],
  },
  {
    category: "Want to Visit",
    locations: [
      { name: "Taiwan", coords: [23.4827208,118.1806062], year: "---", note: "MRT system, night markets" },
      { name: "Vietnam", coords: [15.7405956,100.6205835], year: "---", note: "Hanoi train street" },
      { name: "South Korea", coords: [35.8140741,126.554378], year: "---", note: "Transit, food" },
      { name: "Singapore", coords: [1.3141703,103.76185], year: "---", note: "MRT system" },
      { name: "Japan", coords: [33.0671831,126.5639527], year: "---", note: "Transit, food" },
      { name: "Iceland", coords: [64.8432404,-21.8847476], year: "---", note: "Northern lights" },
    ],
  },
]

const mapLocations: MapLocation[] = places.filter((obj) => obj.category !== "Want to Visit").flatMap(({ locations }) => locations as MapLocation[]);

type Location = { name: string; year: string; note: string }

export default function MapPage() {
  const [selected, setSelected] = useState<Location | null>(null)

  return (
      <NierShell>
        <div className="flex flex-col gap-6">
          <p className="font-sans text-sm leading-relaxed text-foreground/70">
            Places I've called home and places I've visited. Mostly motivated
            by transit infrastructure, cities, and the occasional conference.
            Zoom out to see all places as markers. <i>Last updated February 22, 2026</i>
          </p>

          {/* Leaflet map in a Nier window */}
          <NierWindow title="Map">
            <div className="h-[400px] w-full overflow-hidden lg:h-[500px]">
              <NierLeafletMap locations={mapLocations} />
            </div>
          </NierWindow>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <NierWindow title="Countries">
              <p className="text-center font-sans text-2xl font-light text-foreground/80">17</p>
            </NierWindow>
            <NierWindow title="Cities">
              <p className="text-center font-sans text-2xl font-light text-foreground/80">203</p>
            </NierWindow>
            <NierWindow title="Distance Travelled">
              <p className="text-center font-sans text-2xl font-light text-foreground/80">242'810 km</p>
              {/*<p className="text-center font-sans text-xs leading-relaxed text-foreground/80">Zurich HB</p>*/}
            </NierWindow>
          </div>

          {/* Location lists */}
          {places.map((group, i) => (
              <NierWindow key={i} title={group.category}>
                <div className="flex flex-col">
                  {group.locations.map((loc, j) => (
                      <button
                          key={j}
                          className="group flex items-baseline justify-between gap-4 border-b border-border/15 py-2 text-left transition-colors last:border-b-0 hover:bg-background/30"
                          onClick={() => setSelected(loc)}
                      >
                        <div className="flex items-baseline gap-3">
                    <span className="font-sans text-sm text-foreground/90">
                      {loc.name}
                    </span>
                          <span className="font-sans text-[11px] text-muted-foreground/40">
                      {loc.note}
                    </span>
                        </div>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground/50">
                    {loc.year}
                  </span>
                      </button>
                  ))}
                </div>
              </NierWindow>
          ))}

          {/* Selected location detail */}
          {selected && (
              <NierWindow title="Selected">
                <div className="flex flex-col">
                  <NierStatRow label="Location" value={selected.name} />
                  <NierStatRow label="Year" value={selected.year} />
                  <NierStatRow label="Note" value={selected.note} />
                </div>
              </NierWindow>
          )}
        </div>
      </NierShell>
  )
}
