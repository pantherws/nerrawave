import { cn } from "@/lib/utils"

export function BlogEditorialFigure({
  variant,
  className,
  workflowDotsRed = false,
}: {
  variant: "workflow" | "layers" | "comparison" | "typography"
  className?: string
  /** Inner workflow node dots (About page). */
  workflowDotsRed?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-muted/30 via-background to-muted/20",
        "dark:from-muted/15 dark:via-background dark:to-muted/10",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(0_0_0/0.04),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(255_255_255/0.06),transparent)]" />

      {variant === "workflow" ? <WorkflowArt dotsRed={workflowDotsRed} /> : null}
      {variant === "layers" ? <LayersArt /> : null}
      {variant === "comparison" ? <ComparisonArt /> : null}
      {variant === "typography" ? <TypographyArt /> : null}
    </div>
  )
}

function WorkflowArt({ dotsRed = false }: { dotsRed?: boolean }) {
  const nodes = ["Upload", "Transcribe", "Review", "Export"]
  const dotFill = dotsRed ? "#ef4444" : "currentColor"
  const dotFillOpacity = dotsRed ? 1 : 0.55

  return (
    <svg viewBox="0 0 400 220" className="h-full w-full min-h-[12rem] sm:min-h-[14rem]">
      <defs>
        <linearGradient id="wf-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <line x1="48" y1="110" x2="352" y2="110" stroke="url(#wf-line)" strokeWidth="1.5" className="text-foreground" />
      {nodes.map((label, i) => {
        const cx = 40 + (i * 320) / (nodes.length - 1)
        return (
          <g key={label}>
            <circle cx={cx} cy={110} r="14" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" className="text-foreground" />
            <circle
              cx={cx}
              cy={110}
              r="4"
              fill={dotFill}
              fillOpacity={dotFillOpacity}
              className={dotsRed ? undefined : "text-foreground"}
            />
            <text x={cx} y={148} textAnchor="middle" className="fill-foreground/50 text-[9px] uppercase tracking-[0.18em]" style={{ fontFamily: "system-ui" }}>
              {label}
            </text>
          </g>
        )
      })}
      <path d="M 80 60 Q 200 20 320 60" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" className="text-foreground" />
      <path d="M 80 160 Q 200 200 320 160" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" className="text-foreground" />
    </svg>
  )
}

function LayersArt() {
  return (
    <div className="flex min-h-[11rem] flex-col justify-center gap-3 p-6 sm:min-h-[13rem] sm:p-10">
      {["Audio", "Speakers", "Transcript"].map((layer, i) => (
        <div
          key={layer}
          className="relative h-12 rounded-md border border-foreground/10 bg-background/80 shadow-sm backdrop-blur-sm sm:h-14"
          style={{ marginLeft: `${i * 1.25}rem`, width: `calc(100% - ${i * 1.25}rem)` }}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {layer}
          </span>
          <div className="absolute inset-y-3 right-4 left-[7.5rem] rounded-sm bg-foreground/[0.04]" />
        </div>
      ))}
    </div>
  )
}

function ComparisonArt() {
  return (
    <div className="grid min-h-[13rem] grid-cols-2 gap-px bg-border/60 p-px sm:min-h-[15rem]">
      {["Source", "Target"].map((side) => (
        <div key={side} className="flex flex-col bg-background/90 p-4 sm:p-6">
          <span className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{side}</span>
          <div className="mb-2 h-2 w-2/3 rounded-full bg-foreground/15" />
          <div className="mb-4 h-1.5 w-full rounded-full bg-foreground/[0.06]" />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((cell) => (
              <div
                key={cell}
                className={cn(
                  "h-6 rounded-sm border border-foreground/10",
                  cell <= 3 ? "bg-foreground/[0.06]" : "bg-transparent",
                )}
              />
            ))}
          </div>
          <div className="mt-auto space-y-1.5 pt-4">
            <div className="h-1 w-full rounded-full bg-foreground/[0.05]" />
            <div className="h-1 w-5/6 rounded-full bg-foreground/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TypographyArt() {
  const samples = ["Aa", "あ", "أ", "Ж"]
  return (
    <div className="flex min-h-[12rem] items-end justify-around px-6 pb-8 pt-10 sm:min-h-[14rem] sm:px-12">
      {samples.map((sample, i) => (
        <div key={sample} className="flex flex-col items-center gap-3">
          <span className="font-sentient-regular text-[2.5rem] leading-none tracking-tight text-foreground/85 sm:text-[3rem]">
            {sample}
          </span>
          <span className="h-px w-8 bg-foreground/20" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">Script {i + 1}</span>
        </div>
      ))}
    </div>
  )
}
