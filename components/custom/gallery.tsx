"use client";

import useSWR from "swr";
import Image from "next/image";
import { Key, useState } from "react";
import { NierLightbox } from "@/components/nier-lightbox";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CatGallery() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    let { data, error, isLoading } = useSWR("/api/cat/pictures", fetcher, {
        revalidateOnFocus: false,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error || !data || data.error) {
        return <p>Failed to load cat gallery</p>;
    }

    const openLightbox = (url: string) => {
        const idx = data.images.findIndex((img: { url: string; filename: string }) => img.url === url);
        setLightboxIndex(idx !== -1 ? idx : null);
    };

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {data.images.map((photo: { url: string; filename: string }, i: Key) => (
                <button
                    key={i}
                    onClick={() => openLightbox(photo.url)}
                    className="group relative aspect-square cursor-pointer overflow-hidden border border-border/30 bg-accent/20"
                    aria-label={`View image full size`}
                >
                    <Image
                        src={photo.url}
                        alt={photo.filename}
                        fill
                        className="object-cover transition-all duration-700 ease-out grayscale-[60%] brightness-[0.85] sepia-[0.6] saturate-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </button>
            ))}

            {lightboxIndex !== null && (
                <NierLightbox
                    src={data.images[lightboxIndex].url}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={lightboxIndex > 0 ? () => setLightboxIndex(lightboxIndex - 1) : undefined}
                    onNext={lightboxIndex < data.images.length - 1 ? () => setLightboxIndex(lightboxIndex + 1) : undefined}
                />
            )}
        </div>
    );
}
