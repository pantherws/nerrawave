"use client"

import { RotateCcw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn, focusRingSoft } from "@/lib/utils"

const INTRO_DELAY_MS = 1800
const CHAR_MS = 42

const EN_LINES = ["Same margins.", "Same headings.", "Same table grid.", "Different language."]
const JA_LINES = ["同じ余白。", "同じ見出し。", "同じ表組み。", "言語だけ違う。"]

const EN_FULL = EN_LINES.join("")
const JA_FULL = JA_LINES.join("")
const MAX_CHARS = Math.max(EN_FULL.length, JA_FULL.length)

type DualBookTranslationAnimationProps = {
  className?: string
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

function linesFromTyped(fullLines: string[], typedCount: number) {
  let remaining = typedCount
  return fullLines.map((line) => {
    if (remaining <= 0) return ""
    const take = Math.min(line.length, remaining)
    remaining -= line.length
    return line.slice(0, take)
  })
}

function OpenBook({
  lines,
  typedLines,
  showCursor,
  cursorLineIndex,
  lang,
}: {
  lines: string[]
  typedLines: string[]
  showCursor: boolean
  cursorLineIndex: number
  lang: "en" | "ja"
}) {
  const leftIndices = [0, 1]
  const rightIndices = [2, 3]

  const renderPage = (indices: number[], page: "left" | "right") => (
    <div
      className={cn(
        "min-h-[5.25rem] space-y-1.5 px-1.5 sm:min-h-[5.75rem] sm:space-y-2 sm:px-2",
        page === "left" ? "pr-2 border-r border-foreground/8" : "pl-2",
      )}
    >
      {indices.map((index) => {
        const line = lines[index]
        const typed = typedLines[index] ?? ""
        if (!line) return null
        const isActive = showCursor && cursorLineIndex === index
        return (
          <div key={`${lang}-${index}`} className="relative min-h-[0.65rem] sm:min-h-[0.72rem]">
            <span
              className="block h-[0.55rem] max-w-full rounded-[1px] bg-foreground/[0.07] sm:h-[0.6rem]"
              style={{ width: `${Math.min(100, 42 + line.length * (lang === "ja" ? 4.2 : 3.4))}%` }}
              aria-hidden
            />
            <span
              className={cn(
                "absolute left-0 top-0 block whitespace-nowrap text-[8px] leading-none text-foreground/88 sm:text-[9px]",
                lang === "ja" && "tracking-[0.02em]",
              )}
            >
              {typed}
              {isActive ? (
                <span className="ml-px inline-block h-[0.7em] w-[1.5px] translate-y-[0.5px] animate-pulse bg-[#ef4444]" />
              ) : null}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="relative w-[47%] max-w-[15.5rem] min-w-[8.75rem] sm:max-w-[17rem] sm:min-w-[10rem]">
      <div className="relative rounded-sm border border-foreground/12 bg-background shadow-[inset_0_0_0_1px_rgb(255_255_255/0.02)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.04)]">
        <div className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-foreground/10" aria-hidden />
        <div className="grid grid-cols-2 gap-0 px-2 py-3 sm:px-2.5 sm:py-3.5">
          {renderPage(leftIndices, "left")}
          {renderPage(rightIndices, "right")}
        </div>
      </div>
      <p className="mt-1.5 text-center text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
        {lang === "en" ? "English" : "日本語"}
      </p>
    </div>
  )
}

export function DualBookTranslationAnimation({ className }: DualBookTranslationAnimationProps) {
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [charIndex, setCharIndex] = useState(0)
  const [typing, setTyping] = useState(false)
  const startAtRef = useRef<number | null>(null)
  const inViewRef = useRef(true)

  const typingRatio = reducedMotion ? 1 : Math.min(1, charIndex / MAX_CHARS)
  const enCharCount = Math.floor(typingRatio * EN_FULL.length)
  const jaCharCount = Math.floor(typingRatio * JA_FULL.length)
  const enTyped = linesFromTyped(EN_LINES, enCharCount)
  const jaTyped = linesFromTyped(JA_LINES, jaCharCount)

  const activeEnLine = EN_LINES.findIndex((line, i) => (enTyped[i]?.length ?? 0) < line.length)
  const activeJaLine = JA_LINES.findIndex((line, i) => (jaTyped[i]?.length ?? 0) < line.length)
  const showEnCursor = typing && enCharCount < EN_FULL.length
  const showJaCursor = typing && jaCharCount < JA_FULL.length

  const reset = useCallback(() => {
    startAtRef.current = null
    setCharIndex(0)
    setTyping(false)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setCharIndex(MAX_CHARS)
      return
    }

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) reset()
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    inViewRef.current = true

    let raf = 0
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick)
      if (!inViewRef.current) return

      if (startAtRef.current === null) startAtRef.current = time
      const elapsed = time - startAtRef.current

      if (elapsed < INTRO_DELAY_MS) {
        setTyping(false)
        setCharIndex(0)
        return
      }

      setTyping(true)
      const typingElapsed = elapsed - INTRO_DELAY_MS
      setCharIndex(Math.min(MAX_CHARS, Math.floor(typingElapsed / CHAR_MS)))
    }

    raf = requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion, reset])

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className="relative flex aspect-[960/300] w-full items-center justify-center gap-3 px-3 sm:gap-5 sm:px-6"
      >
        <OpenBook
          lines={EN_LINES}
          typedLines={enTyped}
          showCursor={showEnCursor}
          cursorLineIndex={activeEnLine}
          lang="en"
        />
        <div className="hidden h-10 w-px shrink-0 bg-foreground/10 sm:block" aria-hidden />
        <OpenBook
          lines={JA_LINES}
          typedLines={jaTyped}
          showCursor={showJaCursor}
          cursorLineIndex={activeJaLine}
          lang="ja"
        />

        {!reducedMotion ? (
          <button
            type="button"
            onClick={reset}
            className={cn(
              "absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-[color,background-color] hover:bg-foreground/[0.04] hover:text-muted-foreground/70",
              focusRingSoft,
            )}
            aria-label="Replay animation"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  )
}
