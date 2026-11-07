"use client"

import { useEffect } from "react"
import "./globals.css"

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#fafafa",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: "1.5rem",
          }}
        >
          Application error
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 500, maxWidth: "24rem", lineHeight: 1.35 }}>
          Nerrawave could not load this view.
        </h1>
        <p style={{ marginTop: "1rem", maxWidth: "22rem", fontSize: "15px", opacity: 0.72, lineHeight: 1.65 }}>
          Try again or reload the page. In development, run a clean dev server if this keeps appearing.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "9999px",
              padding: "0.625rem 1.5rem",
              background: "#fafafa",
              color: "#0a0a0a",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "9999px",
              padding: "0.625rem 1.5rem",
              border: "1px solid rgba(250,250,250,0.25)",
              color: "#fafafa",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Homepage
          </a>
        </div>
      </body>
    </html>
  )
}
