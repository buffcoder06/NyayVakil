"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronDown,
  ChevronUp,
  Users,
  FolderOpen,
  HardDrive,
  ArrowRight,
  Zap,
  Phone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingPlan = {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  yearlyMonthlyPrice: number | null;
  yearlyTotal: number | null;
  contactSales: boolean;
  recommended: boolean;
  badge: string | null;
  forWho: string;
  users: string;
  matters: string;
  storage: string;
  features: string[];
  notIncluded: string[];
  ctaLabel: string;
  ctaHref: string;
};

// ─── Pricing Data ─────────────────────────────────────────────────────────────

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo advocates getting started",
    monthlyPrice: 799,
    yearlyMonthlyPrice: 666,
    yearlyTotal: 7999,
    contactSales: false,
    recommended: false,
    badge: null,
    forWho: "Solo advocates",
    users: "1 user",
    matters: "50 matters",
    storage: "1 GB storage",
    features: [
      "Case & matter tracking",
      "Court diary (hearing dates)",
      "Fee entries and tracking",
      "Client records (unlimited)",
      "Basic dashboard",
      "Email support",
    ],
    notIncluded: [
      "Multiple users",
      "Team tasks",
      "Document vault",
      "Advanced reports",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/contact",
  },
  {
    id: "chamber",
    name: "Chamber",
    tagline: "Advocate + junior / clerk setup",
    monthlyPrice: 2499,
    yearlyMonthlyPrice: 2083,
    yearlyTotal: 24999,
    contactSales: false,
    recommended: true,
    badge: "Most Popular",
    forWho: "Advocate + junior/clerk",
    users: "5 users",
    matters: "500 matters",
    storage: "10 GB storage",
    features: [
      "Everything in Starter",
      "Up to 5 team members",
      "Team task assignment",
      "Document vault",
      "Expense tracking",
      "Payment reminders",
      "Reports & insights",
      "WhatsApp reminder support",
      "Priority support",
    ],
    notIncluded: [],
    ctaLabel: "Start Free Trial",
    ctaHref: "/contact",
  },
  {
    id: "firm",
    name: "Firm",
    tagline: "For growing law firms",
    monthlyPrice: 6999,
    yearlyMonthlyPrice: 5833,
    yearlyTotal: 69999,
    contactSales: false,
    recommended: false,
    badge: null,
    forWho: "Small law firms",
    users: "20 users",
    matters: "Unlimited matters",
    storage: "50 GB storage",
    features: [
      "Everything in Chamber",
      "Up to 20 team members",
      "Advanced analytics",
      "Role-based permissions",
      "Higher document storage",
      "Onboarding support",
      "Custom branding (coming soon)",
    ],
    notIncluded: [],
    ctaLabel: "Start Free Trial",
    ctaHref: "/contact",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Large firms and legal departments",
    monthlyPrice: null,
    yearlyMonthlyPrice: null,
    yearlyTotal: null,
    contactSales: true,
    recommended: false,
    badge: null,
    forWho: "Large firms & legal departments",
    users: "Unlimited users",
    matters: "Custom",
    storage: "Custom",
    features: [
      "Everything in Firm",
      "Unlimited users",
      "Dedicated account manager",
      "Custom workflows",
      "Data migration support",
      "Training sessions",
      "SLA support",
      "Custom integrations",
    ],
    notIncluded: [],
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
  },
];

// ─── Comparison Table Data ────────────────────────────────────────────────────

type ComparisonRow = {
  category: string;
  features: {
    name: string;
    starter: boolean;
    chamber: boolean;
    firm: boolean;
    enterprise: boolean;
  }[];
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    category: "Core Features",
    features: [
      { name: "Case & matter tracking", starter: true, chamber: true, firm: true, enterprise: true },
      { name: "Court diary / hearing dates", starter: true, chamber: true, firm: true, enterprise: true },
      { name: "Fee entries & tracking", starter: true, chamber: true, firm: true, enterprise: true },
      { name: "Client records (unlimited)", starter: true, chamber: true, firm: true, enterprise: true },
      { name: "Basic dashboard", starter: true, chamber: true, firm: true, enterprise: true },
    ],
  },
  {
    category: "Team & Collaboration",
    features: [
      { name: "Multiple users", starter: false, chamber: true, firm: true, enterprise: true },
      { name: "Team task assignment", starter: false, chamber: true, firm: true, enterprise: true },
      { name: "Role-based permissions", starter: false, chamber: false, firm: true, enterprise: true },
      { name: "Custom workflows", starter: false, chamber: false, firm: false, enterprise: true },
    ],
  },
  {
    category: "Storage & Documents",
    features: [
      { name: "Document vault", starter: false, chamber: true, firm: true, enterprise: true },
      { name: "Expense tracking", starter: false, chamber: true, firm: true, enterprise: true },
      { name: "Advanced analytics", starter: false, chamber: false, firm: true, enterprise: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Email support", starter: true, chamber: true, firm: true, enterprise: true },
      { name: "Priority support", starter: false, chamber: true, firm: true, enterprise: true },
      { name: "Onboarding support", starter: false, chamber: false, firm: true, enterprise: true },
      { name: "Dedicated account manager", starter: false, chamber: false, firm: false, enterprise: true },
      { name: "SLA support", starter: false, chamber: false, firm: false, enterprise: true },
    ],
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, absolutely. You can upgrade or downgrade your plan at any time from your account settings. When upgrading, the new plan takes effect immediately and you're charged a prorated amount for the remainder of the billing cycle. When downgrading, the change takes effect at the start of the next billing cycle.",
  },
  {
    question: "Is yearly billing required?",
    answer:
      "No. Monthly billing is fully supported on all plans. Yearly billing is optional and gives you a discount of up to 20% — the savings are shown upfront so you can decide what works best for you.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Every plan comes with a 14-day free trial — no credit card required. You get full access to all features of the chosen plan during the trial period, so you can evaluate NyayVakil with your real practice needs.",
  },
  {
    question: "What happens to my data after the trial?",
    answer:
      "Your data is completely preserved after the trial ends. If you choose to subscribe, everything you entered — matters, hearings, clients, fees — will be right there waiting. If you don't subscribe, your data is retained for 30 days before deletion, giving you time to reconsider or export.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes. If you're not satisfied within the first 30 days of a paid subscription, we'll issue a pro-rated refund for the unused portion of your billing period. Just reach out to our support team and we'll process it promptly.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanCard({ plan, isYearly }: { plan: PricingPlan; isYearly: boolean }) {
  const price = isYearly ? plan.yearlyMonthlyPrice : plan.monthlyPrice;

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl p-6 transition-shadow",
        plan.recommended
          ? "border-2 shadow-xl shadow-[#1e3a5f]/10"
          : "border border-slate-200 shadow-sm hover:shadow-md",
      ].join(" ")}
      style={
        plan.recommended
          ? { borderColor: "#1e3a5f", background: "#fff" }
          : {}
      }
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: "#1e3a5f" }}
          >
            <Zap className="w-3 h-3" />
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name & tagline */}
      <div className="mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: plan.recommended ? "#1e3a5f" : "#0f172a" }}
        >
          {plan.name}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        {plan.contactSales ? (
          <div>
            <span className="text-3xl font-bold text-slate-800">Custom</span>
            <p className="text-sm text-slate-500 mt-1">Tailored to your firm size</p>
          </div>
        ) : (
          <div>
            <div className="flex items-end gap-1">
              <span className="text-sm font-medium text-slate-500 mb-1">₹</span>
              <span className="text-4xl font-bold" style={{ color: "#1e3a5f" }}>
                {price?.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-slate-500 mb-1">/month</span>
            </div>
            {isYearly && plan.yearlyTotal && (
              <p className="text-xs text-slate-500 mt-1">
                Billed as{" "}
                <span className="font-semibold text-slate-700">
                  ₹{plan.yearlyTotal.toLocaleString("en-IN")}
                </span>{" "}
                per year
              </p>
            )}
            {!isYearly && (
              <p className="text-xs text-slate-400 mt-1">Billed monthly</p>
            )}
          </div>
        )}
      </div>

      {/* Limits */}
      <div className="flex flex-col gap-1.5 mb-5 pb-5 border-b border-slate-100">
        {[
          { icon: Users, label: plan.users },
          { icon: FolderOpen, label: plan.matters },
          { icon: HardDrive, label: plan.storage },
        ].map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
            <Check
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: "#1e3a5f" }}
              strokeWidth={2.5}
            />
            <span>{feature}</span>
          </li>
        ))}
        {plan.notIncluded.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
            <Minus className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={[
          "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150",
          plan.recommended
            ? "text-white hover:opacity-90 active:scale-[0.98]"
            : "border hover:bg-slate-50",
        ].join(" ")}
        style={
          plan.recommended
            ? { backgroundColor: "#1e3a5f" }
            : { borderColor: "#1e3a5f", color: "#1e3a5f" }
        }
      >
        {plan.contactSales ? <Phone className="w-4 h-4" /> : null}
        {plan.ctaLabel}
        {!plan.contactSales && <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />}
      </Link>
    </div>
  );
}

function ComparisonCell({ value }: { value: boolean }) {
  if (value) {
    return (
      <td className="px-4 py-3 text-center">
        <Check className="w-4 h-4 mx-auto" style={{ color: "#1e3a5f" }} strokeWidth={2.5} />
      </td>
    );
  }
  return (
    <td className="px-4 py-3 text-center">
      <Minus className="w-4 h-4 mx-auto text-slate-300" strokeWidth={2} />
    </td>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-slate-800 text-sm sm:text-base">{question}</span>
        {open ? (
          <ChevronUp className="w-4.5 h-4.5 text-slate-400 shrink-0 ml-3" />
        ) : (
          <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-white">
      {/* ── Hero / Header ────────────────────────────────────────────────── */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 uppercase"
            style={{ backgroundColor: "#1e3a5f15", color: "#1e3a5f" }}
          >
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Built for Indian legal professionals. No hidden charges, no per-user surprises.
            Start free, upgrade when you need to.
          </p>
        </div>

        {/* Monthly / Yearly toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={[
              "text-sm font-medium transition-colors",
              !isYearly ? "text-slate-900" : "text-slate-400",
            ].join(" ")}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsYearly((v) => !v)}
            role="switch"
            aria-checked={isYearly}
            aria-label="Toggle yearly billing"
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            ].join(" ")}
            style={{
              backgroundColor: isYearly ? "#1e3a5f" : "#cbd5e1",
            }}
          >
            <span
              className={[
                "inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform duration-200",
                isYearly ? "translate-x-5.5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>

          <span
            className={[
              "text-sm font-medium transition-colors",
              isYearly ? "text-slate-900" : "text-slate-400",
            ].join(" ")}
          >
            Yearly
          </span>

          {/* Save badge */}
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: isYearly ? "#d1fae5" : "#f1f5f9",
              color: isYearly ? "#065f46" : "#94a3b8",
            }}
          >
            Save up to 20%
          </span>
        </div>
      </section>

      {/* ── Plan Cards ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-sm text-slate-500 max-w-2xl mx-auto">
          All prices are introductory and can be customised for chambers and firms based on team
          size and onboarding needs.
        </p>
      </section>

      {/* ── Feature Comparison Table (desktop only) ───────────────────── */}
      <section className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Compare plans in detail</h2>
          <p className="text-slate-500 mt-2 text-sm">
            See exactly what's included in each plan
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-4 text-left text-slate-500 font-medium w-1/3">
                  Feature
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    className="px-4 py-4 text-center font-semibold"
                    style={{ color: plan.recommended ? "#1e3a5f" : "#334155" }}
                  >
                    {plan.name}
                    {plan.recommended && (
                      <span className="block text-xs font-normal mt-0.5" style={{ color: "#1e3a5f" }}>
                        Most Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {COMPARISON_ROWS.map((group) => (
                <React.Fragment key={group.category}>
                  {/* Category header row */}
                  <tr className="bg-slate-50">
                    <td
                      colSpan={5}
                      className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.features.map((row) => (
                    <tr key={row.name} className="border-t border-slate-100 hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-slate-700">{row.name}</td>
                      <ComparisonCell value={row.starter} />
                      <ComparisonCell value={row.chamber} />
                      <ComparisonCell value={row.firm} />
                      <ComparisonCell value={row.enterprise} />
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 text-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Not sure which plan?
          </h2>
          <p className="text-slate-600 mb-8 text-base">
            Book a free demo and we'll recommend the right plan for your practice. Or reach
            out — we're happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#1e3a5f" }}
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white"
              style={{ borderColor: "#1e3a5f", color: "#1e3a5f" }}
            >
              <Phone className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
