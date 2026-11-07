"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Maximize2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { DocumentSegment } from "@/lib/task-segments"
import { cn } from "@/lib/utils"

type PanelTab = "segment" | "ai" | "terminology" | "comments"

export function TaskSegmentPanel({
  segments,
  activeIndex,
  open,
  onOpenChange,
  onActiveIndexChange,
  onTranslationChange,
  onApplySuggestion,
  totalOnPage,
}: {
  segments: DocumentSegment[]
  activeIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onActiveIndexChange: (index: number) => void
  onTranslationChange: (segmentId: string, text: string) => void
  onApplySuggestion: (segmentId: string, text: string) => void
  totalOnPage: number
}) {
  const [tab, setTab] = useState<PanelTab>("segment")
  const [suggestionTab, setSuggestionTab] = useState<"ai" | "tm" | "terms">("ai")

  const segment = segments[activeIndex]
  const goPrev = () => onActiveIndexChange(Math.max(0, activeIndex - 1))
  const goNext = () => onActiveIndexChange(Math.min(segments.length - 1, activeIndex + 1))

  return (
    <aside
      className={cn(
        "task-segment-panel hidden shrink-0 flex-col border-l border-border/60 bg-background transition-[width] duration-200 ease-out lg:flex",
        open ? "w-[min(100%,23.75rem)] max-w-[38vw]" : "w-10",
      )}
    >
      <div className="flex shrink-0 items-center justify-between p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", !open && "mx-auto")}
          aria-label={open ? "Collapse segment panel" : "Expand segment panel"}
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
        >
          {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        {open && segment ? (
          <span className="pr-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Segment {segment.index}
          </span>
        ) : null}
      </div>

      {!open ? (
        <div className="flex flex-1 flex-col items-center gap-1.5 pb-3">
          {segments.map((item, index) => (
            <button
              key={item.id}
              type="button"
              title={`Segment ${item.index}`}
              onClick={() => {
                onOpenChange(true)
                onActiveIndexChange(index)
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-[11px] tabular-nums",
                index === activeIndex
                  ? "bg-foreground font-semibold text-background"
                  : "text-muted-foreground hover:bg-muted/80",
              )}
            >
              {item.index}
            </button>
          ))}
        </div>
      ) : !segment ? (
        <p className="px-3 pb-4 text-[13px] text-muted-foreground">No segments on this page.</p>
      ) : (
        <>
      <div className="flex shrink-0 gap-0.5 border-b border-border/60 px-2 pt-0">
        {(
          [
            ["segment", "Segment"],
            ["ai", "AI Assistant"],
            ["terminology", "Terminology"],
            ["comments", "Comments"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-t-md px-2.5 py-2 text-[11px] font-medium transition-colors",
              tab === id
                ? "bg-muted/50 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "segment" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">{segment.index}</span> of {totalOnPage}{" "}
              segments on this page
            </p>
            <div className="flex gap-0.5">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={goPrev} aria-label="Previous segment">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={goNext} aria-label="Next segment">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/10 p-3">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Source
                </p>
                <p className="text-[12px] leading-relaxed text-foreground/90">{segment.sourceText}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Translation
                </p>
                <Textarea
                  value={segment.translatedText}
                  onChange={(event) => onTranslationChange(segment.id, event.target.value)}
                  className="min-h-[5.5rem] resize-y text-[12px] leading-relaxed"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button type="button" size="sm" className="h-8 gap-1 text-[11px]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Rephrase
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-8 text-[11px]">
                  More options
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Copy">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Expand">
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex gap-2 border-b border-border/50 text-[11px]">
                {(
                  [
                    ["ai", "AI"],
                    ["tm", "Translation memory"],
                    ["terms", "Terminology"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSuggestionTab(id)}
                    className={cn(
                      "border-b-2 pb-1.5 transition-colors",
                      suggestionTab === id
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {suggestionTab === "ai" ? (
                <ul className="space-y-2">
                  {segment.suggestions.map((item, i) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-border/60 bg-card px-3 py-2.5"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {i + 1} · {item.label}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => onApplySuggestion(segment.id, item.text)}
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-[12px] leading-relaxed text-foreground/90">{item.text}</p>
                    </li>
                  ))}
                  {!segment.suggestions.length ? (
                    <p className="text-[12px] text-muted-foreground">No AI suggestions for this segment.</p>
                  ) : null}
                </ul>
              ) : (
                <p className="text-[12px] text-muted-foreground">
                  No matches in {suggestionTab === "tm" ? "translation memory" : "terminology"} yet.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-border/60 bg-muted/15 p-3">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Context in document
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                …{segment.contextBefore}
                <strong className="font-medium text-foreground"> [{segment.sourceText.slice(0, 48)}…] </strong>
                {segment.contextAfter}…
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-[13px] text-muted-foreground">
          {tab === "ai" && "Ask the assistant to refine tone, shorten, or adapt terminology for this page."}
          {tab === "terminology" && "Glossary terms from your upload will appear here during review."}
          {tab === "comments" && "Leave review notes for collaborators on specific segments."}
        </div>
      )}
        </>
      )}
    </aside>
  )
}
