import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";

const changelog = [
    {
        version: "v2.2.0",
        date: "March 2026",
        title: "New site",
        changes: [
            "Complete website redesign inspired by Nier: Automata",
            "Added changelog, bookmarks, playlist, and cat pages",
            "Used AI to build the ground site and refined it by hand",
        ],
    },
    {
        version: "v2.1.0",
        date: "February 2026",
        title: "Switch to Big Enterprise",
        changes: [
            "Started new job as Platform Engineer at AXA",
            "Learned to take everything slower at Big Enterprise, whilst bringing in a bit of the Startup spirit",
        ],
    },
    {
        version: "v2.0.0",
        date: "February 2025",
        title: "Solo living",
        changes: [
            "Moved out from the flatshare into my own apartment",
            "Setup a dedicated office space with standing desk",
            "Visited FOSDEM 2025 in Brussels",
        ],
    },
    {
        version: "v1.4.0",
        date: "Year of 2024",
        title: "Conference season",
        changes: ["Attended RustNL 2024 in Delft", "Attended EuroRust 2024 in Brussels", "Met cool people from the Rust community"],
    },
    {
        version: "v1.3.0",
        date: "October 2023",
        title: "Moved to Zug",
        changes: [
            "Moved out of my parents home into a flatshare with two friends",
            "Mysta was lovingly welcomed as part of the new household as well",
            "Switched to Windows on my personal desktop",
        ],
    },
    {
        version: "v1.2.0",
        date: "Year 2023",
        title: "Venturing beyond my home",
        changes: [
            "Travelled together with a friend on multiple day trips to Milan and Athens",
            "Visited North America for the first time with two of my friends by going to NYC",
            "Explored London with a friend on Christmas day",
        ],
    },
    {
        version: "v1.1.0",
        date: "July 2022",
        title: "Cat update",
        changes: [
            'Adopted Mysta, lovingly calling him "Cat 1" at that time',
            'Adopted Millie, also lovingly calling her "Cat 2" at that time',
            "Productivity decreased by 30%, happiness increased by 200%",
            "Keyboard frequently occupied by unauthorized user",
            "Had to give away Millie sadly to my cousin in preparation for my upcoming move",
        ],
    },
    {
        version: "v1.0.0",
        date: "June 2022",
        title: "Initial release",
        changes: [
            "First full-time software engineering job at Fiberplane",
            "Travelled for the first time alone to a foreign country: Amsterdam, Netherlands",
            "Visited internet friends for the first time in Gothenburg, Sweden",
        ],
    },
    {
        version: "v0.9.0-beta",
        date: "January 2022",
        title: "Finished school",
        changes: ["Ready to enter the real world (was not ready)"],
    },
];

export const metadata = { title: "Changelog" };
export default function ChangelogPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-5">
                <p className="font-sans text-sm leading-relaxed text-foreground/70">
                    A running log of life updates, styled like a software changelog. Semantic versioning applied loosely to human existence.
                </p>

                {changelog.map((entry, i) => (
                    <NierWindow key={i} title={`${entry.version} -- ${entry.title}`}>
                        <div className="flex flex-col gap-3">
                            <span className="font-mono text-xs text-muted-foreground/50">{entry.date}</span>
                            <ul className="flex flex-col gap-1.5">
                                {entry.changes.map((change, j) => (
                                    <li key={j} className="flex items-start gap-2.5">
                                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 bg-foreground/25" aria-hidden="true" />
                                        <span className="font-sans text-sm leading-relaxed text-foreground/80">{change}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </NierWindow>
                ))}
            </div>
        </NierShell>
    );
}
