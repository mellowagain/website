"use client"

import { NierShell } from "@/components/nier-shell"
import { NierWindow, NierStatRow } from "@/components/nier-window"
import Link from "next/link";

const experience = [
  {
    period: "2026 -- currently",
    title: "Platforms Engineer",
    company: "AXA",
    description: "Building internal observability platform. OpenTelemetry, Dynatrace, real-time data processing, dashboards.",
  },
  {
    period: "2022 -- 2025",
    title: "Software Engineer",
    company: "Fiberplane",
    description:
      "Backend development, developer tooling, cloud infrastructure",
  },
]

const skills = [
  { category: "Languages", items: "Rust, Go, TypeScript, JavaScript, Python, SQL, Java, C#, C++, Bash" },
  { category: "Frameworks", items: "Hono, Cloudflare, Svelte, gRPC, Boost, Actix Web, Tokio, sqlx, Django, Flask" },
  { category: "DevOps & Cloud", items: "Docker, Kubernetes, Terraform, AWS, GCP, Azure, Cloudflare, CI/CD, Git, Dependabot" },
  { category: "Databases", items: "MySQL, PostgreSQL, MSSQL" },
  { category: "Spoken", items: "German (native), Tagalog (native), English (fluent)" },
]

export default function CVPage() {
  return (
    <NierShell>
      <div className="flex flex-col gap-6">
        {/* Experience */}
        <NierWindow title="Experience">
          <div className="flex flex-col gap-5">
            {experience.map((exp, i) => (
              <div
                key={i}
                className="border-b border-border/20 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-sans text-sm font-medium text-foreground">
                      {exp.title}
                    </h4>
                    <span className="font-sans text-xs text-muted-foreground">
                      {exp.company}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-foreground/80">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </NierWindow>

        {/* Skills */}
        <NierWindow title="Skills">
          <div className="flex flex-col">
            {skills.map((s, i) => (
              <NierStatRow key={i} label={s.category} value={s.items} />
            ))}
          </div>
        </NierWindow>

        <div className="h-px w-full bg-border/20" aria-hidden="true" />

        <Link
            href="/contact"
            className="group flex items-center gap-3 font-sans text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
        >
          <span
              className="nier-bullet inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/15"
              aria-hidden="true"
          />
          Contact me to get my full CV
        </Link>
      </div>
    </NierShell>
  )
}
