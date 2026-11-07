"use client"

import { memo, useEffect, useRef } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/** Compact cassette (IEC 60094), millimetres. Scene units are mm. */
const W = 100.4
const H = 63.8
const D = 12
const HALF_D = D / 2
const PLATE = 1
const HUB_X = 21
const HUB_Y = 1.9
const TAPE_WIDTH = 3.81

const SCREWS_2D: [number, number][] = [
  [-46.4, 28.1],
  [46.4, 28.1],
  [-46.4, -28.1],
  [46.4, -28.1],
  [0, -22.4],
]

const MONO_FALLBACK = `ui-monospace, Consolas, "Courier New", monospace`

interface HomepageCassetteProps {
  size: number
  isDarkMode: boolean
  /** Bottom edge of the drawn cassette in canvas CSS pixels (from top). */
  onVisualBounds?: (bottomPx: number) => void
}

function pointerToNdc(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect()
  return new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1,
  )
}

function measureProjectedBottom(root: THREE.Object3D, camera: THREE.Camera, canvasSize: number) {
  const box = new THREE.Box3().setFromObject(root)
  if (box.isEmpty()) return null
  const { min, max } = box
  const corner = new THREE.Vector3()
  let maxY = -Infinity
  for (const x of [min.x, max.x]) {
    for (const y of [min.y, max.y]) {
      for (const z of [min.z, max.z]) {
        corner.set(x, y, z).project(camera)
        const sy = (-corner.y * 0.5 + 0.5) * canvasSize
        maxY = Math.max(maxY, sy)
      }
    }
  }
  return maxY
}

function roundedRect<T extends THREE.Path>(p: T, cx: number, cy: number, w: number, h: number, r: number): T {
  const x = cx - w / 2
  const y = cy - h / 2
  p.moveTo(x + r, y)
  p.lineTo(x + w - r, y)
  p.quadraticCurveTo(x + w, y, x + w, y + r)
  p.lineTo(x + w, y + h - r)
  p.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  p.lineTo(x + r, y + h)
  p.quadraticCurveTo(x, y + h, x, y + h - r)
  p.lineTo(x, y + r)
  p.quadraticCurveTo(x, y, x + r, y)
  return p
}

function circle<T extends THREE.Path>(p: T, cx: number, cy: number, r: number): T {
  p.absarc(cx, cy, r, 0, Math.PI * 2, false)
  return p
}

function ringShape(cx: number, cy: number, outer: number, inner: number) {
  const s = circle(new THREE.Shape(), cx, cy, outer)
  s.holes.push(circle(new THREE.Path(), cx, cy, inner))
  return s
}

/** Reel hub face: outer rim, 8 window slots, splined bore with 6 drive teeth. */
function hubShape() {
  const s = circle(new THREE.Shape(), 0, 0, 8.2)

  const bore = new THREE.Path()
  const steps = 96
  const sector = Math.PI / 3
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const local = a % sector
    const r = Math.abs(local - sector / 2) < 0.16 ? 3.0 : 4.15
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) bore.moveTo(x, y)
    else bore.lineTo(x, y)
  }
  s.holes.push(bore)

  const r1 = 5.3
  const r2 = 7.15
  for (let k = 0; k < 8; k++) {
    const a0 = (k * Math.PI) / 4 + 0.13
    const a1 = ((k + 1) * Math.PI) / 4 - 0.13
    const slot = new THREE.Path()
    slot.absarc(0, 0, r2, a0, a1, false)
    slot.absarc(0, 0, r1, a1, a0, true)
    slot.closePath()
    s.holes.push(slot)
  }
  return s
}

function trapezoidShape() {
  const s = new THREE.Shape()
  s.moveTo(-38.6, -31.3)
  s.lineTo(38.6, -31.3)
  s.lineTo(31.2, -19.0)
  s.lineTo(-31.2, -19.0)
  s.closePath()
  for (const sx of [-1, 1]) {
    s.holes.push(circle(new THREE.Path(), sx * 17.5, -27.0, 2.0))
    s.holes.push(roundedRect(new THREE.Path(), sx * 9.6, -27.4, 2.6, 2.6, 0.4))
    s.holes.push(circle(new THREE.Path(), sx * 27.5, -28.4, 1.1))
  }
  return s
}

/** Trapezoid outline grown outward by `o` mm along its top and slanted sides. */
function trapezoidPath<T extends THREE.Path>(p: T, o: number, reverse = false): T {
  const pts: [number, number][] = [
    [-(38.6 + o * 1.2), -31.3],
    [38.6 + o * 1.2, -31.3],
    [31.2 + o * 0.55, -19.0 + o],
    [-(31.2 + o * 0.55), -19.0 + o],
  ]
  if (reverse) pts.reverse()
  p.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1])
  p.closePath()
  return p
}

function trapezoidRibShape() {
  const s = trapezoidPath(new THREE.Shape(), 2.0)
  s.holes.push(trapezoidPath(new THREE.Path(), 1.15, true))
  return s
}

/** Toothed boss around the corner alignment holes. */
function gearRingShape(outer: number, toothDepth: number, teeth: number, hole: number) {
  const s = new THREE.Shape()
  const steps = teeth * 4
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const r = Math.floor(i / 2) % 2 === 0 ? outer : outer - toothDepth
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  s.holes.push(circle(new THREE.Path(), 0, 0, hole))
  return s
}

/**
 * Bump + roughness map in face millimetres (UV = x / W + 0.5): glossy upper face,
 * frosted moulding grain across the bottom quarter, faint flow lines elsewhere.
 */
function createSurfaceTexture() {
  const cw = 1024
  const ch = Math.round((cw * H) / W)
  const c = document.createElement("canvas")
  c.width = cw
  c.height = ch
  const ctx = c.getContext("2d")!
  const img = ctx.createImageData(cw, ch)
  const d = img.data
  const frostTopY = ((H / 2 - -16.6) / H) * ch
  const rimPx = (2.2 / W) * cw
  for (let y = 0; y < ch; y++) {
    const frost = y >= frostTopY
    for (let x = 0; x < cw; x++) {
      const rim = x < rimPx || x > cw - rimPx || y < rimPx || y > ch - rimPx
      let v: number
      if (frost || rim) v = 110 + Math.random() * 70
      else v = 26 + Math.random() * 6 + (Math.sin(x * 0.09 + y * 0.013) > 0.985 ? 10 : 0)
      const i = (y * cw + x) * 4
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  const rand = mulberry32(0xca55e7)
  const s = cw / W
  ctx.lineCap = "round"
  for (let i = 0; i < 140; i++) {
    const x = rand() * cw
    const y = rand() * ch
    const len = (2 + rand() * rand() * 26) * s
    const a = (rand() - 0.5) * 1.1
    const v = 120 + Math.floor(rand() * 90)
    ctx.strokeStyle = `rgb(${v},${v},${v})`
    ctx.lineWidth = (0.05 + rand() * 0.1) * s
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }
  for (let i = 0; i < 400; i++) {
    const onX = rand() < 0.5
    const t = rand()
    const inset = rand() * rand() * 2.2 * s
    const x = onX ? t * cw : rand() < 0.5 ? inset : cw - inset
    const y = onX ? (rand() < 0.5 ? inset : ch - inset) : t * ch
    const v = 150 + Math.floor(rand() * 90)
    ctx.fillStyle = `rgb(${v},${v},${v})`
    ctx.fillRect(x, y, (0.2 + rand() * 1.4) * s, (0.1 + rand() * 0.35) * s)
  }

  const tex = new THREE.CanvasTexture(c)
  tex.repeat.set(1 / W, 1 / H)
  tex.offset.set(0.5, 0.5)
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

function createTapeTexture() {
  const size = 512
  const c = document.createElement("canvas")
  c.width = size
  c.height = size
  const ctx = c.getContext("2d")!
  const mid = size / 2
  ctx.fillStyle = "#24170f"
  ctx.fillRect(0, 0, size, size)
  for (let r = mid; r > 0; r -= 1.5) {
    const v = 28 + Math.floor(Math.random() * 18)
    ctx.strokeStyle = `rgba(${v + 18}, ${v}, ${Math.max(0, v - 12)}, 0.55)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(mid, mid, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  const sheen = ctx.createLinearGradient(0, 0, size, size)
  sheen.addColorStop(0, "rgba(255,220,190,0.10)")
  sheen.addColorStop(0.5, "rgba(255,220,190,0)")
  sheen.addColorStop(1, "rgba(255,220,190,0.06)")
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Resolves a next/font CSS variable (e.g. `--font-geist-mono`) to a canvas-usable family list. */
function cssFontFamily(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  return value ? `${value}, ${fallback}` : fallback
}

const printFonts = () => cssFontFamily("--font-geist-mono", MONO_FALLBACK)

function drawPrint(c: HTMLCanvasElement, side: "a" | "b") {
  const cw = c.width
  const s = cw / W
  const ctx = c.getContext("2d")!
  const px = (x: number) => (x + W / 2) * s
  const py = (y: number) => (H / 2 - y) * s
  const family = printFonts()
  const font = (mm: number, weight: number) => `${weight} ${mm * s}px ${family}`
  const ink = "rgba(250, 250, 247, 0.97)"
  const soft = "rgba(250, 250, 247, 0.9)"

  ctx.clearRect(0, 0, c.width, c.height)
  ctx.textBaseline = "middle"
  ctx.strokeStyle = "rgba(246, 245, 240, 0.18)"
  ctx.lineWidth = 0.22 * s
  ctx.beginPath()
  ctx.roundRect(px(-46.6), py(29.2), 93.2 * s, 46.6 * s, 1.6 * s)
  ctx.stroke()

  ctx.fillStyle = ink
  if (side === "a") {
    ctx.textAlign = "center"
    ctx.font = font(4.75, 600)
    ctx.fillText("UPLOAD. TRANSCRIBE. UNDERSTAND.", px(0), py(21.2), 87 * s)
    ctx.font = font(2.63, 500)
    ctx.fillStyle = soft
    ctx.fillText("AI TRANSCRIPTION PLATFORM FOR INTERVIEWERS AND RESEARCHERS", px(0), py(16.0), 88 * s)

    ctx.textAlign = "left"
    ctx.fillStyle = ink
    ctx.font = font(3.0, 600)
    ctx.fillText("NERRAWAVE", px(-44.4), py(-6.4), 16 * s)
    ctx.font = font(6.32, 500)
    ctx.fillText("C-60", px(-44.6), py(-11.8), 16 * s)

    ctx.textAlign = "right"
    ctx.font = font(2.9, 500)
    ctx.fillStyle = soft
    ctx.fillText("LOW NOISE", px(44.4), py(-7.6), 18.5 * s)
    ctx.fillText("TYPE I", px(44.4), py(-11.1), 18.5 * s)
    ctx.fillText("NORMAL BIAS", px(44.4), py(-14.6), 18.5 * s)
  } else {
    ctx.textAlign = "left"
    ctx.font = font(3.0, 600)
    ctx.fillText("NERRAWAVE", px(-44.4), py(-6.4), 16 * s)
    ctx.font = font(3.0, 500)
    ctx.fillStyle = soft
    ctx.fillText("SIDE B", px(-44.4), py(-10.4), 16 * s)
  }

  drawWear(ctx, s, side === "a" ? 0x5eed : 0xb0b)

  ctx.save()
  ctx.globalCompositeOperation = "destination-out"
  ctx.fillStyle = "#000"
  for (const hx of [-HUB_X, HUB_X]) {
    ctx.beginPath()
    ctx.arc(px(hx), py(HUB_Y), 9.5 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillRect(px(-8.7), py(HUB_Y + 6.5), 17.4 * s, 13 * s)
  ctx.restore()
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Handling wear on a face: worn print, hairline scratches, edge scuffs and dust. Seeded so redraws match. */
function drawWear(ctx: CanvasRenderingContext2D, s: number, seed: number) {
  const rand = mulberry32(seed)
  const cw = ctx.canvas.width
  const ch = ctx.canvas.height

  ctx.save()
  ctx.globalCompositeOperation = "destination-out"
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.35 + rand() * 0.6})`
    ctx.beginPath()
    ctx.arc(rand() * cw, rand() * ch, (0.04 + rand() * 0.14) * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  ctx.save()
  ctx.lineCap = "round"
  for (let i = 0; i < 90; i++) {
    const x = rand() * cw
    const y = rand() * ch
    const len = (2 + rand() * rand() * 22) * s
    const a = (rand() - 0.5) * 0.9 + (rand() < 0.25 ? Math.PI / 2 : 0)
    const bend = (rand() - 0.5) * len * 0.15
    ctx.strokeStyle = `rgba(255,255,255,${0.035 + rand() * 0.08})`
    ctx.lineWidth = (0.04 + rand() * 0.09) * s
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(
      x + Math.cos(a) * len * 0.5 - Math.sin(a) * bend,
      y + Math.sin(a) * len * 0.5 + Math.cos(a) * bend,
      x + Math.cos(a) * len,
      y + Math.sin(a) * len,
    )
    ctx.stroke()
  }

  const edge = 1.8 * s
  for (let i = 0; i < 520; i++) {
    const side = Math.floor(rand() * 4)
    const t = rand()
    const inset = rand() * rand() * edge
    const along = (1.2 + rand() * 3.5) * s
    let x: number
    let y: number
    let dx: number
    let dy: number
    if (side === 0) [x, y, dx, dy] = [t * cw, inset, along, 0]
    else if (side === 1) [x, y, dx, dy] = [t * cw, ch - inset, along, 0]
    else if (side === 2) [x, y, dx, dy] = [inset, t * ch, 0, along]
    else [x, y, dx, dy] = [cw - inset, t * ch, 0, along]
    ctx.strokeStyle = `rgba(225,225,220,${0.04 + rand() * 0.13})`
    ctx.lineWidth = (0.05 + rand() * 0.16) * s
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + dx * (rand() - 0.5), y + dy * (rand() - 0.5))
    ctx.stroke()
  }

  const corners: [number, number][] = [
    [0, 0],
    [cw, 0],
    [0, ch],
    [cw, ch],
  ]
  for (const [cx, cy] of corners) {
    for (let i = 0; i < 70; i++) {
      const r = rand() * 4.5 * s
      const a = rand() * Math.PI * 2
      ctx.fillStyle = `rgba(220,220,215,${0.04 + rand() * 0.1})`
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, (0.06 + rand() * 0.22) * s, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = `rgba(235,235,230,${0.03 + rand() * 0.08})`
    ctx.beginPath()
    ctx.arc(rand() * cw, rand() * ch, (0.03 + rand() * 0.08) * s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** White print on the plastic. Canvas maps the full face (x right, y up in mm). */
function createPrintTexture(side: "a" | "b", anisotropy: number) {
  const c = document.createElement("canvas")
  c.width = 1600
  c.height = Math.round((c.width * H) / W)
  drawPrint(c, side)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = anisotropy
  const redraw = () => {
    drawPrint(c, side)
    tex.needsUpdate = true
  }
  return { tex, redraw }
}

function extrude(shape: THREE.Shape, depth: number, opts: Partial<THREE.ExtrudeGeometryOptions> = {}) {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 24,
    ...opts,
  })
}

function buildCassette(anisotropy: number) {
  const root = new THREE.Group()

  const surfaceTex = createSurfaceTexture()
  const smoke = (opacity: number, side: THREE.Side = THREE.FrontSide, textured = false) =>
    new THREE.MeshPhysicalMaterial({
      color: 0x0b0c0f,
      transparent: true,
      opacity,
      roughness: textured ? 1 : 0.1,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: textured ? 1 : 0.06,
      envMapIntensity: 1.15,
      depthWrite: false,
      side,
      ...(textured
        ? {
            roughnessMap: surfaceTex,
            clearcoatRoughnessMap: surfaceTex,
            bumpMap: surfaceTex,
            bumpScale: 0.5,
          }
        : {}),
    })

  const plateMat = smoke(0.66, THREE.FrontSide, true)
  const wallMat = smoke(0.82, THREE.DoubleSide)
  const detailMat = smoke(0.78, THREE.FrontSide, true)
  const hubMat = new THREE.MeshPhysicalMaterial({
    color: 0xcfc8b6,
    metalness: 0.6,
    roughness: 0.26,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  })
  const tapeTex = createTapeTexture()
  const tapeEdgeMat = new THREE.MeshStandardMaterial({ color: 0x2a1b12, roughness: 0.38, metalness: 0.3 })
  const whitePlastic = new THREE.MeshStandardMaterial({ color: 0xe9e5db, roughness: 0.42, metalness: 0.05 })
  const metal = new THREE.MeshStandardMaterial({ color: 0xc3c6ca, roughness: 0.26, metalness: 1 })
  const feltMat = new THREE.MeshStandardMaterial({ color: 0xc9a86a, roughness: 0.95, metalness: 0 })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.9, metalness: 0, side: THREE.DoubleSide })
  const seamMat = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.5, metalness: 0.1 })

  // Shell: two face plates with bevelled edges, perimeter wall, mould seam.
  const bevel = 0.35
  const plateShape = roundedRect(new THREE.Shape(), 0, 0, W - bevel * 2, H - bevel * 2, 2.7)
  plateShape.holes.push(circle(new THREE.Path(), -HUB_X, HUB_Y, 9.5))
  plateShape.holes.push(circle(new THREE.Path(), HUB_X, HUB_Y, 9.5))
  plateShape.holes.push(roundedRect(new THREE.Path(), 0, HUB_Y, 17.4, 13, 0.9))
  const plateGeo = extrude(plateShape, PLATE - bevel * 2, {
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
  })
  const front = new THREE.Mesh(plateGeo, plateMat)
  front.position.z = HALF_D - PLATE + bevel
  const back = new THREE.Mesh(plateGeo, plateMat)
  back.position.z = -HALF_D + bevel
  root.add(front, back)

  const paneMat = new THREE.MeshPhysicalMaterial({
    color: 0x1c1d22,
    transparent: true,
    opacity: 0.22,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.4,
    depthWrite: false,
  })
  const paneGeo = new THREE.PlaneGeometry(17.6, 13.2)
  for (const dir of [1, -1]) {
    const pane = new THREE.Mesh(paneGeo, paneMat)
    pane.position.set(0, HUB_Y, dir * (HALF_D - 0.5))
    if (dir < 0) pane.rotation.y = Math.PI
    root.add(pane)
  }

  const wallShape = roundedRect(new THREE.Shape(), 0, 0, W - 0.2, H - 0.2, 3)
  wallShape.holes.push(roundedRect(new THREE.Path(), 0, 0, W - 3.4, H - 3.4, 1.8))
  const wall = new THREE.Mesh(extrude(wallShape, D - PLATE * 2), wallMat)
  wall.position.z = -HALF_D + PLATE
  root.add(wall)

  const seamShape = roundedRect(new THREE.Shape(), 0, 0, W + 0.06, H + 0.06, 3)
  seamShape.holes.push(roundedRect(new THREE.Path(), 0, 0, W - 1.2, H - 1.2, 2.4))
  const seam = new THREE.Mesh(extrude(seamShape, 0.22), seamMat)
  seam.position.z = -0.11
  root.add(seam)

  // Raised face details, mirrored on both sides.
  const trapGeo = extrude(trapezoidShape(), 0.55)
  const hubRingGeo = extrude(ringShape(0, 0, 10.7, 9.5), 0.32)
  const windowShape = roundedRect(new THREE.Shape(), 0, HUB_Y, 20, 15.6, 1.4)
  windowShape.holes.push(roundedRect(new THREE.Path(), 0, HUB_Y, 17.4, 13, 0.9))
  const windowGeo = extrude(windowShape, 0.32)
  const alignRingGeo = extrude(ringShape(0, 0, 3.1, 1.75), 0.32)

  // Industrial moulding across the bottom quarter. Built in face coordinates so the
  // frosted surface texture lines up.
  const trapRibGeo = extrude(trapezoidRibShape(), 0.4)
  const perimeterRim = roundedRect(new THREE.Shape(), 0, 0, W - 2.2, H - 2.2, 2.4)
  perimeterRim.holes.push(roundedRect(new THREE.Path(), 0, 0, W - 3.6, H - 3.6, 1.8))
  const perimeterRimGeo = extrude(perimeterRim, 0.3)
  const ledgeGeos = [-1, 1].map((sx) => {
    const x0 = sx * (31.2 + 2.2 * 0.55 + 0.6)
    const x1 = sx * 47.6
    const ledge = roundedRect(new THREE.Shape(), (x0 + x1) / 2, -16.6, Math.abs(x1 - x0), 0.75, 0.3)
    return extrude(ledge, 0.38)
  })
  const gearGeos = [-1, 1].map((sx) =>
    extrude(gearRingShape(4.0, 0.45, 14, 3.25), 0.26).translate(sx * 43.2, -24.2, 0),
  )
  const screwBossGeos = SCREWS_2D.filter(([x]) => x !== 0).map(([x, y]) =>
    extrude(ringShape(x, y, 2.75, 2.05), 0.28),
  )
  const padGeos = [-1, 1].map((sx) =>
    extrude(roundedRect(new THREE.Shape(), sx * 23.6, -21.4, 4.6, 1.7, 0.5), 0.3),
  )
  const knurlGeos = [-1, 1].map((sx) => {
    const geos: THREE.BufferGeometry[] = []
    for (let i = 0; i < 5; i++) {
      geos.push(
        extrude(roundedRect(new THREE.Shape(), sx * (34.8 + i * 1.45), -19.6, 0.55, 2.4, 0.2), 0.3),
      )
    }
    return geos
  })
  const raisedBottom: [THREE.BufferGeometry, number][] = [
    [trapRibGeo, 0.4],
    [perimeterRimGeo, 0.3],
    ...ledgeGeos.map((g) => [g, 0.38] as [THREE.BufferGeometry, number]),
    ...gearGeos.map((g) => [g, 0.26] as [THREE.BufferGeometry, number]),
    ...screwBossGeos.map((g) => [g, 0.28] as [THREE.BufferGeometry, number]),
    ...padGeos.map((g) => [g, 0.3] as [THREE.BufferGeometry, number]),
    ...knurlGeos.flat().map((g) => [g, 0.3] as [THREE.BufferGeometry, number]),
  ]

  for (const dir of [1, -1]) {
    const surface = dir * HALF_D
    const place = (geo: THREE.BufferGeometry, depth: number, x = 0, y = 0) => {
      const m = new THREE.Mesh(geo, detailMat)
      m.position.set(x, y, dir > 0 ? surface - 0.05 : surface + 0.05 - depth)
      root.add(m)
    }
    place(trapGeo, 0.55)
    place(windowGeo, 0.32)
    place(hubRingGeo, 0.32, -HUB_X, HUB_Y)
    place(hubRingGeo, 0.32, HUB_X, HUB_Y)
    place(alignRingGeo, 0.32, -43.2, -24.2)
    place(alignRingGeo, 0.32, 43.2, -24.2)
    for (const [geo, depth] of raisedBottom) place(geo, depth)
  }

  // Through-holes read as dark tubes through the smoked shell.
  const capstanTube = new THREE.CylinderGeometry(2.0, 2.0, D + 0.8, 24, 1, true).rotateX(Math.PI / 2)
  const alignTube = new THREE.CylinderGeometry(1.75, 1.75, D - 0.4, 20, 1, true).rotateX(Math.PI / 2)
  const guideHoleTube = new THREE.CylinderGeometry(1.1, 1.1, 1.6, 16, 1, true).rotateX(Math.PI / 2)
  for (const sx of [-1, 1]) {
    const c = new THREE.Mesh(capstanTube, darkMat)
    c.position.set(sx * 17.5, -27.0, 0)
    const a = new THREE.Mesh(alignTube, darkMat)
    a.position.set(sx * 43.2, -24.2, 0)
    root.add(c, a)
    for (const dir of [1, -1]) {
      const g = new THREE.Mesh(guideHoleTube, darkMat)
      g.position.set(sx * 27.5, -28.4, dir * (HALF_D - 0.6))
      root.add(g)
    }
  }

  // Screw bosses inside the shell.
  const bossGeo = new THREE.CylinderGeometry(2.3, 2.3, D - PLATE * 2, 18).rotateX(Math.PI / 2)
  const bosses = new THREE.InstancedMesh(bossGeo, wallMat, SCREWS_2D.length)
  const tmp = new THREE.Object3D()
  SCREWS_2D.forEach(([x, y], i) => {
    tmp.position.set(x, y, 0)
    tmp.rotation.set(0, 0, 0)
    tmp.updateMatrix()
    bosses.setMatrixAt(i, tmp.matrix)
  })
  root.add(bosses)

  // Phillips screws, front and back.
  const headGeo = new THREE.CylinderGeometry(1.7, 1.85, 0.7, 28).rotateX(Math.PI / 2)
  const slotGeo = new THREE.BoxGeometry(2.3, 0.34, 0.12)
  const screwCount = SCREWS_2D.length * 2
  const heads = new THREE.InstancedMesh(headGeo, metal, screwCount)
  const slots = new THREE.InstancedMesh(slotGeo, darkMat, screwCount * 2)
  let si = 0
  for (const dir of [1, -1]) {
    SCREWS_2D.forEach(([x, y], i) => {
      const base = dir * (HALF_D + (y < -20 && Math.abs(x) < 1 ? 0.5 : 0) + 0.3)
      const twist = (i * 0.9 + (dir > 0 ? 0.2 : 1.1)) % Math.PI
      tmp.position.set(x, y, base)
      tmp.rotation.set(0, 0, 0)
      tmp.updateMatrix()
      heads.setMatrixAt(si, tmp.matrix)
      for (let k = 0; k < 2; k++) {
        tmp.position.set(x, y, base + dir * 0.33)
        tmp.rotation.set(0, 0, twist + (k * Math.PI) / 2)
        tmp.updateMatrix()
        slots.setMatrixAt(si * 2 + k, tmp.matrix)
      }
      si++
    })
  }
  root.add(heads, slots)

  // Reels: spoked hub + wound tape pack. Groups are returned so they can turn.
  const HUB_DEPTH = 10.2
  const hubGeo = extrude(hubShape(), HUB_DEPTH, {
    bevelEnabled: true,
    bevelThickness: 0.25,
    bevelSize: 0.2,
    bevelSegments: 2,
    curveSegments: 32,
  })
  const makeReel = (x: number, packRadius: number) => {
    const g = new THREE.Group()
    g.position.set(x, HUB_Y, 0)
    const hub = new THREE.Mesh(hubGeo, hubMat)
    hub.position.z = -HUB_DEPTH / 2
    g.add(hub)

    const tex = tapeTex.clone()
    tex.needsUpdate = true
    tex.repeat.set(1 / (packRadius * 2), 1 / (packRadius * 2))
    tex.offset.set(0.5, 0.5)
    const packFaceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.34, metalness: 0.28 })
    const packGeo = extrude(ringShape(0, 0, packRadius, 8.25), TAPE_WIDTH, { curveSegments: 64 })
    const pack = new THREE.Mesh(packGeo, [packFaceMat, tapeEdgeMat])
    pack.position.z = -TAPE_WIDTH / 2
    g.add(pack)
    root.add(g)
    return { group: g, tex, packFaceMat, packGeo }
  }
  const reelL = makeReel(-HUB_X, 16.4)
  const reelR = makeReel(HUB_X, 13.2)

  // Tape path: off each pack, round the corner rollers, along the head edge.
  const rollerGeo = new THREE.CylinderGeometry(1.6, 1.6, 4.6, 20).rotateX(Math.PI / 2)
  const pinGeo = new THREE.CylinderGeometry(0.55, 0.55, D - PLATE * 2, 12).rotateX(Math.PI / 2)
  for (const sx of [-1, 1]) {
    const roller = new THREE.Mesh(rollerGeo, whitePlastic)
    roller.position.set(sx * 40, -28.5, 0)
    const pin = new THREE.Mesh(pinGeo, metal)
    pin.position.set(sx * 40, -28.5, 0)
    const guide = new THREE.Mesh(pinGeo, whitePlastic)
    guide.position.set(sx * 27.5, -29.1, 0)
    root.add(roller, pin, guide)
  }

  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x2e1d13, roughness: 0.3, metalness: 0.35, side: THREE.DoubleSide })
  const tapePath: [number, number][] = [
    [-21 + 16.4 * Math.cos(3.5), HUB_Y + 16.4 * Math.sin(3.5)],
    [-41.6, -28.5],
    [-40, -30.1],
    [40, -30.1],
    [41.6, -28.5],
    [21 + 13.2 * Math.cos(-0.35), HUB_Y + 13.2 * Math.sin(-0.35)],
  ]
  const ribbonGeos: THREE.BufferGeometry[] = []
  for (let i = 0; i < tapePath.length - 1; i++) {
    const [x0, y0] = tapePath[i]
    const [x1, y1] = tapePath[i + 1]
    const len = Math.hypot(x1 - x0, y1 - y0)
    const geo = new THREE.BoxGeometry(len, 0.08, TAPE_WIDTH)
    ribbonGeos.push(geo)
    const seg = new THREE.Mesh(geo, ribbonMat)
    seg.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0)
    seg.rotation.z = Math.atan2(y1 - y0, x1 - x0)
    root.add(seg)
  }

  // Pressure pad assembly behind the head opening.
  const feltGeo = new THREE.BoxGeometry(5.6, 1.3, 3.2)
  const felt = new THREE.Mesh(feltGeo, feltMat)
  felt.position.set(0, -29.3, 0)
  const springGeo = new THREE.BoxGeometry(9, 0.22, 3)
  const spring = new THREE.Mesh(springGeo, metal)
  spring.position.set(0, -28.5, 0)
  const shieldGeo = new THREE.BoxGeometry(11, 0.3, 6.5)
  const shield = new THREE.Mesh(shieldGeo, metal)
  shield.position.set(0, -26.9, 0)
  root.add(felt, spring, shield)

  // Edge details: top window and write-protect tabs.
  const topWindowGeo = new THREE.BoxGeometry(3.6, 0.12, 3.6)
  const topWindow = new THREE.Mesh(topWindowGeo, darkMat)
  topWindow.position.set(0, H / 2 + 0.02, 0)
  const tabGeo = new THREE.BoxGeometry(6, 0.12, 2.6)
  root.add(topWindow)
  for (const sx of [-1, 1]) {
    const tab = new THREE.Mesh(tabGeo, darkMat)
    tab.position.set(sx * 40.5, H / 2 + 0.02, -3.4)
    root.add(tab)
  }

  // Print, slightly proud of each face.
  const printGeo = new THREE.PlaneGeometry(W, H)
  const printA = createPrintTexture("a", anisotropy)
  const printB = createPrintTexture("b", anisotropy)
  const printMatA = new THREE.MeshBasicMaterial({ map: printA.tex, transparent: true, depthWrite: false, toneMapped: false })
  const printMatB = new THREE.MeshBasicMaterial({ map: printB.tex, transparent: true, depthWrite: false, toneMapped: false })
  const labelA = new THREE.Mesh(printGeo, printMatA)
  labelA.position.z = HALF_D + 0.03
  const labelB = new THREE.Mesh(printGeo, printMatB)
  labelB.position.z = -HALF_D - 0.03
  labelB.rotation.y = Math.PI
  root.add(labelA, labelB)

  const redrawPrint = () => {
    printA.redraw()
    printB.redraw()
  }

  return {
    root,
    reels: [reelL.group, reelR.group],
    extraTextures: [tapeTex, reelL.tex, reelR.tex, surfaceTex],
    redrawPrint,
  }
}

function disposeScene(scene: THREE.Scene) {
  const textures = new Set<THREE.Texture>()
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : []
    for (const m of mats) {
      const map = (m as THREE.MeshStandardMaterial).map
      if (map) textures.add(map)
      m.dispose()
    }
  })
  textures.forEach((t) => t.dispose())
}

function HomepageCassetteInner({ size, isDarkMode, onVisualBounds }: HomepageCassetteProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const invalidateRef = useRef<() => void>(() => {})
  const measureVisualBoundsRef = useRef<() => void>(() => {})
  const onVisualBoundsRef = useRef(onVisualBounds)
  onVisualBoundsRef.current = onVisualBounds
  const sizeRef = useRef(size)
  sizeRef.current = size
  const darkRef = useRef(isDarkMode)
  darkRef.current = isDarkMode

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" })
    } catch (error) {
      console.error("Cassette: WebGL unavailable", error)
      return
    }
    rendererRef.current = renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(sizeRef.current, sizeRef.current)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = darkRef.current ? 1.0 : 0.92
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment(renderer)
    const envTarget = pmrem.fromScene(room, 0.04)
    scene.environment = envTarget.texture
    room.dispose()
    pmrem.dispose()

    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(-60, 110, 160)
    const rim = new THREE.DirectionalLight(0xdfe6f0, 0.8)
    rim.position.set(90, -40, -140)
    scene.add(key, rim)

    const camera = new THREE.PerspectiveCamera(30, 1, 50, 800)
    camera.position.set(0, 0, 230)
    camera.lookAt(0, 0, 0)

    const { root, reels, extraTextures, redrawPrint } = buildCassette(
      renderer.capabilities.getMaxAnisotropy(),
    )
    root.quaternion.setFromEuler(new THREE.Euler(0.16, -0.32, 0.03))

    let disposed = false
    const family = printFonts()
    Promise.all([
      document.fonts.load(`600 40px ${family}`),
      document.fonts.load(`500 40px ${family}`),
    ])
      .then(() => {
        if (disposed) return
        redrawPrint()
        invalidateRef.current()
      })
      .catch(() => {})
    scene.add(root)

    const axisX = new THREE.Vector3(1, 0, 0)
    const axisY = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion()
    const spin = (dx: number, dy: number) => {
      q.setFromAxisAngle(axisY, dx)
      root.quaternion.premultiply(q)
      q.setFromAxisAngle(axisX, dy)
      root.quaternion.premultiply(q)
    }

    let dragging = false
    let lastX = 0
    let lastY = 0
    let velX = 0
    let velY = 0
    let dirty = true
    const SENS = 0.0085

    const canvas = renderer.domElement
    const raycaster = new THREE.Raycaster()

    const publishVisualBounds = () => {
      const bottom = measureProjectedBottom(root, camera, sizeRef.current)
      if (bottom != null) onVisualBoundsRef.current?.(bottom)
    }
    measureVisualBoundsRef.current = () => {
      renderer.render(scene, camera)
      publishVisualBounds()
    }

    const onDown = (e: PointerEvent) => {
      raycaster.setFromCamera(pointerToNdc(canvas, e.clientX, e.clientY), camera)
      if (raycaster.intersectObject(root, true).length === 0) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      velX = 0
      velY = 0
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = (e.clientX - lastX) * SENS
      const dy = (e.clientY - lastY) * SENS
      lastX = e.clientX
      lastY = e.clientY
      spin(dx, dy)
      velX = dx
      velY = dy
      dirty = true
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    }
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)

    let visible = document.visibilityState === "visible"
    let inView = true
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", onVisibility)
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    }, { threshold: 0.02 })
    io.observe(mount)

    invalidateRef.current = () => {
      dirty = true
      if (!visible || !inView) renderer.render(scene, camera)
    }

    measureVisualBoundsRef.current()

    const clock = new THREE.Clock()
    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      if (!visible || !inView) return

      if (!dragging) {
        const decay = Math.pow(0.9, dt * 60)
        velX *= decay
        velY *= decay
        if (Math.abs(velX) + Math.abs(velY) > 1e-5) {
          spin(velX, velY)
          dirty = true
        }
      }
      if (!reducedMotion) {
        reels[0].rotation.z += dt * 0.9
        reels[1].rotation.z += dt * 0.9
        dirty = true
      }

      if (dirty) {
        renderer.render(scene, camera)
        dirty = false
      }
    }
    frame = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      disposeScene(scene)
      extraTextures.forEach((t) => t.dispose())
      envTarget.dispose()
      renderer.dispose()
      if (canvas.parentNode === mount) mount.removeChild(canvas)
      rendererRef.current = null
      invalidateRef.current = () => {}
      measureVisualBoundsRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    rendererRef.current?.setSize(size, size)
    invalidateRef.current()
    requestAnimationFrame(() => measureVisualBoundsRef.current())
  }, [size])

  useEffect(() => {
    const renderer = rendererRef.current
    if (renderer) renderer.toneMappingExposure = isDarkMode ? 1.0 : 0.92
    invalidateRef.current()
  }, [isDarkMode])

  return (
    <div
      ref={mountRef}
      className="cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Nerrawave cassette tape. Drag to rotate."
    />
  )
}

export const HomepageCassette = memo(
  HomepageCassetteInner,
  (prev, next) => prev.size === next.size && prev.isDarkMode === next.isDarkMode,
)
