import type { NextPageContext } from "next"

type ErrorPageProps = {
  statusCode: number
}

export default function NerrawavePagesError({ statusCode }: ErrorPageProps) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.55 }}>
        Error {statusCode || 500}
      </p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 500, marginTop: "1rem" }}>Something went wrong.</h1>
      <p style={{ marginTop: "1rem", maxWidth: "22rem", opacity: 0.75, lineHeight: 1.6 }}>
        Stop the dev server, delete the <code>.next</code> folder in <code>web</code>, then run{" "}
        <code>npm run dev:clean</code> or double-click <code>start-dev.cmd</code>.
      </p>
      <a href="/" style={{ marginTop: "1.5rem", color: "inherit" }}>
        Back to homepage
      </a>
    </div>
  )
}

NerrawavePagesError.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}
