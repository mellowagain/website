import Link from "next/link";
import { NierShell } from "@/components/nier-shell";
import { NierWindow } from "@/components/nier-window";
import { getAllPosts } from "@/lib/blog";

export default function BlogPage() {
  let posts = getAllPosts();
  posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));

  return (
    <NierShell>
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.slug}`}
            className="group block transition-opacity hover:opacity-90"
          >
            <NierWindow title={post.frontmatter.title}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {post.frontmatter.date}
                  </span>
                  <span className="text-muted-foreground/20" aria-hidden="true">
                    |
                  </span>
                  <div className="flex gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="font-sans text-sm leading-relaxed text-foreground/80">
                  {post.frontmatter.summary}
                </p>
              </div>
            </NierWindow>
          </Link>
        ))}
      </div>
    </NierShell>
  );
}
