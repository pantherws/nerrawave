import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { AboutHeroShare } from "@/components/about/about-hero-share"
import { JournalBlockRenderer } from "@/components/journal/journal-block-renderer"
import { JournalPostHero } from "@/components/journal/journal-post-hero"
import { JournalReadingProgress } from "@/components/journal/journal-reading-progress"
import { JournalTocNav } from "@/components/journal/journal-toc-nav"
import {
  EDITORIAL_ARTICLE_COL,
  EDITORIAL_GRID,
  EDITORIAL_RAIL_COL,
  EDITORIAL_SIDEBAR_COL,
} from "@/lib/editorial-layout"
import type { BlogPost, BlogPostSummary } from "@/lib/blog-posts"
import { BackToTopButton } from "@/components/back-to-top-button"
import { cn } from "@/lib/utils"

export function JournalArticleView({
  post,
  otherPost,
}: {
  post: BlogPost
  otherPost?: BlogPostSummary
}) {
  const sections = post.blocks
    .filter((block) => block.type === "section")
    .map((block) => ({ id: block.id, title: block.title }))

  const shareTitle = `${post.title} — Nerrawave`
  let paragraphIndex = 0

  return (
    <article className="blog-longform relative pb-20">
      <JournalReadingProgress />

      <div className="blog-longform__hero border-b border-border/60">
        <div className={EDITORIAL_GRID}>
          <div className={EDITORIAL_SIDEBAR_COL} aria-hidden />
          <div className={cn(EDITORIAL_ARTICLE_COL, "pb-10 pt-10 sm:pb-12 sm:pt-14")}>
            <Link
              href="/blog"
              className="group mb-8 inline-flex items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              All articles
            </Link>

            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Blog
            </p>

            <h1 className="font-sentient-regular text-pretty text-[2rem] font-normal leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.75rem] lg:text-[3.25rem]">
              {post.title}
            </h1>

            <p className="blog-longform__lede mt-6 text-pretty font-sentient-regular text-[1.2rem] leading-[1.45] tracking-[-0.02em] text-foreground sm:text-[1.35rem]">
              {post.dek}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
              <span>{post.date}</span>
              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline" aria-hidden />
              <span>{post.readTime}</span>
              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline" aria-hidden />
              <span>Nerrawave</span>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <JournalPostHero variant={post.heroVariant} />
              <AboutHeroShare shareTitle={shareTitle} />
            </div>
          </div>
          <div className={EDITORIAL_RAIL_COL} aria-hidden />
        </div>
      </div>

      <div className={EDITORIAL_GRID}>
        <aside className={EDITORIAL_SIDEBAR_COL}>
          <JournalTocNav sections={sections} />
        </aside>

        <div className={cn(EDITORIAL_ARTICLE_COL, "space-y-6 py-12 sm:space-y-7 sm:py-16")}>
          {post.blocks.map((block, index) => {
            const isFirstParagraph = block.type === "paragraph" && paragraphIndex++ === 0
            return (
              <JournalBlockRenderer
                key={`${block.type}-${index}`}
                block={block}
                isFirstParagraph={isFirstParagraph}
              />
            )
          })}
          <BackToTopButton className="mt-4 pb-2" />
        </div>

        <div className={EDITORIAL_RAIL_COL} aria-hidden />
      </div>

      {otherPost ? (
        <footer className="border-t border-border/60">
          <div className={EDITORIAL_GRID}>
            <div className={EDITORIAL_SIDEBAR_COL} aria-hidden />
            <div className={cn(EDITORIAL_ARTICLE_COL, "py-14 sm:py-16")}>
              <Link
                href={`/blog/${otherPost.slug}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background/80 px-5 py-5 transition-colors hover:border-foreground/20"
              >
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Continue reading
                  </p>
                  <p className="mt-2 font-sentient-regular text-[1.125rem] leading-snug tracking-[-0.01em] text-foreground group-hover:underline">
                    {otherPost.title}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </div>
            <div className={EDITORIAL_RAIL_COL} aria-hidden />
          </div>
        </footer>
      ) : null}
    </article>
  )
}
