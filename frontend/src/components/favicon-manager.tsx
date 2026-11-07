"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"

const LOGO_LIGHT = "/logo-light-mode.png"
const LOGO_DARK = "/logo-dark-mode.png"

function faviconForTheme(isDark: boolean) {
  return isDark ? LOGO_DARK : LOGO_LIGHT
}

function applyFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[data-nerrawave-favicon]")

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    link.setAttribute("data-nerrawave-favicon", "true")
    document.head.appendChild(link)
  }

  link.href = href
}

export function FaviconManager() {
  const { theme } = useTheme()
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return
    const isDark = theme === "dark"
    applyFavicon(faviconForTheme(isDark))
  }, [mounted, theme])

  return null
}
