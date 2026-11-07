import { RichInline, RichParagraph } from "@/components/blog/rich-paragraph"
import { BlogEditorialFigure } from "@/components/blog/blog-editorial-figures"
import { ReadablePendulumAnimation } from "@/components/blog/readable-pendulum-animation"
import type { BlogBlock } from "@/lib/blog-posts"
import { cn } from "@/lib/utils"

export function JournalBlockRenderer({
  block,
  isFirstParagraph,
}: {
  block: BlogBlock
  isFirstParagraph: boolean
}) {
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
    case "heading":
      return (
        <h2 className="scroll-mt-28 pt-8 font-sentient-regular text-[27px] font-normal leading-[1.12] tracking-[-0.02em] text-foreground first:pt-4 sm:text-[33px]">
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
    default:
      return null
  }
}
