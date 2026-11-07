"use client"

import { useSyncExternalStore } from "react"

/** Discrete globe sizes — avoids resize loops from mobile browser chrome / sub-pixel width changes. */
function readGlobeSize(): number {
  if (typeof window === "undefined") return 500
  if (window.matchMedia("(min-width: 1024px)").matches) return 500
  if (window.matchMedia("(min-width: 640px)").matches) return 430
  return Math.min(520, Math.max(340, window.innerWidth - 16))
}

function subscribe(onStoreChange: () => void) {
  const queries = [
    window.matchMedia("(min-width: 640px)"),
    window.matchMedia("(min-width: 1024px)"),
  ]

  const notify = () => onStoreChange()
  queries.forEach((mq) => mq.addEventListener("change", notify))
  window.addEventListener("orientationchange", notify)

  return () => {
    queries.forEach((mq) => mq.removeEventListener("change", notify))
    window.removeEventListener("orientationchange", notify)
  }
}

export function useStableGlobeSize() {
  return useSyncExternalStore(subscribe, readGlobeSize, () => 500)
}
