"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export type AboutInterstitialId =
  | "spectrum"
  | "tracking"
  | "dial"
  | "meter"
  | "snow"
  | "phantom"

const INTERSTITIAL_MAP: Record<string, AboutInterstitialId> = {
  "what-nerrawave-does": "spectrum",
  "how-nerrawave-works": "tracking",
  "what-makes-nerrawave-different": "dial",
  "the-importance-of-listening": "meter",
  "the-past-and-the-future-of-sound": "snow",
  "key-facts-about-nerrawave": "phantom",
}

export function getAboutInterstitial(sectionId: string): AboutInterstitialId | null {
  return INTERSTITIAL_MAP[sectionId] ?? null
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "about-vhs-interstitial pointer-events-none relative my-10 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {children}
    </div>
  )
}

export function AboutHeroSignal() {
  return (
    <div className="about-hero-signal relative overflow-hidden border border-foreground/12 px-4 py-6">
      <div className="about-hero-signal__tracking absolute inset-x-0 top-0 h-8" />
      <p className="relative z-[1] text-center font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
        From recording to understanding
      </p>
      <div className="about-interstitial-spectrum relative z-[1] mx-auto mt-4 flex h-10 max-w-sm items-end justify-center gap-[3px]">
        {Array.from({ length: 48 }, (_, i) => (
          <span
            key={i}
            className="about-interstitial-spectrum__bar w-[3px] rounded-sm bg-foreground/50"
            style={{ animationDelay: `${(i % 9) * 0.09}s` }}
          />
        ))}
      </div>
      <p className="relative z-[1] mt-4 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/35">
        Every sound has a story
      </p>
    </div>
  )
}

function Spectrum() {
  return (
    <Frame>
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/40">
        Signal / channel 02
      </p>
      <div className="about-interstitial-spectrum flex h-14 items-end gap-[3px]">
        {Array.from({ length: 64 }, (_, i) => (
          <span
            key={i}
            className="about-interstitial-spectrum__bar w-[3px] rounded-sm bg-foreground/55"
            style={{ animationDelay: `${(i % 11) * 0.07}s` }}
          />
        ))}
      </div>
    </Frame>
  )
}

function Tracking() {
  return (
    <Frame className="h-16 border border-foreground/10 bg-foreground/[0.02]">
      <div className="about-interstitial-tracking absolute inset-0" />
      <p className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45">
        Tracking adjust
      </p>
    </Frame>
  )
}

function Dial() {
  return (
    <Frame className="flex items-center justify-center py-4">
      <svg viewBox="0 0 80 80" className="about-interstitial-dial h-20 w-20 text-foreground/50">
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 4" />
        <g className="origin-center about-interstitial-dial__spindle" style={{ transformOrigin: "40px 40px" }}>
          <circle cx="40" cy="40" r="6" fill="currentColor" fillOpacity="0.45" />
          <path d="M40 40 L40 16" stroke="currentColor" strokeWidth="2" />
        </g>
      </svg>
    </Frame>
  )
}

function Meter() {
  return (
    <Frame>
      <div className="flex items-end justify-between gap-1">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="about-interstitial-meter__bar w-2 rounded-t-sm bg-foreground/40"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
        Listen — verify — interpret
      </p>
    </Frame>
  )
}

function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let frame = 0
    let raf = 0
    const w = 320
    const h = 72
    canvas.width = w
    canvas.height = h

    const draw = () => {
      frame++
      const image = ctx.createImageData(w, h)
      for (let i = 0; i < image.data.length; i += 4) {
        const v = Math.random() > 0.62 ? 180 + Math.random() * 75 : 0
        image.data[i] = v
        image.data[i + 1] = v
        image.data[i + 2] = v
        image.data[i + 3] = Math.random() * 28
      }
      ctx.putImageData(image, 0, 0)
      if (frame % 4 === 0) {
        ctx.fillStyle = "rgba(255,80,140,0.08)"
        ctx.fillRect((frame * 3) % w, 0, 42, h)
      }
      raf = requestAnimationFrame(draw)
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      ctx.fillStyle = "rgba(255,255,255,0.04)"
      ctx.fillRect(0, 0, w, h)
      return
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Frame className="border border-foreground/10">
      <canvas ref={canvasRef} className="h-[72px] w-full opacity-80 mix-blend-soft-light" />
    </Frame>
  )
}

function Phantom() {
  return (
    <Frame className="h-12 border border-dashed border-foreground/15">
      <div className="about-interstitial-phantom absolute inset-0 flex items-center overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/30">
        <span>
          standby · carrier lost · carrier found · sp-01 · nerrawave · rec · audio in · standby · carrier
          lost ·
        </span>
      </div>
    </Frame>
  )
}

export function AboutSectionInterstitial({ id }: { id: AboutInterstitialId }) {
  switch (id) {
    case "spectrum":
      return <Spectrum />
    case "tracking":
      return <Tracking />
    case "dial":
      return <Dial />
    case "meter":
      return <Meter />
    case "snow":
      return <Snow />
    case "phantom":
      return <Phantom />
    default:
      return null
  }
}
