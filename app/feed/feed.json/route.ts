import { generateRssFeed } from "@/lib/blog";

export async function GET() {
    const feed = generateRssFeed();

    return new Response(feed.json1(), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
