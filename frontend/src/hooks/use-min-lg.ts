"use client"

import { useSyncExternalStore } from "react"

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia("(min-width: 1024px)")
  query.addEventListener("change", onStoreChange)
  return () => query.removeEventListener("change", onStoreChange)
}

function getSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches
}

export function useMinLg() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
