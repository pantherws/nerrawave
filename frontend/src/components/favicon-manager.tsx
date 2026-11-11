"use client"

import { useEffect } from "react"
import { useMounted } from "@/hooks/use-mounted"

const FAVICON_SRC = "/favicon-32.png"

function applyFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[data-nerrawave-favicon]")

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    link.type = "image/png"
    link.setAttribute("data-nerrawave-favicon", "true")
    document.head.appendChild(link)
  }

  link.href = href
}

export function FaviconManager() {
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return
    applyFavicon(FAVICON_SRC)
  }, [mounted])

  return null
}
