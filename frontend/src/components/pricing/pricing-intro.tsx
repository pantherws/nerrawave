import { FREE_MINUTES } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export function PricingIntro({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <p
        className="about-solid-panel w-fit max-w-full rounded-lg border border-border/70 px-4 py-2.5 text-[13px] font-medium tracking-[0.02em] text-foreground sm:text-[14px]"
        role="note"
      >
        One credit = one minute of audio or video
      </p>
      <p className="text-pretty text-[13px] leading-[1.75] text-foreground/80 sm:text-[14px] lg:hidden">
        No subscriptions required. We do not lock you in to monthly payment plans. Simply pay only
        for what you use. Larger bundles unlock a lower per-credit rate.
      </p>
      <p className="text-pretty text-[13px] leading-[1.75] text-foreground/80 sm:text-[14px] lg:hidden">
        Every new account includes{" "}
        <strong className="font-medium text-foreground">{FREE_MINUTES} free minutes</strong> to try
        Nerrawave. After that, buy credits whenever you need them.
      </p>
      <p className="hidden text-pretty text-[13px] leading-[1.7] text-foreground/80 lg:block">
        Every new account includes{" "}
        <strong className="font-medium text-foreground">{FREE_MINUTES} free minutes</strong> to try
        Nerrawave. Buy credits when you need them; larger bundles unlock a lower per-minute rate.
      </p>
    </div>
  )
}
