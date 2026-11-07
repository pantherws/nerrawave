"use client"

import { useMemo, useState } from "react"
import { useAppShellAuth } from "@/components/app-shell"
import { useMockAuth } from "@/components/mock-auth-provider"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"
import { PricingIntro } from "@/components/pricing/pricing-intro"
import { PricingPageHeader } from "@/components/pricing/pricing-page-header"
import { PricingTierGrid } from "@/components/pricing/pricing-tier-grid"
import { Button } from "@/components/ui/button"
import { getPricingTier } from "@/lib/pricing"

export function BillingPageContent() {
  const { user } = useMockAuth()
  const { openAuth } = useAppShellAuth()
  const [minutes, setMinutes] = useState(1)

  const activeTierLabel = useMemo(() => getPricingTier(minutes).label, [minutes])

  return (
    <article className="mx-auto w-full max-w-[42rem] px-4 py-10 sm:px-6 sm:py-12 lg:py-10">
      <div className="mb-6 space-y-4 sm:mb-8">
        <PricingPageHeader eyebrow="Buy Nerrawave credits" title="Buy credits" />
        <PricingIntro />
      </div>

      <div className="space-y-5 sm:space-y-6">
        {user ? (
          <div className="about-solid-panel grid gap-4 rounded-lg border border-border/70 px-4 py-4 text-[13px] sm:grid-cols-3 sm:px-5 sm:py-5 sm:text-[14px]">
            <div>
              <p className="text-muted-foreground">Free minutes left</p>
              <p className="mt-0.5 font-medium tabular-nums text-foreground">
                {user.freeMinutesRemaining}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Paid credits</p>
              <p className="mt-0.5 font-medium tabular-nums text-foreground">{user.credits}</p>
            </div>
            <div className="min-w-0 sm:col-span-1">
              <p className="text-muted-foreground">Account</p>
              <p className="mt-0.5 truncate font-medium text-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="about-solid-panel rounded-lg border border-border/70 px-4 py-4 text-[13px] leading-[1.75] text-foreground/80 sm:px-5 sm:text-[14px]">
            <p>
              Log in to view your balance and complete a purchase.{" "}
              <button
                type="button"
                onClick={openAuth}
                className="text-foreground underline underline-offset-4 hover:text-foreground/90"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        <PricingCalculator minutes={minutes} onMinutesChange={setMinutes} sliderId="buy-credits-minutes" />

        <Button
          type="button"
          className="w-full rounded-full sm:w-auto"
          onClick={() => {
            if (!user) {
              openAuth()
              return
            }
            alert("Mock checkout — Stripe integration coming soon.")
          }}
        >
          Buy credits now
        </Button>

        <PricingTierGrid activeTierLabel={activeTierLabel} />
      </div>
    </article>
  )
}
