"use client";

import Link from "next/link";
import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";

export default function ColophonPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <p className="font-sans text-sm leading-relaxed text-foreground/85">
                        This site is a personal experiment in bringing game UI aesthetics to the web. The design is heavily inspired by the
                        menu system of Nier: Automata, a 2017 action jRPG by PlatinumGames. I think it's the most elegant interface ever
                        designed for a video game.
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-foreground/85">
                        Every element of the website such as the muted palette, geometric background, floating sidebar, window-based content
                        panels, rotating diamond bullets; is a reference to that UI. The dark color scheme is my own twist; the original
                        game uses warm beige tones.
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-foreground/85">
                        My speciality is backend and systems engineering so frontend isn't my strength, thus the design of the website was
                        made with Vercel's v0 using Claude Opus 4.6. It cost about $10 in credits to generate and refine to my taste.
                        Integrations with third-party APIs for the Blog, Projects, Bookmarks, Playlist and Maps are all hand written.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <NierWindow title="Tech Stack">
                        <div className="flex flex-col">
                            <NierStatRow label="Framework" value="Next.js 16" />
                            <NierStatRow label="Styling" value="Tailwind CSS v4" />
                            <NierStatRow label="Components" value="shadcn/ui (heavily customized)" />
                            <NierStatRow label="Font" value="Libre Baskerville" />
                            <NierStatRow label="Hosting" value="Vercel" />
                            <NierStatRow label="Domain" value="Porkbun" />
                        </div>
                    </NierWindow>

                    <NierWindow title="Integrations">
                        <div className="flex flex-col">
                            <NierStatRow label="Blog" value=".mdx files living in the repo tree" />
                            <NierStatRow label="Projects" value="GitHub" />
                            <NierStatRow label="Bookmarks" value="Raindrop.io" />
                            <NierStatRow label="Playlist" value="Spotify" />
                            <NierStatRow label="Maps (Data)" value="Google Timeline" />
                            <NierStatRow label="Maps (Visualization)" value="Leaflet (OpenStreetMap tiles)" />
                        </div>
                    </NierWindow>
                </div>

                <div className="h-px w-full bg-border/20" aria-hidden="true" />

                <Link
                    href="https://github.com/mellowagain/website"
                    className="group flex items-center gap-3 font-sans text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                >
                    <span
                        className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/15"
                        aria-hidden="true"
                    />
                    Source code of the website
                </Link>

                <Link
                    href="/uses"
                    className="group flex items-center gap-3 font-sans text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                >
                    <span
                        className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/15"
                        aria-hidden="true"
                    />
                    Back to Uses
                </Link>
            </div>
        </NierShell>
    );
}
