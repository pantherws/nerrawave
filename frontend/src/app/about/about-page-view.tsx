"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ThreePillarsMotif } from "@/components/about-motifs"
import { AboutHeroCover } from "@/components/about/about-hero-cover"
import { AboutKeyFacts } from "@/components/about/about-key-facts"
import { AboutWorkflowTabs } from "@/components/about/about-workflow-tabs"
import { EditorialReadingProgress } from "@/components/editorial/editorial-reading-progress"
import { AboutHeroShare } from "@/components/about/about-hero-share"
import { BlogEditorialFigure } from "@/components/blog/blog-editorial-figures"
import { useActiveSection } from "@/hooks/use-active-section"
import { BackToTopButton } from "@/components/back-to-top-button"
import { cn } from "@/lib/utils"

const SHARE_TITLE = "What is Nerrawave? — AI transcription for interviews and research"

const EDITORIAL_BOX =
  "about-solid-panel rounded-lg border border-border/70 transition-colors hover:border-foreground/30"

/** Same 3-column shell as blog (TOC | 42rem article | spacer) — no sticky share column */
const ABOUT_GRID =
  "mx-auto grid w-full max-w-[72rem] grid-cols-1 gap-x-12 px-4 sm:px-6 lg:grid-cols-[11rem_minmax(0,42rem)_minmax(0,1fr)] lg:gap-x-16 xl:grid-cols-[minmax(0,1fr)_42rem_minmax(0,1fr)] xl:gap-x-20"

const ABOUT_ARTICLE_COL =
  "min-w-0 lg:col-start-2 lg:max-w-[42rem] xl:col-start-2 xl:w-full xl:max-w-[42rem]"

const ABOUT_SIDEBAR_COL = "hidden lg:col-start-1 lg:block lg:-translate-x-3 xl:-translate-x-4"

const ABOUT_RAIL_COL = "hidden lg:col-start-3 lg:block"

const ABOUT_SECTIONS = [
  { id: "what-nerrawave-does", title: "What Nerrawave does" },
  { id: "how-it-works", title: "How Nerrawave works" },
  { id: "what-makes-different", title: "What makes Nerrawave different" },
  { id: "why-exists", title: "Why Nerrawave exists" },
  { id: "who-uses", title: "Who uses Nerrawave" },
  { id: "built-for-recordings", title: "Built for long-form recordings" },
  { id: "why-teams-use", title: "Why teams use Nerrawave" },
  { id: "testimonials", title: "What users say" },
  { id: "team", title: "The team behind Nerrawave" },
  { id: "standard", title: "The standard for interview transcription" },
  { id: "key-facts", title: "Key facts about Nerrawave" },
  { id: "closing", title: "From recording to transcript" },
] as const

/** Contents rail — last section stays in-page but is omitted from the sticky list */
const ABOUT_TOC_SECTIONS = ABOUT_SECTIONS.slice(0, -1)

function Ext({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4 hover:text-foreground"
    >
      {children}
    </a>
  )
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 pt-8 font-sentient-regular text-[27px] font-normal leading-[1.12] tracking-[-0.02em] text-foreground first:pt-4 sm:text-[33px]"
    >
      {children}
    </h2>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-4 font-medium text-[13px] uppercase tracking-[0.16em] text-foreground/75">
      {children}
    </h3>
  )
}

function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-pretty text-[15px] leading-[1.9] text-foreground/88", className)}>
      {children}
    </p>
  )
}

const USER_TYPES = [
  {
    title: "Market and UX researchers",
    body: "Turning focus groups, IDIs, and usability sessions into searchable transcripts you can code, share, and archive.",
  },
  {
    title: "Journalism and podcasts",
    body: "Getting accurate quotes and episode text without spending hours on manual typing.",
  },
  {
    title: "Corporate and compliance teams",
    body: "Documenting meetings, hearings, and interviews with a clear paper trail tied to the recording.",
  },
  {
    title: "Product and customer research",
    body: "Keeping customer voice feedback in a durable text form the whole team can use.",
  },
  {
    title: "Universities and fieldwork",
    body: "Processing long-form qualitative audio from interviews and ethnography with less admin overhead.",
  },
  {
    title: "Creators and producers",
    body: "Generating subtitles, show notes, and draft copy from the same master recording.",
  },
]

const DIFFERENTIATORS = [
  {
    title: "Duration-based credits",
    body: "Pricing is tied to minutes of audio or video—aligned with how interview and fieldwork actually accumulate.",
  },
  {
    title: "Built for transcripts, not ad hoc chat",
    body: "The workflow centres on uploads, job status, and a durable transcript you can return to—not one-off prompts that disappear.",
  },
  {
    title: "Quality signals you can see",
    body: "Where supported, speaker separation and language detection help you navigate long recordings without scrubbing blindly.",
  },
  {
    title: "Optional analysis on top",
    body: "Structured AI output can sit on top of the transcript when you need themes, summaries, or quotes—without replacing the verbatim record.",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "We went from shipping transcripts late to having something our analysts could search the same day. The per-minute pricing made it easy to forecast fieldwork costs.",
    cite: "Research lead, insights agency",
    label: "Market research",
  },
  {
    quote:
      "I stopped paying for manual typing on long interviews. The transcript is not perfect every time, but it is good enough to code against and faster than our old process.",
    cite: "Independent researcher",
    label: "Qualitative research",
  },
  {
    quote:
      "Our newsroom needed verbatim quotes, not summaries. Uploading batches and getting text back in one place replaced a mess of voice memos and scattered notes.",
    cite: "Desk editor",
    label: "Editorial",
  },
]

const BENEFITS = [
  "fast turnaround on long audio and video",
  "minute-based pricing you can budget against",
  "searchable transcripts tied to each job",
  "workflow built around uploads and tasks",
  "speaker separation where supported",
  "optional AI summaries and themes on top of verbatim text",
  "fewer manual typing handoffs",
  "exports suitable for analysis and archival",
  "one place to track credits and history",
]

export function AboutPageView() {
  const sectionIds = useMemo(() => ABOUT_SECTIONS.map((section) => section.id), [])
  const activeSection = useActiveSection(sectionIds)

  return (
    <article className="blog-longform relative pb-20">
      <EditorialReadingProgress />

      <div className="blog-longform__hero border-b border-border/60">
        <div className={ABOUT_GRID}>
          <div className={ABOUT_SIDEBAR_COL} aria-hidden />
          <div className={cn(ABOUT_ARTICLE_COL, "pb-10 pt-10 sm:pb-12 sm:pt-14")}>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              About Nerrawave
            </p>
            <h1 className="font-sentient-regular text-pretty text-[2rem] font-normal leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.75rem] lg:text-[3.25rem]">
              What is Nerrawave?
            </h1>
            <p className="blog-longform__lede mt-6 text-pretty font-sentient-regular text-[1.2rem] leading-[1.45] tracking-[-0.02em] text-foreground sm:text-[1.35rem]">
              Nerrawave is an AI speech-to-text platform for interviews and long-form recordings. Upload
              audio or video, and receive transcripts you can search, quote from, and analyse—with
              minute-based pricing that matches how research work is actually billed.
            </p>
            <div className="mt-8">
              <AboutHeroCover />
              <AboutHeroShare shareTitle={SHARE_TITLE} />
            </div>
          </div>
          <div className={ABOUT_RAIL_COL} aria-hidden />
        </div>
      </div>

      <div className={ABOUT_GRID}>
        <aside className={ABOUT_SIDEBAR_COL}>
          <nav
            className="sticky top-24 space-y-1 border-l border-transparent py-16"
            aria-label="On this page"
          >
            <p className="mb-4 pl-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Contents
            </p>
            {ABOUT_TOC_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "block border-l py-1.5 pl-4 text-[12px] leading-snug transition-colors",
                  activeSection === section.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/80",
                )}
              >
                {section.title}
              </a>
            ))}
            <span
              className="invisible block border-l border-transparent py-1.5 pl-4 text-[12px] leading-snug"
              aria-hidden
            >
              {ABOUT_SECTIONS[ABOUT_SECTIONS.length - 1].title}
            </span>
          </nav>
        </aside>

        <div className={cn(ABOUT_ARTICLE_COL, "space-y-6 py-12 sm:space-y-7 sm:py-16")}>
          <Prose>
            Nerrawave exists because recorded conversations are not useful until they are text. The hard
            part is not hearing the interview again. It is finding the right passage, comparing answers,
            turning speech into structure, and sharing a durable version of what was said.
          </Prose>
          <Prose>
            That means getting three things right:{" "}
            <strong className="font-medium text-foreground">ingest</strong>,{" "}
            <strong className="font-medium text-foreground">transcribe</strong>, and{" "}
            <strong className="font-medium text-foreground">deliver</strong>.
          </Prose>
          <ThreePillarsMotif />
          <Prose>
            Nerrawave combines automated speech recognition with safeguards and optional AI analysis so you
            get a transcript that behaves like source material, not a disposable chat reply.
          </Prose>
          <Prose>Upload a file. Run a job. Receive text you can work with.</Prose>

          <SectionTitle id="what-nerrawave-does">What Nerrawave does</SectionTitle>

          <SubTitle>Speech-to-text for real interviews</SubTitle>
          <Prose>
            Upload pre-recorded audio or video in common formats. Nerrawave converts speech into time-aware
            text while preserving enough structure to navigate long sessions.
          </Prose>
          <Prose>
            Where the pipeline supports it, diarisation separates speakers so you can follow who said what
            without endless rewinding.
          </Prose>

          <SubTitle>Review where it matters</SubTitle>
          <Prose>
            Automated transcription is fast, but it is not infallible. Nerrawave is designed so teams can
            spot-check names, technical terms, and legally sensitive lines against the recording.
          </Prose>

          <SubTitle>Optional insight on top of the transcript</SubTitle>
          <Prose>
            When you need more than raw text, optional AI features can highlight themes, pull candidate
            quotes, or draft summaries—always grounded in the transcript rather than replacing it.
          </Prose>

          <figure className="blog-longform__pullquote relative my-4 py-2">
            <blockquote className="font-sentient-regular text-pretty text-[1.375rem] leading-[1.35] tracking-[-0.015em] text-foreground sm:text-[1.625rem]">
              The recording stays the source of truth. The transcript makes it usable.
            </blockquote>
          </figure>

          <SectionTitle id="how-it-works">How Nerrawave works</SectionTitle>
          <SubTitle>From upload to exported text</SubTitle>
          <Prose>
            The flow is intentionally linear so project managers can track fieldwork the same way they track
            other deliverables.
          </Prose>
          <AboutWorkflowTabs />
          <figure className="my-4 space-y-3">
            <BlogEditorialFigure variant="workflow" workflowDotsRed className="w-full" />
            <figcaption className="text-[12px] leading-relaxed text-muted-foreground">
              Ingest, transcribe, review, and export as one continuous job—not a chain of desktop tools.
            </figcaption>
          </figure>

          <SectionTitle id="what-makes-different">What makes Nerrawave different</SectionTitle>
          <Prose>
            General AI chat tools can paraphrase audio if you paste a transcript. Dedicated speech APIs can
            return raw text. Spreadsheets can tally minutes.
          </Prose>
          <Prose className="font-medium text-foreground">
            Nerrawave combines those concerns into a product workflow.
          </Prose>
          <div className="grid gap-3 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item) => (
              <div key={item.title} className={cn(EDITORIAL_BOX, "px-4 py-4 sm:px-5")}>
                <p className="mb-2 text-[13px] font-medium leading-snug text-foreground">{item.title}</p>
                <p className="text-[13px] leading-relaxed text-foreground/75">{item.body}</p>
              </div>
            ))}
          </div>
          <div className={cn(EDITORIAL_BOX, "px-5 py-4")}>
            <p className="text-[13px] font-medium text-foreground">Built for fieldwork economics</p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/80">
              Research budgets think in hours of audio, not pages of PDFs. Per-minute credits let you model
              spend before the recorder ever starts.
            </p>
          </div>

          <SectionTitle id="why-exists">Why Nerrawave exists</SectionTitle>
          <Prose>
            Even with better models, the bottleneck for qualitative teams is still turning sound into
            workable text on deadline.
          </Prose>
          <Prose>
            Spreadsheets, manual typists, and single-purpose APIs each solve a slice of that problem.
            Nerrawave exists to connect ingestion, billing, and delivery so your analysts spend time on
            insight—not logistics.
          </Prose>

          <SectionTitle id="who-uses">Who uses Nerrawave</SectionTitle>
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Typical users include
          </p>
          <ul className="space-y-3">
            {USER_TYPES.map((item) => (
              <li
                key={item.title}
                className={cn(EDITORIAL_BOX, "rounded-md px-4 py-3 text-[14px] leading-relaxed")}
              >
                <strong className="font-medium text-foreground">{item.title}</strong>
                <span className="text-foreground/80"> — {item.body}</span>
              </li>
            ))}
          </ul>
          <Prose>
            Nerrawave can run a single pilot interview or sit behind a standing pipeline of moderated
            sessions.
          </Prose>

          <SectionTitle id="built-for-recordings">Built for long-form recordings</SectionTitle>
          <Prose>
            Short clips are easy. The hard cases are ninety-minute focus groups, noisy venue recordings,
            multi-speaker panels, and back-to-back IDIs across time zones.
          </Prose>
          <Prose>
            Nerrawave keeps those files inside a job model so you always know what ran, what failed, and
            what still needs human ears.
          </Prose>
          <Prose className="font-medium text-foreground">
            That distinction is central to what Nerrawave is.
          </Prose>
          <BlogEditorialFigure variant="layers" className="my-2 w-full" />

          <SectionTitle id="why-teams-use">Why teams use Nerrawave</SectionTitle>
          <Prose>
            The purpose of Nerrawave is not to add another siloed tool. It is to collapse redundant steps
            between capture and analysis.
          </Prose>
          <p className="text-[15px] leading-[1.85] text-foreground/88">The system is designed to provide:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-foreground/35">
            {BENEFITS.map((item, index) => (
              <li key={item} className="pl-1 text-[15px] leading-[1.85] text-foreground/88">
                {item}
                {index < BENEFITS.length - 1 ? ";" : "."}
              </li>
            ))}
          </ul>
          <Prose>
            Human review still matters wherever stakes are high. Nerrawave automates the repeatable part so
            experts spend time on judgment, not retyping.
          </Prose>

          <SectionTitle id="testimonials">What users say</SectionTitle>
          <div className="space-y-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.cite} className={cn(EDITORIAL_BOX, "px-5 py-5 sm:px-6")}>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t.label}
                </p>
                <blockquote className="font-sentient-regular text-pretty text-[1.05rem] leading-[1.45] tracking-[-0.01em] text-foreground sm:text-[1.125rem]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[13px] text-muted-foreground">{t.cite}</figcaption>
              </figure>
            ))}
          </div>

          <SectionTitle id="team">The team behind Nerrawave</SectionTitle>
          <Prose>
            Nerrawave is an independent technology company based in the Western Cape, South Africa, focused
            on practical language infrastructure.
          </Prose>
          <div className={cn(EDITORIAL_BOX, "px-5 py-5 sm:px-6")}>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Industry knowledge
            </p>
            <Prose>
              It was founded by the team behind <Ext href="https://phrase9.com">Phrase9</Ext>, with deep
              experience in professional language services and the operational realities of multilingual
              research and content workflows.
            </Prose>
            <Prose className="mt-4">
              The same team builds{" "}
              <Ext href="https://nerracell.com">Nerracell</Ext>, our sister product for AI document
              translation—so Nerrawave inherits lessons about production-grade text pipelines, not just demos.
            </Prose>
            <dl className="mt-6 space-y-2 text-[14px] leading-relaxed text-foreground/85">
              <div>
                <dt className="font-medium text-foreground">Founder</dt>
                <dd>M. Jonker</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">LinkedIn</dt>
                <dd>
                  <Ext href="https://www.linkedin.com/in/mustafajonker/">linkedin.com/in/mustafajonker</Ext>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Nerrawave on LinkedIn</dt>
                <dd>
                  <Ext href="https://www.linkedin.com/company/108641251/">linkedin.com/company/108641251</Ext>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">X</dt>
                <dd>
                  <Ext href="https://x.com/Nerrawave">x.com/Nerrawave</Ext>
                </dd>
              </div>
            </dl>
          </div>

          <SectionTitle id="standard">The standard for interview transcription</SectionTitle>
          <Prose>Teams should expect the same clarity from transcription software that they expect from modern SaaS.</Prose>
          <Prose>Upload a recording. Track the job. Download the transcript. Pay for the minutes you use.</Prose>
          <Prose>
            Everything between those points—encoding, routing, model selection, retries, and audit-friendly
            status—is the platform&apos;s responsibility.
          </Prose>
          <p className="font-sentient-regular pt-2 text-[1.125rem] leading-snug tracking-[-0.01em] text-foreground sm:text-[1.25rem]">
            Nerrawave. Transcripts you can build on.
          </p>

          <AboutKeyFacts />

          <SectionTitle id="closing">From recording to transcript</SectionTitle>
          <Prose>Fieldwork ends with a file on a disk.</Prose>
          <Prose>Analysis starts when that file becomes text you can search, cite, and share.</Prose>
          <Prose>That is what Nerrawave was built to do.</Prose>
          <div className={cn(EDITORIAL_BOX, "px-6 py-8 text-center")}>
            <p className="font-sentient-regular text-[1.375rem] tracking-tight text-foreground sm:text-[1.5rem]">
              Upload. Transcribe. Analyse.
            </p>
            <p className="mt-6">
              <Link href="/" className="text-[13px] text-muted-foreground underline-offset-4 hover:underline">
                Start on the homepage
              </Link>
            </p>
          </div>
          <footer className="mt-8 space-y-1 border-t border-border/50 pt-6 text-[12px] leading-relaxed text-muted-foreground">
            <p>
              <em className="italic">Nerra</em>: undefined by design
            </p>
            <p>
              <em className="italic">Wave</em>: sound made legible
            </p>
          </footer>
          <BackToTopButton className="mt-8" />
        </div>

        <div className={ABOUT_RAIL_COL} aria-hidden />
      </div>
    </article>
  )
}
