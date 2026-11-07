"use client"

import { useState } from "react"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Italic,
  Languages,
  Replace,
  Table2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type TranslationEditorToolbarProps = {
  editorRef: React.RefObject<HTMLDivElement | null>
  onContentChange: () => void
}

function exec(editor: HTMLDivElement | null, command: string, value?: string) {
  if (!editor) return
  editor.focus()
  document.execCommand(command, false, value)
}

export function TranslationEditorToolbar({
  editorRef,
  onContentChange,
}: TranslationEditorToolbarProps) {
  const [findOpen, setFindOpen] = useState(false)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")

  const runFind = () => {
    const editor = editorRef.current
    if (!editor || !findText) return
    editor.focus()
    const selection = window.getSelection()
    selection?.collapse(editor, 0)
    const found = (
      window as Window & { find?: (...args: unknown[]) => boolean }
    ).find?.(findText, false, false, true, false, true, false)
    if (!found) {
      selection?.collapse(editor, 0)
      ;(window as Window & { find?: (...args: unknown[]) => boolean }).find?.(
        findText,
        false,
        false,
        true,
        false,
        true,
        false,
      )
    }
  }

  const runReplace = () => {
    const editor = editorRef.current
    if (!editor || !findText) return
    const html = editor.innerHTML
    if (!html.includes(findText)) {
      runFind()
      return
    }
    editor.innerHTML = html.replace(findText, replaceText)
    onContentChange()
    runFind()
  }

  const replaceAll = () => {
    const editor = editorRef.current
    if (!editor || !findText) return
    editor.innerHTML = editor.innerHTML.split(findText).join(replaceText)
    onContentChange()
  }

  return (
    <div className="space-y-2 border-b border-border/60 pb-3">
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarIcon
          label="Bold"
          onClick={() => {
            exec(editorRef.current, "bold")
            onContentChange()
          }}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarIcon>
        <ToolbarIcon
          label="Italic"
          onClick={() => {
            exec(editorRef.current, "italic")
            onContentChange()
          }}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarIcon>
        <ToolbarIcon
          label="Inline code"
          onClick={() => {
            exec(editorRef.current, "formatBlock", "pre")
            onContentChange()
          }}
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarIcon>

        <span className="mx-1 h-5 w-px bg-border/80" aria-hidden="true" />

        <select
          className="h-8 max-w-[6.5rem] rounded-md border border-input/80 bg-background px-2 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-ring/35"
          defaultValue="Inter"
          onChange={(event) => {
            exec(editorRef.current, "fontName", event.target.value)
            onContentChange()
          }}
          aria-label="Font"
        >
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
        </select>
        <select
          className="h-8 w-[4.5rem] rounded-md border border-input/80 bg-background px-2 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-ring/35"
          defaultValue="3"
          onChange={(event) => {
            exec(editorRef.current, "fontSize", event.target.value)
            onContentChange()
          }}
          aria-label="Font size"
        >
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Title</option>
        </select>

        <input
          type="color"
          title="Text color"
          className="h-8 w-8 cursor-pointer rounded border border-input/80 bg-background p-0.5"
          defaultValue="#222222"
          onChange={(event) => {
            exec(editorRef.current, "foreColor", event.target.value)
            onContentChange()
          }}
          aria-label="Text color"
        />
        <input
          type="color"
          title="Highlight"
          className="h-8 w-8 cursor-pointer rounded border border-input/80 bg-background p-0.5"
          defaultValue="#fef08a"
          onChange={(event) => {
            exec(editorRef.current, "hiliteColor", event.target.value)
            onContentChange()
          }}
          aria-label="Highlight color"
        />

        <span className="mx-1 h-5 w-px bg-border/80" aria-hidden="true" />

        <ToolbarIcon label="Align left" onClick={() => exec(editorRef.current, "justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarIcon>
        <ToolbarIcon label="Align center" onClick={() => exec(editorRef.current, "justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarIcon>
        <ToolbarIcon label="Align right" onClick={() => exec(editorRef.current, "justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarIcon>
        <ToolbarIcon label="Justify" onClick={() => exec(editorRef.current, "justifyFull")}>
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarIcon>

        <span className="mx-1 h-5 w-px bg-border/80" aria-hidden="true" />

        <ToolbarIcon
          label="Left-to-right"
          onClick={() => {
            if (editorRef.current) editorRef.current.dir = "ltr"
            onContentChange()
          }}
        >
          <span className="text-[10px] font-medium">LTR</span>
        </ToolbarIcon>
        <ToolbarIcon
          label="Right-to-left"
          onClick={() => {
            if (editorRef.current) editorRef.current.dir = "rtl"
            onContentChange()
          }}
        >
          <span className="text-[10px] font-medium">RTL</span>
        </ToolbarIcon>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1 px-2 text-[11px]">
              <Table2 className="h-3.5 w-3.5" />
              Table
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 text-[12px]">
            <DropdownMenuLabel>Table options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                exec(
                  editorRef.current,
                  "insertHTML",
                  '<table class="task-doc-table"><tr><td>New cell</td><td>New cell</td></tr></table>',
                )
                onContentChange()
              }}
            >
              Insert 2×1 table
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Add column before</DropdownMenuItem>
            <DropdownMenuItem disabled>Add column after</DropdownMenuItem>
            <DropdownMenuItem disabled>Delete column</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Add row before</DropdownMenuItem>
            <DropdownMenuItem disabled>Add row after</DropdownMenuItem>
            <DropdownMenuItem disabled>Delete row</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Show borders</DropdownMenuItem>
            <DropdownMenuItem disabled>Hide borders</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-8 gap-1 px-2 text-[11px]", findOpen && "bg-muted/40")}
          onClick={() => setFindOpen((open) => !open)}
        >
          <Replace className="h-3.5 w-3.5" />
          Find & replace
        </Button>
      </div>

      {findOpen ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/15 p-2">
          <Languages className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            value={findText}
            onChange={(event) => setFindText(event.target.value)}
            placeholder="Find…"
            className="h-8 min-w-[7rem] flex-1 rounded-md border border-input/80 bg-background px-2 text-[12px] outline-none focus-visible:ring-1 focus-visible:ring-ring/35"
          />
          <input
            value={replaceText}
            onChange={(event) => setReplaceText(event.target.value)}
            placeholder="Replace with…"
            className="h-8 min-w-[7rem] flex-1 rounded-md border border-input/80 bg-background px-2 text-[12px] outline-none focus-visible:ring-1 focus-visible:ring-ring/35"
          />
          <Button type="button" size="sm" variant="secondary" className="h-8 text-[11px]" onClick={runFind}>
            Find
          </Button>
          <Button type="button" size="sm" variant="secondary" className="h-8 text-[11px]" onClick={runReplace}>
            Replace
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 text-[11px]" onClick={replaceAll}>
            Replace all
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function ToolbarIcon({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-8 w-8 shrink-0"
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
