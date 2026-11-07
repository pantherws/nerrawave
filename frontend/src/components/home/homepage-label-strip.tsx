"use client"

import Link from "next/link"
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight, BadgeCheck, Quote } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FREE_MINUTES } from "@/lib/pricing"
import { cn, focusRingSoft } from "@/lib/utils"

const TESTIMONIALS = [
  {
    quote:
      "We replaced same-day manual typing with Nerrawave. Analysts search transcripts while the moderator still has the recording fresh.",
    name: "Elena M.",
    role: "Research operations, insights agency",
  },
  {
    quote:
      "Per-minute credits match how we budget fieldwork. We can estimate cost before the first participant walks in.",
    name: "James K.",
    role: "Field director, qual team",
  },
  {
    quote:
      "I upload batches of IDIs and get text back in one workspace. No more fragmented voice memos and half-finished Word files.",
    name: "Priya S.",
    role: "Independent researcher",
  },
] as const

const FEATURED_ON = [
  { name: "ProZ.com", href: "https://www.proz.com", domain: "proz.com" },
  { name: "Translators without Borders", href: "https://twb.org", domain: "twb.com" },
  { name: "Slator", href: "https://slator.com", domain: "slator.com" },
] as const

const FORMATS = ["MP3", "WAV", "M4A", "MP4", "MOV", "+More"] as const

const SPEAKER_ROWS = [
  { time: "00:04", speaker: "A", width: "82%" },
  { time: "00:11", speaker: "B", width: "54%" },
  { time: "00:19", speaker: "A", width: "68%" },
] as const

const ROW_MIN_GAP_PX = 10

const LABEL =
  "relative h-[104px] shrink-0 border border-foreground/[0.14] font-mono uppercase text-foreground/55"
const LABEL_INTERACTIVE =
  "transition-[color,border-color,background-color,box-shadow] duration-300 hover:border-foreground/30 hover:text-foreground/80"
const META = "text-[8px] leading-none tracking-[0.14em]"
const HATCH: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, currentColor 0 1.5px, transparent 1.5px 5px)",
}

function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={cn("h-2.5 w-2.5", className)} aria-hidden>
      <circle cx="5" cy="5" r="2.6" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

function Barcode({
  seed,
  vertical = false,
  className,
}: {
  seed: string
  vertical?: boolean
  className?: string
}) {
  const { bars, total } = useMemo(() => {
    const out: Array<{ at: number; size: number }> = []
    let at = 0
    for (let i = 0; i < seed.length; i++) {
      const size = (seed.charCodeAt(i) % 3) + 1
      if (i % 2 === 0) out.push({ at, size })
      at += size
    }
    return { bars: out, total: at }
  }, [seed])

  return (
    <svg
      viewBox={vertical ? `0 0 10 ${total}` : `0 0 ${total} 10`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {bars.map((bar) =>
        vertical ? (
          <rect key={bar.at} x="0" y={bar.at} width="10" height={bar.size} fill="currentColor" />
        ) : (
          <rect key={bar.at} x={bar.at} y="0" width={bar.size} height="10" fill="currentColor" />
        ),
      )}
    </svg>
  )
}

function CornerBrackets() {
  const base = "absolute h-2 w-2 border-foreground/35"
  return (
    <>
      <span className={cn(base, "left-0 top-0 border-l border-t")} aria-hidden />
      <span className={cn(base, "right-0 top-0 border-r border-t")} aria-hidden />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} aria-hidden />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} aria-hidden />
    </>
  )
}

function TestimonialsTag({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Read testimonials"
      className={cn(
        LABEL,
        LABEL_INTERACTIVE,
        focusRingSoft,
        "group flex w-[84px] flex-col justify-between p-2 text-left",
      )}
    >
      <span className={cn(META, "flex w-full items-center justify-between")}>
        <span>Ref/01</span>
        <Crosshair />
      </span>
      <Quote className="h-5 w-5 self-center text-foreground/70" strokeWidth={1.25} aria-hidden />
      <span className={cn(META, "flex w-full items-end justify-between leading-[1.3]")}>
        <span>
          Field
          <br />
          notes
        </span>
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      </span>
    </button>
  )
}

function FreeMinutesTicket({ onClick }: { onClick?: () => void }) {
  const body = (
    <>
      <span className="flex flex-1 flex-col justify-between p-2.5">
        <span className={cn(META, "flex items-center justify-between")}>
          <span>No. NW-00{FREE_MINUTES}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" aria-hidden />
        </span>
        <span className="block">
          <span className="flex items-baseline gap-1">
            <span className="font-sans text-[34px] font-semibold normal-case leading-none tracking-[-0.05em] text-foreground/85">
              {FREE_MINUTES}
            </span>
            <span className="text-[9px] tracking-[0.14em]">Min free</span>
          </span>
          <span className="mt-1.5 block text-[8.5px] leading-[1.35] tracking-[0.1em]">
            Start with audio
            <br />
            or video
          </span>
        </span>
        <span className={cn(META, "flex items-center justify-between text-foreground/40")}>
          <span>Admit one</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            &gt;&gt;&gt;
          </span>
        </span>
      </span>
      <span className="flex w-[26px] border-l border-dashed border-foreground/25 px-[6px] py-2.5">
        <Barcode seed="NW-FREE-0030-ADMIT-ONE-2026-XQ7-RX" vertical className="h-full w-full text-foreground/50" />
      </span>
    </>
  )

  const className = cn(LABEL, "group flex w-[156px] text-left")

  if (!onClick) return <div className={className}>{body}</div>

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Start with ${FREE_MINUTES} free minutes of audio or video`}
      className={cn(
        className,
        LABEL_INTERACTIVE,
        focusRingSoft,
        "hover:border-red-400/40",
        "hover:shadow-[0_0_0_1px_rgba(248,113,113,0.22),0_0_14px_rgba(239,68,68,0.26),0_0_28px_rgba(234,88,12,0.12)]",
      )}
    >
      {body}
    </button>
  )
}

function FormatsSpec() {
  return (
    <div className={cn(LABEL, "flex w-[156px] flex-col")}>
      <span className="h-[9px] border-b border-foreground/[0.14] text-foreground/25" style={HATCH} aria-hidden />
      <span className={cn(META, "flex items-center justify-between px-2 pt-2")}>
        <span>Input</span>
        <span className="text-foreground/35">// Formats</span>
      </span>
      <ul className="mt-auto grid grid-cols-3 border-t border-foreground/[0.14] text-[9.5px] tracking-[0.06em] text-foreground/70">
        {FORMATS.map((format, index) => (
          <li
            key={format}
            className={cn(
              "whitespace-nowrap border-foreground/[0.14] px-2 py-[5px]",
              index % 3 !== 0 && "border-l",
              index > 2 && "border-t",
              index === FORMATS.length - 1 && "text-foreground/45",
            )}
          >
            {format}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LegalPlate() {
  return (
    <div className="relative flex h-[104px] w-[316px] shrink-0 flex-col justify-between px-4 py-3 text-center">
      <CornerBrackets />
      <div className="flex items-center justify-between font-mono uppercase">
        <span className={cn(META, "text-foreground/35")}>No. R-2026</span>
        <span className="font-sans text-[11px] font-semibold tracking-[-0.01em] text-foreground/75">
          Nerrawave<span className="ml-px align-super text-[7px] font-normal">®</span>
        </span>
        <span className={cn(META, "text-foreground/35")}>Transcript sys.</span>
      </div>
      <p className="mt-2 text-balance font-sans text-[10.5px] leading-[1.55] text-foreground/50">
        Nerrawave turns audio and video into transcripts for research teams. By using it, you agree
        to our{" "}
        <Link
          href="/terms"
          className="underline decoration-foreground/25 underline-offset-2 transition-colors hover:text-foreground"
        >
          Terms
        </Link>{" "}
        &amp;{" "}
        <Link
          href="/privacy"
          className="underline decoration-foreground/25 underline-offset-2 transition-colors hover:text-foreground"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className={cn(META, "mt-2.5 flex items-center gap-2 font-mono uppercase text-foreground/30")}>
        <span>Est. 2026</span>
        <span className="h-px flex-1 bg-foreground/15" aria-hidden />
        <span>&gt;&gt;&gt;&gt;&gt;&gt;</span>
        <span className="h-px flex-1 bg-foreground/15" aria-hidden />
        <span>All rights reserved</span>
      </div>
    </div>
  )
}

function SpeakerLog() {
  return (
    <div className={cn(LABEL, "flex w-[172px] flex-col justify-between p-2.5")}>
      <span className={cn(META, "flex items-center justify-between")}>
        <span>Output</span>
        <span className="text-foreground/35">Spk ×2</span>
      </span>
      <ul className="space-y-[5px]" aria-hidden>
        {SPEAKER_ROWS.map((row) => (
          <li key={row.time} className="grid grid-cols-[auto_auto_1fr] items-center gap-1.5 text-[8px] tracking-[0.08em]">
            <span className="text-foreground/35">{row.time}</span>
            <span className="text-foreground/70">Spk_{row.speaker}</span>
            <span className="h-[3px] bg-foreground/25" style={{ width: row.width }} />
          </li>
        ))}
      </ul>
      <span className="whitespace-nowrap text-[8.5px] leading-[1.35] tracking-[0.08em]">
        Speaker-aware transcripts
        <br />+ AI summaries
      </span>
    </div>
  )
}

function CostPlate() {
  return (
    <div className="relative flex h-[104px] w-[124px] shrink-0 flex-col justify-between border border-foreground/25 bg-foreground/[0.07] p-2.5 font-mono uppercase text-foreground/70">
      <span className={cn(META, "flex items-center justify-between")}>
        <span>Rate / QC</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-foreground/40 text-[7px] tracking-normal">
          03
        </span>
      </span>
      <span className="font-sans text-[30px] font-semibold normal-case leading-none tracking-[-0.05em]">
        25×
      </span>
      <span className="text-[8px] leading-[1.35] tracking-[0.1em]">
        More affordable
        <br />
        than agencies
      </span>
    </div>
  )
}

function FeaturedSeal({ onOpen }: { onOpen: () => void }) {
  const pathId = `seal-${useId().replace(/:/g, "")}`
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="See where Nerrawave is featured"
      className={cn(
        focusRingSoft,
        "group relative h-[104px] w-[104px] shrink-0 rounded-full text-foreground/55 transition-colors duration-300 hover:text-foreground/85",
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="48.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full motion-safe:animate-[spin_28s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path id={pathId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="font-mono" fontSize="8" fill="currentColor" letterSpacing="1.6">
          <textPath href={`#${pathId}`} textLength="230" lengthAdjust="spacing">
            FEATURED ✦ VERIFIED ✦ PRESS INDEX ✦
          </textPath>
        </text>
      </svg>
      <BadgeCheck
        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2"
        strokeWidth={1.25}
        aria-hidden
      />
    </button>
  )
}

function Rise({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className="micro-label-rise shrink-0" style={{ "--i": index } as CSSProperties}>
      {children}
    </div>
  )
}

type HomepageLabelStripProps = {
  /** `row`: single bottom-aligned line scaled to fit. `wrap`: flowing grid for narrow screens. */
  layout?: "row" | "wrap"
  showFeatureLabels?: boolean
  onFreeMinutesClick?: () => void
  className?: string
}

export function HomepageLabelStrip({
  layout = "row",
  showFeatureLabels = true,
  onFreeMinutesClick,
  className,
}: HomepageLabelStripProps) {
  const [testimonialsOpen, setTestimonialsOpen] = useState(false)
  const [featuredOpen, setFeaturedOpen] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ scale: number; naturalWidth: number }>({
    scale: 1,
    naturalWidth: 0,
  })

  useLayoutEffect(() => {
    if (layout !== "row") return
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const measure = () => {
      const children = Array.from(inner.children) as HTMLElement[]
      const naturalWidth =
        children.reduce((sum, child) => sum + child.offsetWidth, 0) +
        ROW_MIN_GAP_PX * Math.max(0, children.length - 1)
      setFit({ scale: Math.min(1, outer.clientWidth / naturalWidth), naturalWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [layout, showFeatureLabels])

  const items: ReactNode[] = [
    <TestimonialsTag key="testimonials" onOpen={() => setTestimonialsOpen(true)} />,
    showFeatureLabels ? <FreeMinutesTicket key="free" onClick={onFreeMinutesClick} /> : null,
    showFeatureLabels ? <FormatsSpec key="formats" /> : null,
    <LegalPlate key="legal" />,
    showFeatureLabels ? <SpeakerLog key="speakers" /> : null,
    showFeatureLabels ? <CostPlate key="cost" /> : null,
    <FeaturedSeal key="featured" onOpen={() => setFeaturedOpen(true)} />,
  ].filter(Boolean)

  return (
    <>
      {layout === "row" ? (
        <div ref={outerRef} className={cn("flex w-full justify-center", className)}>
          <div
            ref={innerRef}
            className="flex shrink-0 origin-bottom items-end justify-between"
            style={{
              gap: ROW_MIN_GAP_PX,
              width: fit.scale < 1 ? fit.naturalWidth : "100%",
              transform: fit.scale < 1 ? `scale(${fit.scale})` : undefined,
            }}
          >
            {items.map((item, index) => (
              <Rise key={index} index={index}>
                {item}
              </Rise>
            ))}
          </div>
        </div>
      ) : (
        <div className={cn("flex flex-wrap items-end justify-center gap-2", className)}>
          {items.map((item, index) => (
            <Rise key={index} index={index}>
              {item}
            </Rise>
          ))}
        </div>
      )}

      <Dialog open={testimonialsOpen} onOpenChange={setTestimonialsOpen}>
        <DialogContent className="max-w-md gap-0 border-border/80 p-0 sm:rounded-xl">
          <DialogHeader className="space-y-1 border-b border-border/60 px-5 py-4 text-left">
            <DialogTitle className="font-sentient-regular text-lg font-normal tracking-tight">
              What teams say
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Sample feedback from early Nerrawave users.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-[min(70vh,24rem)] space-y-0 overflow-y-auto overscroll-contain">
            {TESTIMONIALS.map((item, index) => (
              <li
                key={item.name}
                className={cn(
                  "px-5 py-4",
                  index < TESTIMONIALS.length - 1 && "border-b border-border/50",
                )}
              >
                <p className="text-pretty text-[14px] leading-relaxed text-foreground/90">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-3 text-[12px] font-medium text-foreground">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.role}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={featuredOpen} onOpenChange={setFeaturedOpen}>
        <DialogContent className="max-w-sm gap-0 border-border/80 p-0 sm:rounded-xl">
          <DialogHeader className="space-y-1 border-b border-border/60 px-5 py-4 text-left">
            <DialogTitle className="font-sentient-regular text-lg font-normal tracking-tight">
              Featured on
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Industry communities and media covering translation.
            </DialogDescription>
          </DialogHeader>
          <ul className="p-2">
            {FEATURED_ON.map((site) => (
              <li key={site.domain}>
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
                >
                  <span>
                    <span className="block text-[14px] font-medium text-foreground group-hover:underline">
                      {site.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">{site.domain}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
