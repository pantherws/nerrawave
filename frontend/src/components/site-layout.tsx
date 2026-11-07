"use client"

import { usePathname } from "next/navigation"
import { AppShell } from "@/components/app-shell"

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noScroll =
    pathname === "/" ||
    pathname?.startsWith("/task/") === true
  const noScrollFromLg = pathname === "/contact" || pathname === "/pricing"

  return (
    <AppShell noScroll={noScroll} noScrollFromLg={noScrollFromLg}>
      {children}
    </AppShell>
  )
}
