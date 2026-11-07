"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

interface WikipediaGlobeProps {
  size?: number
  isDarkMode: boolean
}

function yieldFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

export default function WikipediaGlobe({ size = 500, isDarkMode }: WikipediaGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const globeRef = useRef<THREE.Group>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const puzzlePiecesRef = useRef<THREE.Mesh[]>([])
  const puzzleOutlinesRef = useRef<THREE.LineSegments[]>([])
  const textMeshesRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!mountRef.current) return

    let cancelled = false
    const mount = mountRef.current

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Globe group
    const globeGroup = new THREE.Group()
    globeRef.current = globeGroup
    scene.add(globeGroup)

    // Scale globe based on size
    const scale = size / 500
    const globeRadius = 3.0 * scale

    // Balanced multilingual character sets
    const latinChars = [
      "W",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "X",
      "Y",
      "Z",
    ]

    const greekChars = [
      "Α",
      "Β",
      "Γ",
      "Δ",
      "Ε",
      "Ζ",
      "Η",
      "Θ",
      "Ι",
      "Κ",
      "Λ",
      "Μ",
      "Ν",
      "Ξ",
      "Ο",
      "Π",
      "Ρ",
      "Σ",
      "Τ",
      "Υ",
      "Φ",
      "Χ",
      "Ψ",
      "Ω",
    ]

    const cyrillicChars = [
      "А",
      "Б",
      "В",
      "Г",
      "Д",
      "Е",
      "Ж",
      "З",
      "И",
      "Й",
      "К",
      "Л",
      "М",
      "Н",
      "О",
      "П",
      "Р",
      "С",
      "Т",
      "У",
      "Ф",
      "Х",
      "Ц",
      "Ч",
      "Ш",
      "Щ",
      "Ъ",
      "Ы",
      "Ь",
      "Э",
      "Ю",
      "Я",
    ]

    const chineseChars = [
      "中",
      "文",
      "维",
      "基",
      "百",
      "科",
      "全",
      "书",
      "自",
      "由",
      "的",
      "人",
      "国",
      "大",
      "学",
      "生",
      "会",
      "时",
      "年",
      "月",
      "日",
      "本",
      "地",
      "方",
      "工",
      "作",
    ]

    const japaneseChars = [
      "あ",
      "か",
      "さ",
      "た",
      "な",
      "は",
      "ま",
      "や",
      "ら",
      "わ",
      "が",
      "ざ",
      "だ",
      "ば",
      "ぱ",
      "ア",
      "カ",
      "サ",
      "タ",
      "ナ",
      "ハ",
      "マ",
      "ヤ",
      "ラ",
      "ワ",
    ]

    const koreanChars = [
      "가",
      "나",
      "다",
      "라",
      "마",
      "바",
      "사",
      "아",
      "자",
      "차",
      "카",
      "타",
      "파",
      "하",
      "거",
      "너",
      "더",
      "러",
      "머",
      "버",
      "서",
      "어",
      "저",
      "처",
      "커",
      "터",
    ]

    const arabicChars = [
      "ا",
      "ب",
      "ت",
      "ث",
      "ج",
      "ح",
      "خ",
      "د",
      "ذ",
      "ر",
      "ز",
      "س",
      "ش",
      "ص",
      "ض",
      "ط",
      "ظ",
      "ع",
      "غ",
      "ف",
      "ق",
      "ك",
      "ل",
      "م",
      "ن",
      "ه",
      "و",
      "ي",
    ]

    const hebrewChars = [
      "א",
      "ב",
      "ג",
      "ד",
      "ה",
      "ו",
      "ז",
      "ח",
      "ט",
      "י",
      "כ",
      "ל",
      "מ",
      "נ",
      "ס",
      "ע",
      "פ",
      "צ",
      "ק",
      "ר",
      "ש",
      "ת",
    ]

    const hindiChars = [
      "अ",
      "आ",
      "इ",
      "ई",
      "उ",
      "ऊ",
      "ए",
      "ऐ",
      "ओ",
      "औ",
      "क",
      "ख",
      "ग",
      "घ",
      "च",
      "छ",
      "ज",
      "झ",
      "ट",
      "ठ",
      "ड",
      "ढ",
      "त",
      "थ",
      "द",
      "ध",
    ]

    // Create balanced character distribution
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

    // Distribute characters evenly across scripts
    const numPieces = 80
    const charsPerScript = Math.floor(numPieces / scriptSets.length)
    const remainder = numPieces % scriptSets.length

    scriptSets.forEach((scriptChars, scriptIndex) => {
      const numCharsFromThisScript = charsPerScript + (scriptIndex < remainder ? 1 : 0)
      for (let i = 0; i < numCharsFromThisScript; i++) {
        balancedCharacters.push(scriptChars[i % scriptChars.length])
      }
    })

    // Shuffle the balanced characters for random distribution
    for (let i = balancedCharacters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[balancedCharacters[i], balancedCharacters[j]] = [balancedCharacters[j], balancedCharacters[i]]
    }

    // Create puzzle pieces with characters
    const puzzlePieces: THREE.Mesh[] = []
    const puzzleOutlines: THREE.LineSegments[] = []
    const textMeshes: THREE.Mesh[] = []

    // Slightly more visible outlines - tad more visible than before
    const outlineColor = isDarkMode ? 0x333333 : 0xcccccc

    const buildGlobe = async () => {
    for (let i = 0; i < numPieces; i++) {
      if (cancelled) return

      // Create puzzle piece geometry (simplified as rounded rectangles with some randomness)
      const pieceWidth = 0.5 + Math.random() * 0.4
      const pieceHeight = 0.5 + Math.random() * 0.4

      // Create base piece geometry
      const pieceGeometry = new THREE.BoxGeometry(pieceWidth, pieceHeight, 0.02)

      // Add some randomness to make it look more like puzzle pieces
      const vertices = pieceGeometry.attributes.position.array as Float32Array
      for (let j = 0; j < vertices.length; j += 3) {
        vertices[j] += (Math.random() - 0.5) * 0.15 // x
        vertices[j + 1] += (Math.random() - 0.5) * 0.15 // y
        vertices[j + 2] += (Math.random() - 0.5) * 0.01 // z (slight depth variation)
      }
      pieceGeometry.attributes.position.needsUpdate = true
      pieceGeometry.computeVertexNormals()

      // Create transparent piece (invisible background)
      const pieceMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0, // Completely transparent
        side: THREE.DoubleSide,
      })

      const piece = new THREE.Mesh(pieceGeometry, pieceMaterial)

      // Position pieces on sphere surface
      const phi = Math.acos(-1 + (2 * i) / numPieces)
      const theta = Math.sqrt(numPieces * Math.PI) * phi

      const x = Math.cos(theta) * Math.sin(phi) * globeRadius
      const y = Math.cos(phi) * globeRadius
      const z = Math.sin(theta) * Math.sin(phi) * globeRadius

      piece.position.set(x, y, z)

      // Orient piece to face outward from sphere center
      piece.lookAt(x * 2, y * 2, z * 2)

      // Add slight random rotation for more natural look
      piece.rotateZ((Math.random() - 0.5) * 0.5)

      puzzlePieces.push(piece)
      globeGroup.add(piece)

      // Create outline for the piece with slightly more visibility
      const edges = new THREE.EdgesGeometry(pieceGeometry)
      const outlineMaterial = new THREE.LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0.3, // Slightly more visible than before (was 0.2)
        linewidth: 2,
      })

      const outline = new THREE.LineSegments(edges, outlineMaterial)
      outline.position.copy(piece.position)
      outline.rotation.copy(piece.rotation)

      puzzleOutlines.push(outline)
      globeGroup.add(outline)

      // Add text character to ALL pieces using balanced distribution
      const character = balancedCharacters[i] || balancedCharacters[i % balancedCharacters.length]

      // Create text geometry with comprehensive font support
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (context) {
        canvas.width = 512 // Increased resolution
        canvas.height = 512

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Set comprehensive font stack for all scripts
        context.font =
          "bold 240px 'Times New Roman', 'Noto Sans Arabic', 'Noto Sans CJK SC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Arial Unicode MS', 'Microsoft YaHei', 'SimSun', 'Malgun Gothic', 'Yu Gothic', 'Hiragino Sans', serif"

        // Further reduced letter visibility - even more subtle
        context.fillStyle = isDarkMode ? "#999999" : "#666666"
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.shadowColor = isDarkMode ? "#000000" : "#ffffff"
        context.shadowBlur = 2 // Reduced shadow blur
        context.shadowOffsetX = 1 // Reduced shadow offset
        context.shadowOffsetY = 1

        // Draw the character
        context.fillText(character, 256, 256)

        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true

        const textMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6, // Further reduced opacity (was 0.8)
          alphaTest: 0.1,
        })

        const textGeometry = new THREE.PlaneGeometry(0.4, 0.4)
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)

        // Position text slightly above the piece
        textMesh.position.copy(piece.position)
        textMesh.position.multiplyScalar(1.03) // Slightly further from center
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
    textMeshesRef.current = textMeshes

    // Add some connecting lines between adjacent pieces (like puzzle piece connections)
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x666666 : 0x999999,
      transparent: true,
      opacity: 0.3, // Reduced opacity for connections too
    })

    // Create some random connections between nearby pieces
    for (let i = 0; i < puzzlePieces.length; i++) {
      if (cancelled) return

      const piece1 = puzzlePieces[i]

      // Find nearby pieces and connect some of them
      for (let j = i + 1; j < puzzlePieces.length; j++) {
        const piece2 = puzzlePieces[j]
        const distance = piece1.position.distanceTo(piece2.position)

        // Connect pieces that are close enough (simulate puzzle connections)
        if (distance < 1.5 && Math.random() < 0.15) {
          // 15% chance to connect nearby pieces
          const points = [piece1.position, piece2.position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, connectionMaterial)
          globeGroup.add(line)
        }
      }

      if ((i + 1) % 8 === 0) {
        await yieldFrame()
      }
    }

    if (cancelled) return

    startInteractions()
    }

    // Mouse event handlers
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

    // Touch event handlers for mobile
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

    // CTA area detection function with increased opacity effect (75%)
    const updatePieceOpacities = () => {
      if (!globeRef.current) return

      // CTA center position in world coordinates (center of globe)
      const ctaCenter = new THREE.Vector3(0, 0, 0)
      const ctaRadius = globeRadius * 0.5 // Radius to cover CTA area

      // Camera position for depth calculation
      const cameraPosition = new THREE.Vector3(0, 0, 5)

      // Update opacity for each outline and text based on distance to CTA and depth
      puzzleOutlinesRef.current.forEach((outline, index) => {
        const distance = outline.position.distanceTo(ctaCenter)
        const material = outline.material as THREE.LineBasicMaterial

        // Calculate depth (z position relative to camera)
        const worldPosition = outline.position.clone()
        globeRef.current?.localToWorld(worldPosition)
        const depthFactor = worldPosition.z < 0 ? 0.4 : 1.0 // Reduce opacity for back side

        if (distance < ctaRadius) {
          // Outlines in CTA area get 75% opacity reduction (0.25 = 25% of original)
          material.opacity = 0.3 * 0.25 * depthFactor
        } else {
          // Outlines outside CTA keep normal opacity with depth factor
          material.opacity = 0.3 * depthFactor
        }
      })

      // Update text mesh opacities based on depth
      textMeshesRef.current.forEach((textMesh) => {
        const material = textMesh.material as THREE.MeshBasicMaterial

        // Calculate depth (z position relative to camera)
        const worldPosition = textMesh.position.clone()
        globeRef.current?.localToWorld(worldPosition)
        const depthFactor = worldPosition.z < 0 ? 0.4 : 1.0 // Reduce opacity for back side

        material.opacity = 0.6 * depthFactor
      })
    }

    // Animation loop — must be cancelled on unmount so the globe never blocks other pages
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

    return () => {
      cancelled = true
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
  }, [size])

  useEffect(() => {
    const outlineColor = isDarkMode ? 0x333333 : 0xcccccc
    const connectionColor = isDarkMode ? 0x666666 : 0x999999

    puzzleOutlinesRef.current.forEach((outline) => {
      const material = outline.material as THREE.LineBasicMaterial
      material.color.setHex(outlineColor)
    })

    if (!globeRef.current) return

    globeRef.current.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        const material = child.material as THREE.LineBasicMaterial
        material.color.setHex(connectionColor)
      }
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
