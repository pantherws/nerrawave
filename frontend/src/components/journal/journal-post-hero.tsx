import { DualBookTranslationAnimation } from "@/components/blog/dual-book-translation-animation"
import { ReadablePendulumAnimation } from "@/components/blog/readable-pendulum-animation"
import { cn } from "@/lib/utils"

type JournalHeroVariant = "ai-document" | "pdf-format"

export function JournalPostHero({ variant }: { variant: JournalHeroVariant }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-lg border border-border/60",
        "readable-pendulum-stage",
      )}
      aria-hidden
    >
      {variant === "ai-document" ? (
        <DualBookTranslationAnimation />
      ) : (
        <ReadablePendulumAnimation layout="hero" />
      )}
    </div>
  )
}
