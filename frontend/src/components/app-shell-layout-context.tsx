"use client"

import { createContext, useContext } from "react"

type AppShellLayoutContextValue = {
  sidebarExpanded: boolean
  tasksPanelOpen: boolean
}

const AppShellLayoutContext = createContext<AppShellLayoutContextValue>({
  sidebarExpanded: false,
  tasksPanelOpen: false,
})

export function AppShellLayoutProvider({
  sidebarExpanded,
  tasksPanelOpen,
  children,
}: AppShellLayoutContextValue & { children: React.ReactNode }) {
  return (
    <AppShellLayoutContext.Provider value={{ sidebarExpanded, tasksPanelOpen }}>
      {children}
    </AppShellLayoutContext.Provider>
  )
}

export function useAppShellLayout() {
  return useContext(AppShellLayoutContext)
}
