interface ContentPageProps {
  title: string
  description?: string
  /** Slightly smaller body copy (e.g. legal pages) */
  compactBody?: boolean
  children: React.ReactNode
}

export function ContentPage({
  title,
  description,
  compactBody = false,
  children,
}: ContentPageProps) {
  const bodyCopy = compactBody
    ? "text-pretty text-[14px] leading-[1.8] text-foreground/88"
    : "text-pretty text-[15px] leading-[1.85] text-foreground/88"

  return (
    <article className="mx-auto max-w-[42rem] px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 space-y-5">
        <h1 className="font-sentient-regular text-[1.75rem] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[2.125rem]">
          {title}
        </h1>
        {description ? <p className={bodyCopy}>{description}</p> : null}
      </header>
      <div className={`space-y-5 ${bodyCopy}`}>{children}</div>
    </article>
  )
}
