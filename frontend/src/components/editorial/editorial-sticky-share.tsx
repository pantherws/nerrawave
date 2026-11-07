"use client"

import { useEffect, useState } from "react"
import { Facebook, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function buildShareLinks(pageUrl: string, title: string) {
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(title)
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  }
}

export function EditorialStickyShare({
  shareTitle,
  className,
  compact = false,
}: {
  shareTitle: string
  className?: string
  /** Hides label and uses lighter, smaller controls (e.g. About page). */
  compact?: boolean
}) {
  const [links, setLinks] = useState<{ linkedin: string; facebook: string; x: string } | null>(
    null,
  )

  useEffect(() => {
    const pageUrl = window.location.href
    setLinks(buildShareLinks(pageUrl, shareTitle))
  }, [shareTitle])

  const itemClass = compact
    ? "flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-muted-foreground/55 transition-colors hover:border-border hover:bg-muted/30 hover:text-muted-foreground"
    : "flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"

  return (
    <aside
      className={cn("sticky top-28 self-start", className)}
      aria-label="Share this page"
    >
      {!compact ? (
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Share
        </p>
      ) : null}
      <ul className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2")}>
        <li>
          <a
            href={links?.linkedin ?? "#"}
            className={itemClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </a>
        </li>
        <li>
          <a
            href={links?.x ?? "#"}
            className={itemClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <XIcon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
          </a>
        </li>
        <li>
          <a
            href={links?.facebook ?? "#"}
            className={itemClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </a>
        </li>
      </ul>
    </aside>
  )
}
