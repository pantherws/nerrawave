"use client"

import { useMemo } from "react"
import { highlightSegmentHtml } from "@/lib/task-document-utils"
import { cn } from "@/lib/utils"

export function TaskDocumentPane({
  label,
  languageTag,
  html,
  activeSegmentId,
  side,
  showChanges = true,
  wide = false,
  className,
}: {
  label: string
  languageTag: string
  html: string
  activeSegmentId: string | null
  side: "source" | "target"
  showChanges?: boolean
  wide?: boolean
  className?: string
}) {
  const renderedHtml = useMemo(
    () => highlightSegmentHtml(html, activeSegmentId, side),
    [html, activeSegmentId, side],
  )

  return (
    <section className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}>
      <div className="task-editor-chrome shrink-0 border-b border-border/50 bg-background/90 px-3 py-2">
        <p className="text-[11px] font-medium text-foreground">
          {label}{" "}
          <span className="font-normal text-muted-foreground">— {languageTag}</span>
        </p>
      </div>
      <div className="task-doc-viewport min-h-0 flex-1 overflow-auto p-4 lg:p-5">
        <div
          className={cn(
            "task-document-preview task-doc-page-canvas mx-auto",
            wide && "task-doc-page-canvas--wide",
            !showChanges && "show-changes-off",
          )}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </section>
  )
}
