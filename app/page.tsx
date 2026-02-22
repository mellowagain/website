"use client";

import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";
import { NierPortrait } from "@/components/nier-portrait";

export default function HomePage() {
  return (
    <NierShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Portrait */}
        <div className="w-40 shrink-0 lg:w-44">
          <NierPortrait src="/images/portrait.jpg" alt="Portrait" />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          {/* Stat rows */}
          <div className="flex flex-col gap-2">
            <NierStatRow
              label="Currently"
              value="Building things in Rust and Go"
            />
            <NierStatRow
              label="Thinking of"
              value="Transit systems, flying, clean code"
            />
            <NierStatRow label="Based in" value="Zurich metropolitan area 🇨🇭" />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-sm leading-relaxed text-foreground/85">
              I'm Mari, a software engineer who builds high-performance backend
              systems and developer platforms. I've been writing code since I
              was 9 and that early obsession grew into a career focused on
              scalable infrastructure and great developer tooling.
            </p>
            <p className="font-sans text-sm leading-relaxed text-foreground/85">
              Outside of work, you'll find me exploring transit networks across
              Europe and the world, photographing my cats or deep in aviation
              rabbit holes.
            </p>
          </div>

          {/*<div className="h-px w-full bg-border/20" aria-hidden="true" />*/}

          {/* Status */}
          {/*<NierWindow title="Status">
            <div className="flex flex-col">
              <NierStatRow label="Name" value="Mari" />
              <NierStatRow label="Role" value="Software Engineer" />
              <NierStatRow label="Location" value="Winterthur, CH" />
              <NierStatRow label="Focus" value="Rust, TypeScript, Infra" />
              <NierStatRow label="Availability" value="Open to interesting work" />
            </div>
          </NierWindow>*/}
        </div>
      </div>
    </NierShell>
  );
}
