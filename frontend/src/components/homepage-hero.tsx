"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { HomepageUploadPanel } from "@/components/upload/homepage-upload-panel"
import type { TranslationSubmitPayload } from "@/components/upload/homepage-upload-panel"
import {
  MOCK_SAVED_GLOSSARIES,
  MOCK_SAVED_GUIDELINES,
  resolveResourceLabel,
} from "@/lib/translation-resources"
import { useAppShellAuth } from "@/components/app-shell"
import { useMockAuth } from "@/components/mock-auth-provider"
import { useMounted } from "@/hooks/use-mounted"
import { useStableGlobeSize } from "@/hooks/use-stable-globe-size"
import { HomepageLabelStrip } from "@/components/home/homepage-label-strip"
import { HomepageSoundwave } from "@/components/home/homepage-soundwave"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const HomepageCassette = dynamic(
  () => import("@/components/home/homepage-cassette").then((m) => m.HomepageCassette),
  { ssr: false, loading: () => null },
)

const UPLOAD_GAP_PX = 32
export function HomepageHero() {
  const router = useRouter()
  const { theme } = useTheme()
  const mounted = useMounted()
  const { openAuth } = useAppShellAuth()
  const { user, createTask } = useMockAuth()
  const showSignedOutChrome = !user
  const cassetteSize = Math.round(useStableGlobeSize() * 0.994 * 0.95)
  const [uploadOverlayOpen, setUploadOverlayOpen] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const cassetteAnchorRef = useRef<HTMLDivElement>(null)
  const [cassetteVisualBottomPx, setCassetteVisualBottomPx] = useState<number | null>(null)
  const [uploadTopPx, setUploadTopPx] = useState<number | null>(null)

  const isDarkMode = mounted && theme === "dark"

  useLayoutEffect(() => {
    if (!mounted) return

    const measure = () => {
      const hero = heroRef.current
      const anchor = cassetteAnchorRef.current
      if (!hero || !anchor) return
      const heroTop = hero.getBoundingClientRect().top
      const anchorTop = anchor.getBoundingClientRect().top
      const cassetteBottom =
        cassetteVisualBottomPx != null
          ? anchorTop + cassetteVisualBottomPx
          : anchor.getBoundingClientRect().bottom
      setUploadTopPx(cassetteBottom - heroTop + UPLOAD_GAP_PX)
    }

    measure()

    const ro = new ResizeObserver(measure)
    const anchor = cassetteAnchorRef.current
    if (anchor) ro.observe(anchor)

    window.addEventListener("resize", measure)
    window.visualViewport?.addEventListener("resize", measure)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      window.visualViewport?.removeEventListener("resize", measure)
    }
  }, [mounted, cassetteSize, cassetteVisualBottomPx])

  const startTask = ({ file, enhancements }: TranslationSubmitPayload) => {
    if (!user) {
      openAuth()
      return
    }

    const fileName = file?.name ?? "recording.mp3"
    const context = enhancements.context.trim()
    const glossaryName = resolveResourceLabel(enhancements.glossary, MOCK_SAVED_GLOSSARIES)
    const guidelinesName = resolveResourceLabel(
      enhancements.guidelines,
      MOCK_SAVED_GUIDELINES,
    )

    const task = createTask(
      fileName,
      "Auto-detect",
      "Transcript",
      {
        ...(context ? { translationContext: context } : {}),
        ...(glossaryName ? { glossaryName } : {}),
        ...(guidelinesName ? { guidelinesName } : {}),
      },
    )
    router.push(`/task/${task.id}`)
  }

  const waveHeight = Math.round(cassetteSize * 0.62)
  const waveGap = Math.round(cassetteSize * 0.86)

  return (
    <div ref={heroRef} className="relative flex h-full min-h-0 flex-1 flex-col">
      <div className="relative z-[1] flex shrink-0 flex-col items-center justify-start px-4 pt-3 sm:px-6 sm:pt-5">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h1 className="sr-only">Transcribe interviews and recordings with AI</h1>

          <div className="flex w-full flex-col items-stretch -translate-y-5">
            <div
              className="relative flex w-full shrink-0 items-center justify-center pt-1"
              style={{ minHeight: cassetteSize }}
            >
              {mounted ? (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(96vw,1500px)] -translate-x-1/2 -translate-y-1/2"
                  style={{ height: waveHeight }}
                >
                  <HomepageSoundwave gap={waveGap} isDarkMode={isDarkMode} />
                </div>
              ) : null}
              {mounted ? (
                <div
                  ref={cassetteAnchorRef}
                  className="pointer-events-auto relative z-10 max-md:scale-[1.08]"
                  style={{ width: cassetteSize, height: cassetteSize }}
                >
                  <HomepageCassette
                    size={cassetteSize}
                    isDarkMode={isDarkMode}
                    onVisualBounds={setCassetteVisualBottomPx}
                  />
                </div>
              ) : (
                <div
                  ref={cassetteAnchorRef}
                  className="shrink-0"
                  style={{ width: cassetteSize, height: cassetteSize }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadTopPx != null ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-20 flex justify-center px-4 sm:px-6"
          style={{ top: uploadTopPx }}
        >
          <div className="pointer-events-auto w-full max-w-3xl space-y-2 px-2">
            <HomepageUploadPanel
              onSubmit={startTask}
              canUseSavedResources={Boolean(user)}
              onSignInForSaved={openAuth}
              onOverlayOpenChange={(open) => {
                setUploadOverlayOpen(open)
                requestAnimationFrame(() => {
                  const hero = heroRef.current
                  const anchor = cassetteAnchorRef.current
                  if (!hero || !anchor) return
                  const heroTop = hero.getBoundingClientRect().top
                  const anchorTop = anchor.getBoundingClientRect().top
                  const cassetteBottom =
                    cassetteVisualBottomPx != null
                      ? anchorTop + cassetteVisualBottomPx
                      : anchor.getBoundingClientRect().bottom
                  setUploadTopPx(cassetteBottom - heroTop + UPLOAD_GAP_PX)
                })
              }}
            />

            <div
              className={cn("pt-3 md:hidden", uploadOverlayOpen && "pointer-events-none invisible")}
              aria-hidden={uploadOverlayOpen}
            >
              <HomepageLabelStrip
                layout="wrap"
                showFeatureLabels={showSignedOutChrome}
                onFreeMinutesClick={openAuth}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden px-4 pb-4 transition-opacity duration-300 sm:px-6 md:block",
          uploadOverlayOpen && "invisible opacity-0",
        )}
        aria-hidden={uploadOverlayOpen}
      >
        <div className="pointer-events-auto">
          <HomepageLabelStrip
            showFeatureLabels={showSignedOutChrome}
            onFreeMinutesClick={openAuth}
          />
        </div>
      </div>
    </div>
  )
}
