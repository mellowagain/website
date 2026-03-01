import Image from "next/image";
import { NierShell } from "@/components/nier-shell";
import { NierWindow, NierStatRow } from "@/components/nier-window";
import CatGallery from "@/components/custom/gallery";
import fs from "fs";
import path from "path";

export const metadata = { title: "Cat" };
export const dynamic = "force-static";

export default function CatsPage() {
    const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

    const files = fs.readdirSync(path.join(process.cwd(), "public/images/cat"));
    const images = files.filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())).sort((a, b) => b.localeCompare(a));

    return (
        <NierShell>
            <div className="flex flex-col gap-6">
                <NierWindow title="Mysta">
                    <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                        {/* Cat photo */}
                        <div className="group relative aspect-square w-full shrink-0 overflow-hidden border border-border/30 bg-accent/20 md:w-48 lg:w-56">
                            <Image
                                src="/images/cat/20240925_142354.jpg"
                                alt="Mysta"
                                fill
                                className="object-cover transition-all duration-700 ease-out grayscale-[60%] brightness-[0.85] sepia-[0.6] saturate-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100"
                                sizes="(max-width: 768px) 100vw, 224px"
                            />
                            <div
                                className="pointer-events-none absolute inset-0 bg-[#c8bfa8]/20 mix-blend-color transition-opacity duration-700 ease-out group-hover:opacity-0"
                                aria-hidden="true"
                            />
                        </div>

                        {/* Cat stats */}
                        <div className="flex flex-1 flex-col">
                            <NierStatRow label="Breed" value="European Shorthair" />
                            <NierStatRow label="Color" value="Black, Brown, White" />
                            <NierStatRow label="Age" value="4 years" />
                            <NierStatRow label="Weight" value="4.5 kg" />
                            <NierStatRow label="Personality" value="Clingy, cute, always sleepy" />
                            <NierStatRow label="Favorite spot" value="On my pillow" />
                        </div>
                    </div>
                </NierWindow>

                {/* Photo Gallery */}
                <div className="h-px w-full bg-border/20" aria-hidden="true" />
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Gallery</p>
                <p className="font-sans text-sm leading-relaxed text-foreground/70">
                    Hover over images to see them in color. Click to enlarge.
                </p>
                <CatGallery images={images} />
            </div>
        </NierShell>
    );
}
