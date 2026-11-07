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

const SHARE_ITEMS = [
  { key: "linkedin" as const, label: "Share on LinkedIn", Icon: Linkedin },
  { key: "x" as const, label: "Share on X", Icon: XIcon },
  { key: "facebook" as const, label: "Share on Facebook", Icon: Facebook },
]

export function AboutHeroShare({ shareTitle }: { shareTitle: string }) {
  const [links, setLinks] = useState<ReturnType<typeof buildShareLinks> | null>(null)

  useEffect(() => {
    setLinks(buildShareLinks(window.location.href, shareTitle))
  }, [shareTitle])

  return (
    <nav
      className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/50 pt-6"
      aria-label="Share this page"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        SHARE ON:
      </span>
      <ul className="flex items-center gap-2">
        {SHARE_ITEMS.map(({ key, label, Icon }) => (
          <li key={key}>
            <a
              href={links?.[key] ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border border-border/70",
                "about-solid-panel text-muted-foreground transition-colors",
                "hover:border-foreground/35 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
