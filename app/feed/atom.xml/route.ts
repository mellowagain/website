import { generateRssFeed } from "@/lib/blog";

export async function GET() {
    let feed = generateRssFeed();

    return new Response(feed.atom1(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
