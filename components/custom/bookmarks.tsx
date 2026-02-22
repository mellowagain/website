"use client";

import useSWR from "swr";
import { NierWindow } from "@/components/nier-window";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Key } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Bookmarks() {
    let { data, error, isLoading } = useSWR("/api/bookmarks", fetcher, {
        revalidateOnFocus: false,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error || !data || !data.result) {
        return <p>Failed to load bookmarks</p>;
    }

    return (
        <NierWindow title={`All items (${data.count})`}>
            <div className="flex flex-col">
                {data.items.map(
                    (
                        item: {
                            link: string;
                            title: string;
                            domain: string;
                            created: string;
                        },
                        j: Key
                    ) => (
                        <Link key={j} href={item.link} className="group block transition-opacity hover:opacity-90">
                            <div className="flex items-baseline justify-between gap-4 border-b border-border/15 py-2 last:border-b-0">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans text-sm text-foreground/90">{item.title}</span>
                                    <span className="font-sans text-[11px] text-muted-foreground/50">{item.domain}</span>
                                </div>
                                <span className="shrink-0 font-mono text-[11px] text-muted-foreground/40">
                                    {formatDistanceToNow(new Date(item.created), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </Link>
                    )
                )}
            </div>
        </NierWindow>
    );
}
