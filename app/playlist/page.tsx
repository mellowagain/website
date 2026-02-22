"use client";

import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";
import NowPlaying from "@/components/custom/now-playing";
import RecentlyPlayed from "@/components/custom/recently-played";
import Link from "next/link";

export default function PlaylistPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                {/* Now playing */}
                <NowPlaying />

                {/* Recently played */}
                <RecentlyPlayed />

                {/* Favorites by genre */}
                {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {favorites.map((group, i) => (
            <NierWindow key={i} title={group.genre}>
              <div className="flex flex-col">
                {group.artists.map((artist, j) => (
                  <div
                    key={j}
                    className="flex items-baseline justify-between gap-3 border-b border-border/15 py-1.5 last:border-b-0"
                  >
                    <span className="font-sans text-sm text-foreground/90">
                      {artist.name}
                    </span>
                    <span className="shrink-0 font-sans text-[11px] text-muted-foreground/50">
                      {artist.note}
                    </span>
                  </div>
                ))}
              </div>
            </NierWindow>
          ))}
        </div>*/}

                <div className="h-px w-full bg-border/20" aria-hidden="true" />

                <Link
                    href="https://open.spotify.com/user/31fawrtsshqoldaaorbnkmbhkx4i?si=78b26c211b424b67"
                    target="_blank"
                    className="group flex items-center gap-3 font-sans text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                >
                    <span
                        className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/15"
                        aria-hidden="true"
                    />
                    Spotify
                </Link>
            </div>
        </NierShell>
    );
}
