"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function useInView(threshold = 0.4) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/** After “three things right: ingest, transcribe, deliver” */
export function ThreePillarsMotif() {
  const { ref, inView } = useInView()
  const items = ["Ingest", "Transcribe", "Deliver"] as const

  return (
    <div
      ref={ref}
      className="my-10 flex items-start justify-center gap-10 sm:gap-14"
      aria-hidden
    >
      {items.map((label) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "h-12 w-12 rounded-full border border-border/80 bg-background/80 transition-all duration-700",
              inView ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
