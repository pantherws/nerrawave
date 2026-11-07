import { Fragment } from "react"

/** Supports **bold** markers inline (no wrapping element) */
export function RichInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}

/** Supports **bold** markers in blog paragraph copy */
export function RichParagraph({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return (
    <p className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </p>
  )
}
