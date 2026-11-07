import { ContentPage } from "@/components/content-page"
import { TermsOfServiceContent } from "@/components/legal/terms-of-service-content"

export default function TermsPage() {
  return (
    <ContentPage compactBody title="Terms of Service" description="Last updated: 05/10/2026">
      <TermsOfServiceContent />
    </ContentPage>
  )
}
