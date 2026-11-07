const fs = require("fs")
const path = require("path")

const src = fs.readFileSync(
  path.join(__dirname, "../_extracted-articles.txt"),
  "utf8",
)
const lines = src.split(/\r?\n/)

function extractBody(startTitle, endTitle) {
  const startIdx = lines.findIndex((l) => l.trim() === startTitle)
  const endIdx = endTitle
    ? lines.findIndex((l, i) => i > startIdx && l.trim() === endTitle)
    : -1
  if (startIdx < 0) throw new Error("start not found " + startTitle)
  const bodyLines = lines.slice(startIdx + 1, endIdx >= 0 ? endIdx : lines.length)
  while (
    bodyLines.length &&
    (bodyLines[bodyLines.length - 1].trim() === "" ||
      bodyLines[bodyLines.length - 1].includes("</user_query>"))
  ) {
    bodyLines.pop()
  }
  return bodyLines.join("\n").trim()
}

function toMarkdownBody(raw, figureAnchors) {
  const out = []
  const figs = [...figureAnchors]
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trimEnd()
    if (t === "") {
      out.push("")
      continue
    }
    if (/^\*\*.+\*\*$/.test(t.trim())) {
      out.push("")
      out.push("> " + t.trim())
      out.push("")
      continue
    }
    out.push(t)
    while (figs.length && figs[0].after === t.trim()) {
      const f = figs.shift()
      out.push("")
      out.push(":::figure")
      out.push("variant: " + f.variant)
      out.push("caption: " + f.caption)
      out.push(":::")
      out.push("")
    }
  }
  return out.join("\n").trim() + "\n"
}

const art1Raw = extractBody(
  "# AI Document Translation: How to Translate Documents Without Losing the Formatting",
  "# How to Translate a PDF Without Losing the Formatting",
)
const art2Raw = extractBody(
  "# How to Translate a PDF Without Losing the Formatting",
  null,
).replace(/<\/user_query>\s*$/, "").trim()

const art1Dek =
  "AI can translate a paragraph in seconds. Translating an entire document is a different problem."
const art2Dek = "Translating the words in a PDF is easy."

const art1Body = toMarkdownBody(art1Raw, [
  {
    after: "A useful way to think about document translation is as three connected problems.",
    variant: "workflow",
    caption:
      "Translation, review, and document reconstruction as one connected workflow.",
  },
  {
    after: "The language changes.",
    variant: "layers",
    caption:
      "Separating translatable language from the structural layers that define the document.",
  },
  {
    after:
      "A dedicated AI document translator is designed to handle the file itself, not merely the language contained inside it.",
    variant: "comparison",
    caption:
      "Pasting text into a chatbot versus translating the document file itself.",
  },
])

const art2Body = toMarkdownBody(art2Raw, [
  {
    after: "Then, repairing the translated document.",
    variant: "comparison",
    caption:
      "Convert-then-translate often means fixing formatting twice—before and after translation.",
  },
  {
    after: "It is to return the document in another language.",
    variant: "workflow",
    caption:
      "Analyse, translate, review, and reconstruct the PDF as a single workflow.",
  },
  {
    after:
      "It means preserving the design, hierarchy and structure of the original document as faithfully as the new language allows.",
    variant: "typography",
    caption:
      "Typography and layout adapt to the target language while keeping document hierarchy intact.",
  },
])

const fm1 = `---
slug: ai-document-translation
title: AI Document Translation: How to Translate Documents Without Losing the Formatting
dek: ${art1Dek}
date: October 6, 2026
tags: AI, Document translation, Formatting
heroVariant: ai-document
---

`

const fm2 = `---
slug: translate-pdf-keep-formatting
title: How to Translate a PDF Without Losing the Formatting
dek: ${art2Dek}
date: October 6, 2026
tags: PDF, Formatting, Translation
heroVariant: pdf-format
---

`

const journalDir = path.join(__dirname, "../src/content/journal")
fs.mkdirSync(journalDir, { recursive: true })
const p1 = path.join(journalDir, "ai-document-translation.md")
const p2 = path.join(journalDir, "translate-pdf-keep-formatting.md")
fs.writeFileSync(p1, fm1 + art1Body)
fs.writeFileSync(p2, fm2 + art2Body)

console.log("art1 section ok", art1Body.includes("## What is AI document translation?"))
console.log("art2 section ok", art2Body.includes("## Can you translate a PDF and keep the same formatting?"))
console.log("sizes", fs.statSync(p1).size, fs.statSync(p2).size)
