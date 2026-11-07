"use client"

import { memo, useRef, useEffect, type RefObject } from "react"
import * as THREE from "three"

interface WikipediaGlobeExperimentalProps {
  size?: number
  isDarkMode: boolean
  headlineMaskRef?: RefObject<HTMLElement | null>
}

function yieldFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function createRoundedCellGeometry(width: number, height: number, depth: number) {
  const w = width / 2
  const h = height / 2
  const r = Math.min(0.07, w * 0.22, h * 0.22)

  const shape = new THREE.Shape()
  shape.moveTo(-w + r, -h)
  shape.lineTo(w - r, -h)
  shape.quadraticCurveTo(w, -h, w, -h + r)
  shape.lineTo(w, h - r)
  shape.quadraticCurveTo(w, h, w - r, h)
  shape.lineTo(-w + r, h)
  shape.quadraticCurveTo(-w, h, -w, h - r)
  shape.lineTo(-w, -h + r)
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    steps: 1,
  })
}

const VHS_MAGENTA = 0xff235f
const VHS_CYAN = 0x00d2ff

function glitchColor(seed: number) {
  return Math.sin(seed * 12.9898) > 0 ? VHS_MAGENTA : VHS_CYAN
}

function isGlitchBeat(elapsed: number, index: number, period: number, width: number) {
  return ((elapsed + index * 1.618) % period) < width
}

function createSurfaceArc(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  lift = 1.035,
) {
  const start = from.clone().normalize().multiplyScalar(radius)
  const end = to.clone().normalize().multiplyScalar(radius)
  const mid = start
    .clone()
    .add(end)
    .normalize()
    .multiplyScalar(radius * lift)

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
  return curve.getPoints(16)
}

function WikipediaGlobeExperimental({
  size = 500,
  isDarkMode,
  headlineMaskRef,
}: WikipediaGlobeExperimentalProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const globeRef = useRef<THREE.Group>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const puzzlePiecesRef = useRef<THREE.Mesh[]>([])
  const puzzleOutlinesRef = useRef<THREE.LineSegments[]>([])
  const outlineGlowsRef = useRef<THREE.LineSegments[]>([])
  const cellFacesRef = useRef<THREE.Mesh[]>([])
  const textMeshesRef = useRef<THREE.Mesh[]>([])
  const connectionLinesRef = useRef<THREE.Line[]>([])
  const junctionNodesRef = useRef<THREE.Mesh[]>([])
  const startTimeRef = useRef(0)
  const isDarkModeRef = useRef(isDarkMode)
  const connectionColorRef = useRef(isDarkMode ? 0x777777 : 0x999999)
  const glowColorRef = useRef(isDarkMode ? 0x888888 : 0xd8d8d8)
  const builtSizeRef = useRef(size)
  const sizeRef = useRef(size)
  sizeRef.current = size
  const layoutCacheRef = useRef({
    headline: null as DOMRect | null,
    canvas: null as DOMRect | null,
    updatedAt: 0,
  })
  const initGenerationRef = useRef(0)

  useEffect(() => {
    if (!mountRef.current) return

    let cancelled = false
    const myGeneration = ++initGenerationRef.current
    const mount = mountRef.current
    const mountSize = sizeRef.current
    builtSizeRef.current = mountSize
    startTimeRef.current = performance.now()

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(mountSize, mountSize)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mount.appendChild(renderer.domElement)

    const globeGroup = new THREE.Group()
    globeRef.current = globeGroup
    scene.add(globeGroup)

    const scale = mountSize / 500
    const globeRadius = 3.0 * scale

    const latinChars = [
      "W", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",
      "R", "S", "T", "U", "V", "X", "Y", "Z",
    ]
    const greekChars = [
      "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ",
      "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω",
    ]
    const cyrillicChars = [
      "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С",
      "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я",
    ]
    const chineseChars = [
      "中", "文", "维", "基", "百", "科", "全", "书", "自", "由", "的", "人", "国", "大", "学",
      "生", "会", "时", "年", "月", "日", "本", "地", "方", "工", "作",
    ]
    const japaneseChars = [
      "あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "が", "ざ", "だ", "ば", "ぱ",
      "ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ",
    ]
    const koreanChars = [
      "가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하", "거",
      "너", "더", "러", "머", "버", "서", "어", "저", "처", "커", "터",
    ]
    const arabicChars = [
      "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع",
      "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي",
    ]
    const hebrewChars = [
      "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ",
      "ק", "ר", "ש", "ת",
    ]
    const hindiChars = [
      "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "क", "ख", "ग", "घ", "च", "छ", "ज",
      "झ", "ट", "ठ", "ड", "ढ", "त", "थ", "द", "ध",
    ]

    const scriptSets = [
      latinChars,
      greekChars,
      cyrillicChars,
      chineseChars,
      japaneseChars,
      koreanChars,
      arabicChars,
      hebrewChars,
      hindiChars,
    ]
    const balancedCharacters: string[] = []
    const numPieces = 80
    const charsPerScript = Math.floor(numPieces / scriptSets.length)
    const remainder = numPieces % scriptSets.length

    scriptSets.forEach((scriptChars, scriptIndex) => {
      const numCharsFromThisScript = charsPerScript + (scriptIndex < remainder ? 1 : 0)
      for (let i = 0; i < numCharsFromThisScript; i++) {
        balancedCharacters.push(scriptChars[i % scriptChars.length])
      }
    })

    for (let i = balancedCharacters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[balancedCharacters[i], balancedCharacters[j]] = [balancedCharacters[j], balancedCharacters[i]]
    }

    const puzzlePieces: THREE.Mesh[] = []
    const puzzleOutlines: THREE.LineSegments[] = []
    const outlineGlows: THREE.LineSegments[] = []
    const cellFaces: THREE.Mesh[] = []
    const textMeshes: THREE.Mesh[] = []
    const connectionLines: THREE.Line[] = []
    const junctionNodes: THREE.Mesh[] = []

    isDarkModeRef.current = isDarkMode

    const outlineColor = isDarkMode ? 0x555555 : 0xb8b8b8
    const glowColor = isDarkMode ? 0x666666 : 0xd8d8d8
    const connectionColor = isDarkMode ? 0x777777 : 0x999999
    const faceColor = isDarkMode ? 0x1e1e1e : 0xe8e8e8

    connectionColorRef.current = connectionColor
    glowColorRef.current = glowColor

    const buildGlobe = async () => {
      for (let i = 0; i < numPieces; i++) {
        if (cancelled || myGeneration !== initGenerationRef.current) return

        const pieceWidth = 0.5 + Math.random() * 0.4
        const pieceHeight = 0.5 + Math.random() * 0.4
        const pieceGeometry = createRoundedCellGeometry(pieceWidth, pieceHeight, 0.014)
        pieceGeometry.computeVertexNormals()

        const pieceMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: isDarkMode ? 0.018 : 0.05,
          color: faceColor,
          side: THREE.DoubleSide,
          depthWrite: false,
        })

        const piece = new THREE.Mesh(pieceGeometry, pieceMaterial)

        const phi = Math.acos(-1 + (2 * i) / numPieces)
        const theta = Math.sqrt(numPieces * Math.PI) * phi

        const x = Math.cos(theta) * Math.sin(phi) * globeRadius
        const y = Math.cos(phi) * globeRadius
        const z = Math.sin(theta) * Math.sin(phi) * globeRadius

        piece.position.set(x, y, z)
        piece.lookAt(x * 2, y * 2, z * 2)
        piece.rotateZ((Math.random() - 0.5) * 0.35)

        puzzlePieces.push(piece)
        cellFaces.push(piece)
        globeGroup.add(piece)

        const edges = new THREE.EdgesGeometry(pieceGeometry)
        const outlineMaterial = new THREE.LineBasicMaterial({
          color: outlineColor,
          transparent: true,
          opacity: 0.42,
        })

        const outline = new THREE.LineSegments(edges, outlineMaterial)
        outline.position.copy(piece.position)
        outline.rotation.copy(piece.rotation)
        puzzleOutlines.push(outline)
        globeGroup.add(outline)

        const glowMaterial = new THREE.LineBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: isDarkMode ? 0.06 : 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const glowOutline = new THREE.LineSegments(edges, glowMaterial)
        glowOutline.position.copy(piece.position).multiplyScalar(1.006)
        glowOutline.rotation.copy(piece.rotation)
        outlineGlows.push(glowOutline)
        globeGroup.add(glowOutline)

        const character = balancedCharacters[i] || balancedCharacters[i % balancedCharacters.length]
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (context) {
          canvas.width = 512
          canvas.height = 512
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.font =
            "bold 240px 'Times New Roman', 'Noto Sans Arabic', 'Noto Sans CJK SC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Arial Unicode MS', 'Microsoft YaHei', 'SimSun', 'Malgun Gothic', 'Yu Gothic', 'Hiragino Sans', serif"
          context.fillStyle = isDarkMode ? "#999999" : "#666666"
          context.textAlign = "center"
          context.textBaseline = "middle"
          context.shadowColor = isDarkMode ? "#000000" : "#ffffff"
          context.shadowBlur = 2
          context.shadowOffsetX = 1
          context.shadowOffsetY = 1
          context.fillText(character, 256, 256)

          const texture = new THREE.CanvasTexture(canvas)
          texture.needsUpdate = true

          const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.6,
            alphaTest: 0.1,
          })

          const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), textMaterial)
          textMesh.position.copy(piece.position)
          textMesh.position.multiplyScalar(1.03)
          textMesh.lookAt(textMesh.position.clone().multiplyScalar(2))

          textMeshes.push(textMesh)
          globeGroup.add(textMesh)
        }

        if ((i + 1) % 5 === 0) {
          await yieldFrame()
        }
      }

      if (cancelled) return

      puzzlePiecesRef.current = puzzlePieces
      puzzleOutlinesRef.current = puzzleOutlines
      outlineGlowsRef.current = outlineGlows
      cellFacesRef.current = cellFaces
      textMeshesRef.current = textMeshes

      const connectionMaterial = new THREE.LineBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.38,
        blending: THREE.NormalBlending,
      })

      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
      const nodeGeometry = new THREE.SphereGeometry(0.022 * scale, 8, 8)

      const connectedPairs = new Set<string>()

      for (let i = 0; i < puzzlePieces.length; i++) {
        if (cancelled) return

        const neighbors = puzzlePieces
          .map((piece, j) => ({
            j,
            d: puzzlePieces[i].position.distanceTo(piece.position),
          }))
          .filter(({ j }) => j !== i)
          .sort((a, b) => a.d - b.d)

        for (let n = 0; n < 2 && n < neighbors.length; n++) {
          const { j, d } = neighbors[n]
          if (d > 1.35) continue

          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (connectedPairs.has(key)) continue
          connectedPairs.add(key)

          const arcPoints = createSurfaceArc(
            puzzlePieces[i].position,
            puzzlePieces[j].position,
            globeRadius,
          )
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints)
          const line = new THREE.Line(lineGeometry, connectionMaterial.clone())
          connectionLines.push(line)
          globeGroup.add(line)

          const midIndex = Math.floor(arcPoints.length / 2)
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())
          node.position.copy(arcPoints[midIndex])
          junctionNodes.push(node)
          globeGroup.add(node)
        }

        if ((i + 1) % 8 === 0) {
          await yieldFrame()
        }
      }

      if (cancelled || myGeneration !== initGenerationRef.current) return

      connectionLinesRef.current = connectionLines
      junctionNodesRef.current = junctionNodes

      startInteractions()
    }

    const getDepthFactor = (localPosition: THREE.Vector3) => {
      const worldPosition = localPosition.clone()
      globeRef.current?.localToWorld(worldPosition)
      return worldPosition.z < 0 ? 0.4 : 1.0
    }

    const refreshLayoutCache = (force = false) => {
      const maskEl = headlineMaskRef?.current
      const canvas = renderer.domElement
      if (!maskEl || !canvas) return

      const now = performance.now()
      if (!force && now - layoutCacheRef.current.updatedAt < 120) return

      layoutCacheRef.current = {
        headline: maskEl.getBoundingClientRect(),
        canvas: canvas.getBoundingClientRect(),
        updatedAt: now,
      }
    }

    const isBehindHeadline = (localPosition: THREE.Vector3) => {
      const maskEl = headlineMaskRef?.current
      const canvas = renderer.domElement
      if (!maskEl || !canvas) return false

      refreshLayoutCache()

      const worldPos = localPosition.clone()
      globeRef.current?.localToWorld(worldPos)
      worldPos.project(camera)

      if (worldPos.z > 1) return false

      const headlineRect = layoutCacheRef.current.headline
      const canvasRect = layoutCacheRef.current.canvas
      if (!headlineRect || !canvasRect) return false

      const sx = canvasRect.left + (worldPos.x * 0.5 + 0.5) * canvasRect.width
      const sy = canvasRect.top + (-worldPos.y * 0.5 + 0.5) * canvasRect.height

      const padX = 12
      const padY = 8

      return (
        sx >= headlineRect.left - padX &&
        sx <= headlineRect.right + padX &&
        sy >= headlineRect.top - padY &&
        sy <= headlineRect.bottom + padY
      )
    }

    const updatePieceOpacities = () => {
      if (!globeRef.current) return

      const dark = isDarkModeRef.current
      const elapsed = (performance.now() - startTimeRef.current) * 0.001

      puzzleOutlinesRef.current.forEach((outline) => {
        const material = outline.material as THREE.LineBasicMaterial
        if (isBehindHeadline(outline.position)) {
          material.opacity = 0
          return
        }
        const depthFactor = getDepthFactor(outline.position)
        material.opacity = 0.42 * depthFactor
      })

      outlineGlowsRef.current.forEach((glow, index) => {
        const material = glow.material as THREE.LineBasicMaterial
        if (isBehindHeadline(glow.position)) {
          material.opacity = 0
          return
        }
        const depthFactor = getDepthFactor(glow.position)
        const pulse = 0.88 + 0.12 * Math.sin(elapsed * 1.6 + index * 0.35)
        const baseGlowOpacity = dark ? 0.06 : 0.14
        const glitching =
          depthFactor > 0.55 && isGlitchBeat(elapsed, index, 8.5 + (index % 5), 0.036)

        if (glitching) {
          material.color.setHex(glitchColor(index + elapsed))
          material.opacity = Math.min(0.28, baseGlowOpacity * 2.8) * depthFactor
        } else {
          material.color.setHex(glowColorRef.current)
          material.opacity = baseGlowOpacity * depthFactor * pulse
        }
      })

      cellFacesRef.current.forEach((face) => {
        const material = face.material as THREE.MeshBasicMaterial
        if (isBehindHeadline(face.position)) {
          material.opacity = 0
          return
        }
        const depthFactor = getDepthFactor(face.position)
        const baseFaceOpacity = dark ? 0.018 : 0.05
        material.opacity = baseFaceOpacity * depthFactor
      })

      connectionLinesRef.current.forEach((line, index) => {
        const material = line.material as THREE.LineBasicMaterial
        const positions = line.geometry.attributes.position
        const midIndex = Math.floor(positions.count / 2)
        const mid = new THREE.Vector3().fromBufferAttribute(positions, midIndex)
        if (isBehindHeadline(mid)) {
          material.opacity = 0
          return
        }
        const depthFactor = getDepthFactor(mid)
        const pulse = 0.82 + 0.18 * Math.sin(elapsed * 2.1 + index * 0.55)
        const glitching =
          depthFactor > 0.55 && isGlitchBeat(elapsed, index + 40, 10.5 + (index % 4), 0.032)

        if (glitching) {
          material.color.setHex(glitchColor(index * 1.7 + elapsed))
          material.opacity = 0.62 * depthFactor
        } else {
          material.color.setHex(connectionColorRef.current)
          material.opacity = 0.38 * depthFactor * pulse
        }
      })

      junctionNodesRef.current.forEach((node, index) => {
        const material = node.material as THREE.MeshBasicMaterial
        if (isBehindHeadline(node.position)) {
          material.opacity = 0
          node.scale.setScalar(1)
          return
        }
        const depthFactor = getDepthFactor(node.position)
        const pulse = 0.75 + 0.25 * Math.sin(elapsed * 2.4 + index * 0.7)
        const glitching =
          depthFactor > 0.55 && isGlitchBeat(elapsed, index + 12, 6.5 + (index % 6), 0.044)

        if (glitching) {
          material.color.setHex(glitchColor(index * 2.3 + elapsed * 1.4))
          material.opacity = 0.78 * depthFactor
          node.scale.setScalar(1.45)
        } else {
          material.color.setHex(connectionColorRef.current)
          material.opacity = 0.45 * depthFactor * pulse
          node.scale.setScalar(1)
        }
      })

      textMeshesRef.current.forEach((textMesh, index) => {
        const material = textMesh.material as THREE.MeshBasicMaterial
        if (isBehindHeadline(textMesh.position)) {
          material.opacity = 0
          textMesh.scale.setScalar(1)
          material.color.setHex(0xffffff)
          return
        }

        const depthFactor = getDepthFactor(textMesh.position)
        const glitching =
          depthFactor > 0.55 && isGlitchBeat(elapsed, index + 80, 7.5 + (index % 5), 0.036)

        if (glitching) {
          material.color.setHex(glitchColor(index * 1.9 + elapsed * 1.2))
          material.opacity = 0.82 * depthFactor
          textMesh.scale.setScalar(1.1)
        } else {
          material.color.setHex(0xffffff)
          material.opacity = 0.6 * depthFactor
          textMesh.scale.setScalar(1)
        }
      })
    }

    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !globeRef.current) return

      const deltaX = event.clientX - mouseRef.current.x
      const deltaY = event.clientY - mouseRef.current.y

      globeRef.current.rotation.y += deltaX * 0.01
      globeRef.current.rotation.x += deltaY * 0.01

      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDraggingRef.current = true
        mouseRef.current.x = event.touches[0].clientX
        mouseRef.current.y = event.touches[0].clientY
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current || !globeRef.current || event.touches.length !== 1) return

      const deltaX = event.touches[0].clientX - mouseRef.current.x
      const deltaY = event.touches[0].clientY - mouseRef.current.y

      globeRef.current.rotation.y += deltaX * 0.01
      globeRef.current.rotation.x += deltaY * 0.01

      mouseRef.current.x = event.touches[0].clientX
      mouseRef.current.y = event.touches[0].clientY
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }

    let animationFrameId = 0
    let isActive = true
    let isVisible = document.visibilityState === "visible"
    let isInView = true

    const animate = () => {
      if (!isActive) return

      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible || !isInView) return

      updatePieceOpacities()

      if (!isDraggingRef.current && globeRef.current) {
        globeRef.current.rotation.y += 0.002
      }

      renderer.render(scene, camera)
    }

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible"
      if (isVisible && isActive) {
        updatePieceOpacities()
        renderer.render(scene, camera)
      }
    }

    const startInteractions = () => {
      renderer.domElement.addEventListener("mousedown", handleMouseDown)
      renderer.domElement.addEventListener("touchstart", handleTouchStart)
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchend", handleTouchEnd)
      document.addEventListener("visibilitychange", handleVisibilityChange)
      animationFrameId = requestAnimationFrame(animate)
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    intersectionObserver.observe(mount)

    void buildGlobe()

    const maskEl = headlineMaskRef?.current
    const headlineObserver =
      maskEl &&
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => refreshLayoutCache(true))
        : null
    headlineObserver?.observe(maskEl as Element)

    return () => {
      cancelled = true
      initGenerationRef.current += 1
      headlineObserver?.disconnect()
      isActive = false
      cancelAnimationFrame(animationFrameId)
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      renderer.domElement.removeEventListener("mousedown", handleMouseDown)
      renderer.domElement.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleTouchEnd)

      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }

      renderer.dispose()
      scene.clear()
    }
  }, [])

  useEffect(() => {
    const renderer = rendererRef.current
    const globe = globeRef.current
    if (!renderer || !globe || builtSizeRef.current <= 0) return

    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const scaleFactor = size / builtSizeRef.current
    globe.scale.setScalar(scaleFactor)
  }, [size])

  useEffect(() => {
    isDarkModeRef.current = isDarkMode

    const outlineColor = isDarkMode ? 0x555555 : 0xb8b8b8
    const glowColor = isDarkMode ? 0x666666 : 0xd8d8d8
    const connectionColor = isDarkMode ? 0x777777 : 0x999999
    const faceColor = isDarkMode ? 0x1e1e1e : 0xe8e8e8

    connectionColorRef.current = connectionColor
    glowColorRef.current = glowColor

    puzzleOutlinesRef.current.forEach((outline) => {
      ;(outline.material as THREE.LineBasicMaterial).color.setHex(outlineColor)
    })

    outlineGlowsRef.current.forEach((glow) => {
      ;(glow.material as THREE.LineBasicMaterial).color.setHex(glowColor)
    })

    cellFacesRef.current.forEach((face) => {
      const material = face.material as THREE.MeshBasicMaterial
      material.color.setHex(faceColor)
    })

    connectionLinesRef.current.forEach((line) => {
      ;(line.material as THREE.LineBasicMaterial).color.setHex(connectionColor)
    })

    junctionNodesRef.current.forEach((node) => {
      ;(node.material as THREE.MeshBasicMaterial).color.setHex(connectionColor)
    })
  }, [isDarkMode])

  return (
    <div
      ref={mountRef}
      className="cursor-grab touch-none active:cursor-grabbing"
      style={{ width: size, height: size }}
    />
  )
}

export default memo(WikipediaGlobeExperimental)
