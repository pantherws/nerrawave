"use client"

import { memo, type RefObject } from "react"
import dynamic from "next/dynamic"

const WikipediaGlobeExperimental = dynamic(
  () => import("@/components/globe-experiment/wikipedia-globe-experimental"),
  {
    ssr: false,
    loading: () => null,
  },
)

export interface HomepageGlobeProps {
  size: number
  isDarkMode: boolean
  headlineMaskRef?: RefObject<HTMLElement | null>
}

function HomepageGlobeInner({ size, isDarkMode, headlineMaskRef }: HomepageGlobeProps) {
  return (
    <WikipediaGlobeExperimental
      size={size}
      isDarkMode={isDarkMode}
      headlineMaskRef={headlineMaskRef}
    />
  )
}

export const HomepageGlobe = memo(
  HomepageGlobeInner,
  (prev, next) =>
    prev.size === next.size &&
    prev.isDarkMode === next.isDarkMode &&
    prev.headlineMaskRef === next.headlineMaskRef,
)
