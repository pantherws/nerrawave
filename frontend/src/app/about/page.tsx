import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Metadata } from "next"
import { AboutPageView } from "./about-page-view"

export const metadata: Metadata = {
  title: "About Nerrawave | AI Transcription & Research Analysis",
  description:
    "Discover Nerrawave, an AI transcription and audio analysis platform for interviews, focus groups and qualitative research. Transcribe, analyse and ask AI.",
}

function loadAboutSource() {
  const path = join(process.cwd(), "src/content/about-nerrawave.md")
  return readFileSync(path, "utf8")
}

export default function AboutPage() {
  return <AboutPageView source={loadAboutSource()} />
}
