"use client";

import { CSSProperties } from "react";

// contact info is base64 encoded and split up so crawlers reading source code dont stumble upon it
const J = atob("c3A=");
const L = atob("Mjcu");
const B = atob("b3Rs");
const H = atob("ODFzWHRHcmxYMVhIWkdWZjlhRG5UZVp6cHp0dkxjZWl3dWY=");
const E = atob("cGl6");
const G = atob("dWUj");
const K = atob("dHRo");
const F = atob("ZW0ubGFuZ2lz");
const D = atob("aXJhbQ==");
const I = atob("dzIzc3pMcFQxYkowQmxTWkd6cFdueGtyRWxmd0Q=");
const C = atob("ZW0=");
const A = atob("aWFt");

function reverse(input: string): string {
    return input.split("").reverse().join("");
}

const links = [
    { label: "Email", value: `${E}.${D}@${C}`, href: `${E}.${D}@${C}:${B}${A}` },
    {
        label: "GitHub",
        value: "github.com/mellowagain",
        href: reverse("https://github.com/mellowagain"),
    },
    { label: "Signal", value: `${L}redomwoem`, href: `${I}${H}/${G}/${F}//:${J}${K}` },
];

export default function ContactLinks() {
    return (
        <>
            {links.map((link, i) => {
                const isGitHub = link.label === "GitHub";
                const style: CSSProperties = isGitHub ? {} : { unicodeBidi: "bidi-override", direction: "rtl" };

                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();

                    const location = e.currentTarget.dataset.meow;
                    window.open(reverse(location!), "_blank");
                };

                return (
                    <a
                        key={i}
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between border-b border-border/15 py-2.5 transition-colors last:border-b-0 hover:bg-background/30"
                        onClick={handleClick}
                        data-meow={link.href}
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
