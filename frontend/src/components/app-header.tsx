"use client"

import Link from "next/link"
import { ChevronDown, CircleUser, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeaderDummyAudioToggle } from "@/components/header-dummy-audio-toggle"
import { HeaderScrollingTicker } from "@/components/header-scrolling-ticker"
import { useMockAuth } from "@/components/mock-auth-provider"

interface AppHeaderProps {
  onOpenAuth: () => void
  onOpenSidebar: () => void
  showMobileMenu?: boolean
}

export function AppHeader({ onOpenAuth, onOpenSidebar, showMobileMenu = true }: AppHeaderProps) {
  const { user, logout } = useMockAuth()

  return (
    <header className="relative z-20 grid h-14 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full md:hidden"
            onClick={onOpenSidebar}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-center">
          <Link
            href="/"
            prefetch
            className="rounded-full px-3 py-2 font-sans text-sm font-medium uppercase tracking-[-0.01em] no-underline hover:bg-muted/60"
          >
            NERRAWAVE
            <span className="ml-px align-super text-[9px] font-normal">™</span>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Menu">
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="text-[13px]" asChild>
                <Link prefetch href="/">New transcription</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]" asChild>
                <Link prefetch href="/pricing">Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]" asChild>
                <Link prefetch href="/about">About Nerrawave</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[13px]" asChild>
                <Link prefetch href="/blog">Blog</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <HeaderScrollingTicker />

      <div className="flex shrink-0 items-center justify-end gap-2">
        <ThemeToggle />
        <HeaderDummyAudioToggle />

        {user ? (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden h-9 max-w-[11rem] rounded-full px-3 text-[13px] font-normal sm:inline-flex"
                >
                  <span className="truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="text-[13px]" asChild>
                  <Link href="/buy-credits">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[13px]" onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full sm:hidden"
                  aria-label="Account menu"
                >
                  <CircleUser className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="text-[13px]" disabled>
                  {user.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[13px]" asChild>
                  <Link href="/buy-credits">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[13px]" onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="hidden h-9 rounded-full border-input bg-background text-[13px] sm:inline-flex dark:border-[#f7f7f7] dark:bg-[#f7f7f7] dark:text-[#222222] dark:hover:bg-[#f7f7f7]/90"
              onClick={onOpenAuth}
            >
              Log in
            </Button>
            <Button
              className="h-9 rounded-full px-4 text-[13px] dark:border dark:border-muted-foreground/40 dark:bg-transparent dark:text-foreground dark:hover:bg-muted/50"
              onClick={onOpenAuth}
            >
              Sign up for free
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
