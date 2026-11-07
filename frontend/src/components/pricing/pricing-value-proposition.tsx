"use client"

import { BadgePercent, Coins, FileStack } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { pricingEyebrowClassName } from "@/components/pricing/pricing-page-header"
import { cn } from "@/lib/utils"

const VALUE_POINTS = [
  {
    icon: BadgePercent,
    title: "25× more affordable than agencies",
    body: "Fast AI transcription without agency overhead or minimum project fees.",
  },
  {
    icon: FileStack,
    title: "Simple per-minute pricing",
    footnote: true,
    body: "Buy credits by the minute of audio or video—not by the word. What you see is what you pay.",
  },
  {
    icon: Coins,
    title: "Pay only when you need to",
    body: "No subscriptions and no lock-in. Top up credits when a project lands, stop when you are done.",
  },
] as const

export function PricingValueProposition({ className }: { className?: string }) {
  return (
    <aside className={cn("w-full max-w-md", className)}>
      <header className="mb-6 space-y-2.5 lg:mb-0 lg:space-y-4">
        <p
          className={cn(
            pricingEyebrowClassName,
            "pointer-events-none invisible select-none max-lg:hidden",
          )}
          aria-hidden
        >
          Nerrawave pricing
        </p>
        <h2 className="font-sentient-regular text-pretty text-[1.5rem] font-normal leading-[1.14] tracking-[-0.02em] sm:text-[1.75rem] lg:text-[1.1875rem] lg:leading-[1.12] lg:whitespace-nowrap">
          Transcription pricing that stays out of your way
        </h2>
        <p className="text-pretty text-[14px] leading-[1.7] text-foreground/75">
          Transparent credits for real recordings—interviews, focus groups, and meetings—not
          open-ended word-count quotes.
        </p>
      </header>

      <TooltipProvider delayDuration={200}>
        <ul className="space-y-[13px] sm:space-y-[15px] lg:mt-8">
          {VALUE_POINTS.map((point) => {
            const Icon = point.icon
            return (
              <li
                key={point.title}
                className="about-solid-panel flex gap-3 rounded-lg border border-border/70 px-4 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/80 text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-[14px] font-medium leading-snug text-foreground">
                    {point.title}
                    {"footnote" in point && point.footnote ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="ml-0.5 inline-flex align-baseline text-[13px] font-medium text-[#ef4444] hover:underline"
                            aria-label="What counts as a minute"
                          >
                            *
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[16rem] border-border/80 px-3 py-2.5 text-[12px] leading-relaxed text-popover-foreground"
                        >
                          A credit covers one minute of processed audio or video. Rounding follows your job
                          summary at checkout.
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </p>
                  <p className="text-pretty text-[13px] leading-[1.65] text-muted-foreground">
                    {point.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </TooltipProvider>
    </aside>
  )
}
