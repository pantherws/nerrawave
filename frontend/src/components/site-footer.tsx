import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="pointer-events-auto px-4 pb-4 text-center text-xs text-muted-foreground sm:px-6">
      <p>
        Nerrawave turns audio and video into transcripts for research teams. By using it, you agree
        to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </footer>
  )
}
