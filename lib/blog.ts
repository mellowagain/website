import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Feed } from "feed";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts() {
    const files = fs.readdirSync(BLOG_DIR);
    return files
        .filter((f) => f.endsWith(".mdx"))
        .map((filename) => {
            const slug = filename.replace(".mdx", "");
            const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
            const { data: frontmatter, content } = matter(raw);
            return { slug, frontmatter, content };
        });
}

export function getPostBySlug(slug: string) {
    const blogPath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(blogPath)) {
        return null;
    }

    const raw = fs.readFileSync(blogPath, "utf-8");
    const { data: frontmatter, content } = matter(raw);
    return { slug, frontmatter, content };
}

export function generateRssFeed() {
    const feed = new Feed({
        title: "Blog -- mari.zip",
        description: "strangely quiet here without you",
        author: {
            name: "Mari (mellowagain)",
            link: "https://mari.zip",
        },
        favicon: "https://mari.zip/icon.svg",
        feedLinks: {
            rss: "https://mari.zip/feed/rss.xml",
            json: "https://mari.zip/feed/feed.json",
            atom: "https://mari.zip/feed/atom.xml",
        },
        id: "https://mari.zip",
        language: "en",
        link: "https://mari.zip/blog",
        updated: new Date(process.env.NEXT_PUBLIC_GIT_DATE!),
        category: "technology",
    });

    getAllPosts().forEach((post) => {
        const content = post.content
            .replaceAll('import MdxLayout from "../components/mdx-layout";', "")
            .replaceAll("export default function MDXPage({ children }) {\n    return <MdxLayout>{children}</MdxLayout>\n}", "");

        feed.addItem({
            title: post.frontmatter.title,
            description: post.frontmatter.summary,
            id: post.slug,
            date: new Date(post.frontmatter.date),
            link: `https://mari.zip/blog/${post.slug}`,
            author: [
                {
                    name: "Mari (mellowagain)",
                    link: "https://mari.zip",
                },
            ],
            content,
        });
    });

    return feed;
}
