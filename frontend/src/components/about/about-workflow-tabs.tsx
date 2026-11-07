"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    id: "upload",
    label: "1. Upload",
    title: "Upload your recording",
    body: "Add audio or video from interviews, focus groups, or meetings. Nerrawave validates the container, estimates duration for credits, and prepares the file for speech processing.",
  },
  {
    id: "language",
    label: "2. Language",
    title: "Choose language and options",
    body: "Pick the spoken language (or confirm auto-detection where available) and any optional settings such as speaker labels or vocabulary hints that improve accuracy on brand or domain terms.",
  },
  {
    id: "transcribe",
    label: "3. Transcribe",
    title: "Transcribe and review",
    body: "Automated speech recognition turns audio into text. Where enabled, a second pass can flag low-confidence spans, possible mis-hears, or missing punctuation so reviewers know where to listen back.",
  },
  {
    id: "export",
    label: "4. Export",
    title: "Export and hand off",
    body: "Download the transcript in the formats your workflow needs—plain text, subtitles, or analyst-ready copy. Optional AI summaries can sit alongside the verbatim transcript when you enable them.",
  },
] as const

export function AboutWorkflowTabs() {
  const [active, setActive] = useState<(typeof STEPS)[number]["id"]>("upload")
  const step = STEPS.find((s) => s.id === active) ?? STEPS[0]

  return (
    <div className="about-solid-panel my-4 rounded-lg border border-border/70 p-1 transition-colors hover:border-foreground/30 sm:p-1.5">
      <div
        className="flex gap-1 overflow-x-auto pb-1 scrollbar-none"
        role="tablist"
        aria-label="How Nerrawave works"
      >
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-[11px] font-medium tracking-wide transition-colors sm:text-[12px]",
              active === s.id
                ? "about-solid-panel text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="about-solid-panel rounded-md px-4 py-5 sm:px-5" role="tabpanel">
        <h4 className="font-sentient-regular mb-3 text-[1.125rem] leading-snug tracking-[-0.01em]">
          {step.title}
        </h4>
        <p className="text-pretty text-[15px] leading-[1.85] text-foreground/88">{step.body}</p>
      </div>
    </div>
  )
}
