"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

const BRAND_LOGO_DARK = "/nerrawave-logo.png"
const BRAND_LOGO_LIGHT = "/nerrawave-logo-light.png"

function useBrandLogoSrc() {
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()
  if (!mounted) {
    return BRAND_LOGO_DARK
  }
  return resolvedTheme === "dark" ? BRAND_LOGO_DARK : BRAND_LOGO_LIGHT
}

interface BrandMarkProps {
  className?: string
  width?: number
  height?: number
  vhsGlitchOnHover?: boolean
}

interface BrandLogoProps extends BrandMarkProps {
  vhsGlitchOnHover?: boolean
}

export function BrandMark({ className, width = 32, height = 32, vhsGlitchOnHover }: BrandMarkProps) {
  const mounted = useMounted()
  const src = useBrandLogoSrc()

  if (!mounted) {
    return <span className={cn("inline-block h-8 w-8", className)} aria-hidden="true" />
  }

  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={cn("brand-mark-img h-8 w-auto", vhsGlitchOnHover && "brand-logo-vhs__img", className)}
      priority
    />
  )
}

export function BrandLogo({ className, width = 32, height = 32, vhsGlitchOnHover }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Nerrawave home"
      className={cn("group inline-flex shrink-0 rounded-md", className)}
    >
      <span
        className={cn(
          "relative inline-flex items-center justify-center",
          vhsGlitchOnHover && "brand-logo-vhs",
        )}
      >
        <BrandMark width={width} height={height} vhsGlitchOnHover={vhsGlitchOnHover} />
        {vhsGlitchOnHover ? (
          <>
            <span className="brand-logo-vhs__rgb brand-logo-vhs__rgb--a" aria-hidden />
            <span className="brand-logo-vhs__rgb brand-logo-vhs__rgb--b" aria-hidden />
            <span className="brand-logo-vhs__scan" aria-hidden />
          </>
        ) : null}
      </span>
    </Link>
  )
}
