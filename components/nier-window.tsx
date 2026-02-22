interface NierWindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function NierWindow({ title, children, className = "" }: NierWindowProps) {
    return (
        <div className={`flex flex-col border border-border/30 ${className}`}>
            {/* Muted header bar */}
            <div className="flex items-center gap-2.5 border-b border-border/30 bg-accent/40 px-4 py-2">
                <span
                    className="nier-bullet nier-bullet-active inline-block h-2.5 w-2.5 border border-foreground/30 bg-foreground/20"
                    aria-hidden="true"
                />
                <h3 className="font-sans text-xs font-light uppercase tracking-[0.2em] text-foreground/60">{title}</h3>
            </div>
            {/* Content body */}
            <div className="bg-card/30 p-4">{children}</div>
        </div>
    );
}

interface NierStatRowProps {
    label: string;
    value: string;
}

export function NierStatRow({ label, value }: NierStatRowProps) {
    return (
        <div className="flex items-baseline justify-between gap-4 border-b border-border/15 py-1.5">
            <span className="font-sans text-sm tracking-wide text-muted-foreground">{label}</span>
            <div className="flex flex-1 items-baseline gap-3">
                <span className="h-px flex-1 bg-border/20" aria-hidden="true" />
                <span className="font-sans text-sm text-foreground/90">{value}</span>
            </div>
        </div>
    );
}
