"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BackToTopButtonProps = {
  className?: string
}

export function BackToTopButton({ className }: BackToTopButtonProps) {
  return (
    <div className={cn("flex justify-center pt-2 md:hidden", className)}>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-full border-border/80 px-5 text-[13px] font-normal"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
        <ArrowUp className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}
