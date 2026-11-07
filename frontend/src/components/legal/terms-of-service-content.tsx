import Link from "next/link"
import {
  LegalContactBlock,
  LegalIntro,
  LegalList,
  LegalSection,
  LegalSections,
} from "@/components/legal/legal-prose"

export function TermsOfServiceContent() {
  return (
    <>
      <LegalIntro>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Nerrawave&apos;s
          websites, applications, AI speech-to-text and transcription services, software, artificial
          intelligence features and related services (collectively, the &quot;Services&quot;).
        </p>
        <p>
          The Services are operated by NERRAWAVE PTY., LTD. (&quot;Nerrawave&quot;, &quot;we&quot;, &quot;us&quot; or
          &quot;our&quot;).
        </p>
        <p>
          By accessing or using the Services, creating an account, purchasing credits or submitting audio,
          video or other files for processing, you agree to these Terms.
        </p>
        <p>If you do not agree to these Terms, do not use the Services.</p>
      </LegalIntro>

      <LegalSections>
        <LegalSection title="1. The Services">
          <p>Nerrawave provides automated speech-to-text transcription and related technology.</p>
          <p>Depending on the functionality available at the time, the Services may include:</p>
          <LegalList
            items={[
              "upload and ingest audio and video files;",
              "automatic speech recognition and language detection;",
              "transcript generation with optional timestamps;",
              "speaker separation or diarisation where supported;",
              "quality checks on automated output;",
              "optional AI-assisted summaries or thematic analysis;",
              "transcript export in supported formats;",
              "storage of source media and generated transcripts; and",
              "related tools and functionality.",
            ]}
          />
          <p>Features may be added, modified, restricted or discontinued from time to time.</p>
        </LegalSection>

        <LegalSection title="2. Artificial Intelligence">
          <p>Nerrawave uses artificial intelligence and automated systems.</p>
          <p>
            Artificial intelligence is probabilistic and can produce incorrect, incomplete, inconsistent
            or unexpected results.
          </p>
          <p>
            Accordingly, Nerrawave does not guarantee that any transcript, correction, analysis,
            classification, speaker label, timestamp or other output will be completely accurate, complete
            or suitable for any particular purpose.
          </p>
          <p>
            Automated quality checks are intended to improve transcript usability but do not guarantee the
            detection or correction of every error.
          </p>
          <p>Users are responsible for reviewing outputs to the extent appropriate for their intended use.</p>
        </LegalSection>

        <LegalSection title="3. Transcript Accuracy">
          <p>
            Nerrawave is designed to produce useful automated transcripts, but speech recognition
            inherently involves uncertainty.
          </p>
          <p>
            Audio quality, accents, overlapping speakers, background noise, domain vocabulary and recording
            equipment can all affect results.
          </p>
          <p>
            Nerrawave therefore makes no guarantee that a transcript will be word-perfect, complete or
            identical to a transcript produced by a particular human transcriber.
          </p>
          <p>
            Transcript quality may vary according to language, audio quality, subject matter, speaking pace
            and other factors.
          </p>
        </LegalSection>

        <LegalSection title="4. Timing, Speakers and Structure">
          <p>
            Where the Services provide timestamps, speaker labels or structural segmentation, those
            outputs are generated automatically and may be approximate or incomplete.
          </p>
          <p>
            Media containers, codecs, variable frame rates and unusual export settings may affect how
            duration is measured for billing or display.
          </p>
          <p>
            Nerrawave does not guarantee that every speaker turn, pause or overlap will be represented
            exactly as a human listener would annotate it.
          </p>
          <p>You should review transcripts before relying upon them for decisions that require verbatim accuracy.</p>
        </LegalSection>

        <LegalSection title="5. High-Stakes and Professional Uses">
          <p>
            Nerrawave is an automated technology service and does not provide legal, medical, financial,
            regulatory or other professional advice.
          </p>
          <p>
            Unless expressly agreed otherwise in writing, transcripts are not represented as certified or
            verbatim legal records, court reporter transcripts, or medically or legally verified documents.
          </p>
          <p>
            You should obtain appropriate professional or human review before relying upon transcripts
            where an error could materially affect legal rights, regulatory compliance, medical care,
            personal safety, financial decisions or other significant interests.
          </p>
          <p>You remain responsible for determining whether an output is suitable for your intended purpose.</p>
        </LegalSection>

        <LegalSection title="6. User Accounts">
          <p>Certain features may require an account.</p>
          <p>You agree to provide accurate information and maintain the security of your account.</p>
          <p>
            You are responsible for activity occurring through your account except to the extent
            otherwise required by applicable law.
          </p>
          <p>You must notify us promptly if you become aware of unauthorised access to your account.</p>
          <p>
            We may restrict, suspend or terminate accounts where reasonably necessary to protect the
            Services, enforce these Terms, comply with law or prevent misuse.
          </p>
        </LegalSection>

        <LegalSection title="7. Eligibility">
          <p>
            You may use the Services only if you have legal capacity to enter into a binding agreement
            or are otherwise authorised to use the Services under applicable law.
          </p>
          <p>
            If you use Nerrawave on behalf of a company, organisation or other entity, you represent
            that you have authority to bind that entity to these Terms.
          </p>
          <p>In that case, references to &quot;you&quot; include that entity where appropriate.</p>
        </LegalSection>

        <LegalSection title="8. Your Content">
          <p>
            You retain whatever ownership rights you hold in audio, video, transcripts, accompanying
            metadata, instructions and other material that you submit to the Services (&quot;User
            Content&quot;).
          </p>
          <p>
            Nerrawave does not acquire ownership of User Content merely because it is submitted for
            processing.
          </p>
          <p>
            You grant Nerrawave a limited, worldwide, non-exclusive right to host, copy, transmit,
            process, modify and otherwise use User Content to the extent reasonably necessary to provide,
            secure, maintain and operate the Services and fulfil your requests.
          </p>
          <p>
            This permission lasts only for as long as reasonably necessary for those purposes, subject to
            legitimate retention requirements described in our{" "}
            <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="9. Responsibility for User Content">
          <p>You are solely responsible for User Content that you submit.</p>
          <p>
            You represent and warrant that you have all rights, permissions, consents and lawful bases
            necessary to submit and process User Content through Nerrawave.
          </p>
          <p>You must not submit content where doing so would:</p>
          <LegalList
            items={[
              "violate applicable law;",
              "infringe intellectual-property rights;",
              "breach confidentiality obligations;",
              "violate privacy or data-protection rights;",
              "violate contractual restrictions;",
              "contain unlawful material; or",
              "otherwise expose Nerrawave or another person to unlawful processing or liability.",
            ]}
          />
          <p>
            Nerrawave is not responsible for determining whether you have permission to record, upload or
            transcribe a particular conversation or file.
          </p>
        </LegalSection>

        <LegalSection title="10. Confidential and Personal Information">
          <p>
            You are responsible for deciding whether Nerrawave is appropriate for the information contained
            in your recordings and transcripts.
          </p>
          <p>
            Where recordings contain confidential, personal, special-category, regulated or commercially
            sensitive information, you are responsible for ensuring that use of the Services complies with
            your legal, regulatory, professional and contractual obligations.
          </p>
          <p>
            Information may be processed by third-party infrastructure providers as described in our{" "}
            <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="11. Intellectual Property">
          <p>
            Except for User Content, the Services and their underlying technology, software, designs,
            interfaces, systems, workflows, branding, trademarks, documentation and other materials are
            owned by Nerrawave or its licensors and are protected by applicable intellectual-property
            laws.
          </p>
          <p>These Terms do not transfer ownership of Nerrawave intellectual property to you.</p>
          <p>
            Subject to these Terms, we grant you a limited, revocable, non-exclusive, non-transferable
            right to access and use the Services for their intended purpose.
          </p>
        </LegalSection>

        <LegalSection title="12. Output">
          <p>
            Subject to applicable law and any third-party rights, Nerrawave does not claim ownership over
            transcripts or other outputs generated specifically from your User Content.
          </p>
          <p>
            You are responsible for determining whether you have sufficient rights to use, reproduce,
            publish or distribute any output.
          </p>
          <p>
            Because artificial intelligence systems may generate similar results for different users,
            outputs may not be unique.
          </p>
          <p>
            Nerrawave makes no representation that any output is eligible for copyright or other
            intellectual-property protection.
          </p>
        </LegalSection>

        <LegalSection title="13. Acceptable Use">
          <p>You must not misuse the Services.</p>
          <p>You may not:</p>
          <LegalList
            items={[
              "use the Services unlawfully;",
              "attempt to gain unauthorised access to systems or accounts;",
              "interfere with the operation or security of the Services;",
              "introduce malicious software or code;",
              "circumvent usage, payment, access or security restrictions;",
              "scrape or systematically extract the Services except where expressly permitted;",
              "reverse engineer protected portions of the Services except where such restriction is prohibited by law;",
              "use the Services to infringe another person's rights;",
              "impersonate another person;",
              "use automated methods that place unreasonable loads on the Services; or",
              "use the Services in a manner reasonably likely to damage Nerrawave, its infrastructure, users or service providers.",
            ]}
          />
          <p>We may take reasonable measures to prevent or investigate suspected misuse.</p>
        </LegalSection>

        <LegalSection title="14. Credits, Pricing and Payment">
          <p>
            Nerrawave may charge for Services using credits, usage-based pricing, fixed charges or other
            pricing models displayed at the time of purchase.
          </p>
          <p>Prices and available packages may change prospectively.</p>
          <p>
            The price applicable to a transaction will ordinarily be the price displayed when the
            transaction is initiated, subject to correction of obvious errors and applicable law.
          </p>
          <p>
            Payments may be processed by third-party payment providers and may be subject to their
            terms.
          </p>
          <p>
            Taxes, duties, currency-conversion charges and payment-provider charges may apply where
            relevant.
          </p>
        </LegalSection>

        <LegalSection title="15. Credits">
          <p>
            Where Nerrawave uses prepaid credits, credits represent a contractual right to obtain
            eligible Services subject to these Terms.
          </p>
          <p>Credits:</p>
          <LegalList
            items={[
              "are not currency;",
              "have no cash value except where required by law;",
              "may not be transferred or resold unless expressly permitted;",
              "may be subject to reasonable usage restrictions; and",
              "may be modified, replaced or discontinued subject to applicable law and any rights already acquired by users.",
            ]}
          />
          <p>
            Any expiry rules applicable to purchased credits will be disclosed as required by applicable
            law.
          </p>
          <p>
            Promotional, complimentary, referral or bonus credits may be subject to separate conditions
            and may differ from purchased credits.
          </p>
        </LegalSection>

        <LegalSection title="16. Refunds">
          <p>
            Except where required by applicable law or expressly stated otherwise, purchases are generally
            non-refundable once the relevant processing service has been performed or materially
            commenced.
          </p>
          <p>
            If a technical failure attributable to Nerrawave prevents a purchased service from being
            delivered, we may, as appropriate and subject to applicable law, reprocess the recording,
            restore affected credits, issue replacement credits or provide a refund.
          </p>
          <p>
            Nothing in these Terms limits refund, cancellation or consumer rights that cannot lawfully be
            excluded.
          </p>
        </LegalSection>

        <LegalSection title="17. Processing Estimates">
          <p>
            Any estimated processing time displayed by Nerrawave is an estimate only unless expressly
            stated otherwise.
          </p>
          <p>
            Processing times may vary because of file duration, audio quality, language, demand,
            infrastructure, third-party services and other factors.
          </p>
          <p>
            We do not guarantee completion within a particular period unless expressly agreed in writing.
          </p>
        </LegalSection>

        <LegalSection title="18. Third-Party Services">
          <p>Nerrawave relies on third-party technology and service providers.</p>
          <p>
            These may include providers of artificial intelligence, cloud infrastructure, storage,
            media processing, authentication, payments, communications and other services.
          </p>
          <p>
            We do not control independent third-party services and cannot guarantee their uninterrupted
            availability, security or performance.
          </p>
          <p>
            The Services may be affected by failures, restrictions, changes or outages affecting
            third-party systems.
          </p>
        </LegalSection>

        <LegalSection title="19. Availability and Changes">
          <p>
            We aim to provide reliable Services but do not guarantee uninterrupted, error-free or
            continuous availability.
          </p>
          <p>We may perform maintenance or make changes to the Services.</p>
          <p>
            Features, supported file types, languages, models, processing methods, limits and other
            functionality may change over time.
          </p>
          <p>
            We may discontinue functionality where reasonably necessary for technical, security,
            commercial, legal or operational reasons.
          </p>
        </LegalSection>

        <LegalSection title="20. Beta and Experimental Features">
          <p>
            Certain features may be identified as beta, preview, experimental or similar.
          </p>
          <p>Such features may be incomplete, less reliable or subject to change.</p>
          <p>
            They are provided on an &quot;as available&quot; basis to the fullest extent permitted by law.
          </p>
        </LegalSection>

        <LegalSection title="21. No Warranty">
          <p className="text-[14px] leading-[1.75]">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot;
            AND &quot;AS AVAILABLE&quot; BASIS.
          </p>
          <p className="text-[14px] leading-[1.75]">
            NERRAWAVE DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, COMPLETELY
            SECURE OR SUITABLE FOR EVERY PURPOSE.
          </p>
          <p className="text-[14px] leading-[1.75]">
            TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM WARRANTIES OR REPRESENTATIONS NOT
            EXPRESSLY SET OUT IN THESE TERMS, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
          </p>
          <p>Nothing in this section excludes any warranty or right that cannot lawfully be excluded.</p>
        </LegalSection>

        <LegalSection title="22. Limitation of Liability">
          <p className="text-[14px] leading-[1.75]">
            To the fullest extent permitted by applicable law, Nerrawave and its owners, directors,
            officers, employees, contractors, affiliates, licensors and service providers will not be
            liable for indirect, incidental, special, exemplary, punitive or consequential losses arising
            from or relating to the Services.
          </p>
          <p className="text-[14px] leading-[1.75]">
            This includes, where permitted by law, loss of profits, revenue, business, opportunity,
            goodwill, anticipated savings or data.
          </p>
          <p>Without limiting the foregoing, Nerrawave is not responsible, to the fullest extent permitted by law, for losses arising from:</p>
          <LegalList
            items={[
              "transcription errors or omissions;",
              "misheard or ambiguous speech;",
              "incorrect speaker labels or segmentation;",
              "timestamp drift or rounding differences;",
              "corrupted or unsupported media files;",
              "reliance on transcripts without appropriate human review;",
              "decisions made using automated outputs;",
              "third-party services;",
              "interruptions or outages;",
              "unauthorised account access not caused by Nerrawave's breach of applicable obligations;",
              "loss caused by circumstances outside our reasonable control; or",
              "a user's failure to comply with these Terms.",
            ]}
          />
          <p className="text-[14px] leading-[1.75]">
            To the fullest extent permitted by applicable law, Nerrawave&apos;s aggregate liability arising
            out of or relating to the Services or these Terms will not exceed the greater of:
          </p>
          <p className="text-[14px] leading-[1.75]">
            (a) the amount paid by you to Nerrawave for the specific Service giving rise to the claim
            during the preceding twelve months; or
          </p>
          <p className="text-[14px] leading-[1.75]">
            (b) any minimum amount of liability that applicable law does not permit us to exclude or
            limit.
          </p>
          <p>
            Nothing in these Terms excludes or limits liability where doing so would be prohibited by
            applicable law.
          </p>
        </LegalSection>

        <LegalSection title="23. Indemnity">
          <p>
            To the fullest extent permitted by applicable law, you agree to indemnify and hold harmless
            Nerrawave and its affiliates, officers, directors, employees and contractors from
            third-party claims, damages, liabilities, costs and reasonable legal expenses arising from:
          </p>
          <LegalList
            items={[
              "User Content submitted by you;",
              "your infringement of another person's rights;",
              "your unlawful use of the Services;",
              "your material breach of these Terms; or",
              "your lack of authority or permission to submit information for processing.",
            ]}
          />
          <p>
            This section does not require a consumer to indemnify Nerrawave to an extent prohibited by
            applicable consumer-protection law.
          </p>
        </LegalSection>

        <LegalSection title="24. Suspension and Termination">
          <p>You may stop using the Services at any time.</p>
          <p>We may suspend or terminate access where reasonably necessary because of:</p>
          <LegalList
            items={[
              "breach of these Terms;",
              "suspected fraud or unlawful activity;",
              "security risks;",
              "non-payment;",
              "abuse of the Services;",
              "legal or regulatory requirements;",
              "risks to Nerrawave, users or third parties; or",
              "discontinuation of the Services.",
            ]}
          />
          <p>Where reasonably practicable and legally appropriate, we may provide notice.</p>
          <p>Termination does not affect rights or obligations that by their nature should survive termination.</p>
        </LegalSection>

        <LegalSection title="25. Account and Data Deletion">
          <p>
            Users may request account deletion subject to functionality made available through the
            Services.
          </p>
          <p>
            Deletion may be subject to legal, security, fraud-prevention, financial-recordkeeping and
            legitimate operational retention requirements.
          </p>
          <p>
            Further information regarding data retention and deletion appears in our{" "}
            <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="26. Feedback">
          <p>
            If you provide suggestions, ideas or feedback concerning Nerrawave, you grant us permission
            to use that feedback without restriction or compensation, provided that doing so does not
            grant us ownership of your confidential recordings or User Content.
          </p>
        </LegalSection>

        <LegalSection title="27. Force Majeure">
          <p>
            To the fullest extent permitted by law, Nerrawave will not be responsible for delay or
            failure caused by circumstances reasonably beyond its control, including natural disasters,
            utility failures, internet failures, cyberattacks, governmental action, labour disruption,
            war, civil disturbance, epidemics, infrastructure failures and failures of third-party service
            providers.
          </p>
        </LegalSection>

        <LegalSection title="28. Changes to These Terms">
          <p>We may update these Terms from time to time.</p>
          <p>The updated Terms will display a revised &quot;Last updated&quot; date.</p>
          <p>
            Where required by applicable law, we will provide additional notice of material changes or
            request renewed agreement.
          </p>
          <p>
            Changes will not retroactively remove rights already accrued where doing so would be
            prohibited by law.
          </p>
        </LegalSection>

        <LegalSection title="29. Governing Law">
          <p>
            Except where mandatory consumer or other laws require otherwise, these Terms and disputes
            arising from them are governed by the laws of the Republic of South Africa.
          </p>
          <p>
            Subject to any rights you may have to approach another competent court, tribunal, regulator or
            consumer-protection body, disputes may be brought before a court of competent jurisdiction in
            South Africa.
          </p>
          <p>
            Nothing in these Terms deprives a consumer of protections afforded by mandatory laws
            applicable to that consumer.
          </p>
        </LegalSection>

        <LegalSection title="30. General Provisions">
          <p>
            If any provision of these Terms is held invalid, unlawful or unenforceable, that provision
            will be enforced to the maximum extent permitted and the remaining provisions will remain in
            effect.
          </p>
          <p>Our failure to enforce a provision does not constitute a waiver of that provision.</p>
          <p>
            You may not assign your rights or obligations under these Terms without our consent where
            consent is legally permitted to be required.
          </p>
          <p>
            We may assign or transfer these Terms in connection with a restructuring, merger, acquisition,
            financing, sale of business or assets, or transfer of the Services, subject to applicable
            law.
          </p>
          <p>
            These Terms, together with policies and terms expressly incorporated by reference, constitute
            the agreement between you and Nerrawave concerning the Services.
          </p>
          <p>Headings are provided for convenience and do not affect interpretation.</p>
        </LegalSection>

        <LegalSection title="31. Consumer Rights">
          <p>
            Nothing in these Terms is intended to waive, exclude, restrict or modify any right, remedy,
            guarantee or protection that applicable law does not permit to be waived, excluded,
            restricted or modified.
          </p>
          <p>
            If a provision of these Terms conflicts with a mandatory consumer-protection law applicable
            to you, the mandatory law prevails to the extent of that conflict.
          </p>
        </LegalSection>

        <LegalSection title="32. Contact and Supplier Information">
          <p>The Services are operated by:</p>
          <LegalContactBlock
            lines={[
              "NERRAWAVE PTY., LTD.",
              "Trading as: Nerrawave",
              "Legal form: Limited Liability Company",
              "Registration number:",
              "Country of registration: South Africa",
              "Website: www.nerrawave.com",
            ]}
            email="info@nerrawave.com"
          />
          <p>Additional supplier information will be provided where required by applicable law.</p>
        </LegalSection>
      </LegalSections>
    </>
  )
}
