import Link from "next/link"
import { cn } from "@/lib/utils"

export function LegalIntro({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>
}

export function LegalSections({ children }: { children: React.ReactNode }) {
  return <div className="space-y-10 border-t border-border/60 pt-10">{children}</div>
}

export function LegalSection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="font-sentient-regular text-[1.125rem] font-normal leading-snug tracking-[-0.015em] text-foreground sm:text-[1.25rem]">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-foreground/35">
      {items.map((item) => (
        <li key={item.slice(0, 48)} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function LegalContactBlock({
  lines,
  email,
}: {
  lines: string[]
  email?: string
}) {
  return (
    <address className="space-y-1 not-italic text-[14px] leading-[1.8] text-foreground/88">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
      {email ? (
        <span className="block">
          Email:{" "}
          <Link href={`mailto:${email}`} className="text-foreground underline-offset-4 hover:underline">
            {email}
          </Link>
        </span>
      ) : null}
    </address>
  )
}
