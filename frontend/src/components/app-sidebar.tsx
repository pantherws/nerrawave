"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  ArrowUpRight,
  CircleHelp,
  CircleUser,
  CreditCard,
  ExternalLink,
  FileText,
  History,
  Info,
  Mail,
  PenLine,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo, BrandMark } from "@/components/brand-logo"
import { SidebarToggleIcon } from "@/components/sidebar-toggle-icon"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMockAuth } from "@/components/mock-auth-provider"

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/nerrawave",
    label: "Instagram",
    icon: (
      <svg className="h-[13px] w-[13px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/nerrawave",
    label: "X",
    icon: (
      <svg className="h-[13px] w-[13px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/nerrawave",
    label: "LinkedIn",
    icon: (
      <svg className="h-[13px] w-[13px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
] as const

const NAV_ITEMS = [
  { href: "/about", label: "About", icon: Info },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/blog", label: "Blog", icon: FileText },
  {
    href: "https://nerrawave.com",
    label: "Nerrawave",
    icon: Activity,
    external: true,
    tooltip: "AI document translation",
  },
] as const

interface AppSidebarProps {
  expanded: boolean
  onToggle: () => void
  onOpenAuth: () => void
  fixedHeight?: boolean
  fixedHeightFromLg?: boolean
  tasksPanelOpen?: boolean
  onOpenTasksPanel?: () => void
}

function CollapsedIconButton({
  label,
  active,
  tooltip,
  onClick,
  onMouseEnter,
  href,
  external,
  children,
}: {
  label: string
  active?: boolean
  tooltip?: string
  onClick?: () => void
  onMouseEnter?: () => void
  href?: string
  external?: boolean
  children: ReactNode
}) {
  const className = cn(
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
    active && "bg-muted text-foreground",
  )

  const inner =
    href && !onClick ? (
      external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={className}
        >
          {children}
        </a>
      ) : (
        <Link prefetch href={href} aria-label={label} className={className}>
          {children}
        </Link>
      )
    ) : (
      <button
        type="button"
        aria-label={label}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </button>
    )

  const tip = tooltip ?? label

  return (
    <Tooltip>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {tip}
      </TooltipContent>
    </Tooltip>
  )
}

export function AppSidebar({
  expanded,
  onToggle,
  onOpenAuth,
  fixedHeight = false,
  fixedHeightFromLg = false,
  tasksPanelOpen = false,
  onOpenTasksPanel,
}: AppSidebarProps) {
  const heightClass = fixedHeight
    ? "h-dvh"
    : fixedHeightFromLg
      ? "h-full lg:h-dvh"
      : "h-full"
  const pathname = usePathname()
  const router = useRouter()
  const { user, tasks, isReady } = useMockAuth()

  const navLinkClass = (href: string, active = false) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
      (pathname === href || active) && "bg-muted text-foreground",
    )

  const openTasksPanel = () => {
    onOpenTasksPanel?.()
  }

  if (!expanded) {
    return (
      <TooltipProvider delayDuration={250}>
        <aside
          className={cn(
            "flex w-14 shrink-0 flex-col border-r border-border bg-background",
            heightClass,
          )}
        >
          <div className="flex items-center px-4 py-3">
            <button
              type="button"
              onClick={onToggle}
              className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              aria-label="Open sidebar"
            >
              <span className="flex items-center justify-center transition-opacity group-hover:opacity-0">
                <BrandMark width={28} height={28} className="!h-7" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <SidebarToggleIcon />
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-1 px-3">
            <CollapsedIconButton label="New task" href="/" active={pathname === "/"}>
              <PenLine className="h-4 w-4" />
            </CollapsedIconButton>
            <CollapsedIconButton
              label="Buy credits"
              href="/buy-credits"
              active={pathname === "/buy-credits"}
            >
              <CreditCard className="h-4 w-4" />
            </CollapsedIconButton>
            {isReady && user && tasks.length > 0 ? (
              <CollapsedIconButton
                label="Recent tasks"
                active={tasksPanelOpen}
                onClick={openTasksPanel}
                onMouseEnter={openTasksPanel}
              >
                <History className="h-4 w-4" />
              </CollapsedIconButton>
            ) : null}
          </div>

          <div className="flex-1" />

          <div className="flex shrink-0 flex-col items-center space-y-1 px-3 pb-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <CollapsedIconButton
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  external={"external" in item && item.external}
                  active={
                    !("external" in item && item.external) && pathname === item.href
                  }
                  tooltip={"tooltip" in item ? item.tooltip : item.label}
                >
                  <Icon className="h-4 w-4" />
                </CollapsedIconButton>
              )
            })}

            <div className="mt-4 flex flex-col items-center gap-2 px-0 text-muted-foreground">
              {SOCIAL_LINKS.map((social) => (
                <Tooltip key={social.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted/60 hover:text-foreground"
                    >
                      {social.icon}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {social.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 justify-center border-t border-border p-3">
            <CollapsedIconButton
              label={user ? "Account" : "Log in"}
              onClick={user ? () => router.push("/buy-credits") : onOpenAuth}
            >
              {user ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10px] font-semibold">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
              ) : (
                <CircleUser className="h-5 w-5" strokeWidth={1.5} />
              )}
            </CollapsedIconButton>
          </div>
        </aside>
      </TooltipProvider>
    )
  }

  return (
    <aside
      className={cn(
        "flex w-[260px] shrink-0 flex-col border-r border-border bg-background text-[13px]",
        heightClass,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <BrandLogo vhsGlitchOnHover />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={onToggle}
          aria-label="Close sidebar"
        >
          <SidebarToggleIcon />
        </Button>
      </div>

      <div className="space-y-1 px-3">
        <Link prefetch href="/" className={navLinkClass("/")}>
          <PenLine className="h-4 w-4" />
          New task
        </Link>
        <Link prefetch href="/buy-credits" className={navLinkClass("/buy-credits")}>
          <CreditCard className="h-4 w-4" />
          Buy credits
        </Link>
        {isReady && user && tasks.length > 0 ? (
          <button
            type="button"
            className={cn("w-full text-left", navLinkClass("", tasksPanelOpen))}
            onMouseEnter={openTasksPanel}
            onClick={openTasksPanel}
          >
            <History className="h-4 w-4" />
            Recent tasks
          </button>
        ) : null}
      </div>

      <div className="flex-1" />

      <div className="shrink-0 px-3 pb-3">
        <TooltipProvider delayDuration={250}>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              if ("external" in item && item.external) {
                const link = (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
                  </a>
                )

                if ("tooltip" in item && item.tooltip) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return <span key={item.href}>{link}</span>
              }
              return (
                <Link prefetch key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-3 px-3 text-muted-foreground">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="hover:text-foreground"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        {user ? (
          <div className="space-y-2">
            <p className="truncate font-medium">{user.email}</p>
            <p className="text-muted-foreground">
              {user.freeMinutesRemaining} free minutes · {user.credits} credits
            </p>
            <Button variant="outline" className="w-full rounded-full text-[13px]" asChild>
              <Link href="/buy-credits">
                Manage billing
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground">Log in to save and download tasks</p>
            <Button variant="outline" className="w-full rounded-full text-[13px]" onClick={onOpenAuth}>
              Log in
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
