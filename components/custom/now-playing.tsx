"use client";

import useSWR from "swr";
import { NierStatRow, NierWindow } from "@/components/nier-window";
import { NierLoadingIndicator } from "@/components/nier-shell";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NowPlaying() {
  let { data, error, isLoading } = useSWR("/api/spotify/now", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    refreshWhenHidden: false,
  });

  if (isLoading) {
    return (
      <NierWindow title="Now Playing">
        <NierLoadingIndicator />
      </NierWindow>
    );
  }

  if (error || !data) {
    return (
      <NierWindow title="Now Playing">
        <div className="flex flex-col gap-2">
          <p className="font-sans text-sm text-foreground/70">
            Failed to load Spotify data
          </p>
        </div>
      </NierWindow>
    );
  }

  if (!data.isPlaying) {
    return (
      <NierWindow title="Now Playing">
        <div className="flex flex-col gap-2">
          <p className="font-sans text-sm text-foreground/70">
            Currently not playing any song
          </p>
        </div>
      </NierWindow>
    );
  }

  return (
    <NierWindow title="Now Playing">
      <div className="flex flex-col">
        <NierStatRow label="Track" value={data.track} />
        <NierStatRow label="Artist" value={data.artist} />
        <NierStatRow label="Album" value={data.album} />
      </div>
    </NierWindow>
  );
}
