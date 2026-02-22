"use client";

import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CatGallery() {
  let { data, error, isLoading } = useSWR("/api/cat/pictures", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !data || data.error) {
    return <p>Failed to load cat gallery</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {data.images.map((photo, i) => (
        <div
          key={i}
          className="group relative aspect-square overflow-hidden border border-border/30 bg-accent/20"
        >
          <Image
            src={photo.url}
            alt={photo.filename}
            fill
            className="object-cover transition-all duration-700 ease-out grayscale-[60%] brightness-[0.85] sepia-[0.6] saturate-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
