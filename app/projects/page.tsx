import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";

const projects = [
    {
        name: "GitArena",
        type: "Web App",
        tech: "Rust",
        status: "In progress",
        description:
            "Self-hostable software development platform with custom Git server implementation in Rust. Features include issue tracking, code review, and full Git protocol support.",
        url: "https://github.com/mellowagain/gitarena",
    },
    {
        name: "rpc-wine",
        type: "Wine DLL",
        tech: "C++",
        status: "Stable",
        description:
            "Wine DLL enabling Discord Rich Presence for Windows games running on Linux. Implemented cross-platform RPC bridge between Wine processes and native Discord client.",
        url: "https://github.com/mellowagain/rpc-wine",
    },
    {
        name: "pomu",
        type: "Web App",
        tech: "Go, Svelte",
        status: "Stable",
        description: "YouTube Archiver with automated recording, S3 storage and public API.",
        url: "https://github.com/mellowagain/pomu",
    },
    {
        name: "Titan",
        type: "Desktop App",
        tech: "C#",
        status: "Archived",
        description: "CS:GO report and commendation bot built with performance and ease-of-use in mind.",
        url: "https://github.com/mellowagain/Titan",
    },
    {
        name: "mari.zip",
        type: "Website",
        tech: "Next.js, TypeScript",
        status: "Stable",
        description: "This current website you're viewing.",
        url: "https://github.com/mellowagain/website",
    },
];

export const metadata = { title: "Projects" };
export default function ProjectsPage() {
    return (
        <NierShell>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {projects.map((project, i) => (
                    <NierWindow key={i} title={project.name}>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <NierStatRow label="Type" value={project.type} />
                                <NierStatRow label="Tech" value={project.tech} />
                                <NierStatRow label="Status" value={project.status} />
                            </div>
                            <p className="font-sans text-sm leading-relaxed text-foreground/80">{project.description}</p>
                            <span className="font-mono text-xs text-muted-foreground/50">
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                    {project.url.replaceAll("https://", "")}
                                </a>
                            </span>
                        </div>
                    </NierWindow>
                ))}
            </div>
        </NierShell>
    );
}
