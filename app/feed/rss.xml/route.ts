import { generateRssFeed } from "@/lib/blog";

export async function GET() {
    const feed = generateRssFeed();

    return new Response(feed.rss2(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
