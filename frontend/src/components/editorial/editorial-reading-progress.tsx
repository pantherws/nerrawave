"use client"

import { useReadingProgress } from "@/hooks/use-reading-progress"

export function EditorialReadingProgress() {
  const progress = useReadingProgress()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-foreground/80 transition-transform duration-150 dark:bg-foreground/90"
      style={{ transform: `scaleX(${progress / 100})` }}
      aria-hidden
    />
  )
}
