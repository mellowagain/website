import type { MDXComponents } from "mdx/types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { NierWindow } from "@/components/nier-window";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Headings
        h1: (props) => (
            <h1 className="mb-6 mt-2 font-sans text-2xl font-medium uppercase tracking-[0.2em] text-foreground lg:text-3xl" {...props} />
        ),
        h2: (props) => (
            <h2 className="mb-4 mt-8 font-sans text-lg font-medium uppercase tracking-[0.15em] text-foreground first:mt-0" {...props} />
        ),
        h3: (props) => (
            <h3 className="mb-3 mt-6 font-sans text-base font-medium uppercase tracking-[0.1em] text-foreground/90" {...props} />
        ),
        h4: (props) => <h4 className="mb-2 mt-4 font-sans text-sm font-medium uppercase tracking-[0.1em] text-foreground/80" {...props} />,

        // Body text
        p: (props) => <p className="mb-4 font-sans text-sm leading-relaxed text-foreground/85 last:mb-0" {...props} />,
        strong: (props) => <strong className="font-medium text-foreground" {...props} />,
        em: (props) => <em className="italic text-foreground/70" {...props} />,

        // Links
        a: (props) => (
            <a
                className="text-foreground/90 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/50"
                target={props.href?.startsWith("http") ? "_blank" : undefined}
                rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                {...props}
            />
        ),

        // Lists
        ul: (props) => <ul className="mb-4 ml-1 flex flex-col gap-1.5" {...props} />,
        ol: (props) => <ol className="mb-4 ml-1 flex flex-col gap-1.5 [counter-reset:item]" {...props} />,
        li: (props) => (
            <li className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-foreground/85">
                <span
                    className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rotate-45 border border-foreground/30 bg-foreground/20"
                    aria-hidden="true"
                />
                <span>{props.children}</span>
            </li>
        ),

        // Code
        code: (props) => {
            // Inline code (no className means it's not a code block)
            if (!props.className) {
                return (
                    <code
                        className="border border-border/40 bg-accent/50 px-1.5 py-0.5 font-mono text-[13px] text-foreground/90"
                        {...props}
                    />
                );
            }
            // Code block (rendered by syntax highlighter with className)
            return <code className="font-mono text-[13px]" {...props} />;
        },
        pre: (props) => (
            <NierWindow title="Code">
                <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-foreground/85" {...props} />
            </NierWindow>
        ),

        // Blockquote
        blockquote: (props) => (
            <blockquote
                className="my-4 border-l-2 border-foreground/20 pl-4 font-sans text-sm italic leading-relaxed text-foreground/60"
                {...props}
            />
        ),

        // Horizontal rule -> Separator
        hr: () => <Separator className="my-8 bg-border/30" />,

        // Images
        img: (props) => (
            <figure className="my-6 flex flex-col border border-border/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="w-full object-cover grayscale-[60%] brightness-[0.85] sepia-[0.6] saturate-[0.7] transition-all duration-700 hover:grayscale-0 hover:brightness-100 hover:sepia-0 hover:saturate-100"
                    alt={props.alt || ""}
                    {...props}
                />
                {props.alt && (
                    <figcaption className="border-t border-border/30 bg-accent/30 px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
                        {props.alt}
                    </figcaption>
                )}
            </figure>
        ),

        // Table -> shadcn Table components
        table: (props) => (
            <div className="my-4 border border-border/30">
                <Table>{props.children}</Table>
            </div>
        ),
        thead: (props) => <TableHeader className="bg-accent/40">{props.children}</TableHeader>,
        tbody: (props) => <TableBody>{props.children}</TableBody>,
        tr: (props) => <TableRow className="border-border/20 hover:bg-accent/20">{props.children}</TableRow>,
        th: (props) => (
            <TableHead className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/60">
                {props.children}
            </TableHead>
        ),
        td: (props) => <TableCell className="font-sans text-sm text-foreground/85">{props.children}</TableCell>,

        // Allow overrides
        ...components,
    };
}
