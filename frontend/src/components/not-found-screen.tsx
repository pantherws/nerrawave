"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotFoundScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-10">
      <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        Error 404
      </p>

      <h1
        className="font-sentient-regular vhs-glitch vhs-glitch--live text-[clamp(5rem,22vw,9rem)] font-normal leading-none tracking-[-0.04em] text-foreground"
        data-text="404"
      >
        404
      </h1>

      <p className="mt-6 max-w-md text-pretty font-sentient-regular text-[1.25rem] leading-snug tracking-[-0.02em] text-foreground sm:text-[1.375rem]">
        This page is lost in translation.
      </p>
      <p className="mt-3 max-w-sm text-pretty text-[14px] leading-[1.75] text-foreground/72 sm:text-[15px] sm:leading-[1.85]">
        The URL may be mistyped, moved, or removed. Head back to the homepage to upload a document or
        start a new task.
      </p>

      <Button asChild className="mt-8 rounded-full px-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to homepage
        </Link>
      </Button>
    </div>
  )
}
