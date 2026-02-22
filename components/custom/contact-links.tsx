"use client";

import { CSSProperties } from "react";

const A = "iam";
const B = "otl";
const C = "em";
const D = "iram";
const E = "piz";
const F = "signal.me";
const G = "#eu";
const H = "fuwiecLvtzpzZeTnDa9fVGZHX1XlrGtXs18";
const I = "DwflErkxnWpzGZSlB0Jb1TpLzs32w";

const links = [
    { label: "Email", value: `${E}.${D}@${C}`, href: `${E}.${D}@${C}:${B}${A}`.split("").reverse().join("") },
    {
        label: "GitHub",
        value: "github.com/mellowagain",
        href: "https://github.com/mellowagain",
    },
    { label: "Signal", value: "27.redomwoem", href: `https://${F}/${G}/${H}${I}` },
];

export default function ContactLinks() {
    return (
        <>
            {links.map((link, i) => {
                const isGitHub = link.label === "GitHub";
                const style: CSSProperties = isGitHub ? {} : { unicodeBidi: "bidi-override", direction: "rtl" };

                return (
                    <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between border-b border-border/15 py-2.5 transition-colors last:border-b-0 hover:bg-background/30"
                    >
                        <span className="font-sans text-sm uppercase tracking-[0.15em] text-muted-foreground">{link.label}</span>
                        <span
                            className="font-sans text-sm text-foreground/80 group-hover:text-foreground group-hover:underline"
                            style={style}
                        >
                            {link.value}
                        </span>
                    </a>
                );
            })}
        </>
    );
}
