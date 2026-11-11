"use client"

import type { AboutBlock, AboutSection } from "@/lib/parse-about-markdown"
import { cn } from "@/lib/utils"

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function AboutBlocks({ blocks, className }: { blocks: AboutBlock[]; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={index}
                className="text-pretty text-[15px] leading-[1.88] text-foreground/88"
              >
                {renderInline(block.text)}
              </p>
            )
          case "h3":
            return (
              <h3
                key={index}
                className="pt-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/75"
              >
                {block.text}
              </h3>
            )
          case "ul":
            return (
              <ul key={index} className="list-disc space-y-2 pl-5 marker:text-foreground/35">
                {block.items.map((item) => (
                  <li key={item} className="text-[15px] leading-[1.85] text-foreground/88">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )
          case "table":
            return (
              <div key={index} className="overflow-x-auto">
                <table className="about-facts-table w-full min-w-[28rem] border-collapse text-left text-[13px] leading-relaxed">
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-foreground/10">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "px-2 py-2.5 align-top",
                              ci === 0
                                ? "w-[38%] font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/55"
                                : "text-foreground/85",
                            )}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

export function AboutMarkdownSection({
  section,
  className,
}: {
  section: AboutSection
  className?: string
}) {
  return (
    <section id={section.id} className={cn("scroll-mt-28", className)}>
      <h2 className="pt-8 text-[1.35rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground first:pt-4 sm:text-[1.65rem]">
        {section.title}
      </h2>
      <AboutBlocks blocks={section.blocks} className="mt-4" />
    </section>
  )
}

export function AboutMarkdownIntro({ blocks }: { blocks: AboutBlock[] }) {
  return <AboutBlocks blocks={blocks} />
}
