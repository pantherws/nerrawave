"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAppShellLayout } from "@/components/app-shell-layout-context"
import { TaskDocumentPane } from "@/components/task/task-document-pane"
import { TaskEditorHeader } from "@/components/task/task-editor-header"
import {
  TaskEditorViewToolbar,
  type TaskViewMode,
} from "@/components/task/task-editor-view-toolbar"
import { TaskPageThumbnails } from "@/components/task/task-page-thumbnails"
import { TaskSegmentPanel } from "@/components/task/task-segment-panel"
import { Progress } from "@/components/ui/progress"
import { useMockAuth } from "@/components/mock-auth-provider"
import {
  getMockDocumentPages,
  type DocumentPage,
} from "@/lib/mock-document-pages"
import { withLegacyTaskFields, type TranslationTask } from "@/lib/mock-data"
import { getSegmentsForPage, type DocumentSegment } from "@/lib/task-segments"
import { updateSegmentTextInHtml } from "@/lib/task-document-utils"
import { cn } from "@/lib/utils"

interface TaskViewProps {
  task: TranslationTask
}

function languageTag(code: string) {
  const map: Record<string, string> = {
    English: "EN",
    Spanish: "ES",
    French: "FR",
    Arabic: "AR",
  }
  for (const [name, tag] of Object.entries(map)) {
    if (code.toLowerCase().includes(name.toLowerCase())) return `${name} [${tag}]`
  }
  return code
}

export function TaskView({ task: initialTask }: TaskViewProps) {
  const { updateTask, tasks } = useMockAuth()
  const { sidebarExpanded, tasksPanelOpen } = useAppShellLayout()
  const task = withLegacyTaskFields(
    tasks.find((t) => t.id === initialTask.id) ?? initialTask,
  )

  const pages = useMemo(() => {
    if (task.pages?.length) return task.pages
    if (task.status === "completed") return getMockDocumentPages(task)
    return []
  }, [task])

  const [selectedPage, setSelectedPage] = useState(1)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0)
  const [showChanges, setShowChanges] = useState(true)
  const [viewMode, setViewMode] = useState<TaskViewMode>("side-by-side")
  const [segmentOverrides, setSegmentOverrides] = useState<Record<string, string>>({})
  const [pagesPanelOpen, setPagesPanelOpen] = useState(true)
  const [segmentPanelOpen, setSegmentPanelOpen] = useState(true)

  const shellChromeOpen = sidebarExpanded || tasksPanelOpen

  useEffect(() => {
    if (shellChromeOpen) setPagesPanelOpen(false)
  }, [shellChromeOpen])

  const currentPage = pages[selectedPage]

  const baseSegments = useMemo(
    () => (currentPage ? getSegmentsForPage(currentPage.pageNumber) : []),
    [currentPage],
  )

  const segments: DocumentSegment[] = useMemo(
    () =>
      baseSegments.map((segment) => ({
        ...segment,
        translatedText: segmentOverrides[segment.id] ?? segment.translatedText,
      })),
    [baseSegments, segmentOverrides],
  )

  const activeSegment = segments[activeSegmentIndex]

  const sourceHtml = currentPage?.sourceHtml ?? ""
  const translatedHtml = currentPage?.translatedHtml ?? ""

  useEffect(() => {
    if (task.status !== "processing") return

    const interval = window.setInterval(() => {
      const nextProgress = Math.min(task.progress + 18, 100)
      if (nextProgress >= 100) {
        const nextPages = getMockDocumentPages({
          pageCount: task.pageCount,
          status: "completed",
          title: task.title,
          sourceLanguage: task.sourceLanguage,
          targetLanguage: task.targetLanguage,
        })
        updateTask(task.id, {
          progress: 100,
          status: "completed",
          pages: nextPages,
          translatedContent: nextPages[1]?.translatedHtml ?? "",
        })
      } else {
        updateTask(task.id, { progress: nextProgress })
      }
    }, 900)

    return () => window.clearInterval(interval)
  }, [task, updateTask])

  useEffect(() => {
    if (task.status !== "completed") return
    const needsPages =
      !task.pages?.length || !task.pages[0]?.sourceHtml.includes("task-doc-sheet")
    if (!needsPages) return
    const nextPages = getMockDocumentPages(task)
    updateTask(task.id, {
      pages: nextPages,
      translatedContent: task.translatedContent || nextPages[1]?.translatedHtml || "",
    })
  }, [task, updateTask])

  const persistPages = useCallback(
    (nextPages: DocumentPage[]) => {
      updateTask(task.id, {
        pages: nextPages,
        translatedContent: nextPages[selectedPage]?.translatedHtml ?? "",
      })
    },
    [selectedPage, task.id, updateTask],
  )

  const applySegmentToPage = useCallback(
    (segmentId: string, text: string) => {
      if (!currentPage) return
      setSegmentOverrides((prev) => ({ ...prev, [segmentId]: text }))
      const nextHtml = updateSegmentTextInHtml(currentPage.translatedHtml, segmentId, text)
      const nextPages = pages.map((page, index) =>
        index === selectedPage ? { ...page, translatedHtml: nextHtml } : page,
      )
      persistPages(nextPages)
    },
    [currentPage, pages, persistPages, selectedPage],
  )

  const handleTranslationChange = (segmentId: string, text: string) => {
    applySegmentToPage(segmentId, text)
  }

  const sourceLanguage = task.sourceLanguage || "English"
  const targetLanguage = task.targetLanguage.split(",")[0]?.trim() || "Spanish"
  const documentsExpanded = !pagesPanelOpen || !segmentPanelOpen

  return (
    <div
      className={cn(
        "task-editor-root flex min-h-0 flex-1 flex-col bg-[#ececef] dark:bg-[#1a1a1d]",
        documentsExpanded && "task-editor-root--wide-docs",
      )}
    >
      <TaskEditorHeader fileName={task.fileName || "Sustainability Report 2024.pdf"} />

      {task.status === "processing" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
          <div className="w-full max-w-md space-y-3 rounded-xl border border-border/70 bg-background p-6 shadow-sm">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preserving layout, images, and charts…
            </span>
            <Progress value={task.progress} />
            <p className="text-right text-[12px] tabular-nums text-muted-foreground">{task.progress}%</p>
          </div>
        </div>
      ) : currentPage ? (
        <>
          <TaskEditorViewToolbar
            showChanges={showChanges}
            onShowChangesChange={setShowChanges}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            pagesPanelOpen={pagesPanelOpen}
            onPagesPanelOpenChange={setPagesPanelOpen}
            segmentPanelOpen={segmentPanelOpen}
            onSegmentPanelOpenChange={setSegmentPanelOpen}
          />

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <TaskPageThumbnails
              pages={pages}
              selectedIndex={selectedPage}
              open={pagesPanelOpen}
              onOpenChange={setPagesPanelOpen}
              onSelect={(index) => {
                setSelectedPage(index)
                setActiveSegmentIndex(0)
              }}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <div
                className={cn(
                  "grid min-h-0 flex-1",
                  viewMode === "side-by-side" && "grid-cols-1 lg:grid-cols-2",
                  viewMode !== "side-by-side" && "grid-cols-1",
                )}
              >
                <TaskDocumentPane
                  label="Source"
                  languageTag={languageTag(sourceLanguage)}
                  html={sourceHtml}
                  activeSegmentId={activeSegment?.id ?? null}
                  side="source"
                  showChanges={showChanges}
                  wide={documentsExpanded}
                  className={cn(
                    viewMode === "single" && "hidden",
                    viewMode === "reading" && "hidden lg:flex",
                  )}
                />
                <TaskDocumentPane
                  label="Translation"
                  languageTag={languageTag(targetLanguage)}
                  html={translatedHtml}
                  activeSegmentId={activeSegment?.id ?? null}
                  side="target"
                  showChanges={showChanges}
                  wide={documentsExpanded}
                  className={cn(viewMode === "reading" && "lg:col-span-2")}
                />
              </div>
            </div>

            <TaskSegmentPanel
              segments={segments}
              activeIndex={activeSegmentIndex}
              open={segmentPanelOpen}
              onOpenChange={setSegmentPanelOpen}
              onActiveIndexChange={setActiveSegmentIndex}
              onTranslationChange={handleTranslationChange}
              onApplySuggestion={applySegmentToPage}
              totalOnPage={currentPage.pageNumber === 2 ? 12 : segments.length}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
