"use client";

import { useEffect } from "react";
import { NierBackground } from "@/components/nier-background";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-background">
            <NierBackground />

            <div className="relative z-10 flex max-w-lg flex-col items-center gap-8 px-6 text-center">
                {/* Error code */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-destructive/40" aria-hidden="true" />
                        <span className="font-sans text-xs uppercase tracking-[0.3em] text-destructive/60">Critical Error</span>
                        <span className="h-px w-8 bg-destructive/40" aria-hidden="true" />
                    </div>

                    <h1 className="font-sans text-7xl font-light tracking-[0.2em] text-foreground/80 md:text-8xl">500</h1>

                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block h-2.5 w-2.5 rotate-45 border border-destructive/40 bg-destructive/15"
                            aria-hidden="true"
                        />
                        <span className="font-sans text-sm uppercase tracking-[0.25em] text-foreground/60">System malfunction</span>
                        <span
                            className="inline-block h-2.5 w-2.5 rotate-45 border border-destructive/40 bg-destructive/15"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="h-px w-48 bg-border/30" aria-hidden="true" />

                {/* Error details styled like a terminal log */}
                <div className="w-full border border-border/30 bg-card/50 p-4 text-left">
                    <div className="flex items-center gap-2 pb-2">
                        <span className="inline-block h-2 w-2 bg-destructive/50" aria-hidden="true" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">Error Log</span>
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-muted-foreground/50">
                        {error.message || "An unexpected error occurred during runtime execution."}
                    </p>
                    {error.digest && <p className="mt-2 font-mono text-[10px] text-muted-foreground/30">digest: {error.digest}</p>}
                </div>

                <p className="font-sans text-sm leading-relaxed text-muted-foreground/60">
                    An unrecoverable error has occurred within the system. Core processes may have been interrupted. Attempting a reset may
                    restore functionality.
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={reset}
                        className="group flex items-center gap-3 border border-border/40 bg-accent/30 px-6 py-3 transition-all duration-200 hover:bg-foreground/[0.08]"
                    >
                        <span
                            className="inline-block h-2.5 w-2.5 border border-foreground/50 bg-foreground/20 transition-transform duration-250 ease-out group-hover:rotate-45"
                            aria-hidden="true"
                        />
                        <span className="font-sans text-sm uppercase tracking-[0.2em] text-foreground/70 transition-colors group-hover:text-foreground/90">
                            Retry
                        </span>
                    </button>

                    <a
                        href="/"
                        className="group flex items-center gap-3 border border-border/40 bg-accent/30 px-6 py-3 transition-all duration-200 hover:bg-foreground/[0.08]"
                    >
                        <span
                            className="inline-block h-2.5 w-2.5 border border-foreground/50 bg-foreground/20 transition-transform duration-250 ease-out group-hover:rotate-45"
                            aria-hidden="true"
                        />
                        <span className="font-sans text-sm uppercase tracking-[0.2em] text-foreground/70 transition-colors group-hover:text-foreground/90">
                            Return home
                        </span>
                    </a>
                </div>

                {/* Bottom decoration */}
                <div className="flex items-center gap-2 pt-4">
                    <span className="h-px w-12 bg-border/20" aria-hidden="true" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30">mari.zip</span>
                    <span className="h-px w-12 bg-border/20" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
