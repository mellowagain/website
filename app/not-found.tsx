import Link from "next/link";
import { NierBackground } from "@/components/nier-background";

export default function NotFound() {
    return (
        <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-background">
            <NierBackground />

            <div className="relative z-10 flex max-w-lg flex-col items-center gap-8 px-6 text-center">
                {/* Error code styled like a Nier system message */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-border" aria-hidden="true" />
                        <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground/50">System Alert</span>
                        <span className="h-px w-8 bg-border" aria-hidden="true" />
                    </div>

                    <h1 className="font-sans text-7xl font-light tracking-[0.2em] text-foreground/80 md:text-8xl">404</h1>

                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block h-2.5 w-2.5 rotate-45 border border-foreground/30 bg-foreground/10"
                            aria-hidden="true"
                        />
                        <span className="font-sans text-sm uppercase tracking-[0.25em] text-foreground/60">Target not found</span>
                        <span
                            className="inline-block h-2.5 w-2.5 rotate-45 border border-foreground/30 bg-foreground/10"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="h-px w-48 bg-border/30" aria-hidden="true" />

                <p className="font-sans text-sm leading-relaxed text-muted-foreground/60">
                    The requested resource could not be located within the current directory structure. It may have been moved, archived, or
                    never existed in this timeline.
                </p>

                {/* Return link styled like a Nier menu item */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 border border-border/40 bg-accent/30 px-6 py-3 transition-all duration-200 hover:bg-foreground/[0.08]"
                >
                    <span
                        className="inline-block h-2.5 w-2.5 border border-foreground/50 bg-foreground/20 transition-transform duration-250 ease-out group-hover:rotate-45"
                        aria-hidden="true"
                    />
                    <span className="font-sans text-sm uppercase tracking-[0.2em] text-foreground/70 transition-colors group-hover:text-foreground/90">
                        Return to directory
                    </span>
                </Link>

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
