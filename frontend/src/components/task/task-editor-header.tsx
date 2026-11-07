"use client"

import { ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TASK_WORKFLOW_STEPS, type TaskWorkflowStep } from "@/lib/task-segments"
import { cn } from "@/lib/utils"

export function TaskEditorHeader({
  fileName,
  workflowStep = "Review",
  savedLabel = "Saved 2 minutes ago",
}: {
  fileName: string
  workflowStep?: TaskWorkflowStep
  savedLabel?: string
}) {
  const activeIndex = TASK_WORKFLOW_STEPS.indexOf(workflowStep)

  return (
    <header className="task-editor-chrome flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-background px-4 py-2.5 lg:px-5">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 max-w-[min(100%,20rem)] justify-start gap-1.5 px-2 font-medium text-[13px]"
            >
              <span className="truncate">{fileName}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 text-[13px]">
            <DropdownMenuItem>Document properties</DropdownMenuItem>
            <DropdownMenuItem>Version history</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <nav
          className="hidden items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-0.5 sm:flex"
          aria-label="Workflow"
        >
          {TASK_WORKFLOW_STEPS.map((step, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            return (
              <span
                key={step}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium tracking-wide",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  !isActive && isPast && "text-foreground/80",
                  !isActive && !isPast && "text-muted-foreground",
                )}
              >
                {step}
              </span>
            )
          })}
        </nav>
      </div>

      <div className="ml-auto flex shrink-0 items-center justify-end gap-3">
        <span className="hidden text-[12px] text-muted-foreground md:inline">{savedLabel}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="h-9 gap-1.5 rounded-lg px-4 text-[12px] font-medium">
              Export
              <ChevronDown className="h-4 w-4 opacity-80" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-[13px]">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem>Download DOCX</DropdownMenuItem>
            <DropdownMenuItem>Download bilingual PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
