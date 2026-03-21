"use client";

// src/app/(dashboard)/help/page.tsx
// Help & Support page — server layout with client accordion for FAQs

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  CalendarDays,
  ChevronDown,
  Mail,
  MessageCircle,
  Clock,
  ExternalLink,
  Briefcase,
  HelpCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const GETTING_STARTED_CARDS = [
  {
    icon: Briefcase,
    title: "Add your first case",
    description:
      "Go to Cases from the sidebar, then click 'New Case'. Fill in the case number, title, type, and court. You can link a client and add the first hearing date right from the new case form.",
  },
  {
    icon: Users,
    title: "Add your first client",
    description:
      "Go to Clients from the sidebar, then click 'New Client'. Enter the client's name, phone, and contact details. Once added, you can link them to one or more cases.",
  },
  {
    icon: CalendarDays,
    title: "Set up your hearing diary",
    description:
      "Hearings are linked to cases. Open any case and use the Hearings tab, or go to Hearings from the sidebar. Each hearing has a date, court, purpose, and next date. You can also set reminders for any hearing.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I add a new case?",
    answer:
      "Go to Cases from the sidebar. Click 'New Case'. Fill in the basic case info, link a client, and add the first hearing date.",
  },
  {
    question: "How do I track fees for a case?",
    answer:
      "Open any case. Go to the Fees tab. Click 'Add Fee Entry' to record the agreed fee. Use 'Log Payment' when you receive money.",
  },
  {
    question: "How do I add a hearing?",
    answer:
      "Go to Hearings from the sidebar or from inside any case. Click 'Add Hearing'. Select the case, court, date, and purpose.",
  },
  {
    question: "Can I assign tasks to my junior or clerk?",
    answer:
      "Yes. Go to Tasks. Click 'Add Task'. Select the team member from the 'Assign To' dropdown.",
  },
  {
    question: "How do I upload documents?",
    answer:
      "Go to Documents or open a case and click the Documents tab. Click 'Upload Document' to add files.",
  },
  {
    question: "How do I invite a team member?",
    answer:
      "Go to Office Settings from the sidebar. Click 'Team Members'. Use 'Invite Member' to add juniors or clerks.",
  },
  {
    question: "How do I set reminders for hearings?",
    answer:
      "Go to Reminders. You can set WhatsApp, SMS, or email reminders for any hearing or payment.",
  },
  {
    question: "Can I use this on my phone?",
    answer:
      "Yes. NyayVakil works on mobile browsers. Use the bottom navigation bar to quickly access cases, hearings, and fees.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT: ACCORDION
// ─────────────────────────────────────────────────────────────────────────────

function HelpAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="bg-white">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-inset"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-slate-800 pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed bg-slate-50 border-t border-slate-100">
                <p className="pt-4">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Help &amp; Support</h1>
        </div>
        <p className="text-slate-500 text-sm ml-13 pl-1 mt-1">
          Everything you need to get started and make the most of NyayVakil
        </p>
      </div>

      {/* ── Section 1: Getting Started ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-semibold text-slate-900">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GETTING_STARTED_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#1e3a5f]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Common Tasks (FAQ Accordion) ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-semibold text-slate-900">Common Tasks</h2>
        </div>
        <HelpAccordion items={FAQ_ITEMS} />
      </section>

      {/* ── Section 3: Contact Support ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-semibold text-slate-900">Contact Support</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {/* Email */}
            <div className="flex flex-col items-start gap-2 p-6">
              <div className="h-9 w-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-[#1e3a5f]" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Email
              </p>
              <a
                href="mailto:support@nyayvakil.in"
                className="text-sm font-semibold text-[#1e3a5f] hover:underline"
              >
                support@nyayvakil.in
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col items-start gap-2 p-6">
              <div className="h-9 w-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-[#1e3a5f]" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                WhatsApp
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1e3a5f] hover:underline"
              >
                +91 98765 43210
              </a>
            </div>

            {/* Response Time */}
            <div className="flex flex-col items-start gap-2 p-6">
              <div className="h-9 w-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-[#1e3a5f]" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Response Time
              </p>
              <span className="text-sm font-semibold text-slate-800">
                Within 1 business day
              </span>
            </div>
          </div>

          {/* Book a Demo CTA */}
          <div className="bg-[#1e3a5f]/5 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-slate-600">
              Want a guided walkthrough of NyayVakil?
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e3a5f] hover:underline"
            >
              Book a Demo
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
