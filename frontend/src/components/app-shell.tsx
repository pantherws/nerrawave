"use client"

import dynamic from "next/dynamic"
import { createContext, useContext, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { TasksSlidePanel } from "@/components/tasks-slide-panel"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AppShellLayoutProvider } from "@/components/app-shell-layout-context"
import { cn } from "@/lib/utils"

const AuthModal = dynamic(
  () => import("@/components/auth-modal").then((mod) => mod.AuthModal),
  { ssr: false },
)

interface AppShellProps {
  children: React.ReactNode
  /** Lock the app to the viewport at all breakpoints. */
  noScroll?: boolean
  /** Lock the app to the viewport from the lg breakpoint up (CSS media query, no hydration flip). */
  noScrollFromLg?: boolean
}

const AppShellAuthContext = createContext<{ openAuth: () => void } | null>(null)

export function useAppShellAuth() {
  const context = useContext(AppShellAuthContext)
  return context ?? { openAuth: () => {} }
}

export function AppShell({
  children,
  noScroll = false,
  noScrollFromLg = false,
}: AppShellProps) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [tasksPanelOpen, setTasksPanelOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const openAuth = () => setAuthOpen(true)
  const authContext = useMemo(() => ({ openAuth }), [])
  const openTasksPanel = () => {
    setMobileSidebarOpen(false)
    setTasksPanelOpen(true)
  }
  const closeTasksPanel = () => setTasksPanelOpen(false)

  return (
    <AppShellAuthContext.Provider value={authContext}>
      <AppShellLayoutProvider sidebarExpanded={sidebarExpanded} tasksPanelOpen={tasksPanelOpen}>
      <div
        className={cn(
          "flex bg-background min-h-dvh",
          noScroll && "h-dvh overflow-hidden",
          noScrollFromLg && "lg:h-dvh lg:overflow-hidden",
        )}
      >
        <div
          className={cn(
            "hidden shrink-0 md:flex",
            noScroll
              ? undefined
              : noScrollFromLg
                ? "sticky top-0 self-start lg:static lg:self-auto"
                : "sticky top-0 self-start",
          )}
          onMouseLeave={closeTasksPanel}
        >
          <AppSidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((prev) => !prev)}
            onOpenAuth={openAuth}
            fixedHeight={!noScroll && !noScrollFromLg}
            fixedHeightFromLg={noScrollFromLg}
            tasksPanelOpen={tasksPanelOpen}
            onOpenTasksPanel={openTasksPanel}
          />
          <TasksSlidePanel
            open={tasksPanelOpen}
            onClose={closeTasksPanel}
            fixedHeight={!noScroll && !noScrollFromLg}
            fixedHeightFromLg={noScrollFromLg}
          />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {isHome ? (
            <div className="homepage-noise pointer-events-none absolute inset-0 z-0" aria-hidden />
          ) : (
            <div className="site-grid pointer-events-none absolute inset-0 z-0" aria-hidden />
          )}
          <AppHeader
            onOpenAuth={openAuth}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />
          <main
            className={cn(
              "relative flex-1",
              noScroll && "min-h-0 overflow-hidden",
              noScrollFromLg && "lg:min-h-0 lg:overflow-hidden",
            )}
          >
            <div
              className={cn(
                "relative z-[1]",
                noScroll && "flex h-full min-h-0 flex-1 flex-col overflow-hidden",
                noScrollFromLg &&
                  "lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden",
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" hideCloseButton className="w-[280px] p-0">
          <AppSidebar
            expanded
            onToggle={() => setMobileSidebarOpen(false)}
            onOpenAuth={() => {
              setMobileSidebarOpen(false)
              openAuth()
            }}
            tasksPanelOpen={tasksPanelOpen}
            onOpenTasksPanel={openTasksPanel}
          />
        </SheetContent>
      </Sheet>

      {tasksPanelOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeTasksPanel}
            aria-label="Close recent tasks"
          />
          <div className="absolute inset-y-0 left-0 shadow-xl">
            <TasksSlidePanel open onClose={closeTasksPanel} fixedHeight />
          </div>
        </div>
      ) : null}

      {authOpen ? <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} /> : null}
      </AppShellLayoutProvider>
    </AppShellAuthContext.Provider>
  )
}
