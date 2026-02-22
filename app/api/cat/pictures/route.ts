import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const CAT_DIR = path.join(process.cwd(), "public/images/cat");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

export async function GET() {
    try {
        const files = fs.readdirSync(CAT_DIR);
        const images = files
            .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
            .sort((a, b) => b.localeCompare(a))
            .map(filename => ({
                filename,
                url: `/images/cat/${filename}`,
            }));

        return NextResponse.json({ images });
    } catch {
        return NextResponse.json({ error: "Could not read cat directory" }, { status: 500 });
    }
}
