import { cn } from "@/lib/utils"

type SidebarToggleIconProps = {
  className?: string
  /** When the sidebar is expanded, show the “collapse” chevron like ChatGPT. */
  expanded?: boolean
}

/** ChatGPT-style sidebar rail: rounded panel split with optional collapse chevron. */
export function SidebarToggleIcon({ className, expanded = false }: SidebarToggleIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <path d="M5.75 2.5v11" />
      {expanded ? (
        <>
          <path d="M8.25 8h3.25" />
          <path d="M9.75 6.5 8.25 8l1.5 1.5" />
        </>
      ) : null}
    </svg>
  )
}
