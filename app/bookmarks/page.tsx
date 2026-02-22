"use client";

import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";
import Bookmarks from "@/components/custom/bookmarks";

export default function BookmarksPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-4">
                <p className="font-sans text-sm leading-relaxed text-foreground/70">
                    A curated collection of links I keep coming back to, organized by topic. Powered by a raindrop.io.
                </p>

                <Bookmarks />
            </div>
        </NierShell>
    );
}
