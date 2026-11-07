/** One credit covers one minute of processed audio or video. */
export const FREE_MINUTES = 30

export const PRICING_TIERS = [
  { minMinutes: 1, maxMinutes: 24, pricePerMinute: 0.25, label: "1–24 min", shortLabel: "1–24" },
  { minMinutes: 25, maxMinutes: 49, pricePerMinute: 0.22, label: "25–49 min", shortLabel: "25–49" },
  { minMinutes: 50, maxMinutes: 74, pricePerMinute: 0.19, label: "50–74 min", shortLabel: "50–74" },
  { minMinutes: 75, maxMinutes: 99, pricePerMinute: 0.17, label: "75–99 min", shortLabel: "75–99" },
  { minMinutes: 100, maxMinutes: null, pricePerMinute: 0.15, label: "100+ min", shortLabel: "100+" },
] as const

export function getPricingTier(minuteCount: number) {
  const tier = PRICING_TIERS.find((t) => {
    if (t.maxMinutes === null) return minuteCount >= t.minMinutes
    return minuteCount >= t.minMinutes && minuteCount <= t.maxMinutes
  })
  return tier ?? PRICING_TIERS[0]
}

export function getPricePerMinute(minuteCount: number): number {
  return getPricingTier(minuteCount).pricePerMinute
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}
