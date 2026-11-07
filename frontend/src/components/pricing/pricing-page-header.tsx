import { cn } from "@/lib/utils"

export const pricingEyebrowClassName =
  "text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground"

export function PricingPageHeader({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <header className={cn("space-y-4", className)}>
      <p className={pricingEyebrowClassName}>{eyebrow}</p>
      <h1 className="font-sentient-regular text-[1.75rem] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[2.125rem] lg:text-[1.875rem] lg:leading-[1.12]">
        {title}
      </h1>
    </header>
  )
}
