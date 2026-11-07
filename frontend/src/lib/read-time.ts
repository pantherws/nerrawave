const WORDS_PER_MINUTE = 220

export function countWords(text: string): number {
  return text
    .replace(/\*\*/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function formatReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
  return `${minutes} min read`
}

export function readTimeFromText(text: string): string {
  return formatReadTime(countWords(text))
}
