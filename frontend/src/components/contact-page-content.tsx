"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import dynamic from "next/dynamic"
import { useMounted } from "@/hooks/use-mounted"
import { useMinLg } from "@/hooks/use-min-lg"
import { cn } from "@/lib/utils"

const HomepageCassette = dynamic(
  () => import("@/components/home/homepage-cassette").then((m) => m.HomepageCassette),
  { ssr: false, loading: () => null },
)

const CONTACT_CASSETTE_MAX = 540
const CONTACT_CASSETTE_SCALE = 0.8
/** Padding inside the left column so the canvas never crosses the grid gap. */
const CONTACT_CASSETTE_COLUMN_INSET = 28

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "business", label: "Business Inquiry" },
  { value: "media", label: "Media Inquiry" },
] as const

export function ContactPageContent() {
  const { theme } = useTheme()
  const mounted = useMounted()
  const isLg = useMinLg()
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const [cassetteSize, setCassetteSize] = useState(0)
  const [subject, setSubject] = useState<string>("")

  const isDarkMode = mounted && theme === "dark"
  const showCassette = mounted && isLg && cassetteSize > 0

  useEffect(() => {
    if (!isLg) {
      setCassetteSize(0)
      return
    }

    const node = leftColumnRef.current
    if (!node) return

    const updateSize = () => {
      const { clientWidth, clientHeight } = node
      const fit = Math.min(
        clientWidth - CONTACT_CASSETTE_COLUMN_INSET,
        clientHeight - CONTACT_CASSETTE_COLUMN_INSET,
        CONTACT_CASSETTE_MAX,
      )
      setCassetteSize(Math.max(0, Math.floor(fit * CONTACT_CASSETTE_SCALE)))
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [isLg, mounted])

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10",
        "lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col lg:py-6 lg:px-10 xl:px-14",
      )}
    >
      <div
        className={cn(
          "grid gap-8",
          "lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-14 lg:overflow-y-hidden xl:gap-20",
        )}
      >
        <div
          ref={leftColumnRef}
          className="hidden min-h-0 min-w-0 items-center justify-center overflow-hidden lg:flex lg:h-full lg:px-2"
        >
          <div className="flex max-h-full max-w-full items-center justify-center">
            {showCassette ? (
              <HomepageCassette size={cassetteSize} isDarkMode={isDarkMode} />
            ) : (
              <div
                style={{ width: cassetteSize || 400, height: cassetteSize || 400 }}
                className="bg-muted/20"
                aria-hidden
              />
            )}
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col justify-start lg:h-full lg:justify-center lg:overflow-y-hidden lg:py-3 lg:pl-6 lg:pr-2 xl:pl-8 xl:pr-4">
          <div className="relative z-0 w-full max-w-md shrink-0 bg-transparent">
            <header className="mb-5 space-y-2.5 lg:mb-3 lg:space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Contact Nerrawave
              </p>
              <h1 className="font-sentient-regular text-[1.75rem] font-normal leading-[1.12] tracking-[-0.02em] sm:text-[2rem]">
                Start a conversation
              </h1>
              <p className="text-pretty text-[15px] leading-[1.75] text-foreground/75 lg:text-[14px] lg:leading-[1.65]">
                Questions, partnerships, or press; send a message and we&apos;ll respond as soon as we
                can.
              </p>
            </header>

            <form
              className="space-y-3.5 lg:space-y-2.5"
              onSubmit={(e) => {
              e.preventDefault()
              if (!subject) return
              alert("Message sent (mock). Backend will handle this later.")
            }}
          >
            <input type="hidden" name="subject" value={subject} readOnly />
            <div className="space-y-1.5 lg:space-y-1">
              <Label htmlFor="contact-name" className="text-[13px] text-foreground/80">
                Name
              </Label>
              <Input id="contact-name" name="name" required autoComplete="name" className="rounded-full" />
            </div>

            <div className="space-y-1.5 lg:space-y-1">
              <Label htmlFor="contact-email" className="text-[13px] text-foreground/80">
                Email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-full"
              />
            </div>

            <div className="space-y-1.5 lg:space-y-1">
              <Label htmlFor="contact-subject" className="text-[13px] text-foreground/80">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="contact-subject" className="rounded-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 lg:space-y-1">
              <Label htmlFor="contact-message" className="text-[13px] text-foreground/80">
                Message
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className="min-h-[7rem] resize-y rounded-2xl lg:min-h-[4.75rem] lg:max-h-[5.5rem] lg:resize-none"
              />
            </div>

            <Button type="submit" className="w-full rounded-full sm:w-auto sm:px-10" disabled={!subject}>
              Send message
            </Button>

            <p className="pt-0.5 text-[12px] leading-snug text-muted-foreground lg:pt-1">
              For support, contact us via the support center in your dashboard.
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
