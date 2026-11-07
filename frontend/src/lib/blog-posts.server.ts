import "server-only"

import fs from "node:fs"
import path from "node:path"
import { cache } from "react"
import { readTimeFromText } from "@/lib/read-time"
import { parseBlogMarkdown } from "@/lib/blog/parse-blog-markdown"
import type { BlogBlock, BlogPost } from "@/lib/blog-posts"

function blockPlainText(block: BlogBlock): string {
  switch (block.type) {
    case "paragraph":
    case "lede":
    case "pullquote":
      return block.text
    case "list":
      return block.items.join(" ")
    case "callout":
      return `${block.label} ${block.text}`
    case "heading":
    case "subheading":
    case "section":
      return block.title
    case "figure":
      return block.caption
    case "stats":
      return block.items.map((i) => `${i.value} ${i.label}`).join(" ")
    case "footnote":
      return block.text
    default:
      return ""
  }
}

function loadBlogPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), "src/content/blog")
  if (!fs.existsSync(dir)) {
    console.error("[blog] content directory missing:", dir)
    return []
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()

  const posts: BlogPost[] = []

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8")
      const { meta, blocks: parsedBlocks } = parseBlogMarkdown(raw)
      const blocks =
        parsedBlocks[0]?.type === "paragraph" && parsedBlocks[0].text.trim() === meta.dek.trim()
          ? parsedBlocks.slice(1)
          : parsedBlocks
      const wordSource = [meta.dek, ...blocks.map(blockPlainText)].join(" ")

      posts.push({
        slug: meta.slug,
        title: meta.title,
        dek: meta.dek,
        date: meta.date,
        readTime: readTimeFromText(wordSource),
        author: "Nerrawave",
        tags: meta.tags,
        heroVariant: meta.heroVariant,
        blocks,
      })
    } catch (error) {
      console.error(`[blog] failed to load ${file}:`, error)
    }
  }

  posts.sort((a, b) => {
    const da = Date.parse(a.date)
    const db = Date.parse(b.date)
    const byDate = (Number.isNaN(db) ? 0 : db) - (Number.isNaN(da) ? 0 : da)
    if (byDate !== 0) return byDate
    return b.slug.localeCompare(a.slug)
  })

  return posts
}

export const getBlogPosts = cache(loadBlogPosts)

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug)
}

export function getBlogPostSlugs(): string[] {
  return getBlogPosts().map((post) => post.slug)
}
