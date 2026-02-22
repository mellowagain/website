"use client"

import Image from "next/image"

interface NierPortraitProps {
  src: string
  alt: string
}

export function NierPortrait({ src, alt }: NierPortraitProps) {
  return (
    <div className="group flex flex-col border border-border/40">
      {/* Image container - tall and narrow like the reference */}
      <div className="relative aspect-[3/5] w-full overflow-hidden bg-accent/30">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-all duration-700 ease-out grayscale-[60%] brightness-[0.85] sepia-[0.6] saturate-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100"
          sizes="(max-width: 768px) 100vw, 200px"
        />
        {/* Warm amber overlay matching the site's foreground color - fades on hover */}
        <div
          className="pointer-events-none absolute inset-0 bg-[#c8bfa8]/20 mix-blend-color transition-opacity duration-700 ease-out group-hover:opacity-0"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
