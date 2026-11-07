"use client"

import { useEffect, useState } from "react"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

const TYPEWRITER_MS = 2000

interface TypewriterHeadlineProps {
  text: string
  /** e.g. Geist Sans bold on homepage */
  className?: string
}

export function TypewriterHeadline({ text, className }: TypewriterHeadlineProps) {
  const mounted = useMounted()
  const [visibleLength, setVisibleLength] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!mounted) return

    setSettled(false)
    setVisibleLength(0)

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setVisibleLength(text.length)
      setSettled(true)
      return
    }

    const start = performance.now()
    let frame = 0
    let lastUpdate = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / TYPEWRITER_MS)

      if (now - lastUpdate >= 32 || progress >= 1) {
        lastUpdate = now
        setVisibleLength(Math.ceil(progress * text.length))
      }

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        setSettled(true)
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [mounted, text])

  const visible = text.slice(0, visibleLength)

  return (
    <span
      className={cn("typewriter-headline", className, settled && "vhs-glitch")}
      data-text={settled ? visible : undefined}
    >
      {visible}
    </span>
  )
}
