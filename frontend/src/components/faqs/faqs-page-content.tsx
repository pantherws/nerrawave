"use client"

import Link from "next/link"
import { useMemo } from "react"
import { FAQ_PAGE, FAQ_SECTIONS } from "@/lib/faq-content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

const FAQ_PANEL =
  "about-solid-panel scroll-mt-24 rounded-lg border border-border/70 px-4 py-6 sm:px-6 sm:py-8"

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/(Privacy Policy|Terms of Service)/g)

  return (
    <p className="text-pretty text-[13px] leading-[1.75] text-foreground/85">
      {parts.map((part, index) => {
        if (part === "Privacy Policy") {
          return (
            <Link
              key={`privacy-${index}`}
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Privacy Policy
            </Link>
          )
        }
        if (part === "Terms of Service") {
          return (
            <Link
              key={`terms-${index}`}
              href="/terms"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Terms of Service
            </Link>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </p>
  )
}

export function FaqsPageContent() {
  const sectionIds = useMemo(
    () => FAQ_SECTIONS.map((section) => `faq-${section.id}`),
    [],
  )
  const activeSection = useActiveSection(sectionIds)

  return (
    <article className="mx-auto max-w-[42rem] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <header className="mb-8 space-y-5 sm:mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {FAQ_PAGE.kicker}
        </p>
        <h1 className="font-sentient-regular text-pretty text-[2rem] font-normal leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.5rem]">
          {FAQ_PAGE.title}
        </h1>
        <p className="max-w-[38rem] text-pretty text-[15px] leading-[1.85] text-foreground/80 sm:text-[16px]">
          {FAQ_PAGE.description}
        </p>
      </header>

      <nav
        className="mb-8 flex flex-wrap gap-2 sm:mb-10"
        aria-label="FAQ sections"
      >
        {FAQ_SECTIONS.map((section) => {
          const anchor = `faq-${section.id}`
          return (
            <a
              key={section.id}
              href={`#${anchor}`}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] leading-snug transition-colors sm:px-3 sm:py-1.5 sm:text-[11px]",
                activeSection === anchor
                  ? "border-foreground/35 bg-foreground/[0.04] text-foreground"
                  : "border-border/70 text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {section.title}
            </a>
          )
        })}
      </nav>

      <div className="space-y-4 sm:space-y-5">
        {FAQ_SECTIONS.map((section) => (
          <section key={section.id} id={`faq-${section.id}`} className={FAQ_PANEL}>
            <h2 className="mb-4 font-sentient-regular text-[1rem] font-normal leading-snug tracking-[-0.015em] text-foreground sm:text-[1.0625rem]">
              {section.title}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {section.items.map((item, itemIndex) => {
                const value = `${section.id}-${itemIndex}`
                return (
                  <AccordionItem key={value} value={value} className="border-border/50">
                    <AccordionTrigger className="py-3.5 text-left text-[13px] font-medium leading-snug hover:no-underline sm:text-[13px]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-0 text-[13px]">
                      <FaqAnswer text={item.answer} />
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </section>
        ))}
      </div>
    </article>
  )
}
