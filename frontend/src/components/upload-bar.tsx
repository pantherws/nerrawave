"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeftRight, ArrowUp, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LANGUAGES } from "@/lib/languages"
import { cn } from "@/lib/utils"

interface UploadBarProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceChange: (value: string) => void
  onTargetChange: (value: string) => void
  onSubmit: (file?: File) => void
  className?: string
}

type OpenMenu = "source" | "target" | null

const languageButtonClass =
  "h-9 min-w-0 flex-1 gap-1 rounded-full px-2 text-[13px] font-normal sm:justify-between sm:px-3"

export function UploadBar({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  onSubmit,
  className,
}: UploadBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)

  useEffect(() => {
    if (!openMenu) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [openMenu])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onSubmit(file)
    event.target.value = ""
  }

  const swapLanguages = () => {
    if (sourceLanguage === "auto") return
    onSourceChange(targetLanguage)
    onTargetChange(sourceLanguage)
  }

  const sourceLabel = sourceLanguage === "auto" ? "Auto-detect" : sourceLanguage
  const targetLabel = targetLanguage || "Select language"

  const selectLanguage = (value: string) => {
    if (openMenu === "source") {
      onSourceChange(value)
    } else if (openMenu === "target") {
      onTargetChange(value)
    }
    setOpenMenu(null)
  }

  const menuItems =
    openMenu === "source"
      ? [{ value: "auto", label: "Auto-detect" }, ...LANGUAGES.map((l) => ({ value: l, label: l }))]
      : LANGUAGES.map((l) => ({ value: l, label: l }))

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={barRef} className={cn("relative mx-auto w-full max-w-3xl", className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.ppt,.pptx,.xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-2 shadow-sm sm:gap-3 sm:px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload document"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Upload your document</TooltipContent>
          </Tooltip>

          <Button
            type="button"
            variant="ghost"
            className={languageButtonClass}
            onClick={() => setOpenMenu(openMenu === "source" ? null : "source")}
            aria-expanded={openMenu === "source"}
          >
            <span className="truncate">{sourceLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-transparent hover:text-muted-foreground focus-visible:bg-transparent"
            onClick={swapLanguages}
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            className={languageButtonClass}
            onClick={() => setOpenMenu(openMenu === "target" ? null : "target")}
            aria-expanded={openMenu === "target"}
          >
            <span className={cn("truncate", !targetLanguage && "text-muted-foreground")}>
              {targetLabel}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
          </Button>

          <Button
            type="button"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            disabled={!targetLanguage}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Start translation"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        {openMenu ? (
          <div
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-border bg-popover p-3 shadow-lg"
            role="listbox"
          >
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-5">
              {menuItems.map((item) => {
                const selected =
                  openMenu === "source"
                    ? sourceLanguage === item.value
                    : targetLanguage === item.value

                return (
                  <button
                    key={`${openMenu}-${item.value}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      "rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-muted",
                      selected && "bg-muted font-medium",
                    )}
                    onClick={() => selectLanguage(item.value)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  )
}
