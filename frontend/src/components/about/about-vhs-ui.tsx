import { cn } from "@/lib/utils"

export function AboutVhsScanline() {
  return (
    <div
      className="about-vhs-scanline pointer-events-none my-8 h-px w-full opacity-70"
      aria-hidden
    />
  )
}

export function AboutVhsTimecode({ label = "REC ● SP-01" }: { label?: string }) {
  return (
    <div
      className="about-vhs-timecode my-6 flex items-center justify-between gap-4 border border-foreground/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55"
      aria-hidden
    >
      <span>{label}</span>
      <span className="text-foreground/35">00:00:00:00</span>
      <span className="text-foreground/40">TC</span>
    </div>
  )
}

export function AboutVhsWaveform({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 48"
      className={cn("my-6 w-full max-w-md text-foreground/50", className)}
      aria-hidden
    >
      {Array.from({ length: 80 }, (_, i) => {
        const h = 8 + Math.abs(Math.sin(i * 0.55) * 18) + (i % 7) * 1.5
        return (
          <rect
            key={i}
            x={i * 4}
            y={24 - h / 2}
            width={2}
            height={h}
            fill="currentColor"
            opacity={0.35 + (i % 5) * 0.08}
          />
        )
      })}
    </svg>
  )
}

export function AboutVhsCassetteSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      className={cn("mx-auto my-8 h-16 w-auto text-foreground/40", className)}
      aria-hidden
    >
      <rect x="4" y="8" width="112" height="56" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="28" y="20" width="64" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="42" cy="36" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="78" cy="36" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="60" y="66" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="monospace">
        TYPE I
      </text>
    </svg>
  )
}

export function AboutLiminalPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <aside
      className={cn(
        "about-liminal-panel relative my-8 border border-foreground/12 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/60",
        className,
      )}
    >
      {children}
    </aside>
  )
}

export function AboutPullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="about-pullquote my-8 border-l-2 border-foreground/25 py-1 pl-5 text-pretty text-[1.05rem] font-medium leading-[1.5] text-foreground sm:text-[1.15rem]">
      {children}
    </blockquote>
  )
}
