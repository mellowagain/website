import useSWR from "swr";
import { NierWindow } from "@/components/nier-window";
import { NierLoadingIndicator } from "@/components/nier-shell";
import { formatDistanceToNow } from "date-fns";
import { Key } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecentlyPlayed() {
    let {data, error, isLoading} = useSWR("/api/spotify/recent", fetcher, {
        refreshInterval: 10000,
        revalidateOnFocus: true,
        refreshWhenHidden: false,
    });

    if (isLoading) {
        return (
            <NierWindow title="Recently Played">
                <NierLoadingIndicator/>
            </NierWindow>
        );
    }

    if (error || !data || !data.success) {
        return (
            <NierWindow title="Recently Played">
                <div className="flex flex-col gap-2">
                    <p className="font-sans text-sm text-foreground/70">
                        Failed to load Spotify data
                    </p>
                </div>
            </NierWindow>
        );
    }

    return (
        <NierWindow title="Recently Played">
            <div className="flex flex-col">
                {data.items.map((item: {
                    name: string;
                    artist: string;
                    playedAt: string;
                }, i: Key) => (
                    <div
                        key={i}
                        className="flex items-baseline justify-between gap-4 border-b border-border/15 py-1.5 last:border-b-0"
                    >
                        <div className="flex items-baseline gap-2">
                            <span className="font-sans text-sm text-foreground/90">
                              {item.name}
                            </span>
                            <span className="font-sans text-xs text-muted-foreground/50">
                                {item.artist}
                            </span>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground/40">
                            {formatDistanceToNow(new Date(item.playedAt), { addSuffix: true })}
                        </span>
                    </div>
                ))}
            </div>
        </NierWindow>
    )
}
