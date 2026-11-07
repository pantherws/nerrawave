export type FaqItem = {
  question: string
  answer: string
}

export type FaqSection = {
  id: string
  title: string
  items: FaqItem[]
}

export const FAQ_PAGE = {
  kicker: "Support",
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about turning interviews and recordings into accurate transcripts with Nerrawave.",
} as const

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "about-nerrawave",
    title: "About Nerrawave",
    items: [
      {
        question: "What is Nerrawave?",
        answer:
          "Nerrawave is an AI speech-to-text platform for pre-recorded audio and video. Upload a file, and Nerrawave produces a transcript you can search, quote from, and analyse—built for research and interview workflows.",
      },
      {
        question: "Who is Nerrawave for?",
        answer:
          "Market researchers, UX and product teams, journalists, podcasters, legal and compliance teams, and anyone who needs reliable transcripts from recordings without manual typing.",
      },
      {
        question: "How is Nerrawave different from a generic AI chat?",
        answer:
          "Nerrawave is built around long-form audio and video: file upload, duration-based credits, and a task workflow designed for transcripts rather than ad hoc text prompts.",
      },
      {
        question: "Do I need to install anything?",
        answer: "No. Nerrawave runs in your web browser.",
      },
    ],
  },
  {
    id: "transcription",
    title: "Transcription",
    items: [
      {
        question: "Which languages do you support?",
        answer:
          "Supported languages depend on the processing pipeline in your account. The upload flow shows the languages available for a given job.",
      },
      {
        question: "How accurate are the transcripts?",
        answer:
          "Accuracy depends on audio quality, overlapping speech, accents, background noise, and domain vocabulary. Important or high-stakes decisions should always be verified against the recording.",
      },
      {
        question: "Does Nerrawave identify speakers?",
        answer:
          "Where the product supports diarisation, transcripts can separate speakers. Availability is shown in the workflow for your file type and plan.",
      },
      {
        question: "Can Nerrawave summarise or extract key points?",
        answer:
          "Optional AI analysis (for example summaries or thematic extraction) may be offered in addition to the raw transcript. What is available is shown in the product at the time you run a job.",
      },
    ],
  },
  {
    id: "files-and-formats",
    title: "Files and formats",
    items: [
      {
        question: "What file types can I upload?",
        answer:
          "The upload screen lists supported audio and video formats (for example common codecs in MP3, WAV, M4A, MP4, MOV). Maximum file size and duration limits are shown before processing.",
      },
      {
        question: "Can Nerrawave work with poor-quality recordings?",
        answer:
          "It can try, but heavy background noise, very low volume, or overlapping speech reduces accuracy. For best results, use a clear recording close to the microphone where possible.",
      },
      {
        question: "What do I get when the job is done?",
        answer:
          "You receive a transcript tied to your task. Export options available in the product (for example plain text or subtitles) are shown at download time.",
      },
    ],
  },
  {
    id: "pricing-and-credits",
    title: "Pricing and credits",
    items: [
      {
        question: "How much does Nerrawave cost?",
        answer:
          "Nerrawave uses pay-as-you-go pricing measured in minutes of audio or video. Current rates and bundles are shown on the pricing page and at checkout before you purchase credits.",
      },
      {
        question: "What is a credit?",
        answer:
          "A credit typically covers one minute of processed audio or video. The exact definition for your purchase is stated next to the price before you confirm.",
      },
      {
        question: "Do credits expire?",
        answer:
          "Any expiration or policy details are shown when you buy credits and in the Terms of Service.",
      },
      {
        question: "Do I need a subscription?",
        answer: "No subscription is required for standard pay-as-you-go use.",
      },
    ],
  },
  {
    id: "privacy-and-security",
    title: "Privacy and security",
    items: [
      {
        question: "Are my recordings private?",
        answer:
          "Uploaded files are treated as your content and processed to deliver the service, as described in the Privacy Policy. Use Nerrawave only for content you have the right to process.",
      },
      {
        question: "Is my content used to train AI models?",
        answer:
          "How recordings and transcripts are handled—including any use by infrastructure or model providers—is explained in the Privacy Policy.",
      },
      {
        question: "Can I delete my files?",
        answer:
          "Where deletion is available in the product, you can remove content subject to legal or operational retention described in the Privacy Policy.",
      },
    ],
  },
  {
    id: "accounts-and-support",
    title: "Accounts and support",
    items: [
      {
        question: "Do I need an account?",
        answer:
          "Yes, for creating jobs, buying credits, and accessing task history you need a Nerrawave account.",
      },
      {
        question: "What if processing fails?",
        answer:
          "If a technical error prevents completion, credits may be retried or adjusted according to the Terms of Service and what is shown in the product.",
      },
      {
        question: "How do I get help?",
        answer: "Use the contact page or the support channel listed on the website.",
      },
    ],
  },
]
