"use client"

import { Columns2, Eye, LayoutGrid, PanelLeft, PanelRight, Search, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type TaskViewMode = "side-by-side" | "single" | "reading"

export function TaskEditorViewToolbar({
  showChanges,
  onShowChangesChange,
  viewMode,
  onViewModeChange,
  pagesPanelOpen,
  onPagesPanelOpenChange,
  segmentPanelOpen,
  onSegmentPanelOpenChange,
}: {
  showChanges: boolean
  onShowChangesChange: (value: boolean) => void
  viewMode: TaskViewMode
  onViewModeChange: (mode: TaskViewMode) => void
  pagesPanelOpen: boolean
  onPagesPanelOpenChange: (open: boolean) => void
  segmentPanelOpen: boolean
  onSegmentPanelOpenChange: (open: boolean) => void
}) {
  return (
    <div className="task-editor-chrome flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-background px-4 py-2 lg:px-5">
      <label className="flex cursor-pointer items-center gap-2 text-[12px] text-foreground/85">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-border accent-primary"
          checked={showChanges}
          onChange={(event) => onShowChangesChange(event.target.checked)}
        />
        Show changes
      </label>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant={pagesPanelOpen ? "secondary" : "ghost"}
          size="sm"
          className="hidden h-8 gap-1.5 px-2.5 text-[11px] md:inline-flex"
          onClick={() => onPagesPanelOpenChange(!pagesPanelOpen)}
        >
          <PanelLeft className="h-3.5 w-3.5" />
          Pages
        </Button>
        <Button
          type="button"
          variant={segmentPanelOpen ? "secondary" : "ghost"}
          size="sm"
          className="hidden h-8 gap-1.5 px-2.5 text-[11px] lg:inline-flex"
          onClick={() => onSegmentPanelOpenChange(!segmentPanelOpen)}
        >
          <PanelRight className="h-3.5 w-3.5" />
          Segment
        </Button>
        <span className="mx-1 hidden h-5 w-px bg-border/80 md:block" aria-hidden />
        <ViewModeButton
          active={viewMode === "side-by-side"}
          label="Side by side"
          icon={<Columns2 className="h-3.5 w-3.5" />}
          onClick={() => onViewModeChange("side-by-side")}
        />
        <ViewModeButton
          active={viewMode === "single"}
          label="Single page"
          icon={<Square className="h-3.5 w-3.5" />}
          onClick={() => onViewModeChange("single")}
        />
        <ViewModeButton
          active={viewMode === "reading"}
          label="Reading view"
          icon={<Eye className="h-3.5 w-3.5" />}
          onClick={() => onViewModeChange("reading")}
        />
        <span className="mx-1 hidden h-5 w-px bg-border/80 sm:block" aria-hidden />
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Grid view">
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Search in document">
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function ViewModeButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className={cn("h-8 gap-1.5 px-2.5 text-[11px]", active && "bg-muted font-medium")}
      onClick={onClick}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}
