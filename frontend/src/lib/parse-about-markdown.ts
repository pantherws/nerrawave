export type AboutBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; rows: string[][] }

export type AboutSection = {
  id: string
  title: string
  blocks: AboutBlock[]
}

export type ParsedAbout = {
  title: string
  lead?: string
  intro: AboutBlock[]
  sections: AboutSection[]
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function parseBlocks(body: string): AboutBlock[] {
  const blocks: AboutBlock[] = []
  const lines = body.split("\n")
  let i = 0
  let paragraph: string[] = []
  let listItems: string[] = []
  let tableRows: string[][] = []

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim()
    if (text) blocks.push({ type: "p", text })
    paragraph = []
  }

  const flushList = () => {
    if (listItems.length) blocks.push({ type: "ul", items: listItems })
    listItems = []
  }

  const flushTable = () => {
    if (tableRows.length) blocks.push({ type: "table", rows: tableRows })
    tableRows = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      flushTable()
      i++
      continue
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph()
      flushList()
      flushTable()
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() })
      i++
      continue
    }

    if (trimmed.startsWith("|")) {
      flushParagraph()
      flushList()
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
      if (!cells.every((c) => /^[-:]+$/.test(c))) {
        tableRows.push(cells)
      }
      i++
      continue
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph()
      flushTable()
      listItems.push(trimmed.slice(2).trim())
      i++
      continue
    }

    flushList()
    flushTable()
    paragraph.push(trimmed)
    i++
  }

  flushParagraph()
  flushList()
  flushTable()
  return blocks
}

export function parseAboutMarkdown(source: string): ParsedAbout {
  const normalized = source.replace(/\r\n/g, "\n").trim()
  const parts = normalized.split(/\n(?=## )/)

  let title = "About Nerrawave"
  let lead: string | undefined
  let introBody = ""

  const first = parts[0]
  const firstLines = first.split("\n")
  if (firstLines[0].startsWith("# ")) {
    title = firstLines[0].slice(2).trim()
    introBody = firstLines.slice(1).join("\n").trim()
    const leadMatch = introBody.match(/^\*\*(.+)\*\*/)
    if (leadMatch) {
      lead = leadMatch[1]
      introBody = introBody.slice(leadMatch[0].length).trim()
    }
  } else {
    introBody = first
  }

  const sections: AboutSection[] = parts.slice(1).map((chunk) => {
    const nl = chunk.indexOf("\n")
    const rawTitle = nl === -1 ? chunk.replace(/^##\s*/, "") : chunk.slice(3, nl).trim()
    const body = nl === -1 ? "" : chunk.slice(nl + 1).trim()
    return {
      id: slugify(rawTitle),
      title: rawTitle,
      blocks: parseBlocks(body),
    }
  })

  return {
    title,
    lead,
    intro: parseBlocks(introBody),
    sections,
  }
}
