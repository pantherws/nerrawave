import type { BlogBlock } from "@/lib/blog-posts"
import { slugifyHeading } from "@/lib/blog/slugify"

export type BlogFrontmatter = {
  slug: string
  title: string
  dek: string
  date: string
  tags: string[]
  heroVariant: "ai-document" | "pdf-format"
}

function parseFrontmatter(raw: string): { meta: BlogFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error("Blog markdown must start with frontmatter")
  const fm = match[1]
  const body = match[2]
  const meta: Record<string, string> = {}
  for (const line of fm.split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    meta[key] = value
  }
  return {
    meta: {
      slug: meta.slug ?? "",
      title: meta.title ?? "",
      dek: meta.dek ?? "",
      date: meta.date ?? "",
      tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      heroVariant: (meta.heroVariant ?? "ai-document") as BlogFrontmatter["heroVariant"],
    },
    body,
  }
}

function parseFigureBlock(lines: string[]): BlogBlock | null {
  const variantLine = lines.find((l) => l.startsWith("variant:"))
  const captionLine = lines.find((l) => l.startsWith("caption:"))
  if (!variantLine || !captionLine) return null
  const variant = variantLine.replace("variant:", "").trim() as
    | "workflow"
    | "layers"
    | "comparison"
    | "typography"
  return {
    type: "figure",
    variant,
    caption: captionLine.replace("caption:", "").trim(),
    fullBleed: true,
  }
}

export function parseBlogMarkdown(raw: string): {
  meta: BlogFrontmatter
  blocks: BlogBlock[]
} {
  const { meta, body } = parseFrontmatter(raw)
  const lines = body.split(/\r?\n/)
  const blocks: BlogBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    if (trimmed === ":::readable-pendulum") {
      i++
      while (i < lines.length && lines[i].trim() !== ":::") {
        i++
      }
      if (lines[i]?.trim() === ":::") i++
      blocks.push({ type: "animation", variant: "readable-pendulum" })
      continue
    }

    if (trimmed === ":::figure") {
      i++
      const figureLines: string[] = []
      while (i < lines.length && lines[i].trim() !== ":::") {
        figureLines.push(lines[i].trim())
        i++
      }
      if (lines[i]?.trim() === ":::") i++
      const figure = parseFigureBlock(figureLines)
      if (figure) blocks.push(figure)
      continue
    }

    if (trimmed.startsWith("##! ")) {
      const title = trimmed.slice(4).trim()
      blocks.push({
        type: "section",
        id: slugifyHeading(title),
        title,
      })
      i++
      continue
    }

    if (trimmed.startsWith("## ")) {
      const title = trimmed.slice(3).trim()
      blocks.push({ type: "heading", level: 2, title })
      i++
      continue
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "subheading", title: trimmed.slice(4).trim() })
      i++
      continue
    }

    if (trimmed.startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("* ")) {
        items.push(lines[i].trim().slice(2).trim())
        i++
      }
      blocks.push({ type: "list", items })
      continue
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2).trim())
        i++
      }
      blocks.push({ type: "pullquote", text: quoteLines.join(" ") })
      continue
    }

    blocks.push({ type: "paragraph", text: trimmed })
    i++
  }

  return { meta, blocks }
}
