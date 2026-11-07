import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BlogIndexHero } from "@/components/blog/blog-index-hero"
import { BlogPostCardThumbnail } from "@/components/blog/blog-post-card-thumbnail"
import { getBlogPosts } from "@/lib/blog-posts.server"

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="blog-longform">
      <BlogIndexHero />

      <div className="mx-auto max-w-[46rem] divide-y divide-border/70 px-4 pt-2 sm:px-6 sm:pt-4">
        {posts.map((post, index) => (
          <article key={post.slug} className="group py-6 sm:py-7">
            <div className="flex gap-4 sm:gap-5">
              <Link
                href={`/blog/${post.slug}`}
                className="block w-[5.5rem] shrink-0 sm:w-[6.5rem]"
                aria-label={post.title}
              >
                <BlogPostCardThumbnail variant={post.heroVariant} />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[10px] text-muted-foreground">
                  <span className="font-medium tabular-nums tracking-[0.18em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{post.date}</span>
                  <span aria-hidden>·</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="mt-2.5 font-sentient-regular text-[1.0625rem] font-normal leading-[1.22] tracking-[-0.02em] sm:mt-3 sm:text-[1.1875rem]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-start gap-1.5 hover:underline"
                  >
                    <span>{post.title}</span>
                    <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" />
                  </Link>
                </h2>

                <p className="mt-2 text-pretty text-[13px] leading-[1.75] text-foreground/78">
                  {post.dek}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 px-2 py-px text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
