"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { AboutHeroShare } from "@/components/about/about-hero-share"
import { RichInline, RichParagraph } from "@/components/blog/rich-paragraph"
import { BlogEditorialFigure } from "@/components/blog/blog-editorial-figures"
import { ReadablePendulumAnimation } from "@/components/blog/readable-pendulum-animation"
import { EditorialReadingProgress } from "@/components/editorial/editorial-reading-progress"
import { JournalPostHero } from "@/components/journal/journal-post-hero"
import {
  EDITORIAL_ARTICLE_COL,
  EDITORIAL_GRID,
  EDITORIAL_RAIL_COL,
  EDITORIAL_SIDEBAR_COL,
} from "@/lib/editorial-layout"
import type { BlogBlock, BlogPost, BlogPostSummary } from "@/lib/blog-posts"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

function BlockRenderer({ block, isFirstParagraph }: { block: BlogBlock; isFirstParagraph: boolean }) {
  switch (block.type) {
    case "lede":
      return (
        <p className="blog-longform__lede text-pretty font-sentient-regular text-[1.2rem] leading-[1.45] tracking-[-0.02em] text-foreground sm:text-[1.35rem]">
          {block.text}
        </p>
      )
    case "paragraph":
      return (
        <RichParagraph
          text={block.text}
          className={cn(
            "text-pretty text-[15px] leading-[1.9] text-foreground/88",
            isFirstParagraph && "blog-longform__dropcap",
          )}
        />
      )
    case "section":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 pt-8 font-sentient-regular text-[27px] font-normal leading-[1.12] tracking-[-0.02em] text-foreground first:pt-4 sm:text-[33px]"
        >
          {block.title}
        </h2>
      )
    case "subheading":
      return (
        <h3 className="pt-4 font-medium text-[13px] uppercase tracking-[0.16em] text-foreground/75">
          {block.title}
        </h3>
      )
    case "pullquote":
      return (
        <figure className="blog-longform__pullquote relative my-2 py-2">
          <blockquote className="font-sentient-regular text-pretty text-[1.375rem] leading-[1.35] tracking-[-0.015em] text-foreground sm:text-[1.625rem]">
            <RichInline text={block.text} />
          </blockquote>
          {block.cite ? (
            <figcaption className="mt-4 text-[12px] leading-relaxed text-muted-foreground">{block.cite}</figcaption>
          ) : null}
        </figure>
      )
    case "figure":
      return (
        <figure
          className={cn(
            "my-2 space-y-3",
            block.fullBleed && "blog-longform__bleed sm:my-4",
          )}
        >
          <BlogEditorialFigure variant={block.variant} className="w-full" />
          <figcaption className="text-[12px] leading-relaxed tracking-[0.02em] text-muted-foreground">
            {block.caption}
          </figcaption>
        </figure>
      )
    case "callout":
      return (
        <aside className="about-solid-panel rounded-lg border border-border/70 px-5 py-5 sm:px-6">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {block.label}
          </p>
          <RichParagraph
            text={block.text}
            className="text-pretty text-[15px] leading-[1.85] text-foreground/90"
          />
        </aside>
      )
    case "stats":
      return (
        <div className="grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="about-solid-panel px-5 py-6 sm:px-6">
              <p className="font-sentient-regular text-[2rem] leading-none tracking-tight text-foreground sm:text-[2.25rem]">
                {item.value}
              </p>
              <p className="mt-3 text-[12px] leading-snug text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      )
    case "animation":
      if (block.variant === "readable-pendulum") {
        return <ReadablePendulumAnimation layout="inline" className="blog-longform__bleed sm:my-6" />
      }
      return null
    case "list": {
      const Tag = block.ordered ? "ol" : "ul"
      return (
        <Tag
          className={cn(
            "space-y-2 pl-5 text-[15px] leading-[1.85] text-foreground/88",
            block.ordered ? "list-decimal marker:text-muted-foreground" : "list-disc marker:text-foreground/35",
          )}
        >
          {block.items.map((item) => (
            <li key={item.slice(0, 32)} className="pl-1">
              <RichInline text={item} />
            </li>
          ))}
        </Tag>
      )
    }
    case "divider":
      return (
        <div className="flex items-center gap-4 py-2" role="presentation">
          <span className="h-px flex-1 bg-border" />
          {block.label ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {block.label}
            </span>
          ) : null}
          <span className="h-px flex-1 bg-border" />
        </div>
      )
    case "footnote":
      return (
        <p className="border-t border-border/60 pt-6 text-[13px] leading-relaxed text-muted-foreground">
          <sup className="mr-1 font-medium text-foreground/70">{block.index}</sup>
          {block.text}
        </p>
      )
    default:
      return null
  }
}

export function BlogLongformArticle({
  post,
  otherPost,
}: {
  post: BlogPost
  otherPost?: BlogPostSummary
}) {
  const sectionIds = useMemo(
    () =>
      post.blocks
        .filter((b): b is BlogBlock & { type: "section" } => b.type === "section")
        .map((b) => b.id),
    [post.blocks],
  )
  const activeSection = useActiveSection(sectionIds)
  const shareTitle = `${post.title} — Nerrawave`

  let paragraphIndex = 0

  return (
    <article className="blog-longform relative pb-20">
      <EditorialReadingProgress />

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
          <nav
            className="sticky top-24 space-y-1 border-l border-transparent py-16"
            aria-label="On this page"
          >
            <p className="mb-4 pl-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Contents
            </p>
            {sectionIds.map((id) => {
              const section = post.blocks.find((b) => b.type === "section" && b.id === id)
              if (!section || section.type !== "section") return null
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={cn(
                    "block border-l py-1.5 pl-4 text-[12px] leading-snug transition-colors",
                    activeSection === id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/80",
                  )}
                >
                  {section.title}
                </a>
              )
            })}
          </nav>
        </aside>

        <div className={cn(EDITORIAL_ARTICLE_COL, "space-y-6 py-12 sm:space-y-7 sm:py-16")}>
          {post.blocks.map((block, index) => {
            const isFirstParagraph = block.type === "paragraph" && paragraphIndex++ === 0
            return <BlockRenderer key={`${block.type}-${index}`} block={block} isFirstParagraph={isFirstParagraph} />
          })}
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
