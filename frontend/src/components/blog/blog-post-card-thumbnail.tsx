import { cn } from "@/lib/utils"

type BlogPostCardThumbnailProps = {
  variant: "ai-document" | "pdf-format"
  className?: string
}

function PendulumHeroStill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "readable-pendulum-stage relative h-full w-full overflow-hidden text-foreground",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" className="h-full w-full" role="presentation">
        <line x1="60" y1="4" x2="78" y2="52" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
        <circle cx="78" cy="52" r="11" fill="#ef4444" />
        <g fill="currentColor" fontSize="7.5" fontWeight="600" letterSpacing="-0.04em">
          <text x="60" y="44" textAnchor="middle">
            THE HARD
          </text>
          <text x="60" y="54" textAnchor="middle">
            PART IS
          </text>
          <text x="62" y="64" textAnchor="middle" transform="rotate(6 62 64)">
            KEEPING
          </text>
          <text x="58" y="74" textAnchor="middle" transform="rotate(-4 58 74)">
            IT
          </text>
          <text x="60" y="84" textAnchor="middle">
            READABLE.
          </text>
        </g>
      </svg>
    </div>
  )
}

function DualBookHeroStill({ className }: { className?: string }) {
  const enLines = ["Same margins.", "Same headings.", "Same table grid.", "Different language."]
  const jaLines = ["同じ余白。", "同じ見出し。", "同じ表組み。", "言語だけ違う。"]

  return (
    <div
      className={cn(
        "readable-pendulum-stage relative flex h-full w-full items-center justify-center gap-1.5 px-1.5 text-foreground",
        className,
      )}
      aria-hidden
    >
      {[enLines, jaLines].map((lines, bookIndex) => (
        <div
          key={bookIndex}
          className="h-[78%] w-[44%] rounded-[2px] border border-foreground/12 bg-background"
        >
          <div className="relative grid h-full grid-cols-2">
            <div className="border-r border-foreground/8 px-1 py-1.5">
              {lines.slice(0, 2).map((line) => (
                <div key={line} className="mb-1 h-[6px]">
                  <div className="mb-0.5 h-[3px] w-full max-w-[95%] rounded-[1px] bg-foreground/[0.07]" />
                  <p
                    className={cn(
                      "truncate text-[4.5px] leading-none text-foreground/85",
                      bookIndex === 1 && "tracking-[0.02em]",
                    )}
                  >
                    {line}
                    {line === lines[3] ? (
                      <span className="ml-px inline-block h-[5px] w-[1px] bg-[#ef4444]" />
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-1 py-1.5">
              {lines.slice(2, 4).map((line) => (
                <div key={line} className="mb-1 h-[6px]">
                  <div className="mb-0.5 h-[3px] w-full max-w-[95%] rounded-[1px] bg-foreground/[0.07]" />
                  <p
                    className={cn(
                      "truncate text-[4.5px] leading-none text-foreground/85",
                      bookIndex === 1 && "tracking-[0.02em]",
                    )}
                  >
                    {line}
                    {line === lines[3] ? (
                      <span className="ml-px inline-block h-[5px] w-[1px] bg-[#ef4444]" />
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BlogPostCardThumbnail({ variant, className }: BlogPostCardThumbnailProps) {
  return (
    <div
      className={cn(
        "aspect-square w-full overflow-hidden rounded-md border border-border/60",
        className,
      )}
    >
      {variant === "pdf-format" ? <PendulumHeroStill /> : <DualBookHeroStill />}
    </div>
  )
}
