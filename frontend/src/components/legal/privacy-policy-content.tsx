import {
  LegalContactBlock,
  LegalIntro,
  LegalList,
  LegalSection,
  LegalSections,
} from "@/components/legal/legal-prose"

export function PrivacyPolicyContent() {
  return (
    <>
      <LegalIntro>
        <p>
          This Privacy Policy explains how Nerrawave (&quot;Nerrawave&quot;, &quot;we&quot;, &quot;us&quot; or
          &quot;our&quot;) collects, uses, stores, shares and otherwise processes information when you access
          or use our websites, applications, AI speech-to-text services for audio and video, and related
          services (collectively, the &quot;Services&quot;).
        </p>
        <p>By using the Services, you acknowledge the practices described in this Privacy Policy.</p>
        <p>
          Nerrawave is based in South Africa and processes personal information in accordance with
          applicable data protection and privacy laws, including the Protection of Personal Information
          Act, 2013 (&quot;POPIA&quot;), where applicable. Depending on where you are located, additional
          privacy laws may apply.
        </p>
      </LegalIntro>

      <LegalSections>
        <LegalSection title="1. Information We Collect">
          <p>
            We may collect information that you provide directly to us, information generated through your
            use of the Services, information contained within audio, video or other files that you submit,
            and information received from service providers or other lawful sources.
          </p>
          <p>This may include:</p>
          <LegalList
            items={[
              "your name;",
              "email address;",
              "account and profile information;",
              "authentication information;",
              "billing and transaction information;",
              "communications with us;",
              "language or locale preferences;",
              "job instructions or notes you attach to an upload;",
              "audio, video and related media files that you upload;",
              "transcripts, subtitles, speaker labels and other outputs generated from your uploads;",
              "information contained within recordings (which may identify speakers or third parties);",
              "usage and activity information;",
              "browser, device and operating-system information;",
              "IP address and approximate location derived from it;",
              "cookies and similar technologies;",
              "diagnostic, security and error information; and",
              "other information that you choose to provide.",
            ]}
          />
          <p>
            Payment information may be processed directly by third-party payment providers. Nerrawave may
            receive transaction identifiers, payment status and other information necessary to administer
            purchases without receiving or storing complete payment-card details.
          </p>
        </LegalSection>

        <LegalSection title="2. Recordings and Transcript Content">
          <p>
            Nerrawave processes recordings and associated metadata in order to provide automated speech
            recognition, transcript generation, optional speaker separation, quality checks and related
            functionality.
          </p>
          <p>
            Recordings may contain personal information, confidential information, commercially sensitive
            information or other information relating to the user or third parties who appear in the audio
            or video.
          </p>
          <p>
            You are responsible for ensuring that you have the necessary rights, permissions and lawful
            basis to upload, submit and process any recording or information through Nerrawave.
          </p>
          <p>
            We process submitted content for purposes reasonably necessary to provide, secure, maintain and
            improve the Services, comply with law, prevent abuse and perform other purposes described in
            this Privacy Policy.
          </p>
        </LegalSection>

        <LegalSection title="3. How We Use Information">
          <p>We may use information to:</p>
          <LegalList
            items={[
              "create and administer accounts;",
              "provide transcription and related processing;",
              "generate, store and deliver transcripts and exports;",
              "perform automated quality checks or optional analysis features you enable;",
              "measure audio or video duration for billing and credits;",
              "provide requested features and functionality;",
              "process purchases, credits, refunds and transactions;",
              "authenticate users;",
              "provide customer support;",
              "communicate about accounts, transactions and Services;",
              "detect, investigate and prevent fraud, misuse and security incidents;",
              "diagnose technical problems;",
              "maintain and improve the reliability and performance of the Services;",
              "understand how the Services are used;",
              "develop and improve our products and functionality;",
              "comply with legal and regulatory requirements;",
              "establish, exercise or defend legal rights; and",
              "protect Nerrawave, our users and third parties.",
            ]}
          />
          <p>
            Where required by applicable law, we process personal information on an appropriate legal
            basis, which may include performance of a contract, consent, compliance with legal obligations,
            protection of legitimate interests or another lawful basis.
          </p>
        </LegalSection>

        <LegalSection title="4. Artificial Intelligence and Automated Processing">
          <p>Nerrawave uses artificial intelligence and other automated technologies to provide its Services.</p>
          <p>
            Recordings or derived features may therefore be transmitted to and processed by third-party
            technology providers, including providers of speech recognition models, language detection,
            diarisation, cloud hosting, storage, security and related infrastructure.
          </p>
          <p>
            Such processing may occur automatically and may involve infrastructure located outside your
            country.
          </p>
          <p>
            Where appropriate, Nerrawave uses contractual, technical and organisational measures intended
            to protect information processed through such providers.
          </p>
          <p>Our use of particular providers and technologies may change as the Services develop.</p>
        </LegalSection>

        <LegalSection title="5. Training and Improvement of AI Systems">
          <p>Nerrawave does not claim ownership of the contents of recordings you submit.</p>
          <p>
            Nerrawave&apos;s treatment of user content for model training, product improvement, evaluation
            and related purposes will depend on the relevant feature, service configuration, contractual
            arrangement and third-party provider involved.
          </p>
          <p>
            Where Nerrawave represents that content submitted through a particular service or plan will not
            be used to train artificial intelligence models, we will configure and operate that service
            consistently with that representation, subject to applicable law and circumstances outside our
            reasonable control.
          </p>
          <p>
            We may use aggregated, anonymised or de-identified information that does not reasonably identify
            you or another individual for analytics, security, research, service improvement and product
            development.
          </p>
        </LegalSection>

        <LegalSection title="6. How We Share Information">
          <p>We may disclose information to third parties where reasonably necessary to operate the Services.</p>
          <p>These may include providers of:</p>
          <LegalList
            items={[
              "artificial intelligence and machine-learning services;",
              "speech-to-text and audio processing;",
              "cloud hosting and computing;",
              "storage and databases;",
              "authentication;",
              "payment processing;",
              "communications;",
              "analytics;",
              "security and fraud prevention;",
              "technical infrastructure;",
              "customer support; and",
              "professional services.",
            ]}
          />
          <p>We may also disclose information:</p>
          <LegalList
            items={[
              "where required by law, regulation, court order or lawful governmental request;",
              "to investigate or prevent fraud, security incidents or unlawful activity;",
              "to enforce our agreements or protect our legal rights;",
              "where reasonably necessary to protect users or third parties;",
              "in connection with a merger, financing, acquisition, restructuring, sale of assets or other business transaction; or",
              "with your direction or consent.",
            ]}
          />
          <p>
            We do not sell personal information in the ordinary meaning of selling personal information for
            money.
          </p>
        </LegalSection>

        <LegalSection title="7. International Processing and Transfers">
          <p>
            Nerrawave operates using technology providers and infrastructure that may be located in multiple
            countries.
          </p>
          <p>
            As a result, information may be transferred to, stored in or processed in countries other than
            the country in which you reside.
          </p>
          <p>
            Where applicable law requires safeguards for international transfers of personal information,
            we take reasonable steps intended to use appropriate safeguards or another lawful transfer
            mechanism.
          </p>
          <p>By using an international online service, you acknowledge that processing may involve multiple jurisdictions.</p>
        </LegalSection>

        <LegalSection title="8. Data Security">
          <p>
            We use reasonable technical, organisational and administrative measures intended to protect
            information against unauthorised access, alteration, disclosure, loss, misuse or destruction.
          </p>
          <p>
            However, no internet transmission, computer system, cloud service or storage system can be
            guaranteed to be completely secure.
          </p>
          <p>Accordingly, we cannot guarantee the absolute security of information processed through the Services.</p>
          <p>
            You are responsible for maintaining the confidentiality and security of your account credentials
            and for notifying us promptly if you believe your account has been compromised.
          </p>
        </LegalSection>

        <LegalSection title="9. Data Retention">
          <p>
            We retain personal information and user content only for as long as reasonably necessary for the
            purposes for which it was collected or processed, including providing the Services, maintaining
            records, resolving disputes, preventing fraud, enforcing agreements and complying with legal
            obligations.
          </p>
          <p>Different categories of information may be retained for different periods.</p>
          <p>
            Recordings, transcripts and exports may be deleted automatically after a specified period,
            manually by the user where functionality permits, or in accordance with our operational
            retention procedures.
          </p>
          <p>
            Residual copies may remain temporarily in backups, logs, caches or disaster-recovery systems
            after deletion from active systems.
          </p>
          <p>
            We may retain information where required by law or where reasonably necessary to establish,
            exercise or defend legal claims, investigate misuse, prevent fraud or protect the Services.
          </p>
        </LegalSection>

        <LegalSection title="10. Cookies and Similar Technologies">
          <p>
            We may use cookies, local storage, pixels and similar technologies to operate, secure and
            improve the Services.
          </p>
          <p>
            These technologies may be used for authentication, preferences, security, analytics, performance
            and other legitimate operational purposes.
          </p>
          <p>
            Where required by applicable law, we will request consent before using non-essential cookies or
            similar technologies.
          </p>
          <p>
            Browser settings and any cookie controls made available through the Services may allow you to
            manage certain technologies.
          </p>
        </LegalSection>

        <LegalSection title="11. Analytics">
          <p>
            We may use analytics services to understand how users interact with the Services, identify
            technical issues and improve functionality.
          </p>
          <p>
            Analytics information may include device information, browser information, approximate geographic
            information, pages or features used, timestamps and interaction information.
          </p>
          <p>Where reasonably possible, we seek to minimise the personal information used for analytics.</p>
        </LegalSection>

        <LegalSection title="12. Communications and Marketing">
          <p>
            We may send communications necessary to operate your account or provide the Services, including
            security notices, transaction confirmations and service-related messages.
          </p>
          <p>
            Where permitted by law, we may also send information about Nerrawave products, features or
            services.
          </p>
          <p>
            You may unsubscribe from marketing communications using the method provided in those
            communications. Certain operational or transactional communications cannot be disabled while you
            maintain an account or use the Services.
          </p>
        </LegalSection>

        <LegalSection title="13. Your Privacy Rights">
          <p>
            Depending on your location and applicable law, you may have rights concerning your personal
            information, including rights to:
          </p>
          <LegalList
            items={[
              "request access to personal information;",
              "request correction of inaccurate information;",
              "request deletion in certain circumstances;",
              "object to certain processing;",
              "request restriction of certain processing;",
              "withdraw consent where processing is based on consent;",
              "request information concerning how personal information is processed;",
              "lodge a complaint with an applicable data protection authority; and",
              "exercise other rights provided by applicable law.",
            ]}
          />
          <p>These rights may be subject to exceptions and limitations.</p>
          <p>We may need to verify your identity before fulfilling a request.</p>
        </LegalSection>

        <LegalSection title="14. South African Users">
          <p>
            Where POPIA applies, Nerrawave processes personal information subject to the rights and
            obligations established under POPIA.
          </p>
          <p>
            You may have the right to request access to or correction of personal information and, in
            applicable circumstances, request deletion, object to processing or submit a complaint to the
            Information Regulator of South Africa.
          </p>
          <p>Nothing in this Privacy Policy is intended to limit rights that cannot lawfully be limited.</p>
        </LegalSection>

        <LegalSection title="15. Information Concerning Other People">
          <p>
            Recordings submitted for transcription may contain personal information concerning individuals
            other than the account holder.
          </p>
          <p>
            If you submit such information, you represent that you are authorised or otherwise legally
            permitted to provide and process that information through the Services.
          </p>
          <p>Nerrawave may process such information on your behalf to provide the requested Services.</p>
          <p>
            Where you determine the purposes and means for processing personal information contained within
            submitted recordings, you may be the responsible party, controller or equivalent under applicable
            law, while Nerrawave may act as an operator, processor or service provider as applicable.
          </p>
        </LegalSection>

        <LegalSection title="16. Sensitive Information">
          <p>The Services are capable of processing recordings that include many types of information.</p>
          <p>
            You should consider the sensitivity of information before submitting it and should not upload
            information where doing so would violate applicable law, contractual obligations, confidentiality
            duties or third-party rights.
          </p>
          <p>Certain categories of highly sensitive information may be subject to additional legal requirements.</p>
          <p>
            Nerrawave may restrict or prohibit particular categories of content or processing where reasonably
            necessary for legal, security or operational reasons.
          </p>
        </LegalSection>

        <LegalSection title="17. Children">
          <p>
            The Services are not directed to children and are intended for persons legally capable of entering
            into the applicable agreement for the Services.
          </p>
          <p>
            We do not knowingly seek to collect personal information from children except where permitted by
            applicable law and appropriate authorisation exists.
          </p>
          <p>
            If we become aware that information has been collected in circumstances prohibited by applicable
            law, we may delete or otherwise restrict that information.
          </p>
        </LegalSection>

        <LegalSection title="18. Business Transfers">
          <p>
            If Nerrawave or substantially all or part of its business or assets is acquired, merged,
            reorganised, financed or transferred, information associated with the Services may be transferred
            as part of that transaction, subject to applicable law.
          </p>
          <p>Any successor may assume applicable rights and obligations concerning such information.</p>
        </LegalSection>

        <LegalSection title="19. Third-Party Services and Links">
          <p>The Services may integrate with or contain links to third-party services.</p>
          <p>
            Nerrawave is not responsible for the privacy, security or data practices of independent third
            parties.
          </p>
          <p>Your use of third-party services may be governed by their own privacy policies and terms.</p>
        </LegalSection>

        <LegalSection title="20. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy periodically to reflect changes to the Services, technology,
            law or our business practices.
          </p>
          <p>The updated version will be published with a revised &quot;Last updated&quot; date.</p>
          <p>
            Where required by applicable law, we will provide additional notice or obtain consent for
            material changes.
          </p>
          <p>
            Continued use of the Services following an update constitutes acknowledgement of the revised
            Privacy Policy to the extent permitted by law.
          </p>
        </LegalSection>

        <LegalSection title="21. Contact">
          <p>Questions, requests or concerns regarding privacy or personal information may be directed to:</p>
          <LegalContactBlock
            lines={["Nerrawave", "Operated by: NERRAWAVE PTY., LTD.", "Western Cape, South Africa"]}
            email="info@nerrawave.com"
          />
          <p>
            Where applicable, details of Nerrawave&apos;s Information Officer or other privacy representative
            will be made available as required by law.
          </p>
          <p>Nothing in this Privacy Policy limits any rights available to you under applicable law.</p>
        </LegalSection>
      </LegalSections>
    </>
  )
}
