"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

const MASTER_OUTPUT = 0.23
const RADIO_VOICE_SRC = "/header-ambient-voice.wav"
/** Scales voice-forward mix vs static (0.65 = 35% less obvious than prior tune). */
const VOICE_PROMINENCE = 0.65
const VOICE_BED_GAIN = 0.044 * VOICE_PROMINENCE
const VOICE_BURST_PEAK_BASE = 0.038 * VOICE_PROMINENCE
const VOICE_BURST_PEAK_RANGE = 0.028 * VOICE_PROMINENCE
/** Gap between speech burst attempts (steady loop bed stays continuous; this spaces repeats). */
const VOICE_BURST_INTERVAL_MS = 2900
/** Skip ticks ~21% (partway between 12% and pre-boost ~38%). */
const VOICE_BURST_SKIP_CHANCE = 0.12 + 0.35 * (0.38 - 0.12)
const HISS_GAIN = 0.068 + 0.35 * (0.085 - 0.068)

interface AudioGraph {
  ctx: AudioContext
  master: GainNode
  intervalIds: number[]
  stopSources: Array<{ stop: () => void }>
  onVisibility?: () => void
}

async function ensureContextRunning(ctx: AudioContext) {
  if (ctx.state === "closed") return
  if (ctx.state === "suspended") {
    try {
      await ctx.resume()
    } catch {
      /* ignore */
    }
  }
}

/** ~3s looping pink noise (Paul Kellet). */
function createPinkNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const out = buffer.getChannelData(channel)
    let b0 = 0
    let b1 = 0
    let b2 = 0
    let b3 = 0
    let b4 = 0
    let b5 = 0
    let b6 = 0

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
      out[i] = pink
    }
  }

  return buffer
}

function scheduleDistantChatter(
  ctx: AudioContext,
  gain: GainNode,
  filter: BiquadFilterNode,
): number {
  const tick = () => {
    if (ctx.state === "closed") return
    const now = ctx.currentTime
    const bursts = 2 + Math.floor(Math.random() * 5)

    let cursor = now
    for (let b = 0; b < bursts; b++) {
      cursor += 0.08 + Math.random() * 0.55
      const peak = 0.026 + Math.random() * 0.055
      const duration = 0.1 + Math.random() * 0.45
      gain.gain.setValueAtTime(0, cursor)
      gain.gain.linearRampToValueAtTime(peak, cursor + 0.04)
      gain.gain.linearRampToValueAtTime(0, cursor + duration)
      filter.frequency.setValueAtTime(380 + Math.random() * 2400, cursor)
      filter.frequency.linearRampToValueAtTime(420 + Math.random() * 1800, cursor + duration * 0.6)
      filter.Q.setValueAtTime(0.8 + Math.random() * 2.2, cursor)
    }
  }

  tick()
  return window.setInterval(tick, 1800 + Math.random() * 2200)
}

function scheduleCrackle(ctx: AudioContext, noiseSrc: AudioBufferSourceNode, master: GainNode): number {
  const crackleGain = ctx.createGain()
  crackleGain.gain.value = 0
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 2200
  noiseSrc.connect(hp)
  hp.connect(crackleGain)
  crackleGain.connect(master)

  const tick = () => {
    if (ctx.state === "closed") return
    if (Math.random() > 0.55) return
    const now = ctx.currentTime
    const t = now + Math.random() * 0.12
    crackleGain.gain.setValueAtTime(0, t)
    crackleGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.06, t + 0.008)
    crackleGain.gain.linearRampToValueAtTime(0, t + 0.02 + Math.random() * 0.04)
  }

  return window.setInterval(tick, 90 + Math.random() * 220)
}

function makeRadioDistortionCurve(amount: number): Float32Array {
  const samples = 44100
  const curve = new Float32Array(samples)
  const k = amount
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x))
  }
  return curve
}

async function attachDistantRadioVoices(
  ctx: AudioContext,
  master: GainNode,
  stopSources: Array<{ stop: () => void }>,
  intervalIds: number[],
) {
  const response = await fetch(RADIO_VOICE_SRC)
  if (!response.ok) return

  let buffer: AudioBuffer
  try {
    buffer = await ctx.decodeAudioData(await response.arrayBuffer())
  } catch {
    return
  }

  const playVoiceBurst = () => {
    if (ctx.state === "closed") return
    void ensureContextRunning(ctx)
    if (Math.random() < VOICE_BURST_SKIP_CHANCE) return

    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.playbackRate.value = 0.86 + Math.random() * 0.12

    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 350 + Math.random() * 120

    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 750 + Math.random() * 900
    bp.Q.value = 0.6 + Math.random() * 0.8

    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1560 + Math.random() * 700

    const shaper = ctx.createWaveShaper()
    shaper.curve = makeRadioDistortionCurve(2.05 + Math.random() * 1.6) as Float32Array<ArrayBuffer>
    shaper.oversample = "2x"

    const gain = ctx.createGain()
    gain.gain.value = 0

    src.connect(hp)
    hp.connect(bp)
    bp.connect(lp)
    lp.connect(shaper)
    shaper.connect(gain)
    gain.connect(master)

    const maxDur = Math.min(buffer.duration, 8)
    const clip = 1.95 + Math.random() * Math.min(3.4, maxDur - 0.5)
    const offset = Math.random() * Math.max(0.2, buffer.duration - clip - 0.2)
    const now = ctx.currentTime
    const peak = VOICE_BURST_PEAK_BASE + Math.random() * VOICE_BURST_PEAK_RANGE

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(peak, now + 0.27 + Math.random() * 0.3)
    gain.gain.setValueAtTime(peak * 0.73, now + clip * 0.55)
    gain.gain.linearRampToValueAtTime(0, now + clip)

    src.start(now, offset, clip)
    const stopAt = now + clip + 0.15
    src.stop(stopAt)
    src.onended = () => {
      src.disconnect()
      gain.disconnect()
    }
  }

  playVoiceBurst()
  intervalIds.push(window.setInterval(playVoiceBurst, VOICE_BURST_INTERVAL_MS))

  const bedSrc = ctx.createBufferSource()
  bedSrc.buffer = buffer
  bedSrc.loop = true
  bedSrc.playbackRate.value = 0.91

  const bedHp = ctx.createBiquadFilter()
  bedHp.type = "highpass"
  bedHp.frequency.value = 400
  const bedLp = ctx.createBiquadFilter()
  bedLp.type = "lowpass"
  bedLp.frequency.value = 1430
  const bedGain = ctx.createGain()
  bedGain.gain.value = VOICE_BED_GAIN

  bedSrc.connect(bedHp)
  bedHp.connect(bedLp)
  bedLp.connect(bedGain)
  bedGain.connect(master)
  bedSrc.start()
  stopSources.push(bedSrc)

  bedSrc.onended = () => {
    if (ctx.state === "closed") return
    const restart = ctx.createBufferSource()
    restart.buffer = buffer
    restart.loop = true
    restart.playbackRate.value = 0.91
    restart.connect(bedHp)
    restart.start()
    stopSources.push(restart)
  }

}

function buildColdWarAmbient(ctx: AudioContext): Omit<AudioGraph, "ctx"> {
  const master = ctx.createGain()
  master.connect(ctx.destination)

  const noiseBuffer = createPinkNoiseBuffer(ctx, 4)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer
  noiseSrc.loop = true

  const hissHp = ctx.createBiquadFilter()
  hissHp.type = "highpass"
  hissHp.frequency.value = 320
  const hissLp = ctx.createBiquadFilter()
  hissLp.type = "lowpass"
  hissLp.frequency.value = 5200
  const hissGain = ctx.createGain()
  hissGain.gain.value = HISS_GAIN

  noiseSrc.connect(hissHp)
  hissHp.connect(hissLp)
  hissLp.connect(hissGain)
  hissGain.connect(master)

  const stopSources: Array<{ stop: () => void }> = [noiseSrc]
  const intervalIds: number[] = [
    scheduleCrackle(ctx, noiseSrc, master),
  ]

  for (let i = 0; i < 2; i++) {
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    src.loop = true
    src.playbackRate.value = 0.97 + i * 0.05
    stopSources.push(src)

    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 520 + i * 380
    bp.Q.value = 1.4

    const chatterGain = ctx.createGain()
    chatterGain.gain.value = 0

    src.connect(bp)
    bp.connect(chatterGain)
    chatterGain.connect(master)

    intervalIds.push(scheduleDistantChatter(ctx, chatterGain, bp))
    src.start()
  }

  const rumbleOsc = ctx.createOscillator()
  rumbleOsc.type = "sine"
  rumbleOsc.frequency.value = 58
  const rumbleGain = ctx.createGain()
  rumbleGain.gain.value = 0.012
  rumbleOsc.connect(rumbleGain)
  rumbleGain.connect(master)
  rumbleOsc.start()

  const heterodyne = ctx.createOscillator()
  heterodyne.type = "sine"
  heterodyne.frequency.value = 741
  const hetGain = ctx.createGain()
  hetGain.gain.value = 0.006
  heterodyne.connect(hetGain)
  hetGain.connect(master)
  heterodyne.start()

  stopSources.push(rumbleOsc, heterodyne)
  noiseSrc.start()

  return { master, intervalIds, stopSources }
}

/**
 * Cold-war style bed: pink/static hiss, muffled radio chatter, crackle, faint heterodyne tone.
 * Starts only after a user gesture; stops on toggle off or unmount.
 */
export function HeaderDummyAudioToggle() {
  const [on, setOn] = useState(false)
  const graphRef = useRef<AudioGraph | null>(null)

  const stop = useCallback(() => {
    const g = graphRef.current
    if (!g) return
    for (const id of g.intervalIds) window.clearInterval(id)
    if (g.onVisibility) {
      document.removeEventListener("visibilitychange", g.onVisibility)
    }
    for (const source of g.stopSources) {
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
    }
    try {
      g.master.disconnect()
      void g.ctx.close()
    } catch {
      /* already closed */
    }
    graphRef.current = null
  }, [])

  const start = useCallback(async () => {
    stop()
    const ctx = new AudioContext()
    const { master, intervalIds, stopSources } = buildColdWarAmbient(ctx)
    await attachDistantRadioVoices(ctx, master, stopSources, intervalIds)

    const t = ctx.currentTime
    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(MASTER_OUTPUT, t + 0.35)

    const onVisibility = () => {
      void ensureContextRunning(ctx)
    }
    document.addEventListener("visibilitychange", onVisibility)

    graphRef.current = { ctx, master, intervalIds, stopSources, onVisibility }
    await ensureContextRunning(ctx)
  }, [stop])

  useEffect(() => () => stop(), [stop])

  const toggle = async () => {
    if (on) {
      stop()
      setOn(false)
      return
    }
    try {
      await start()
      setOn(true)
    } catch {
      stop()
      setOn(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={toggle}
      aria-label={on ? "Turn ambient sound off" : "Turn ambient sound on"}
      aria-pressed={on}
    >
      {on ? (
        <Volume2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <VolumeX className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </Button>
  )
}
