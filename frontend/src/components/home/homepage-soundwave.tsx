"use client"

import { memo, useEffect, useRef } from "react"

interface HomepageSoundwaveProps {
  /** Empty band in the middle (px) where the cassette sits. */
  gap: number
  isDarkMode: boolean
}

const BAR_STEP = 3.2
const FPS = 30

function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Bar {
  base: number
  phase: number
  speed: number
  spark: boolean
}

function makeBars(count: number, seed: number): Bar[] {
  const rand = seeded(seed)
  return Array.from({ length: count }, () => {
    const r = rand()
    return {
      base: 0.18 + 0.82 * Math.pow(r, 1.6),
      phase: rand() * Math.PI * 2,
      speed: 0.35 + rand() * 0.6,
      spark: rand() > 0.93,
    }
  })
}

/**
 * Greyscale audio waveform flanking the cassette. Canvas 2D, ~30 fps, paused when the
 * tab is hidden or the hero is off-screen; a single static frame for reduced motion.
 */
function HomepageSoundwaveInner({ gap, isDarkMode }: HomepageSoundwaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gapRef = useRef(gap)
  gapRef.current = gap
  const darkRef = useRef(isDarkMode)
  darkRef.current = isDarkMode
  const drawRef = useRef<(t: number) => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0
    let height = 0
    let barsL: Bar[] = []
    let barsR: Bar[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const perSide = Math.max(0, Math.floor((width - gapRef.current) / 2 / BAR_STEP))
      barsL = makeBars(perSide, 0x1eef)
      barsR = makeBars(perSide, 0x7a11)
    }

    const drawSide = (bars: Bar[], dir: 1 | -1, t: number, dark: boolean) => {
      const cx = width / 2
      const cy = height / 2
      const start = cx + dir * (gapRef.current / 2)
      const maxH = height * 0.46
      const n = bars.length
      const fieldPulse = 0.5 + 0.5 * Math.sin(t * 1.5) * Math.sin(t * 0.41)

      for (let i = 0; i < n; i++) {
        const b = bars[i]
        const d = i / n
        const env = Math.exp(-d * 3.6) * 0.94 + 0.06
        const breathe =
          0.55 +
          0.3 * Math.sin(t * b.speed + b.phase) +
          0.15 * Math.sin(t * 0.23 + i * 0.045 + dir)
        const h = Math.max(1, maxH * env * b.base * breathe)
        const xBase = start + dir * (i * BAR_STEP + 1)
        const tone = b.spark ? 1 : 0.55 + 0.45 * env
        const alpha = Math.min(1, (b.spark ? 0.95 : 0.25 + 0.7 * env) * (0.75 + 0.25 * breathe))

        const barWave =
          Math.sin(t * 5.8 + i * 0.68 + dir * 1.2) * Math.sin(t * 1.7 + i * 0.21 + dir * 0.3)
        const pulse = Math.pow(Math.max(0, barWave), 1.65) * env * fieldPulse
        const chromaGate = b.spark ? Math.max(pulse, 0.42) : pulse

        const xJitter = chromaGate > 0.35 ? Math.sin(t * 11 + i * 0.9) * chromaGate * 1.25 : 0
        const x = xBase + xJitter

        if (chromaGate > 0.08) {
          const offset = 1.05 + chromaGate * 2.1 + (b.spark ? 0.55 : 0)
          const wobble = Math.sin(t * 6.2 + i * 0.5) * chromaGate * 0.35
          const offM = -offset + wobble
          const offC = offset + wobble
          const chromaA = alpha * chromaGate
          const magentaA = chromaA * (dark ? 0.5 : 0.4)
          const cyanA = chromaA * (dark ? 0.44 : 0.36)
          ctx.fillStyle = `rgba(255,55,110,${magentaA})`
          ctx.fillRect(x + offM, cy - h, 1.35, h * 2)
          ctx.fillStyle = `rgba(60,220,255,${cyanA})`
          ctx.fillRect(x + offC, cy - h, 1.35, h * 2)
        }

        const mainAlpha = alpha * (chromaGate > 0.45 ? 0.86 : 1)

        if (dark) {
          const v = Math.round(120 + 135 * tone)
          ctx.fillStyle = `rgba(${v},${v},${v + 3},${mainAlpha * 0.12})`
          ctx.fillRect(x - 2, cy - h * 1.06, 5, h * 2.12)
          ctx.fillStyle = `rgba(${v},${v},${v + 3},${mainAlpha})`
        } else {
          const v = Math.round(150 - 115 * tone)
          ctx.fillStyle = `rgba(${v},${v},${v + 2},${mainAlpha * 0.1})`
          ctx.fillRect(x - 2, cy - h * 1.06, 5, h * 2.12)
          ctx.fillStyle = `rgba(${v},${v},${v + 2},${mainAlpha})`
        }
        ctx.fillRect(x, cy - h, 1.3, h * 2)
      }
    }

    const drawVhsOverlay = (t: number, dark: boolean) => {
      for (let y = 0; y < height; y += 3) {
        ctx.fillStyle = dark ? "rgba(0,0,0,0.07)" : "rgba(0,0,0,0.045)"
        ctx.fillRect(0, y + 1, width, 1)
      }

      const band = Math.floor(t * 6) % 23
      if (band === 5 || band === 14 || band === 19) {
        const gy = ((t * 37.1) % 1) * height
        const bandH = 1 + (band % 2)
        ctx.fillStyle = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"
        ctx.fillRect(0, gy, width, bandH)
        ctx.fillStyle = "rgba(255,55,110,0.06)"
        ctx.fillRect(1.5, gy, width, bandH)
        ctx.fillStyle = "rgba(60,220,255,0.05)"
        ctx.fillRect(-1.5, gy, width, bandH)
      }

    }

    const draw = (t: number) => {
      const dark = darkRef.current
      ctx.clearRect(0, 0, width, height)

      const line = ctx.createLinearGradient(0, 0, width, 0)
      const c = dark ? "200,200,205" : "60,60,64"
      line.addColorStop(0, `rgba(${c},0)`)
      line.addColorStop(0.3, `rgba(${c},0.35)`)
      line.addColorStop(0.5, `rgba(${c},0.5)`)
      line.addColorStop(0.7, `rgba(${c},0.35)`)
      line.addColorStop(1, `rgba(${c},0)`)
      ctx.fillStyle = line
      ctx.fillRect(0, height / 2 - 0.5, width, 1)

      drawSide(barsL, -1, t, dark)
      drawSide(barsR, 1, t, dark)
      drawVhsOverlay(t, dark)
    }
    drawRef.current = (t: number) => {
      resize()
      draw(t)
    }

    resize()
    draw(0)

    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now() / 1000)
    })
    ro.observe(canvas)

    if (reducedMotion) {
      return () => {
        ro.disconnect()
        drawRef.current = () => {}
      }
    }

    let visible = document.visibilityState === "visible"
    let inView = true
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", onVisibility)
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })
    io.observe(canvas)

    let raf = 0
    let last = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible || !inView || now - last < 1000 / FPS) return
      last = now
      draw(now / 1000)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      drawRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    drawRef.current(performance.now() / 1000)
  }, [gap, isDarkMode])

  return (
    <div className="homepage-soundwave-vhs relative h-full w-full" aria-hidden>
      <canvas ref={canvasRef} className="relative z-[1] h-full w-full" />
    </div>
  )
}

export const HomepageSoundwave = memo(HomepageSoundwaveInner)
