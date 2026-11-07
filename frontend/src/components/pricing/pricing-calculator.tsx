import { formatUsd, getPricePerMinute } from "@/lib/pricing"
import { cn } from "@/lib/utils"

type PricingCalculatorProps = {
  minutes: number
  onMinutesChange: (minutes: number) => void
  sliderId?: string
  className?: string
}

export function PricingCalculator({
  minutes,
  onMinutesChange,
  sliderId = "pricing-minutes",
  className,
}: PricingCalculatorProps) {
  const pricePerCredit = getPricePerMinute(minutes)
  const total = minutes * pricePerCredit

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={sliderId}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Select minutes of audio or video
          </label>
          <span className="font-medium tabular-nums text-[15px] text-foreground">
            {minutes}
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={100}
          step={1}
          value={minutes}
          onChange={(event) => onMinutesChange(Number(event.target.value))}
          className="pricing-range w-full"
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={minutes}
        />
        <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>1</span>
          <span>100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px] sm:text-[14px]">
        <div className="flex items-baseline justify-between gap-2 sm:block">
          <span className="text-muted-foreground">Price per credit:</span>
          <span className="font-medium tabular-nums text-foreground sm:mt-0.5 sm:block">
            {formatUsd(pricePerCredit)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2 sm:block">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium tabular-nums text-foreground sm:mt-0.5 sm:block">
            {formatUsd(total)}
          </span>
        </div>
      </div>
    </div>
  )
}
