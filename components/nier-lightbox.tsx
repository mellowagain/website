"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface NierLightboxProps {
    src: string;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}

export function NierLightbox({ src, onClose, onPrev, onNext }: NierLightboxProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && onPrev) onPrev();
            if (e.key === "ArrowRight" && onNext) onNext();
        },
        [onClose, onPrev, onNext]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <button className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} aria-label="Close lightbox" />

            {/* Content */}
            <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between bg-accent/80 px-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 border border-foreground/40 bg-foreground/20" aria-hidden="true" />
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 px-1 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">x</span>
                        <span>Close</span>
                    </button>
                </div>

                {/* Image */}
                <div className="relative border border-t-0 border-border/40 bg-card/50">
                    <Image src={src} width={1200} height={900} alt="Mysta" className="max-h-[80vh] w-auto object-contain" sizes="90vw" />
                </div>

                {/* Navigation */}
                {(onPrev || onNext) && (
                    <div className="mt-3 flex items-center justify-between">
                        <button
                            onClick={onPrev}
                            disabled={!onPrev}
                            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
                            aria-label="Previous image"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                <path d="M8 1 L3 6 L8 11" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                            Prev
                        </button>

                        <div className="flex gap-1.5" aria-hidden="true">
                            <span className="h-1 w-1 bg-muted-foreground/30" />
                            <span className="h-1 w-1 bg-muted-foreground/30" />
                            <span className="h-1 w-1 bg-muted-foreground/30" />
                        </div>

                        <button
                            onClick={onNext}
                            disabled={!onNext}
                            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
                            aria-label="Next image"
                        >
                            Next
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                <path d="M4 1 L9 6 L4 11" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
