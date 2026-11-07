"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
      <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="font-sentient-regular max-w-lg text-pretty text-[1.75rem] font-normal leading-snug tracking-[-0.02em] text-foreground sm:text-[2rem]">
        This page hit an unexpected error.
      </h1>
      <p className="mt-4 max-w-md text-pretty text-[14px] leading-[1.75] text-foreground/72 sm:text-[15px]">
        Try again. If you still see &ldquo;missing required error components&rdquo;, stop every
        terminal running Next.js, then from the <code className="text-foreground/90">web</code> folder
        run <code className="text-foreground/90">npm run dev:clean</code>.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground"
        >
          Back to homepage
        </a>
      </div>
    </div>
  )
}
