"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  width?: number
  height?: number
}

export function BrandMark({ className, width = 26, height = 26 }: BrandLogoProps) {
  const { theme } = useTheme()
  const mounted = useMounted()

  const src =
    mounted && theme === "dark" ? "/logo-dark-mode.png" : "/logo-light-mode.png"

  if (!mounted) {
    return <span className={cn("inline-block h-[26px] w-[26px]", className)} aria-hidden="true" />
  }

  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={cn("h-[26px] w-auto", className)}
      priority
    />
  )
}

export function BrandLogo({ className, width = 26, height = 26 }: BrandLogoProps) {
  return (
    <Link href="/" aria-label="Nerrawave home" className={cn("inline-flex shrink-0", className)}>
      <BrandMark width={width} height={height} />
    </Link>
  )
}
