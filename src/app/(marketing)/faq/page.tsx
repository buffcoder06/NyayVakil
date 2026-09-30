import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  label: string;
  questions: FaqItem[];
};

// ── FAQ Data ──────────────────────────────────────────────────────────────────

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    questions: [
      {
        question: "Who is NyayVakil for?",
        answer:
          "NyayVakil is built for Indian legal professionals — solo advocates, advocates with juniors and clerks, small law firms, and in-house legal departments. If you are managing cases, hearings, clients, and fees in India, NyayVakil is designed for you. Our plans are priced for practices of all sizes.",
      },
      {
        question: "Is it suitable for a solo advocate?",
        answer:
          "Yes, absolutely. NyayVakil gives a solo practitioner a full hearing diary, case management, fee and expense tracking, client records and a document register — everything you need to run your practice, and it's free during early access.",
      },
      {
        question: "Can a chamber with junior advocates and a clerk use it?",
        answer:
          "Team access is coming soon. Today each chamber has one login for the advocate. Next, you'll be able to invite juniors and clerks with role-based access, so each person sees what's relevant to their role.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. All data travels over encrypted connections (HTTPS) and is stored encrypted on a managed cloud database. Each chamber's data is kept completely separate, and passwords are never stored in readable form. We do not share your data with any third parties — your client and case information remains strictly yours.",
      },
      {
        question: "Can I use NyayVakil just for maintaining a hearing diary?",
        answer:
          "Yes. You can use the hearing diary feature independently without setting up the full case workflow. Many advocates start with just the diary and gradually adopt other features like fee tracking and client records as they get comfortable with the product.",
      },
      {
        question:
          "Do I need any technical knowledge to use NyayVakil?",
        answer:
          "No. NyayVakil is built with simplicity in mind. If you can use WhatsApp and a basic smartphone app, you can use NyayVakil. The interface is in plain English, steps are clearly labelled, and our onboarding process guides you through setting up your practice from scratch.",
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    questions: [
      {
        question: "Does NyayVakil have a court diary or hearing diary?",
        answer:
          "Yes. The court diary is one of the core features. It shows your hearings date-wise (list or calendar), lets you record the next date after each hearing, and puts today's hearings on your dashboard. You can filter by court, person or status. Automatic reminders before each hearing are coming soon.",
      },
      {
        question: "Can I track fees and pending payments?",
        answer:
          "Yes, fully. You can record professional fees against each case, log payments (cash, UPI, bank transfer or cheque) and see at a glance which cases have outstanding amounts. Overdue fees are flagged automatically, and fee reports can be downloaded as CSV for Excel.",
      },
      {
        question: "Does it handle expenses like court fees and travel?",
        answer:
          "Yes. You can record expenses against cases — court fees, stamp duty, travel, miscellaneous costs — and mark whether they have been reimbursed by the client or not. This keeps your case-level accounts clean and helps at billing time.",
      },
      {
        question:
          "Can I store documents like vakalatnamas and court orders?",
        answer:
          "You can keep a document register today — record each vakalatnama, court order, plaint or reply with its category and linked case. Uploading and storing the files themselves is coming soon.",
      },
      {
        question: "Can I send reminders to clients?",
        answer:
          "You can prepare client reminders for hearings, pending fees and document requests using ready-made templates, and the bell at the top tells you when one is due. Automatic sending by WhatsApp, SMS and email is coming soon — until then you send the message from your phone and mark it sent.",
      },
      {
        question: "Does it have task management for clerks?",
        answer:
          "Yes, you can create tasks with due dates and priorities, link them to cases and track completion. Assigning tasks to juniors and clerks will arrive with team access, which is coming soon.",
      },
      {
        question: "Are reports available?",
        answer:
          "Yes. Reports cover fees collected vs. pending, expenses, case statistics and hearings, with an outstanding-by-client view. Every report can be downloaded as CSV for Excel; PDF export is coming soon.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    questions: [
      {
        question: "What plans are available?",
        answer:
          "NyayVakil is free during early access. When paid plans launch there will be four: Starter (solo advocates), Chamber (advocates with juniors and clerks), Firm (small law firms) and Enterprise (larger organisations). See the Pricing page for planned prices.",
      },
      {
        question: "Can I upgrade or downgrade my plan later?",
        answer:
          "During early access every feature is free, so there's nothing to change. Once paid plans launch, you'll be able to switch plans at any time from your account.",
      },
      {
        question: "Is yearly billing cheaper than monthly billing?",
        answer:
          "When paid plans launch, yearly billing will save you up to 20% compared to paying monthly.",
      },
      {
        question: "Is there a free trial? Do I need a credit card?",
        answer:
          "NyayVakil is completely free during early access, and no credit card is needed. You'll hear from us well in advance before paid plans start, and nothing is ever charged automatically.",
      },
      {
        question:
          "What happens to my data if I cancel my subscription?",
        answer:
          "Your data is yours. You can download your reports as CSV at any time, and if you ever want your full data exported or your account deleted, email info@nyayvakil.in and we'll take care of it.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    questions: [
      {
        question: "Does NyayVakil work on mobile?",
        answer:
          "Yes. NyayVakil is fully mobile responsive and works well on smartphones and tablets. Whether you are in court, at a client meeting, or travelling, you can check your hearing diary, update case notes, and record fee payments from your phone browser without needing to install a separate app.",
      },
      {
        question: "Do I need a constant internet connection?",
        answer:
          "NyayVakil is a cloud-based application and requires an internet connection to access your data. Most features require an active connection. We recommend a stable connection when uploading or downloading documents. Basic browsing on a standard mobile data connection works well for day-to-day use.",
      },
      {
        question:
          "Can I migrate my existing data into NyayVakil?",
        answer:
          "Yes — contact us and we'll help you bring in your existing cases and clients from spreadsheets. A self-service import tool is coming soon.",
      },
      {
        question: "Which browsers are supported?",
        answer:
          "NyayVakil works on all modern browsers — Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. We recommend keeping your browser up to date for the best experience. Internet Explorer is not supported.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    questions: [
      {
        question: "What support options are available?",
        answer:
          "During early access, email info@nyayvakil.in and we'll get back to you — usually within one business day. Priority and phone support are planned for paid plans.",
      },
      {
        question:
          "Is onboarding training provided after I sign up?",
        answer:
          "Yes. The app has a built-in Get Started checklist and a Help section, and we provide a step-by-step user guide. Early-access chambers can also ask us for a personal walkthrough.",
      },
      {
        question: "How quickly are issues resolved?",
        answer:
          "During early access we aim to respond to every email within one business day. Anything that stops you from accessing your account is treated as top priority.",
      },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 bg-white select-none">
      {label}
    </span>
  );
}

function FaqEntry({ question, answer }: FaqItem) {
  return (
    <div className="py-5 border-b border-slate-100 last:border-b-0">
      <p className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
        {question}
      </p>
      <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FaqPage() {
  return (
    <div className="bg-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section
        className="py-14 sm:py-20 text-center"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="font-brand text-3xl sm:text-4xl font-normal text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Answers to common questions about NyayVakil, its features, pricing,
            and how it works for Indian legal practices.
          </p>
        </div>
      </section>

      {/* ── Category pills ────────────────────────────────────────────────── */}
      <section className="py-8 border-b border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
              Categories:
            </span>
            {FAQ_CATEGORIES.map(({ id, label }) => (
              <CategoryPill key={id} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ sections ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {FAQ_CATEGORIES.map(({ id, label, questions }) => (
            <div key={id} id={id}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1.5 h-6 rounded-full"
                  style={{ backgroundColor: "#14213D" }}
                  aria-hidden="true"
                />
                <h2 className="text-xl font-bold text-slate-900">{label}</h2>
                <span className="text-xs font-medium text-slate-400 ml-1">
                  {questions.length} questions
                </span>
              </div>

              {/* Questions */}
              <div className="rounded-2xl border border-slate-200 px-6 divide-y-0">
                {questions.map((faq) => (
                  <FaqEntry key={faq.question} {...faq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-14 text-center"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            If you could not find what you were looking for, our team is happy
            to help. Reach out through the contact page and we will get back to
            you promptly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#14213D" }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
