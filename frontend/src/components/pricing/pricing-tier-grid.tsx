import { PRICING_TIERS, formatUsd } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export function PricingTierGrid({ activeTierLabel }: { activeTierLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2">
      {PRICING_TIERS.map((tier) => {
        const isActive = tier.label === activeTierLabel
        return (
          <div
            key={tier.label}
            className={cn(
              "min-w-0 rounded-md border bg-card px-2.5 py-2.5 transition-colors sm:px-3 sm:py-3 lg:px-2 lg:py-2.5",
              isActive
                ? "border-foreground/30 bg-foreground/[0.03]"
                : "border-border/70 hover:border-muted-foreground/45",
            )}
          >
            <p
              className="truncate text-[10px] leading-snug text-muted-foreground sm:text-[11px] lg:whitespace-nowrap lg:text-[10px]"
              title={tier.label}
            >
              <span className="lg:hidden">{tier.label}</span>
              <span className="hidden lg:inline">{tier.shortLabel}</span>
            </p>
            <p className="mt-1 text-[15px] font-semibold tabular-nums leading-none sm:text-base">
              {formatUsd(tier.pricePerMinute)}
            </p>
            <p className="mt-0.5 text-[9px] text-[#ef4444] sm:text-[10px]">per credit</p>
          </div>
        )
      })}
    </div>
  )
}
