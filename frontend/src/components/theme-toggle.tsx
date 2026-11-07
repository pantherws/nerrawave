"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeHalfIcon } from "@/components/theme-half-icon"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      disabled={!mounted}
    >
      <ThemeHalfIcon className="h-[18px] w-[18px]" />
    </Button>
  )
}
