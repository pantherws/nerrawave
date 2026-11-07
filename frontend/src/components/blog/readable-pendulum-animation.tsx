"use client"

import { RotateCcw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn, focusRingSoft } from "@/lib/utils"

const LINES = ["The hard", "part is", "keeping it", "readable."]
const HERO_INTRO_DELAY_S = 2
const SWING_START_THETA = -1.05

type LetterBody = {
  char: string
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
}

type ReadablePendulumAnimationProps = {
  className?: string
  /** `hero` matches blog header art (960×300). `inline` is the taller experimental embed. */
  layout?: "hero" | "inline"
}

export function ReadablePendulumAnimation({
  className,
  layout = "hero",
}: ReadablePendulumAnimationProps) {
  const isHero = layout === "hero"
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [letters, setLetters] = useState<LetterBody[]>([])
  const [layoutReady, setLayoutReady] = useState(false)
  const [ball, setBall] = useState({ x: 0, y: 0 })
  const [containerWidth, setContainerWidth] = useState(0)
  const [ballRadius, setBallRadius] = useState(18)
  const [swingStarted, setSwingStarted] = useState(false)
  const [pendulumActive, setPendulumActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const bodiesRef = useRef<LetterBody[]>([])
  const pendulumLengthRef = useRef(220)
  const ballRadiusRef = useRef(18)
  const pivotYRef = useRef(-8)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const inViewRef = useRef(false)

  const fontSize = isHero
    ? "clamp(0.8rem, 2.35vw, 1.2rem)"
    : "clamp(1.65rem, 6vw, 2.35rem)"

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const measureEl = measureRef.current
      if (!container || !measureEl) return

      const containerRect = container.getBoundingClientRect()
      const spans = measureEl.querySelectorAll("[data-letter]")
      const next: LetterBody[] = []

      spans.forEach((node) => {
        const el = node as HTMLElement
        const rect = el.getBoundingClientRect()
        const homeX = rect.left - containerRect.left + rect.width / 2
        const homeY = rect.top - containerRect.top + rect.height / 2
        next.push({
          char: el.textContent ?? "",
          homeX,
          homeY,
          x: homeX,
          y: homeY,
          vx: 0,
          vy: 0,
          rot: 0,
          vr: 0,
        })
      })

      bodiesRef.current = next
      setLetters(next)
      setLayoutReady(true)

      const w = containerRect.width
      const h = containerRect.height

      let length: number
      let radius: number
      let pivotY: number

      if (isHero && next.length > 0) {
        const textCenterY = next.reduce((sum, body) => sum + body.homeY, 0) / next.length
        pivotY = Math.min(-4, -h * 0.05)
        // At θ = 0 the bob sits on the text block’s vertical center.
        length = textCenterY - pivotY
        radius = Math.max(15, Math.min(21, h * 0.1))
      } else {
        length = Math.min(280, h * 0.85)
        radius = 26
        pivotY = -8
      }

      pendulumLengthRef.current = length
      ballRadiusRef.current = radius
      pivotYRef.current = pivotY
      setBallRadius(radius)
      setContainerWidth(w)
      startRef.current = null
      setSwingStarted(false)
      setPendulumActive(false)

      setBall({
        x: w / 2 + length * Math.sin(SWING_START_THETA),
        y: pivotY + length * Math.cos(SWING_START_THETA),
      })
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isHero])

  useEffect(() => {
    if (!layoutReady || reducedMotion) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          startRef.current = null
          setSwingStarted(false)
          setPendulumActive(false)
        }
      },
      { threshold: isHero ? 0.12 : 0.35 },
    )
    observer.observe(container)
    inViewRef.current = true

    const step = (time: number) => {
      rafRef.current = requestAnimationFrame(step)
      if (!inViewRef.current) return

      if (startRef.current === null) startRef.current = time
      const t = (time - startRef.current) / 1000
      const introDelay = isHero ? HERO_INTRO_DELAY_S : 0
      const w = container.clientWidth
      const pivotX = w / 2
      const pivotY = isHero ? pivotYRef.current : -8
      const length = pendulumLengthRef.current
      const ballRadius = ballRadiusRef.current
      const swing = isHero ? 1.08 : 1.05

      const bodies = bodiesRef.current
      if (bodies.length === 0) return

      if (t < introDelay) {
        const holdX = pivotX + Math.sin(SWING_START_THETA) * length
        const holdY = pivotY + Math.cos(SWING_START_THETA) * length
        setBall({ x: holdX, y: holdY })

        for (const body of bodies) {
          body.x = body.homeX
          body.y = body.homeY
          body.vx = 0
          body.vy = 0
          body.rot = 0
          body.vr = 0
        }
        setLetters(bodies.map((b) => ({ ...b })))
        return
      }

      if (!swingStarted) setSwingStarted(true)

      const tAnim = t - introDelay
      const damp = Math.exp(-tAnim * 0.45)
      const theta = damp * Math.sin(tAnim * 2.1 - Math.PI / 2) * swing
      const ballX = pivotX + Math.sin(theta) * length
      const ballY = pivotY + Math.cos(theta) * length
      const ballStillSwinging = damp >= 0.1

      setPendulumActive(ballStillSwinging)
      setBall({ x: ballX, y: ballY })

      const inRecovery = !ballStillSwinging
      const snapHome = damp < 0.035

      for (const body of bodies) {
        if (snapHome) {
          body.x = body.homeX
          body.y = body.homeY
          body.rot = 0
          body.vx = 0
          body.vy = 0
          body.vr = 0
          continue
        }

        const dx = body.homeX - body.x
        const dy = body.homeY - body.y
        const spring = inRecovery ? 0.26 : 0.08
        const drag = inRecovery ? 0.24 : 0.12
        body.vx += dx * spring - body.vx * drag
        body.vy += dy * spring - body.vy * drag
        body.vr += (0 - body.rot) * (inRecovery ? 0.22 : 0.11) - body.vr * 0.16

        if (ballStillSwinging) {
          const bx = ballX - body.x
          const by = ballY - body.y
          const dist = Math.hypot(bx, by)
          const hit = ballRadius + (isHero ? 24 : 14)
          if (dist < hit && dist > 0.001) {
            const nx = bx / dist
            const ny = by / dist
            const push = (hit - dist) * (isHero ? 0.5 : 0.35)
            body.vx -= nx * push
            body.vy -= ny * push
            body.vr += (Math.random() - 0.5) * push * (isHero ? 0.42 : 0.35)
          }
        }

        body.x += body.vx
        body.y += body.vy
        body.rot += body.vr
      }

      setLetters(bodies.map((b) => ({ ...b })))
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [isHero, layoutReady, reducedMotion])

  const replayAnimation = useCallback(() => {
    const container = containerRef.current
    const bodies = bodiesRef.current
    if (!container || bodies.length === 0) return

    const w = container.clientWidth
    const length = pendulumLengthRef.current
    const pivotY = pivotYRef.current

    for (const body of bodies) {
      body.x = body.homeX
      body.y = body.homeY
      body.vx = 0
      body.vy = 0
      body.rot = 0
      body.vr = 0
    }

    setLetters(bodies.map((b) => ({ ...b })))
    startRef.current = null
    setSwingStarted(false)
    setPendulumActive(false)
    setBall({
      x: w / 2 + length * Math.sin(SWING_START_THETA),
      y: pivotY + length * Math.cos(SWING_START_THETA),
    })
  }, [])

  const textClassName = cn(
    "text-center font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-foreground",
    isHero ? "gap-y-0" : "",
  )

  const stage = (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        isHero ? "readable-pendulum-stage aspect-[960/300]" : "mx-auto aspect-[4/5] max-w-md bg-transparent sm:aspect-[5/6] sm:max-w-lg",
      )}
    >
      <div
        ref={measureRef}
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 opacity-0",
          isHero ? "justify-center py-2" : "px-6",
          textClassName,
        )}
        style={{ fontSize }}
      >
        {LINES.map((line) => (
          <div key={line} className="flex flex-wrap justify-center gap-x-[0.08em]">
            {line.split("").map((char, index) => (
              <span key={`${line}-${index}`} data-letter>
                {char === " " ? "\u00a0" : char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {reducedMotion ? (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-4",
            textClassName,
          )}
          style={{ fontSize }}
        >
          {LINES.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      ) : (
        <>
          <svg
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full text-foreground/35 transition-opacity duration-300",
              (isHero && !swingStarted) || !pendulumActive ? "opacity-0" : "",
            )}
            aria-hidden
          >
            <line
              x1={containerWidth / 2}
              y1={isHero ? 0 : 8}
              x2={ball.x}
              y2={ball.y}
              stroke="currentColor"
              strokeWidth={1.25}
            />
          </svg>
          {letters.map((letter, index) => (
            <span
              key={`${letter.char}-${index}`}
              className={cn(
                "pointer-events-none absolute origin-center font-semibold uppercase tracking-[-0.04em] text-foreground will-change-transform",
              )}
              style={{
                fontSize,
                left: letter.x,
                top: letter.y,
                transform: `translate(-50%, -50%) rotate(${letter.rot}deg)`,
              }}
            >
              {letter.char}
            </span>
          ))}
          <div
            className={cn(
              "pointer-events-none absolute rounded-full bg-[#ef4444] shadow-[0_0_28px_rgb(239_68_68/0.28)] transition-opacity duration-300 dark:shadow-[0_0_32px_rgb(239_68_68/0.35)]",
              (isHero && !swingStarted) || !pendulumActive ? "opacity-0" : "",
            )}
            style={{
              width: ballRadius * 2,
              height: ballRadius * 2,
              left: ball.x,
              top: ball.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}

      {!reducedMotion ? (
        <button
          type="button"
          onClick={replayAnimation}
          className={cn(
            "absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-[color,background-color,opacity] hover:bg-foreground/[0.04] hover:text-muted-foreground/70",
            focusRingSoft,
          )}
          aria-label="Replay animation"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      ) : null}
    </div>
  )

  if (isHero) {
    return <div className={cn("w-full", className)}>{stage}</div>
  }

  return (
    <figure className={cn("my-8", className)}>
      {stage}
      <figcaption className="mt-3 text-center text-[12px] leading-relaxed tracking-[0.02em] text-muted-foreground">
        Layout survives translation until it doesn&apos;t — then reconstruction matters.
      </figcaption>
    </figure>
  )
}
