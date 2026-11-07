import type { Metadata } from "next"
import { FaqsPageContent } from "@/components/faqs/faqs-page-content"

export const metadata: Metadata = {
  title: "FAQs — Nerrawave",
  description:
    "Everything you need to know about transcribing interviews and recordings with Nerrawave.",
}

export default function FaqsPage() {
  return <FaqsPageContent />
}
