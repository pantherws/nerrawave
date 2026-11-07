"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type Point = {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  accent: boolean
}

const POINT_COUNT = 48
const LINK_DISTANCE = 132
const MOUSE_RADIUS = 140
const MOUSE_STRENGTH = 0.035

function dist(a: Point, b: Point) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

export function BlogIndexMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0

    const mouse = { x: -9999, y: -9999, active: false }
    const points: Point[] = []

    const initPoints = () => {
      points.length = 0
      const accentTarget = Math.max(1, Math.round(POINT_COUNT * 0.1))
      const accentIndices = new Set<number>()
      while (accentIndices.size < accentTarget) {
        accentIndices.add(Math.floor(Math.random() * POINT_COUNT))
      }

      for (let i = 0; i < POINT_COUNT; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        points.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          accent: accentIndices.has(i),
        })
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initPoints()
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
      mouse.active = true
    }

    const onLeave = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const draw = () => {
      const dark = document.documentElement.classList.contains("dark")
      const lineRgb = dark ? "255, 255, 255" : "34, 34, 34"
      const dotRgb = dark ? "255, 255, 255" : "34, 34, 34"

      ctx.clearRect(0, 0, width, height)

      if (!prefersReducedMotion) {
        for (const p of points) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1

          if (mouse.active) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const d = Math.hypot(dx, dy)
            if (d < MOUSE_RADIUS && d > 0.001) {
              const force = (MOUSE_RADIUS - d) * MOUSE_STRENGTH
              p.x += (dx / d) * force
              p.y += (dy / d) * force
            }
          }

          p.x += (p.baseX - p.x) * 0.008
          p.y += (p.baseY - p.y) * 0.008
        }
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = dist(points[i], points[j])
          if (d > LINK_DISTANCE) continue
          const alpha = (1 - d / LINK_DISTANCE) * (dark ? 0.14 : 0.1)
          ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(points[i].x, points[i].y)
          ctx.lineTo(points[j].x, points[j].y)
          ctx.stroke()
        }
      }

      for (const p of points) {
        ctx.fillStyle = p.accent
          ? `rgba(239, 68, 68, ${dark ? 0.88 : 0.78})`
          : `rgba(${dotRgb}, ${dark ? 0.22 : 0.16})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.accent ? 1.5 : 1.25, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = window.requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)

    if (prefersReducedMotion) {
      draw()
    } else {
      raf = window.requestAnimationFrame(draw)
    }

    return () => {
      window.cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  )
}
