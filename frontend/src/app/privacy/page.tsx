import { ContentPage } from "@/components/content-page"
import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content"

export default function PrivacyPage() {
  return (
    <ContentPage compactBody title="Privacy Policy" description="Last updated: 05/10/2026">
      <PrivacyPolicyContent />
    </ContentPage>
  )
}
