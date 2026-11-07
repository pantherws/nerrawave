export function ThemeHalfIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3a9 9 0 0 0 0 18V3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
      />
    </svg>
  )
}
