"use client";

import Link from "next/link";
import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";

const pc = [
    { label: "CPU", value: "Intel Core i7-13700K 16 Core" },
    { label: "CPU Cooler", value: "Fractal Design Celsius S24" },
    { label: "Motherboard", value: "ASRock Z790M-ITX WiFi" },
    { label: "Memory", value: "Crucial DDR5-4800 32 GB CL40" },
    { label: "Storage", value: "Samsung 990 PRO 2TB NVMe SSD" },
    { label: "Graphics Card", value: "Gigabyte Vision OC RTX 3080 10 GB" },
    { label: "Power Supply", value: "Corsair CX750M 750W" },
    { label: "Case", value: "Joule Performance OEM Case" },
];

const hardware = [
    { label: "Main Monitor", value: 'Samsung 32" Odyssey OLED G8 (4K, 240hz)' },
    { label: "Second Monitor", value: 'Samsung 24" CRG50 (1080p, 144hz)' },
    { label: "Keyboard", value: "Wooting 80HE (Lekker V2 L60 Linear)" },
    { label: "Mouse", value: "Logitech G PRO X Superlight" },
    { label: "Play Headphones", value: "SteelSeries Arctis 7 Wireless" },
    { label: "Work Headphones", value: "Sony WH-1000XM4 Limited Edition" },
    { label: "On-the-go Headphones", value: "Samsung Galaxy Buds Pro 2" },
    { label: "Phone", value: "Samsung Galaxy S23 Ultra" },
];

const software = [
    { label: "OS", value: "Garuda Linux" },
    { label: "Desktop Environment", value: "GNOME" },
    { label: "Editor", value: "RustRover, Sublime" },
    { label: "Terminal", value: "kitty, alacritty" },
    { label: "Shell", value: "fish" },
    { label: "Browser", value: "Firefox" },
    { label: "Music", value: "Spotify" },
];

const editorSetup = [
    { label: "Theme", value: "Islands Dark" },
    { label: "Font", value: "Fira Code Mono, 17px" },
];

export default function UsesPage() {
    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                <p className="font-sans text-sm leading-relaxed text-foreground/80">
                    A somewhat obsessive catalog of hardware, software, and configuration that makes up my daily workflow. Updated whenever
                    something changes.
                </p>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <NierWindow title="pc">
                        <div className="flex flex-col">
                            {pc.map((item, i) => (
                                <NierStatRow key={i} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </NierWindow>

                    <NierWindow title="Hardware">
                        <div className="flex flex-col">
                            {hardware.map((item, i) => (
                                <NierStatRow key={i} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </NierWindow>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <NierWindow title="Software">
                        <div className="flex flex-col">
                            {software.map((item, i) => (
                                <NierStatRow key={i} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </NierWindow>

                    <NierWindow title="Editor Config">
                        <div className="flex flex-col">
                            {editorSetup.map((item, i) => (
                                <NierStatRow key={i} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </NierWindow>
                </div>

                {/*<NierWindow title="Dotfiles">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-sm leading-relaxed text-foreground/80">
              My entire development environment is reproducible via a single Nix flake.
              Clone the repo, run{" "}
              <code className="font-mono text-xs text-foreground/60">nix develop</code>,
              and you get my exact setup.
            </p>
            <span className="font-mono text-xs text-muted-foreground/50">
              github.com/mari/dotfiles
            </span>
          </div>
        </NierWindow>*/}

                <div className="h-px w-full bg-border/20" aria-hidden="true" />

                <Link
                    href="/uses/colophon"
                    className="group flex items-center gap-3 font-sans text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                >
                    <span
                        className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/15"
                        aria-hidden="true"
                    />
                    Colophon &mdash; how this site is built
                </Link>
            </div>
        </NierShell>
    );
}
