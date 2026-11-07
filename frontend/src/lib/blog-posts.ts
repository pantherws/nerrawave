export type BlogBlock =
  | { type: "lede"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "section"; id: string; title: string; number?: string }
  | { type: "heading"; level: 2; title: string }
  | { type: "subheading"; title: string }
  | { type: "pullquote"; text: string; cite?: string }
  | {
      type: "figure"
      variant: "workflow" | "layers" | "comparison" | "typography"
      caption: string
      fullBleed?: boolean
    }
  | { type: "callout"; label: string; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "divider"; label?: string }
  | { type: "footnote"; index: number; text: string }
  | { type: "animation"; variant: "readable-pendulum" }

export interface BlogPost {
  slug: string
  title: string
  dek: string
  date: string
  readTime: string
  author: string
  tags: string[]
  heroVariant: "ai-document" | "pdf-format"
  blocks: BlogBlock[]
}

export type BlogPostSummary = Pick<BlogPost, "slug" | "title">
