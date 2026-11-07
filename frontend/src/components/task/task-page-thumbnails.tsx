"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DocumentPage } from "@/lib/mock-document-pages"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TaskPageThumbnails({
  pages,
  selectedIndex,
  open,
  onOpenChange,
  onSelect,
}: {
  pages: DocumentPage[]
  selectedIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (index: number) => void
}) {
  return (
    <aside
      className={cn(
        "task-editor-thumbs relative flex shrink-0 flex-col border-r border-border/60 bg-muted/20 transition-[width] duration-200 ease-out",
        open ? "w-[8.75rem] md:w-[9.75rem]" : "w-10",
      )}
    >
      <div className="flex shrink-0 justify-end p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label={open ? "Collapse page list" : "Expand page list"}
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {open ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-2 pb-3 pt-0">
          {pages.map((page, index) => {
            const selected = index === selectedIndex
            return (
              <button
                key={page.pageNumber}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "group w-full text-left transition-opacity",
                  selected ? "opacity-100" : "opacity-80 hover:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "task-page-thumb-frame rounded-md border bg-white shadow-sm",
                    selected
                      ? "border-foreground/35 ring-2 ring-foreground/10"
                      : "border-border/80",
                  )}
                >
                  <div
                    className="task-page-thumb-inner task-document-preview pointer-events-none bg-white"
                    dangerouslySetInnerHTML={{ __html: page.sourceHtml }}
                  />
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-center text-[11px] tabular-nums",
                    selected ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {page.pageNumber}
                </p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-1.5 pb-3 pt-1">
          {pages.map((page, index) => {
            const selected = index === selectedIndex
            return (
              <button
                key={page.pageNumber}
                type="button"
                title={`Page ${page.pageNumber}`}
                onClick={() => onSelect(index)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-[11px] tabular-nums transition-colors",
                  selected
                    ? "bg-foreground font-semibold text-background"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {page.pageNumber}
              </button>
            )
          })}
        </div>
      )}
    </aside>
  )
}
