"use client"

import { useRef } from "react"
import { FileText, X } from "lucide-react"
import type { ResourceAttachmentMode, SavedResource, TranslationResourceSelection } from "@/lib/translation-resources"
import { cn } from "@/lib/utils"

const MODES: { id: ResourceAttachmentMode; label: string }[] = [
  { id: "none", label: "None" },
  { id: "upload", label: "Upload" },
  { id: "saved", label: "Saved" },
]

type TranslationResourceFieldProps = {
  label: string
  description: string
  variant?: "segmented" | "row"
  accept: string
  selection: TranslationResourceSelection
  savedItems: SavedResource[]
  canUseSaved: boolean
  onSignInForSaved: () => void
  onChange: (next: TranslationResourceSelection) => void
  /** Row layout for the narrow attachments column (label stacked above actions) */
  narrowColumn?: boolean
  showAttachmentChip?: boolean
}

export function TranslationResourceField({
  label,
  description,
  variant = "segmented",
  accept,
  selection,
  savedItems,
  canUseSaved,
  onSignInForSaved,
  onChange,
  narrowColumn = false,
  showAttachmentChip = false,
}: TranslationResourceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const setMode = (mode: ResourceAttachmentMode) => {
    if (mode === "saved" && !canUseSaved) {
      onSignInForSaved()
      return
    }
    onChange({
      mode,
      file: mode === "upload" ? selection.file : null,
      savedId: mode === "saved" ? selection.savedId : "",
    })
  }

  const clearSelection = () => {
    onChange({ mode: "none", file: null, savedId: "" })
  }

  const openUpload = () => {
    setMode("upload")
    window.requestAnimationFrame(() => inputRef.current?.click())
  }

  const openSaved = () => {
    setMode("saved")
  }

  const hiddenFileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      className="hidden"
      onChange={(event) => {
        const file = event.target.files?.[0] ?? null
        onChange({ mode: "upload", file, savedId: "" })
        event.target.value = ""
      }}
    />
  )

  const attachmentChip =
    selection.mode === "upload" && selection.file ? (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[12px] text-foreground">
        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{selection.file.name}</span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground"
          aria-label={`Remove ${label} file`}
          onClick={clearSelection}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </span>
    ) : null

  if (variant === "row") {
    const actionLinks = (
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <button
          type="button"
          className={cn(
            "transition-colors hover:text-foreground",
            selection.mode === "upload" && "text-foreground/85",
          )}
          onClick={openUpload}
        >
          Upload
        </button>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <button
          type="button"
          className={cn(
            "transition-colors hover:text-foreground",
            selection.mode === "saved" && "text-foreground/85",
          )}
          onClick={openSaved}
        >
          From saved
        </button>
      </div>
    )

    const savedPicker =
      selection.mode === "saved" ? (
        canUseSaved ? (
          <select
            value={selection.savedId}
            onChange={(event) => onChange({ ...selection, savedId: event.target.value, file: null })}
            className="mt-2 h-8 w-full rounded-lg border border-input/80 bg-background px-2 text-[11px] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring/35 focus-visible:ring-offset-0"
          >
            <option value="">Choose saved…</option>
            {savedItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={onSignInForSaved}
            >
              Sign in
            </button>{" "}
            for saved {label.toLowerCase()}s.
          </p>
        )
      ) : null

    return (
      <div className={cn(narrowColumn ? "space-y-1.5" : "border-b border-border/40 py-2.5 last:border-b-0")}>
        {hiddenFileInput}
        {narrowColumn ? (
          <>
            <span className="block text-[13px] font-medium text-foreground">{label}</span>
            {actionLinks}
            {savedPicker}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-[13px] font-medium text-foreground">{label}</span>
              {actionLinks}
            </div>
            {showAttachmentChip && attachmentChip ? (
              <div className="mt-2 flex justify-end">{attachmentChip}</div>
            ) : null}
            {savedPicker}
          </>
        )}
        {narrowColumn && showAttachmentChip && attachmentChip ? (
          <div className="mt-1">{attachmentChip}</div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="text-[12px] leading-snug text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-full border border-border/80 bg-muted/20 p-0.5">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setMode(mode.id)}
            className={cn(
              "rounded-full px-3 py-1 text-[12px] transition-colors",
              selection.mode === mode.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {selection.mode === "upload" ? (
        <div className="flex flex-wrap items-center gap-2">
          {hiddenFileInput}
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-full border border-input bg-background px-3 text-[12px] hover:bg-muted/40"
            onClick={() => inputRef.current?.click()}
          >
            Choose file
          </button>
          {attachmentChip}
          {!selection.file ? (
            <span className="text-[12px] text-muted-foreground">.csv, .xlsx, .txt, .tmx</span>
          ) : null}
        </div>
      ) : null}

      {selection.mode === "saved" ? (
        canUseSaved ? (
          <select
            value={selection.savedId}
            onChange={(event) => onChange({ ...selection, savedId: event.target.value })}
            className="h-9 w-full rounded-lg border border-input/80 bg-background px-3 text-[13px] text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring/35 focus-visible:ring-offset-0"
          >
            <option value="">Select a saved {label.toLowerCase()}…</option>
            {savedItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-[12px] text-muted-foreground">
            <button type="button" className="underline underline-offset-2 hover:text-foreground" onClick={onSignInForSaved}>
              Sign in
            </button>{" "}
            to use saved {label.toLowerCase()}s.
          </p>
        )
      ) : null}
    </div>
  )
}
