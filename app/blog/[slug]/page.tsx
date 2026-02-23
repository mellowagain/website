import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { useMDXComponents } from "@/mdx-components";
import { NierShell } from "@/components/nier-shell";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import NotFound from "@/app/not-found";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return null;
    }

    return { title: post.frontmatter.title };
}

const components = useMDXComponents({});

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return <NotFound />;
    }

    const { content, frontmatter } = post;

    return (
        <NierShell>
            <div className="flex flex-col gap-10 prose-p:my-2">
                {/* header */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/blog"
                        className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors hover:text-foreground/70"
                    >
                        &larr; back to blog
                    </Link>

                    <h1 className="font-sans text-2xl font-medium tracking-wide text-foreground">{frontmatter.title}</h1>

                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground/60">{frontmatter.date}</span>
                        <span className="text-muted-foreground/20" aria-hidden="true">
                            |
                        </span>
                        <div className="flex gap-2">
                            {frontmatter.tags.map((tag: string) => (
                                <span key={tag} className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-border/20" aria-hidden="true" />

                <div className="prose-h1:mt-4 prose-h1:mb-2 prose-h2:mt-4 prose-h2:mb-2 prose-h3:mt-3 prose-h3:mb-1">
                    <MDXRemote
                        source={content}
                        components={components}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [[rehypePrettyCode, { theme: "vitesse-dark" }]],
                            },
                        }}
                    />
                </div>
            </div>
        </NierShell>
    );
}
