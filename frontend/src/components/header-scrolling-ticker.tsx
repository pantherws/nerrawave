"use client"

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

const TICKER =
  "Every sound has a story · Extract deeper insights from your interviews · What can Nerrawave help you discover?"

/** Pixels of scroll per second (~ readable crawl). */
const TICKER_SPEED_PX_PER_S = 48

function TickerLine() {
  return (
    <span className="header-ticker__line inline-flex items-center gap-2.5">
      <span className="header-ticker__mark text-[10px] text-foreground/90" aria-hidden>
        ◆
      </span>
      <span>
        <span className="header-ticker__phrase">Every sound has a story</span>
        <span className="header-ticker__dot"> · </span>
        <span className="header-ticker__phrase header-ticker__phrase--dim">
          Extract deeper insights from your interviews
        </span>
        <span className="header-ticker__dot"> · </span>
        <span className="header-ticker__phrase header-ticker__phrase--accent">
          What can Nerrawave help you discover?
        </span>
      </span>
    </span>
  )
}

export function HeaderScrollingTicker() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [metrics, setMetrics] = useState<{ loopPx: number; sepPx: number } | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current
      const line = measureRef.current
      if (!viewport || !line) return
      const itemW = line.offsetWidth
      const sepPx = viewport.clientWidth + 64
      setMetrics({ loopPx: itemW + sepPx, sepPx })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    window.addEventListener("resize", measure)

    const mq = window.matchMedia("(min-width: 768px)")
    const onMq = () => window.requestAnimationFrame(measure)
    mq.addEventListener("change", onMq)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      mq.removeEventListener("change", onMq)
    }
  }, [])

  return (
    <div
      ref={viewportRef}
      className="header-ticker hidden min-w-0 md:block"
      aria-label={TICKER}
    >
      <div
        className={cn(
          "header-ticker__track flex w-max items-center py-1.5",
          metrics == null && "opacity-0",
        )}
        style={
          metrics != null && metrics.loopPx > 0
            ? ({
                "--ticker-loop-px": `${metrics.loopPx}px`,
                animationDuration: `${metrics.loopPx / TICKER_SPEED_PX_PER_S}s`,
              } as CSSProperties)
            : undefined
        }
      >
        <span ref={measureRef} className="shrink-0">
          <TickerLine />
        </span>
        <span
          className="header-ticker__spacer shrink-0"
          style={metrics != null ? { width: metrics.sepPx } : undefined}
          aria-hidden="true"
        />
        <span className="shrink-0" aria-hidden="true">
          <TickerLine />
        </span>
      </div>
    </div>
  )
}
