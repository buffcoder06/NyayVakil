// src/app/(marketing)/privacy/page.tsx
// Privacy Policy – NyayVakil
// Server Component

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how NyayVakil collects, uses, and protects your personal data and the data of your legal clients.",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({
  id,
  number,
  children,
}: {
  id: string;
  number: number;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 flex items-baseline gap-3 text-xl font-semibold text-slate-800 scroll-mt-24"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: "#14213D" }}
        aria-hidden="true"
      >
        {number}
      </span>
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 text-slate-600 leading-relaxed text-[15px]">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  const effectiveDate = "1 April 2025";
  const contactEmail = "privacy@nyayvakil.in";

  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#14213D" }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-blue-200 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-blue-200 text-sm">
            Effective date: {effectiveDate}
          </p>
        </div>
      </div>

      {/* ── Placeholder Notice ──────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-amber-800 font-medium">
            <strong>Notice:</strong> This privacy policy is a placeholder and
            should be reviewed by a qualified legal professional before going
            live. It should be updated to reflect your actual data practices,
            infrastructure, and applicable regulations.
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        {/* Intro paragraph */}
        <p className="text-slate-600 leading-relaxed text-[15px] mb-8">
          NyayVakil (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
          committed to protecting the privacy and security of your personal
          information and the confidential data of your clients. This Privacy
          Policy explains what data we collect, how we use it, and the choices
          you have regarding your information.
        </p>

        {/* Table of Contents */}
        <nav
          aria-label="Table of contents"
          className="mb-12 rounded-xl border border-slate-200 bg-slate-50 p-6"
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            On this page
          </h2>
          <ol className="space-y-1.5 text-sm text-slate-600 list-none">
            {[
              ["what-we-collect", "What Data We Collect"],
              ["how-we-use", "How We Use Your Data"],
              ["storage-security", "Data Storage and Security"],
              ["retention", "Data Retention"],
              ["cookies", "Cookies"],
              ["third-party", "Third-Party Services"],
              ["your-rights", "Your Rights"],
              ["childrens", "Children's Privacy"],
              ["changes", "Changes to This Policy"],
              ["contact", "Contact for Privacy Concerns"],
            ].map(([id, label], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-baseline gap-2 hover:text-[#14213D] transition-colors"
                >
                  <span className="text-xs text-slate-400 tabular-nums w-5 shrink-0">
                    {i + 1}.
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── 1. What we collect ───────────────────────────────────────────── */}
        <SectionHeading id="what-we-collect" number={1}>
          What Data We Collect
        </SectionHeading>
        <Prose>
          <p>
            We collect information in two broad categories: information you
            provide directly to us, and information we collect automatically
            when you use the Service.
          </p>

          <p>
            <strong>1.1 Account & Professional Information</strong>
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Name</strong> — your full name as registered on the
              platform.
            </li>
            <li>
              <strong>Email address</strong> — used for account login,
              notifications, and communications.
            </li>
            <li>
              <strong>Mobile number</strong> — used for account verification,
              OTP login, and optional WhatsApp notifications.
            </li>
            <li>
              <strong>Bar Council Enrolment Number</strong> — to verify your
              professional credentials (where provided).
            </li>
            <li>
              <strong>Practice / Firm information</strong> — chamber name,
              office address, city, state, GSTIN, and PAN (optional, for
              invoicing purposes).
            </li>
            <li>
              <strong>Profile photograph</strong> — optional, used for your
              account avatar.
            </li>
          </ul>

          <p>
            <strong>1.2 Client and Case Data</strong>
          </p>
          <p>
            As a legal practice management tool, you may upload or enter data
            about your clients and legal matters. This may include:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Client names, contact details (mobile, email, address), and client
              type (individual, company, family, organisation).
            </li>
            <li>
              Case/matter details: case numbers, CNR numbers, court names,
              hearing dates, case stages, opposite party information.
            </li>
            <li>
              Fee agreements, payment records, and expense entries related to
              matters.
            </li>
            <li>
              Documents uploaded by you (affidavits, notices, petitions, court
              orders, etc.).
            </li>
            <li>Notes, tasks, and reminders associated with matters.</li>
          </ul>
          <p>
            You are the data controller of this client and case information. We
            process it solely on your behalf as a data processor, in accordance
            with your instructions and these terms.
          </p>

          <p>
            <strong>1.3 Usage and Technical Data</strong>
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Log data: IP address, browser type, device information, pages
              visited, timestamps.
            </li>
            <li>
              Feature usage patterns: which sections of the app you use, actions
              performed (anonymised where possible).
            </li>
            <li>
              Error and performance data to diagnose issues and improve the
              Service.
            </li>
          </ul>

          <p>
            <strong>1.4 Payment Information</strong>
          </p>
          <p>
            We do not store your full credit/debit card details on our servers.
            Payment processing is handled by our third-party payment gateway
            provider (see Section 6). We retain a record of transaction amounts,
            dates, and payment references for billing and accounting purposes.
          </p>
        </Prose>

        {/* ── 2. How we use ────────────────────────────────────────────────── */}
        <SectionHeading id="how-we-use" number={2}>
          How We Use Your Data
        </SectionHeading>
        <Prose>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>To provide the Service:</strong> Creating and managing
              your account, displaying your matters, hearings, clients, fees,
              and documents within the application.
            </li>
            <li>
              <strong>To process payments:</strong> Handling subscription
              billing, generating receipts, and managing account renewals.
            </li>
            <li>
              <strong>To send notifications:</strong> Hearing reminders, payment
              due alerts, trial expiry notices, and important Service updates
              via email, SMS, or WhatsApp (where you have opted in).
            </li>
            <li>
              <strong>To improve the Service:</strong> Analysing aggregated,
              anonymised usage data to understand how the platform is used and
              where we can make improvements.
            </li>
            <li>
              <strong>To provide customer support:</strong> Responding to your
              queries and resolving technical issues.
            </li>
            <li>
              <strong>To comply with legal obligations:</strong> Maintaining
              records as required by Indian law, including GST regulations and
              applicable tax laws.
            </li>
            <li>
              <strong>To protect our rights:</strong> Detecting, investigating,
              and preventing fraudulent activity, abuse, and security threats.
            </li>
          </ul>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <p className="font-semibold text-sm mb-1">Our Commitment</p>
            <p className="text-sm">
              We will never sell, rent, or trade your personal information or
              your clients&apos; data to any third party for their marketing or
              commercial purposes. Period.
            </p>
          </div>
        </Prose>

        {/* ── 3. Storage & Security ─────────────────────────────────────────── */}
        <SectionHeading id="storage-security" number={3}>
          Data Storage and Security
        </SectionHeading>
        <Prose>
          <p>
            <strong>3.1 Location:</strong> We prefer to store all data on
            servers located within India. Where we use third-party cloud
            infrastructure (see Section 6), we endeavour to select providers
            that offer India-based data residency options. Where data is
            processed or stored outside India, we ensure appropriate contractual
            safeguards are in place.
          </p>
          <p>
            <strong>3.2 Encryption:</strong> Data is encrypted in transit using
            TLS (Transport Layer Security). Sensitive data at rest is encrypted
            using industry-standard AES-256 encryption. Passwords are hashed
            using a secure, salted hashing algorithm (e.g., bcrypt) and are
            never stored in plain text.
          </p>
          <p>
            <strong>3.3 Access Controls:</strong> Access to your data within
            our systems is restricted to authorised personnel on a
            need-to-know basis, subject to confidentiality agreements. We
            maintain audit logs of administrative access to production systems.
          </p>
          <p>
            <strong>3.4 Security Practices:</strong> We follow industry
            best practices including regular security assessments, vulnerability
            scanning, and responsible disclosure procedures. However, no
            electronic storage or transmission method is 100% secure, and we
            cannot guarantee absolute security.
          </p>
          <p>
            <strong>3.5 Breach Notification:</strong> In the event of a data
            breach that poses a risk to your rights and freedoms, we will notify
            you and relevant authorities as required by applicable Indian law
            (including the Digital Personal Data Protection Act, 2023 when in
            full force), without undue delay.
          </p>
        </Prose>

        {/* ── 4. Retention ─────────────────────────────────────────────────── */}
        <SectionHeading id="retention" number={4}>
          Data Retention
        </SectionHeading>
        <Prose>
          <p>We retain your data for as long as necessary to:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Provide the Service to you while your account is active.</li>
            <li>Comply with our legal obligations (e.g., GST records).</li>
            <li>Resolve disputes and enforce our agreements.</li>
          </ul>
          <p>
            <strong>Active Accounts:</strong> All data is retained for the
            duration of your active subscription.
          </p>
          <p>
            <strong>After Cancellation:</strong> Upon cancellation of your
            subscription, your account data (matters, clients, documents, etc.)
            will be retained for <strong>30 days</strong> from the effective
            cancellation date. During this period, you may log in, export your
            data, or reactivate your subscription. After 30 days, your data
            will be permanently and irreversibly deleted from our active systems.
            Anonymised, aggregated data may be retained for analytical purposes.
          </p>
          <p>
            <strong>Billing Records:</strong> Transaction records and invoices
            may be retained for up to 8 years as required under Indian tax laws.
          </p>
          <p>
            <strong>Data Export:</strong> You can export your data in CSV or
            PDF format at any time from within the application. We strongly
            recommend exporting your data before cancelling your account.
          </p>
        </Prose>

        {/* ── 5. Cookies ───────────────────────────────────────────────────── */}
        <SectionHeading id="cookies" number={5}>
          Cookies
        </SectionHeading>
        <Prose>
          <p>
            We use cookies and similar tracking technologies to operate and
            improve the Service. Cookies are small text files placed on your
            device when you visit our website.
          </p>
          <p>
            <strong>5.1 Essential Cookies:</strong> Required for the Service to
            function. These include session cookies that keep you logged in and
            security tokens that protect against CSRF attacks. You cannot opt
            out of essential cookies without disabling the Service.
          </p>
          <p>
            <strong>5.2 Analytics Cookies:</strong> We use analytics tools
            (see Section 6) to understand how users interact with our platform.
            These cookies collect information about pages visited, time spent,
            and navigation paths. This data is aggregated and anonymised where
            possible.
          </p>
          <p>
            <strong>5.3 Preference Cookies:</strong> Used to remember your
            settings and preferences, such as sidebar state and display
            preferences.
          </p>
          <p>
            <strong>5.4 Managing Cookies:</strong> Most browsers allow you to
            control cookies through their settings. Disabling non-essential
            cookies will not prevent you from using the Service, but some
            features may not function optimally.
          </p>
        </Prose>

        {/* ── 6. Third-party services ──────────────────────────────────────── */}
        <SectionHeading id="third-party" number={6}>
          Third-Party Services
        </SectionHeading>
        <Prose>
          <p>
            We rely on carefully selected third-party service providers to
            operate NyayVakil. These providers access only the minimum data
            necessary to perform their services and are contractually bound to
            protect your data.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="px-4 py-2.5 font-semibold text-slate-700 border border-slate-200">
                    Service Category
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700 border border-slate-200">
                    Provider (Placeholder)
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700 border border-slate-200">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  [
                    "Cloud Infrastructure",
                    "[e.g., AWS / Azure / GCP — India region]",
                    "Hosting, storage, and database services",
                  ],
                  [
                    "Payment Gateway",
                    "[e.g., Razorpay / Cashfree]",
                    "Processing subscription payments in INR",
                  ],
                  [
                    "Transactional Email",
                    "[e.g., SendGrid / Amazon SES]",
                    "Sending hearing reminders, receipts, and account emails",
                  ],
                  [
                    "SMS / WhatsApp",
                    "[e.g., Twilio / MSG91]",
                    "Sending hearing alerts and OTP verification",
                  ],
                  [
                    "Analytics",
                    "[e.g., Mixpanel / PostHog — self-hosted]",
                    "Understanding platform usage patterns (anonymised)",
                  ],
                  [
                    "Error Monitoring",
                    "[e.g., Sentry]",
                    "Detecting and diagnosing application errors",
                  ],
                  [
                    "Authentication",
                    "NyayVakil (in-house)",
                    "Secure login and session management",
                  ],
                ].map(([category, provider, purpose]) => (
                  <tr key={category} className="even:bg-slate-50">
                    <td className="px-4 py-2.5 border border-slate-200 font-medium">
                      {category}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200 text-slate-500 italic">
                      {provider}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200">
                      {purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            We do not use advertising networks or sell data to data brokers.
            Links within the Service to external websites are provided for
            convenience; we are not responsible for the privacy practices of
            those external sites.
          </p>
        </Prose>

        {/* ── 7. Your rights ───────────────────────────────────────────────── */}
        <SectionHeading id="your-rights" number={7}>
          Your Rights
        </SectionHeading>
        <Prose>
          <p>
            Subject to applicable Indian law (including the Digital Personal
            Data Protection Act, 2023), you have the following rights regarding
            your personal data:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Right of Access:</strong> You can request a copy of the
              personal data we hold about you.
            </li>
            <li>
              <strong>Right to Correction:</strong> You can update your account
              information directly within the application or request correction
              of inaccurate data.
            </li>
            <li>
              <strong>Right to Deletion:</strong> You can request that we
              delete your personal data. This is fulfilled by deleting your
              account. Note that we may retain certain data as required by law
              (e.g., billing records).
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can export your
              data (matters, clients, fees, documents) in machine-readable
              format at any time from the application.
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Where we process your
              data based on consent (e.g., marketing emails), you can withdraw
              consent at any time via the unsubscribe link or account settings.
            </li>
            <li>
              <strong>Right to Raise a Grievance:</strong> You have the right
              to raise a grievance with our designated Grievance Officer (see
              Section 10) or with the relevant data protection authority in
              India.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#14213D] underline hover:opacity-80"
            >
              {contactEmail}
            </a>
            . We will respond within 30 days of receiving a verifiable request.
          </p>
        </Prose>

        {/* ── 8. Children's privacy ────────────────────────────────────────── */}
        <SectionHeading id="childrens" number={8}>
          {"Children's Privacy"}
        </SectionHeading>
        <Prose>
          <p>
            NyayVakil is a professional platform intended solely for use by
            legal professionals and their authorised staff who are at least 18
            years of age. The Service is not directed at children under the age
            of 18, and we do not knowingly collect personal data from minors.
          </p>
          <p>
            If we become aware that we have inadvertently collected personal
            information from a person under 18, we will take prompt steps to
            delete that information. If you believe we may have collected data
            from a minor, please contact us immediately at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#14213D] underline hover:opacity-80"
            >
              {contactEmail}
            </a>
            .
          </p>
        </Prose>

        {/* ── 9. Changes ───────────────────────────────────────────────────── */}
        <SectionHeading id="changes" number={9}>
          Changes to This Policy
        </SectionHeading>
        <Prose>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our data practices, the Service, or applicable laws.
            When we make material changes, we will:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Update the effective date at the top of this page.</li>
            <li>
              Notify you via email to your registered email address at least 14
              days before the changes take effect (for significant changes).
            </li>
            <li>
              Display a notification within the application for a reasonable
              period.
            </li>
          </ul>
          <p>
            We encourage you to review this Privacy Policy periodically. Your
            continued use of the Service after the effective date of any changes
            constitutes your acceptance of the updated policy.
          </p>
        </Prose>

        {/* ── 10. Contact ──────────────────────────────────────────────────── */}
        <SectionHeading id="contact" number={10}>
          Contact for Privacy Concerns
        </SectionHeading>
        <Prose>
          <p>
            If you have any questions, concerns, or complaints regarding this
            Privacy Policy or the handling of your personal data, please reach
            out to us:
          </p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm space-y-2">
            <p>
              <strong>Privacy / Data Protection Enquiries:</strong>{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#14213D] underline hover:opacity-80"
              >
                {contactEmail}
              </a>
            </p>
            <p>
              <strong>Grievance Officer:</strong> [Name — to be designated as
              per IT Rules 2011]{" "}
              <a
                href="mailto:grievance@nyayvakil.in"
                className="text-[#14213D] underline hover:opacity-80"
              >
                grievance@nyayvakil.in
              </a>
            </p>
            <p>
              <strong>Postal Address:</strong> NyayVakil Technologies Pvt.
              Ltd., [Address], India – [PIN]
            </p>
            <p>
              <strong>Response Time:</strong> We aim to acknowledge all privacy
              enquiries within 3 business days and resolve them within 30 days.
            </p>
          </div>
          <p>
            If you are not satisfied with our response, you may escalate your
            concern to the appropriate data protection authority in India once
            the relevant provisions of the Digital Personal Data Protection Act,
            2023 come into force.
          </p>
        </Prose>

        {/* ── Footer nav ───────────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NyayVakil Technologies Pvt. Ltd.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-[#14213D] hover:underline font-medium"
            >
              Terms of Service
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/contact" className="hover:text-slate-700">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
