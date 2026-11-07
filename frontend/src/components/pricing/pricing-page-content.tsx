"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppShellAuth } from "@/components/app-shell"
import { useMockAuth } from "@/components/mock-auth-provider"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"
import { PricingIntro } from "@/components/pricing/pricing-intro"
import { PricingPageHeader } from "@/components/pricing/pricing-page-header"
import { PricingTierGrid } from "@/components/pricing/pricing-tier-grid"
import { PricingValueProposition } from "@/components/pricing/pricing-value-proposition"
import { Button } from "@/components/ui/button"
import { getPricingTier } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export function PricingPageContent() {
  const router = useRouter()
  const { user } = useMockAuth()
  const { openAuth } = useAppShellAuth()
  const [minutes, setMinutes] = useState(1)

  const activeTierLabel = useMemo(() => getPricingTier(minutes).label, [minutes])

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10",
        "lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-center lg:px-10 lg:py-6 xl:px-14",
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-10",
          "lg:mx-auto lg:w-fit lg:max-w-full lg:flex-row lg:items-stretch lg:gap-14 xl:gap-20",
        )}
      >
        <article className="flex min-h-0 w-full max-w-md shrink-0 flex-col self-stretch">
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-8 lg:gap-0">
            <div className="space-y-4">
              <PricingPageHeader
                eyebrow="Nerrawave pricing"
                title="Simple pay-as-you-go credits"
              />
              <PricingIntro />
            </div>

            <div className="space-y-5 lg:space-y-6">
              <PricingCalculator
                minutes={minutes}
                onMinutesChange={setMinutes}
                sliderId="pricing-minutes"
                className="lg:mt-8"
              />

              <Button
                type="button"
                className="w-full rounded-full sm:w-auto"
                onClick={() => {
                  if (!user) openAuth()
                  else router.push("/buy-credits")
                }}
              >
                Buy credits now
              </Button>

              <PricingTierGrid activeTierLabel={activeTierLabel} />
            </div>
          </div>
        </article>

        <div className="flex min-h-0 w-full max-w-md shrink-0 flex-col self-stretch">
          <PricingValueProposition />
        </div>
      </div>
    </div>
  )
}
