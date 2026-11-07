"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MoreHorizontal, Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, focusRingSoft } from "@/lib/utils"
import { useMockAuth } from "@/components/mock-auth-provider"

interface TasksSlidePanelProps {
  open: boolean
  onClose: () => void
  fixedHeight?: boolean
  fixedHeightFromLg?: boolean
}

function formatTaskDate(iso: string) {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

export function TasksSlidePanel({
  open,
  onClose,
  fixedHeight = false,
  fixedHeightFromLg = false,
}: TasksSlidePanelProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { tasks, updateTask, deleteTask, isReady } = useMockAuth()
  const savedCount = isReady ? tasks.length : 0
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setOpenMenuTaskId(null)
    }
  }, [open])

  const sessionTasks = isReady ? tasks : []

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return sessionTasks
    return sessionTasks.filter((task) => task.title.toLowerCase().includes(query))
  }, [searchQuery, sessionTasks])

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const startEdit = (taskId: string, title: string) => {
    setEditingId(taskId)
    setEditValue(title)
  }

  const commitEdit = (taskId: string) => {
    const trimmed = editValue.trim()
    if (trimmed) {
      updateTask(taskId, { title: trimmed })
    }
    setEditingId(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleDelete = (taskId: string) => {
    deleteTask(taskId)
    if (pathname === `/task/${taskId}`) {
      router.push("/")
    }
    if (editingId === taskId) {
      cancelEdit()
    }
  }

  return (
    <aside
      aria-hidden={!open}
      className={cn(
        "tasks-panel shrink-0 overflow-hidden border-r border-[var(--tasks-panel-border)] bg-[var(--tasks-panel-bg)] text-[13px] text-[var(--tasks-panel-fg)] transition-[width] duration-300 ease-out",
        fixedHeight ? "h-dvh" : fixedHeightFromLg ? "h-full lg:h-dvh" : "h-full",
        open ? "w-[260px]" : "w-0 border-r-0",
      )}
    >
      <div className="flex h-full w-[260px] flex-col">
        <div className="border-b border-[var(--tasks-panel-border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Recent tasks</p>
              <p className="text-xs text-[var(--tasks-panel-fg-muted)]">{savedCount} saved</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--tasks-panel-fg)] hover:bg-[var(--tasks-panel-hover)] hover:text-[var(--tasks-panel-fg)]"
              onClick={onClose}
              aria-label="Close recent tasks"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--tasks-panel-fg-subtle)]" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks"
              className={cn(
                "h-8 border-[var(--tasks-panel-input-border)] bg-[var(--tasks-panel-input-bg)] pl-8 text-[13px] md:text-[13px] text-[var(--tasks-panel-fg)] placeholder:text-[13px] placeholder:text-[var(--tasks-panel-fg-subtle)]",
                focusRingSoft,
                "focus-visible:border-[var(--tasks-panel-input-border)]",
              )}
            />
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div>
            {filteredTasks.length === 0 ? (
              <p className="px-4 py-6 text-center text-[var(--tasks-panel-fg-muted)]">
                {searchQuery.trim() ? "No tasks match your search" : "No tasks yet"}
              </p>
            ) : null}

            {filteredTasks.map((task, index) => {
              const isActive = pathname === `/task/${task.id}`
              const isEditing = editingId === task.id

              return (
                <div
                  key={task.id}
                  className={cn(
                    "group relative border-b border-[var(--tasks-panel-border)] px-4 py-3",
                    index === filteredTasks.length - 1 && "border-b-0",
                    isActive && "bg-[var(--tasks-panel-active)]",
                  )}
                >
                  <div className="flex items-start gap-1">
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(task.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              commitEdit(task.id)
                            }
                            if (e.key === "Escape") {
                              e.preventDefault()
                              cancelEdit()
                            }
                          }}
                          className={cn(
                            "w-full rounded-md border border-[var(--tasks-panel-edit-border)] bg-[var(--tasks-panel-edit-bg)] px-2 py-1 text-[13px] text-[var(--tasks-panel-fg)]",
                            focusRingSoft,
                            "focus-visible:border-[var(--tasks-panel-edit-border)]",
                          )}
                          aria-label="Edit task name"
                        />
                      ) : (
                        <Link
                          href={`/task/${task.id}`}
                          className="block font-medium text-[var(--tasks-panel-fg)] hover:underline"
                        >
                          {task.title}
                        </Link>
                      )}
                      <p className="mt-0.5 text-xs text-[var(--tasks-panel-fg-muted)]">
                        {task.sourceLanguage} → {task.targetLanguage}
                      </p>
                    </div>

                    <DropdownMenu
                      open={openMenuTaskId === task.id}
                      onOpenChange={(nextOpen) =>
                        setOpenMenuTaskId(nextOpen ? task.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-[var(--tasks-panel-fg)] opacity-100 hover:bg-[var(--tasks-panel-hover)] hover:text-[var(--tasks-panel-fg)] md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 md:data-[state=open]:opacity-100"
                          aria-label={`Task options for ${task.title}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-[80] w-32">
                        <DropdownMenuItem className="text-[13px]" onClick={() => startEdit(task.id, task.title)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[13px] text-destructive focus:text-destructive dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-300"
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-0.5 flex items-end justify-between gap-2 pr-1.5">
                    <span className="min-w-0 text-xs leading-none text-[var(--tasks-panel-fg-muted)]">
                      {task.pageCount} {task.pageCount === 1 ? "page" : "pages"}
                    </span>
                    <time
                      dateTime={task.createdAt}
                      className="shrink-0 whitespace-nowrap text-[10px] tabular-nums leading-none text-[var(--tasks-panel-fg-muted)]"
                    >
                      {formatTaskDate(task.createdAt)}
                    </time>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
