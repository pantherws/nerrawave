"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowUp,
  BookOpen,
  ChevronUp,
  FileText,
  Info,
  PencilLine,
  Plus,
  ScrollText,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  emptyResourceSelection,
  emptyTranslationEnhancements,
  formatSavedResourceLabel,
  MOCK_SAVED_GLOSSARIES,
  MOCK_SAVED_GUIDELINES,
  type TranslationEnhancements,
  type TranslationResourceSelection,
} from "@/lib/translation-resources"
import { cn, focusRingSoft } from "@/lib/utils"

export type TranslationSubmitPayload = {
  file?: File
  enhancements: TranslationEnhancements
}

type HomepageUploadPanelProps = {
  onSubmit: (payload: TranslationSubmitPayload) => void
  canUseSavedResources: boolean
  onSignInForSaved: () => void
  onOverlayOpenChange?: (open: boolean) => void
}

const DOCUMENT_ACCEPT =
  ".mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.wma,.webm,.mp4,.mov,.m4v,.mkv,.avi,.pdf,.doc,.docx,.txt,.rtf,.odt,.ppt,.pptx,.xls,.xlsx"
const GLOSSARY_ACCEPT = ".csv,.xlsx,.xls,.txt,.tmx"
const GUIDELINES_ACCEPT = ".pdf,.doc,.docx,.txt,.md"
const CONTEXT_MAX = 2000

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function SourceDocumentChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-7 min-w-0 max-w-[10.5rem] shrink items-center gap-1 rounded-full border border-border/50 bg-background px-2 text-[11px] text-foreground max-md:max-w-none max-md:flex-1">
      <FileText className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate">{label}</span>
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function TaskFileChip({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-[11px] text-foreground">
      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate">{file.name}</span>
      <span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span>
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label={`Remove ${file.name}`}
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  )
}

type AttachMenuItem = {
  icon: typeof Upload
  title: string
  subtitle: string
  onClick: () => void
}

function AttachmentPlusMenu({ items }: { items: AttachMenuItem[] }) {
  return (
    <div className="absolute left-0 top-[calc(100%+0.35rem)] z-50 w-[15.75rem] rounded-xl border border-border/80 bg-popover p-1 shadow-md">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.title}
            type="button"
            className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/45"
            onClick={item.onClick}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-foreground">{item.title}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                {item.subtitle}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function SectionTitle({
  title,
  optional,
  hint,
}: {
  title: string
  optional?: boolean
  hint?: string
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[12px] font-medium text-foreground">
        {title}
        {optional ? <span className="font-normal text-muted-foreground"> (optional)</span> : null}
      </p>
      {hint ? <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function TaskUploadRow({
  title,
  hint,
  file,
  onUpload,
  onClear,
}: {
  title: string
  hint: string
  file: File | null
  onUpload: () => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="min-w-[8.5rem] flex-1">
        <p className="text-[12px] font-medium text-foreground">{title}</p>
        <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>
      </div>
      {file ? (
        <TaskFileChip file={file} onRemove={onClear} />
      ) : (
        <button
          type="button"
          className="shrink-0 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          onClick={onUpload}
        >
          Upload
        </button>
      )}
    </div>
  )
}

export function HomepageUploadPanel({
  onSubmit,
  canUseSavedResources,
  onSignInForSaved,
  onOverlayOpenChange,
}: HomepageUploadPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const glossaryInputRef = useRef<HTMLInputElement>(null)
  const guidelinesInputRef = useRef<HTMLInputElement>(null)
  const contextRef = useRef<HTMLTextAreaElement>(null)

  const [plusMenuOpen, setPlusMenuOpen] = useState(false)
  const [expandedPanelOpen, setExpandedPanelOpen] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [enhancements, setEnhancements] = useState(emptyTranslationEnhancements)

  const showExpandedPanel = expandedPanelOpen

  useEffect(() => {
    onOverlayOpenChange?.(plusMenuOpen || expandedPanelOpen)
  }, [expandedPanelOpen, onOverlayOpenChange, plusMenuOpen])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setPlusMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (plusMenuOpen) {
        setPlusMenuOpen(false)
        return
      }
      if (expandedPanelOpen) {
        setExpandedPanelOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [expandedPanelOpen, plusMenuOpen])

  const handleStart = () => {
    onSubmit({
      file: documentFile ?? undefined,
      enhancements,
    })
  }

  const openExpanded = () => setExpandedPanelOpen(true)

  const closePlusMenu = () => setPlusMenuOpen(false)

  const setGlossary = (next: TranslationResourceSelection) => {
    setEnhancements((prev) => ({ ...prev, glossary: next }))
    openExpanded()
  }

  const setGuidelines = (next: TranslationResourceSelection) => {
    setEnhancements((prev) => ({ ...prev, guidelines: next }))
    openExpanded()
  }

  const toggleSavedGlossary = (checked: boolean) => {
    if (checked && !canUseSavedResources) {
      onSignInForSaved()
      return
    }
    setGlossary(
      checked
        ? { mode: "saved", file: null, savedId: enhancements.glossary.savedId }
        : emptyResourceSelection(),
    )
  }

  const toggleSavedGuidelines = (checked: boolean) => {
    if (checked && !canUseSavedResources) {
      onSignInForSaved()
      return
    }
    setGuidelines(
      checked
        ? { mode: "saved", file: null, savedId: enhancements.guidelines.savedId }
        : emptyResourceSelection(),
    )
  }

  const glossaryUploadFile =
    enhancements.glossary.mode === "upload" ? enhancements.glossary.file : null
  const guidelinesUploadFile =
    enhancements.guidelines.mode === "upload" ? enhancements.guidelines.file : null

  const attachMenuItems: AttachMenuItem[] = [
    {
      icon: Upload,
      title: "Upload audio or file",
      subtitle: "MP3, WAV, M4A, MP4, MOV, or documents.",
      onClick: () => {
        closePlusMenu()
        documentInputRef.current?.click()
      },
    },
    {
      icon: BookOpen,
      title: "Add glossary",
      subtitle: "Terminology and preferred terms.",
      onClick: () => {
        closePlusMenu()
        openExpanded()
        glossaryInputRef.current?.click()
      },
    },
    {
      icon: ScrollText,
      title: "Add guidelines",
      subtitle: "Style, tone and brand guidelines.",
      onClick: () => {
        closePlusMenu()
        openExpanded()
        guidelinesInputRef.current?.click()
      },
    },
    {
      icon: PencilLine,
      title: "Add instructions",
      subtitle: "Optional prompt for additional context.",
      onClick: () => {
        closePlusMenu()
        openExpanded()
        window.requestAnimationFrame(() => contextRef.current?.focus())
      },
    },
  ]

  const contextLength = enhancements.context.length

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={containerRef} className="relative mx-auto w-full max-w-3xl">
        <input
          ref={documentInputRef}
          type="file"
          accept={DOCUMENT_ACCEPT}
          className="hidden"
          onChange={(event) => {
            setDocumentFile(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
        />
        <input
          ref={glossaryInputRef}
          type="file"
          accept={GLOSSARY_ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            if (file) setGlossary({ mode: "upload", file, savedId: "" })
            event.target.value = ""
          }}
        />
        <input
          ref={guidelinesInputRef}
          type="file"
          accept={GUIDELINES_ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            if (file) setGuidelines({ mode: "upload", file, savedId: "" })
            event.target.value = ""
          }}
        />

        <div
          className={cn(
            "border border-border bg-background shadow-sm",
            showExpandedPanel
              ? "rounded-2xl"
              : documentFile
                ? "rounded-xl md:rounded-full"
                : "rounded-full",
          )}
        >
          <div
            className={cn(
              "flex gap-2 px-2 py-2 sm:gap-3 sm:px-3",
              documentFile
                ? "max-md:flex-col max-md:items-stretch md:flex-nowrap md:items-center"
                : "flex-nowrap items-center",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 items-center gap-2",
                documentFile && "max-md:w-full max-md:border-b max-md:border-border/40 max-md:pb-2",
              )}
            >
              <div className="relative shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-full",
                        plusMenuOpen && "bg-muted/30",
                      )}
                      onClick={() => setPlusMenuOpen((open) => !open)}
                      aria-label="Add files and options"
                      aria-expanded={plusMenuOpen}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Upload audio, video, or add optional glossary and notes
                  </TooltipContent>
                </Tooltip>
                {plusMenuOpen ? <AttachmentPlusMenu items={attachMenuItems} /> : null}
              </div>

              {documentFile ? (
                <SourceDocumentChip
                  label={documentFile.name}
                  onRemove={() => setDocumentFile(null)}
                />
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 flex-nowrap items-center justify-between gap-2 sm:gap-3">
              <p className="min-w-0 flex-1 px-1 text-left text-[13px] leading-snug text-muted-foreground max-md:text-[12px]">
                Add a recording (or tap + for optional glossary and speaker notes), then start.
              </p>

              <Button
                type="button"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full max-md:h-8 max-md:w-8"
                onClick={handleStart}
                aria-label="Start transcription"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showExpandedPanel ? (
            <div className="border-t border-border/50">
              <div className="flex justify-end px-4 pt-2 sm:px-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setExpandedPanelOpen(false)}
                >
                  Hide options
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-border/50">
                <div className="space-y-5 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-1.5">
                      <SectionTitle
                        title="Use my saved resources"
                        optional
                        hint="Reuse glossaries and guidelines already in your account."
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label="About saved resources"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[14rem] text-[12px]">
                          Saved glossaries and guidelines apply to this task only unless you change
                          them.
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2 text-[12px] text-foreground">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-border accent-foreground"
                          checked={enhancements.glossary.mode === "saved"}
                          onChange={(event) => toggleSavedGlossary(event.target.checked)}
                        />
                        <span>Use saved glossary</span>
                      </label>
                      {enhancements.glossary.mode === "saved" ? (
                        canUseSavedResources ? (
                          <select
                            value={enhancements.glossary.savedId}
                            onChange={(event) =>
                              setGlossary({
                                mode: "saved",
                                file: null,
                                savedId: event.target.value,
                              })
                            }
                            className={cn(
                              "h-8 w-full rounded-lg border border-input/80 bg-background px-2.5 text-[12px]",
                              focusRingSoft,
                            )}
                          >
                            <option value="">Select glossary…</option>
                            {MOCK_SAVED_GLOSSARIES.map((item) => (
                              <option key={item.id} value={item.id}>
                                {formatSavedResourceLabel(item)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            <button
                              type="button"
                              className="underline underline-offset-2 hover:text-foreground"
                              onClick={onSignInForSaved}
                            >
                              Sign in
                            </button>{" "}
                            to choose saved glossaries.
                          </p>
                        )
                      ) : null}

                      <label className="flex items-center gap-2 text-[12px] text-foreground">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-border accent-foreground"
                          checked={enhancements.guidelines.mode === "saved"}
                          onChange={(event) => toggleSavedGuidelines(event.target.checked)}
                        />
                        <span>Use saved guidelines</span>
                      </label>
                      {enhancements.guidelines.mode === "saved" ? (
                        canUseSavedResources ? (
                          <select
                            value={enhancements.guidelines.savedId}
                            onChange={(event) =>
                              setGuidelines({
                                mode: "saved",
                                file: null,
                                savedId: event.target.value,
                              })
                            }
                            className={cn(
                              "h-8 w-full rounded-lg border border-input/80 bg-background px-2.5 text-[12px]",
                              focusRingSoft,
                            )}
                          >
                            <option value="">Select guidelines…</option>
                            {MOCK_SAVED_GUIDELINES.map((item) => (
                              <option key={item.id} value={item.id}>
                                {formatSavedResourceLabel(item)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            <button
                              type="button"
                              className="underline underline-offset-2 hover:text-foreground"
                              onClick={onSignInForSaved}
                            >
                              Sign in
                            </button>{" "}
                            to choose saved guidelines.
                          </p>
                        )
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border/40 pt-4">
                    <SectionTitle
                      title="Task-specific files"
                      optional
                      hint="Upload glossary or guideline files for this job only."
                    />
                    <div className="space-y-3">
                      <TaskUploadRow
                        title="Add glossary"
                        hint="CSV, XLSX, TMX, or TXT."
                        file={glossaryUploadFile}
                        onUpload={() => glossaryInputRef.current?.click()}
                        onClear={() => setGlossary(emptyResourceSelection())}
                      />
                      <TaskUploadRow
                        title="Add guidelines"
                        hint="PDF, Word, or Markdown."
                        file={guidelinesUploadFile}
                        onUpload={() => guidelinesInputRef.current?.click()}
                        onClear={() => setGuidelines(emptyResourceSelection())}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[10rem] flex-col px-4 py-3 sm:min-h-[11rem] sm:px-5 sm:py-4">
                  <SectionTitle
                    title="Additional instructions"
                    optional
                    hint="Optional prompt for tone, audience, or handling notes."
                  />
                  <div className="relative mt-3 flex min-h-0 flex-1 flex-col">
                    <Textarea
                      ref={contextRef}
                      value={enhancements.context}
                      maxLength={CONTEXT_MAX}
                      onChange={(event) =>
                        setEnhancements((prev) => ({
                          ...prev,
                          context: event.target.value.slice(0, CONTEXT_MAX),
                        }))
                      }
                      placeholder="Add any specific instructions for names, spelling, or formatting…"
                      className={cn(
                        "min-h-[9rem] flex-1 resize-none rounded-xl border-border/60 bg-background pb-7 text-[13px] leading-relaxed placeholder:text-muted-foreground sm:min-h-[10rem]",
                        focusRingSoft,
                      )}
                    />
                    <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] tabular-nums text-muted-foreground">
                      {contextLength}/{CONTEXT_MAX}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  )
}
