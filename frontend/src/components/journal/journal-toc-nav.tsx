"use client"

import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

export type JournalTocSection = { id: string; title: string }

export function JournalTocNav({ sections }: { sections: JournalTocSection[] }) {
  const sectionIds = sections.map((s) => s.id)
  const activeSection = useActiveSection(sectionIds)

  return (
    <nav
      className="sticky top-24 space-y-1 border-l border-transparent py-16"
      aria-label="On this page"
    >
      <p className="mb-4 pl-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Contents
      </p>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block border-l py-1.5 pl-4 text-[12px] leading-snug transition-colors",
            activeSection === section.id
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/80",
          )}
        >
          {section.title}
        </a>
      ))}
    </nav>
  )
}
