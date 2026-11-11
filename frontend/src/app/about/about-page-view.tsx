"use client"

import Link from "next/link"
import { useMemo } from "react"
import { AboutHeroShare } from "@/components/about/about-hero-share"
import {
  AboutMarkdownIntro,
  AboutMarkdownSection,
} from "@/components/about/about-markdown-body"
import { AboutPullQuote } from "@/components/about/about-vhs-ui"
import {
  AboutHeroSignal,
  AboutSectionInterstitial,
  getAboutInterstitial,
} from "@/components/about/about-vhs-interstitials"
import { EditorialReadingProgress } from "@/components/editorial/editorial-reading-progress"
import { BackToTopButton } from "@/components/back-to-top-button"
import { useActiveSection } from "@/hooks/use-active-section"
import { ABOUT_TOC } from "@/lib/about-toc"
import { parseAboutMarkdown } from "@/lib/parse-about-markdown"
import { cn } from "@/lib/utils"

const SHARE_TITLE = "About Nerrawave | AI Transcription & Research Analysis"

const ABOUT_GRID =
  "mx-auto grid w-full max-w-[72rem] grid-cols-1 gap-x-12 px-4 sm:px-6 lg:grid-cols-[11rem_minmax(0,42rem)_minmax(0,1fr)] lg:gap-x-16 xl:grid-cols-[minmax(0,1fr)_42rem_minmax(0,1fr)] xl:gap-x-20"

const ABOUT_ARTICLE_COL =
  "min-w-0 lg:col-start-2 lg:max-w-[42rem] xl:col-start-2 xl:w-full xl:max-w-[42rem]"

const ABOUT_SIDEBAR_COL = "hidden lg:col-start-1 lg:block lg:-translate-x-3 xl:-translate-x-4"

const ABOUT_RAIL_COL = "hidden lg:col-start-3 lg:block"

interface AboutPageViewProps {
  source: string
}

export function AboutPageView({ source }: AboutPageViewProps) {
  const parsed = useMemo(() => parseAboutMarkdown(source), [source])
  const tocIds = useMemo(() => ABOUT_TOC.map((item) => item.id), [])
  const activeSection = useActiveSection(tocIds)

  return (
    <article className="about-liminal relative pb-20">
      <EditorialReadingProgress />

      <div className="about-liminal__hero border-b border-border/40">
        <div className={ABOUT_GRID}>
          <div className={ABOUT_SIDEBAR_COL} aria-hidden />
          <div className={cn(ABOUT_ARTICLE_COL, "pb-10 pt-10 sm:pb-12 sm:pt-14")}>
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              SP-01 / About
            </p>
            <h1 className="text-pretty text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.6rem] lg:text-[3rem]">
              {parsed.title}
            </h1>
            {parsed.lead ? (
              <p className="mt-6 text-pretty text-[1.05rem] leading-[1.55] text-foreground sm:text-[1.15rem]">
                {parsed.lead}
              </p>
            ) : null}
            <AboutHeroSignal />
            <div className="mt-6">
              <AboutHeroShare shareTitle={SHARE_TITLE} />
            </div>
          </div>
          <div className={ABOUT_RAIL_COL} aria-hidden />
        </div>
      </div>

      <div className={ABOUT_GRID}>
        <aside className={ABOUT_SIDEBAR_COL}>
          <nav
            className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-0.5 overflow-y-auto border-l border-transparent py-16"
            aria-label="On this page"
          >
            <p className="mb-3 pl-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Contents
            </p>
            {ABOUT_TOC.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "block border-l py-1.5 pl-4 font-mono text-[11px] leading-snug tracking-[0.04em] transition-colors",
                  activeSection === section.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/80",
                )}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className={cn(ABOUT_ARTICLE_COL, "space-y-2 py-12 sm:py-16")}>
          <AboutMarkdownIntro blocks={parsed.intro} />

          {parsed.sections.map((section) => {
            const interstitial = getAboutInterstitial(section.id)
            return (
              <div key={section.id}>
                <AboutMarkdownSection section={section} />
                {interstitial ? <AboutSectionInterstitial id={interstitial} /> : null}
                {section.id === "from-recording-to-understanding" ? (
                  <AboutPullQuote>
                    Human judgement determines what the information means.
                  </AboutPullQuote>
                ) : null}
                {section.id === "beyond-transcription" ? (
                  <AboutPullQuote>Nerrawave. Every sound has a story.</AboutPullQuote>
                ) : null}
              </div>
            )
          })}

          <div className="mt-10 border border-foreground/12 px-6 py-8 text-center">
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-foreground">
              Upload · Transcribe · Ask AI
            </p>
            <p className="mt-6">
              <Link href="/" className="text-[13px] text-muted-foreground underline-offset-4 hover:underline">
                Start on the homepage
              </Link>
            </p>
          </div>

          <BackToTopButton className="mt-8" />
        </div>

        <div className={ABOUT_RAIL_COL} aria-hidden />
      </div>
    </article>
  )
}
