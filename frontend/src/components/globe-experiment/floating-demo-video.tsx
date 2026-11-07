"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const DEMO_YOUTUBE_ID = "WNBKGIlsknA"
const DEMO_POSTER_SRC = `https://img.youtube.com/vi/${DEMO_YOUTUBE_ID}/hqdefault.jpg`

function DemoVideoPreviewCard({
  compact,
  onOpen,
  onDismiss,
}: {
  compact?: boolean
  onOpen: () => void
  onDismiss: (event: React.MouseEvent) => void
}) {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-xl",
        "border border-border/80 bg-background/95 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] backdrop-blur-sm",
        "dark:bg-background/90 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]",
        compact
          ? "h-[3.75rem] w-[min(16rem,calc(100vw-2rem))]"
          : "h-[4.25rem] w-[min(18rem,calc(100vw-2.5rem))]",
      )}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-foreground"
        aria-label="Dismiss demo video"
      >
        <X className="h-3 w-3" />
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/35 focus-visible:ring-offset-0"
        aria-label="Watch the Nerrawave demo video"
      >
        <div className="relative w-1/3 shrink-0 overflow-hidden border-r border-border/60 bg-muted/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DEMO_POSTER_SRC} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-black/20" aria-hidden />
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm",
                compact ? "h-7 w-7" : "h-8 w-8",
              )}
            >
              <Play className={cn("fill-current", compact ? "ml-0.5 h-3 w-3" : "ml-0.5 h-3.5 w-3.5")} />
            </span>
          </span>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col justify-center py-2 pr-8",
            compact ? "px-3" : "px-3.5",
          )}
        >
          <p className="truncate text-[13px] font-medium text-foreground">See Nerrawave in action</p>
          <p className="truncate text-[11px] text-muted-foreground">Watch the demo</p>
        </div>
      </button>
    </div>
  )
}

export function FloatingDemoVideo() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const dismiss = (event: React.MouseEvent) => {
    event.stopPropagation()
    setDismissed(true)
    setOpen(false)
  }

  if (dismissed) {
    return null
  }

  return (
    <>
      <div className="demo-video-slide-in pointer-events-auto fixed bottom-[4.75rem] right-4 z-[39] sm:hidden">
        <DemoVideoPreviewCard compact onOpen={() => setOpen(true)} onDismiss={dismiss} />
      </div>

      <div className="demo-video-slide-in pointer-events-auto fixed bottom-[5.75rem] right-5 z-[39] hidden sm:block">
        <DemoVideoPreviewCard onOpen={() => setOpen(true)} onDismiss={dismiss} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden border-border/80 p-0 sm:rounded-xl">
          <DialogTitle className="sr-only">Nerrawave product demo</DialogTitle>
          {open ? (
            <iframe
              title="Nerrawave product demo"
              src={`https://www.youtube.com/embed/${DEMO_YOUTUBE_ID}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full border-0 bg-black"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
