// src/app/(marketing)/terms/page.tsx
// Terms of Service – NyayVakil
// Server Component

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for NyayVakil – the legal practice management platform built for Indian advocates and law firms.",
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

export default function TermsPage() {
  const effectiveDate = "1 April 2025";
  const companyName = "NyayVakil";
  const contactEmail = "info@nyayvakil.in";
  const contactAddress =
    "NyayVakil Technologies Pvt. Ltd., [Address], India – [PIN]";

  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#14213D" }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-blue-200 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Terms of Service
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
            <strong>Notice:</strong> These terms are placeholders and should be
            reviewed by a qualified legal professional before going live. Do not
            rely on this document as final legal advice.
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
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
              ["introduction", "Introduction / Overview"],
              ["acceptance", "Acceptance of Terms"],
              ["description", "Description of Service"],
              ["accounts", "User Accounts and Registration"],
              ["payments", "Subscription and Payments"],
              ["data-privacy", "Data and Privacy"],
              ["acceptable-use", "Acceptable Use"],
              ["ip", "Intellectual Property"],
              ["disclaimers", "Disclaimers"],
              ["liability", "Limitation of Liability"],
              ["termination", "Termination"],
              ["governing-law", "Governing Law"],
              ["contact", "Contact Information"],
              ["changes", "Changes to Terms"],
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

        {/* ── 1. Introduction ──────────────────────────────────────────────── */}
        <SectionHeading id="introduction" number={1}>
          Introduction / Overview
        </SectionHeading>
        <Prose>
          <p>
            Welcome to {companyName} (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). {companyName} is a Software-as-a-Service (SaaS)
            legal practice management platform designed specifically for Indian
            advocates, law chambers, and law firms. Our platform helps legal
            professionals manage cases (matters), hearing diaries, client
            records, fee collections, documents, and tasks — all in one place.
          </p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to
            and use of the {companyName} website (
            <strong>nyayvakil.in</strong>) and the associated web application,
            APIs, and any related services (collectively, the
            &quot;Service&quot;). Please read these Terms carefully before
            creating an account or using the Service.
          </p>
          <p>
            By using {companyName}, you agree to be bound by these Terms and
            our{" "}
            <Link href="/privacy" className="text-[#14213D] underline hover:opacity-80">
              Privacy Policy
            </Link>
            . If you are using the Service on behalf of a law firm or
            organisation, you represent and warrant that you have the authority
            to bind that entity to these Terms.
          </p>
        </Prose>

        {/* ── 2. Acceptance ────────────────────────────────────────────────── */}
        <SectionHeading id="acceptance" number={2}>
          Acceptance of Terms
        </SectionHeading>
        <Prose>
          <p>
            By registering for an account, starting a free trial, or otherwise
            accessing or using the Service, you confirm that:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>You are at least 18 years of age.</li>
            <li>
              You are a qualified legal professional enrolled with a Bar Council
              in India, or an authorised representative or staff member of such
              a professional.
            </li>
            <li>
              You have read, understood, and agree to be legally bound by these
              Terms.
            </li>
            <li>
              You agree to comply with all applicable laws and regulations,
              including but not limited to the Advocates Act, 1961, Bar Council
              of India Rules, and applicable Indian information technology laws.
            </li>
          </ul>
          <p>
            If you do not agree to these Terms, you must not use the Service.
          </p>
        </Prose>

        {/* ── 3. Description ───────────────────────────────────────────────── */}
        <SectionHeading id="description" number={3}>
          Description of Service
        </SectionHeading>
        <Prose>
          <p>
            {companyName} provides a cloud-based legal practice management
            platform that includes, but is not limited to, the following
            features:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Matter / Case Management:</strong> Create and manage legal
              matters, including case numbers, CNR numbers, court details,
              opposite parties, and case stages.
            </li>
            <li>
              <strong>Hearing Diary:</strong> Track upcoming and past hearings,
              set reminders, and record attendance.
            </li>
            <li>
              <strong>Client Management:</strong> Maintain a secure database of
              clients (individuals, companies, families) with contact details
              and matter history.
            </li>
            <li>
              <strong>Fee & Payment Tracking:</strong> Record fee agreements,
              log payments, track outstanding amounts, and generate receipts.
            </li>
            <li>
              <strong>Expense Tracking:</strong> Log disbursements and
              court-related expenses per matter.
            </li>
            <li>
              <strong>Document Storage:</strong> Upload, organise, and access
              case-related documents securely.
            </li>
            <li>
              <strong>Task Management:</strong> Assign and track tasks for team
              members.
            </li>
            <li>
              <strong>Reminders & Notifications:</strong> Automated alerts for
              hearings, payment due dates, and follow-ups.
            </li>
            <li>
              <strong>Reporting:</strong> Generate reports on collections,
              outstanding fees, and practice performance.
            </li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any feature
            of the Service at any time, with or without notice, and without
            liability to you.
          </p>
        </Prose>

        {/* ── 4. Accounts ──────────────────────────────────────────────────── */}
        <SectionHeading id="accounts" number={4}>
          User Accounts and Registration
        </SectionHeading>
        <Prose>
          <p>
            To access the Service, you must register for an account. When
            registering, you agree to:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Provide accurate, current, and complete information (name, email
              address, mobile number, and bar council details where requested).
            </li>
            <li>
              Maintain and promptly update your account information to keep it
              accurate and current.
            </li>
            <li>
              Keep your password confidential and not share it with any
              unauthorised person.
            </li>
            <li>
              Notify us immediately at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#14213D] underline hover:opacity-80"
              >
                {contactEmail}
              </a>{" "}
              if you suspect any unauthorised use of your account.
            </li>
          </ul>
          <p>
            You are solely responsible for all activities that occur under your
            account. {companyName} will not be liable for any loss or damage
            arising from your failure to maintain the security of your account
            credentials.
          </p>
          <p>
            Accounts are personal to the registered user or the subscribing
            firm. You may not transfer your account to another person without
            our prior written consent.
          </p>
        </Prose>

        {/* ── 5. Payments ──────────────────────────────────────────────────── */}
        <SectionHeading id="payments" number={5}>
          Subscription and Payments
        </SectionHeading>
        <Prose>
          <p>
            {companyName} offers both a free trial period and paid subscription
            plans. All prices are quoted in Indian Rupees (INR) and are
            inclusive of applicable taxes unless stated otherwise.
          </p>
          <p>
            <strong>5.1 Free Trial:</strong> New accounts may access the
            Service on a free trial basis for a limited period. No payment
            information is required during the trial. At the end of the trial,
            you must subscribe to a paid plan to continue using the Service.
          </p>
          <p>
            <strong>5.2 Subscription Plans:</strong> Paid subscriptions are
            available on a monthly or yearly basis. Yearly plans may be offered
            at a discounted rate. Plan details, features, and current pricing
            are listed on our{" "}
            <Link href="/pricing" className="text-[#14213D] underline hover:opacity-80">
              Pricing page
            </Link>
            .
          </p>
          <p>
            <strong>5.3 Billing:</strong> Subscriptions are billed in advance
            at the start of each billing period (monthly or yearly). Payment is
            processed through our authorised payment gateway. By providing
            payment details, you authorise us to charge the applicable
            subscription fee on a recurring basis.
          </p>
          <p>
            <strong>5.4 Renewals:</strong> Subscriptions automatically renew at
            the end of each billing period unless you cancel before the renewal
            date. You will receive a reminder notification before renewal.
          </p>
          <p>
            <strong>5.5 Cancellation and Refunds:</strong> You may cancel your
            subscription at any time from your account settings. Cancellation
            takes effect at the end of the current billing period. We do not
            offer pro-rata refunds for partial billing periods, except as
            required by applicable Indian law. Refund requests are evaluated on
            a case-by-case basis.
          </p>
          <p>
            <strong>5.6 Price Changes:</strong> We reserve the right to change
            subscription prices upon 30 days&apos; prior notice. Continued use
            of the Service after a price change constitutes your acceptance of
            the new pricing.
          </p>
          <p>
            <strong>5.7 Late Payments:</strong> If a payment fails, we will
            notify you and may temporarily suspend your account until the
            outstanding amount is settled.
          </p>
        </Prose>

        {/* ── 6. Data & Privacy ────────────────────────────────────────────── */}
        <SectionHeading id="data-privacy" number={6}>
          Data and Privacy
        </SectionHeading>
        <Prose>
          <p>
            Your privacy is important to us. By using the Service, you agree to
            the collection and use of your information as described in our{" "}
            <Link href="/privacy" className="text-[#14213D] underline hover:opacity-80">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
          <p>
            <strong>6.1 Your Data:</strong> You retain full ownership of all
            data, content, and information you upload to or create within the
            Service (&quot;Your Data&quot;). You grant us a limited,
            non-exclusive licence to host, store, and process Your Data solely
            for the purpose of providing the Service to you.
          </p>
          <p>
            <strong>6.2 Data Security:</strong> We implement industry-standard
            security measures to protect Your Data. However, no method of
            transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
          <p>
            <strong>6.3 Confidential Client Information:</strong> You are
            solely responsible for ensuring that storing client data on
            {companyName} complies with your professional obligations under the
            Bar Council of India Rules regarding client confidentiality. We
            process such data only as your data processor under your
            instructions.
          </p>
          <p>
            <strong>6.4 Data Portability:</strong> You may export Your Data
            from the Service at any time using the available export tools. Upon
            account termination, your data will be retained for 30 days after
            which it may be permanently deleted.
          </p>
        </Prose>

        {/* ── 7. Acceptable Use ────────────────────────────────────────────── */}
        <SectionHeading id="acceptable-use" number={7}>
          Acceptable Use
        </SectionHeading>
        <Prose>
          <p>
            You agree to use the Service only for lawful purposes and in a
            manner consistent with these Terms. You must not:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Use the Service for any purpose that is unlawful or prohibited by
              applicable Indian law.
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the Service or
              its related systems or networks.
            </li>
            <li>
              Upload, transmit, or distribute any content that is harmful,
              defamatory, obscene, or infringes upon the rights of any third
              party.
            </li>
            <li>
              Use the Service to store or process data of clients without their
              informed consent.
            </li>
            <li>
              Reverse-engineer, decompile, or disassemble any component of the
              Service.
            </li>
            <li>
              Use automated bots, scrapers, or scripts to access or extract data
              from the Service without our written permission.
            </li>
            <li>
              Sublicense, resell, or transfer access to the Service to any third
              party without our prior written consent.
            </li>
            <li>
              Use the Service in a way that could damage, disable, overburden,
              or impair our servers or infrastructure.
            </li>
          </ul>
          <p>
            Violation of this Acceptable Use Policy may result in immediate
            suspension or termination of your account without refund.
          </p>
        </Prose>

        {/* ── 8. IP ────────────────────────────────────────────────────────── */}
        <SectionHeading id="ip" number={8}>
          Intellectual Property
        </SectionHeading>
        <Prose>
          <p>
            <strong>8.1 Our Property:</strong> The Service, including all
            underlying software, algorithms, interfaces, design, text, graphics,
            logos, and trademarks, is the exclusive property of{" "}
            {companyName} and its licensors. Nothing in these Terms transfers
            any intellectual property rights to you.
          </p>
          <p>
            <strong>8.2 Licence to Use:</strong> Subject to your compliance
            with these Terms and timely payment of applicable fees, we grant you
            a limited, non-exclusive, non-transferable, revocable licence to
            access and use the Service for your internal legal practice
            management purposes.
          </p>
          <p>
            <strong>8.3 Feedback:</strong> If you provide us with any
            suggestions, feedback, or ideas regarding the Service, you grant us
            a perpetual, royalty-free, worldwide licence to use such feedback
            without any obligation to compensate you.
          </p>
          <p>
            <strong>8.4 Your Content:</strong> You retain all intellectual
            property rights in Your Data. You represent that you have the
            necessary rights and permissions to upload Your Data to the Service.
          </p>
        </Prose>

        {/* ── 9. Disclaimers ───────────────────────────────────────────────── */}
        <SectionHeading id="disclaimers" number={9}>
          Disclaimers
        </SectionHeading>
        <Prose>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold mb-1">Important Notice</p>
            <p className="text-sm">
              <strong>{companyName} is a practice management tool — it is NOT
              a legal advice platform.</strong> Nothing in the Service
              constitutes legal advice, and the Service is not a substitute for
              advice from a qualified legal professional. {companyName} does not
              provide legal services of any kind.
            </p>
          </div>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis, without warranties of any kind, either
            express or implied, including but not limited to:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </li>
            <li>
              That the Service will be uninterrupted, error-free, or free from
              viruses or other harmful components.
            </li>
            <li>
              That any information or data obtained through the Service will be
              accurate, complete, or reliable.
            </li>
            <li>
              That court dates, CNR lookups, or case status information
              (where integrated) will be current or accurate at all times.
            </li>
          </ul>
          <p>
            We do not warrant that the Service complies with the laws of any
            jurisdiction other than India.
          </p>
        </Prose>

        {/* ── 10. Limitation of Liability ──────────────────────────────────── */}
        <SectionHeading id="liability" number={10}>
          Limitation of Liability
        </SectionHeading>
        <Prose>
          <p>
            To the fullest extent permitted by applicable Indian law, in no
            event shall {companyName}, its directors, officers, employees,
            agents, or licensors be liable for any:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Indirect, incidental, special, consequential, or punitive damages.
            </li>
            <li>
              Loss of profits, revenue, data, goodwill, or business
              opportunities.
            </li>
            <li>
              Damages arising from missed court dates, incorrect data entry, or
              reliance on information within the Service.
            </li>
            <li>Damages arising from unauthorised access to Your Data.</li>
          </ul>
          <p>
            In no event shall our total cumulative liability to you for any
            claims arising out of or related to these Terms or the Service
            exceed the total amount of subscription fees paid by you to us in
            the 3 months immediately preceding the event giving rise to the
            claim.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties
            or limitation of liability. In such cases, our liability will be
            limited to the maximum extent permitted by law.
          </p>
        </Prose>

        {/* ── 11. Termination ──────────────────────────────────────────────── */}
        <SectionHeading id="termination" number={11}>
          Termination
        </SectionHeading>
        <Prose>
          <p>
            <strong>11.1 By You:</strong> You may terminate your account at
            any time by cancelling your subscription and deleting your account
            from the settings page. Termination does not entitle you to a
            refund of any prepaid subscription fees.
          </p>
          <p>
            <strong>11.2 By Us:</strong> We may suspend or terminate your
            account immediately, with or without notice, if:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>You breach any provision of these Terms.</li>
            <li>You fail to pay subscription fees when due.</li>
            <li>
              We reasonably believe your use of the Service is fraudulent,
              illegal, or harmful to other users or third parties.
            </li>
            <li>
              We are required to do so by law or a regulatory authority.
            </li>
          </ul>
          <p>
            <strong>11.3 Effect of Termination:</strong> Upon termination, your
            right to access and use the Service ceases immediately. We will
            retain Your Data for 30 days following termination, during which you
            may request an export. After 30 days, Your Data may be permanently
            deleted.
          </p>
          <p>
            Sections relating to Intellectual Property, Disclaimers, Limitation
            of Liability, Governing Law, and any other provisions that by their
            nature should survive, will survive termination.
          </p>
        </Prose>

        {/* ── 12. Governing Law ────────────────────────────────────────────── */}
        <SectionHeading id="governing-law" number={12}>
          Governing Law
        </SectionHeading>
        <Prose>
          <p>
            These Terms and any dispute arising out of or in connection with
            them shall be governed by and construed in accordance with the laws
            of the Republic of India. Relevant statutes may include, but are
            not limited to:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              The Information Technology Act, 2000 and the Information
              Technology (Amendment) Act, 2008.
            </li>
            <li>
              The Information Technology (Reasonable Security Practices and
              Procedures and Sensitive Personal Data or Information) Rules,
              2011.
            </li>
            <li>
              The Digital Personal Data Protection Act, 2023 (as and when in
              full force).
            </li>
            <li>The Indian Contract Act, 1872.</li>
            <li>
              The Consumer Protection Act, 2019 (where applicable to B2C
              transactions).
            </li>
          </ul>
          <p>
            Any disputes arising under these Terms that cannot be resolved
            amicably shall be subject to the exclusive jurisdiction of the
            courts in <strong>[City], India</strong> (to be specified upon
            legal review). We encourage resolution of disputes through direct
            communication before escalating to formal proceedings.
          </p>
        </Prose>

        {/* ── 13. Contact ──────────────────────────────────────────────────── */}
        <SectionHeading id="contact" number={13}>
          Contact Information
        </SectionHeading>
        <Prose>
          <p>
            If you have any questions, concerns, or complaints regarding these
            Terms of Service, please contact us:
          </p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm space-y-1.5">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#14213D] underline hover:opacity-80"
              >
                {contactEmail}
              </a>
            </p>
            <p>
              <strong>Postal Address:</strong> {contactAddress}
            </p>
            <p>
              <strong>Grievance Officer:</strong> [Name of Grievance Officer —
              to be designated as per IT Rules 2011] —{" "}
              <a
                href="mailto:info@nyayvakil.in"
                className="text-[#14213D] underline hover:opacity-80"
              >
                info@nyayvakil.in
              </a>
            </p>
          </div>
          <p>
            We will endeavour to respond to all queries within 7 business days.
          </p>
        </Prose>

        {/* ── 14. Changes ──────────────────────────────────────────────────── */}
        <SectionHeading id="changes" number={14}>
          Changes to Terms
        </SectionHeading>
        <Prose>
          <p>
            We reserve the right to modify these Terms at any time. When we
            make material changes, we will:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Update the &quot;Effective date&quot; at the top of this page.
            </li>
            <li>
              Send an email notification to the registered email address on your
              account.
            </li>
            <li>
              Display a prominent notice within the application for a reasonable
              period.
            </li>
          </ul>
          <p>
            Your continued use of the Service after the revised Terms come into
            effect constitutes your acceptance of the new Terms. If you do not
            agree to the revised Terms, you must stop using the Service and
            cancel your subscription.
          </p>
          <p>
            We recommend that you periodically review these Terms to stay
            informed of any updates.
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
              href="/privacy"
              className="text-[#14213D] hover:underline font-medium"
            >
              Privacy Policy
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
