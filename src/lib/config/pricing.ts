// ─────────────────────────────────────────────────────────────────────────────
// NyayVakil – Pricing Configuration
// All prices in INR (₹). Update this file when plans change.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = "starter" | "chamber" | "firm" | "enterprise";
export type CtaVariant = "outline" | "default" | "primary" | "secondary";

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Monthly price in INR. null for contact-sales plans. */
  monthlyPrice: number | null;
  /** Yearly price (total) in INR. null for contact-sales plans. */
  yearlyPrice: number | null;
  /** Effective per-month cost when billed yearly. null for contact-sales plans. */
  yearlyPricePerMonth: number | null;
  /** Max users. null means unlimited. */
  users: number | null;
  /** Max active matters. null means unlimited. */
  matters: number | null;
  /** Storage in GB. null means unlimited / negotiated. */
  storage: number | null;
  /** Features included in this plan. */
  features: string[];
  /** Features explicitly NOT included (shown greyed-out in UI). */
  notIncluded: string[];
  /** Whether to visually highlight this plan as recommended. */
  highlighted: boolean;
  /** Badge text displayed on card (e.g. "Recommended", "Popular"). Empty string = no badge. */
  badge: string;
  /** Label for the CTA button. */
  ctaText: string;
  /** Button variant passed to the UI component. */
  ctaVariant: CtaVariant;
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan definitions
// ─────────────────────────────────────────────────────────────────────────────

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Everything a solo advocate needs to stay organised.",
    monthlyPrice: 799,
    yearlyPrice: 7999,
    yearlyPricePerMonth: Math.round(7999 / 12), // ≈ 667
    users: 1,
    matters: 50,
    storage: 1,
    features: [
      "1 user seat",
      "Up to 50 active cases",
      "1 GB document storage",
      "Court hearing diary with reminders",
      "Basic client records",
      "Fee & expense tracking",
      "Task management",
      "SMS & email hearing reminders",
      "Mobile-friendly web app",
      "Standard email support (48-hour SLA)",
    ],
    notIncluded: [
      "Team collaboration",
      "Advanced analytics & reports",
      "Bulk document upload",
      "Priority support",
      "Custom fields",
      "API access",
      "Dedicated account manager",
    ],
    highlighted: false,
    badge: "",
    ctaText: "Start Free Trial",
    ctaVariant: "outline",
  },
  {
    id: "chamber",
    name: "Chamber",
    tagline: "Built for advocates' chambers managing multiple clients and juniors.",
    monthlyPrice: 2499,
    yearlyPrice: 24999,
    yearlyPricePerMonth: Math.round(24999 / 12), // ≈ 2083
    users: 5,
    matters: 500,
    storage: 10,
    features: [
      "Up to 5 user seats",
      "Up to 500 active cases",
      "10 GB document storage",
      "Court hearing diary with reminders",
      "Full client & opposing-party records",
      "Fee & expense tracking with invoicing",
      "Task management with assignment",
      "SMS, email & WhatsApp reminders",
      "Team collaboration & notes",
      "Advanced reports (fees, hearings, tasks)",
      "Bulk document upload & tagging",
      "Custom case fields",
      "Priority email support (24-hour SLA)",
      "Onboarding call included",
    ],
    notIncluded: [
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA-backed uptime guarantee",
    ],
    highlighted: true,
    badge: "Recommended",
    ctaText: "Start Free Trial",
    ctaVariant: "primary",
  },
  {
    id: "firm",
    name: "Firm",
    tagline: "For established law firms that need full control and visibility.",
    monthlyPrice: 6999,
    yearlyPrice: 69999,
    yearlyPricePerMonth: Math.round(69999 / 12), // ≈ 5833
    users: 20,
    matters: null,
    storage: 50,
    features: [
      "Up to 20 user seats",
      "Unlimited active cases",
      "50 GB document storage",
      "Court hearing diary with reminders",
      "Full client, opposing-party & counsel records",
      "Fee & expense tracking with invoicing",
      "Task management with delegation",
      "SMS, email & WhatsApp reminders",
      "Team collaboration, notes & activity log",
      "Full analytics dashboard",
      "Bulk document upload, tagging & search",
      "Custom case & client fields",
      "Role-based access control",
      "Audit trail",
      "Priority phone & email support (8-hour SLA)",
      "Dedicated onboarding assistance",
    ],
    notIncluded: [
      "Dedicated account manager",
      "Custom API integrations",
      "On-premise deployment",
    ],
    highlighted: false,
    badge: "Best for Firms",
    ctaText: "Start Free Trial",
    ctaVariant: "default",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom plans for large firms, legal departments and bar associations.",
    monthlyPrice: null,
    yearlyPrice: null,
    yearlyPricePerMonth: null,
    users: null,
    matters: null,
    storage: null,
    features: [
      "Unlimited user seats",
      "Unlimited active cases",
      "Negotiated storage (on-cloud or on-premise)",
      "All Firm plan features",
      "Custom workflow automation",
      "API access & custom integrations",
      "SSO / Active Directory integration",
      "Dedicated account manager",
      "SLA-backed 99.9% uptime guarantee",
      "Custom onboarding & data migration",
      "In-person training for your team",
      "Legal-grade data processing agreement",
    ],
    notIncluded: [],
    highlighted: false,
    badge: "Custom",
    ctaText: "Contact Sales",
    ctaVariant: "secondary",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Discount
// ─────────────────────────────────────────────────────────────────────────────

/** Approximate saving percentage when choosing yearly billing over monthly. */
export const YEARLY_DISCOUNT_PERCENT = 17;

// ─────────────────────────────────────────────────────────────────────────────
// Feature comparison table
// ─────────────────────────────────────────────────────────────────────────────

export type ComparisonValue = boolean | string;

export interface ComparisonFeature {
  label: string;
  starter: ComparisonValue;
  chamber: ComparisonValue;
  firm: ComparisonValue;
  enterprise: ComparisonValue;
  /** Optional tooltip/footnote for the feature row. */
  note?: string;
}

export interface ComparisonCategory {
  category: string;
  features: ComparisonFeature[];
}

export const FEATURE_COMPARISON: ComparisonCategory[] = [
  {
    category: "Limits",
    features: [
      {
        label: "User seats",
        starter: "1",
        chamber: "Up to 5",
        firm: "Up to 20",
        enterprise: "Unlimited",
      },
      {
        label: "Active cases",
        starter: "50",
        chamber: "500",
        firm: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        label: "Document storage",
        starter: "1 GB",
        chamber: "10 GB",
        firm: "50 GB",
        enterprise: "Custom",
      },
    ],
  },
  {
    category: "Case Management",
    features: [
      {
        label: "Case creation & tracking",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Client & opposing-party records",
        starter: "Basic",
        chamber: "Full",
        firm: "Full",
        enterprise: "Full",
      },
      {
        label: "Custom case fields",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Unlimited cases",
        starter: false,
        chamber: false,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Court Diary & Hearings",
    features: [
      {
        label: "Hearing diary",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "SMS & email reminders",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "WhatsApp reminders",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
        note: "Sent via NyayVakil's WhatsApp Business integration.",
      },
      {
        label: "Calendar export (ICS / Google)",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Fees & Finance",
    features: [
      {
        label: "Fee & expense recording",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Client invoicing",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Payment tracking",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Financial reports",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Documents",
    features: [
      {
        label: "Document upload & storage",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Bulk document upload",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Full-text document search",
        starter: false,
        chamber: false,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Collaboration & Access",
    features: [
      {
        label: "Team notes & collaboration",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Task assignment to team members",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Role-based access control",
        starter: false,
        chamber: false,
        firm: true,
        enterprise: true,
      },
      {
        label: "Audit trail",
        starter: false,
        chamber: false,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Analytics & Reports",
    features: [
      {
        label: "Basic activity summary",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Advanced analytics dashboard",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Exportable reports (PDF / Excel)",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Support & Onboarding",
    features: [
      {
        label: "Email support",
        starter: "48-hr SLA",
        chamber: "24-hr SLA",
        firm: "8-hr SLA",
        enterprise: "Dedicated",
      },
      {
        label: "Phone support",
        starter: false,
        chamber: false,
        firm: true,
        enterprise: true,
      },
      {
        label: "Onboarding call",
        starter: false,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Dedicated account manager",
        starter: false,
        chamber: false,
        firm: false,
        enterprise: true,
      },
      {
        label: "Custom data migration",
        starter: false,
        chamber: false,
        firm: false,
        enterprise: true,
      },
    ],
  },
  {
    category: "Security & Compliance",
    features: [
      {
        label: "Data encrypted at rest & in transit",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "Daily automated backups",
        starter: true,
        chamber: true,
        firm: true,
        enterprise: true,
      },
      {
        label: "SSO / Active Directory",
        starter: false,
        chamber: false,
        firm: false,
        enterprise: true,
      },
      {
        label: "Data processing agreement (DPA)",
        starter: false,
        chamber: false,
        firm: false,
        enterprise: true,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pricing FAQ
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export const PRICING_FAQ: PricingFaqItem[] = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every paid plan includes a 14-day free trial with no credit card required. You get full access to all features of your chosen plan during the trial period.",
  },
  {
    question: "How does the yearly billing discount work?",
    answer:
      `When you choose yearly billing, you save approximately ${YEARLY_DISCOUNT_PERCENT}% compared to paying month to month. The full yearly amount is billed upfront and is non-refundable after 30 days.`,
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade your plan at any time and the difference is prorated. Downgrades take effect at the start of the next billing cycle.",
  },
  {
    question: "What happens when I exceed my case or storage limit?",
    answer:
      "You will receive an in-app notification before you reach your limit. You can upgrade your plan at any point or archive closed cases to free up space. We will not delete your data without notice.",
  },
  {
    question: "Do you offer a discount for bar associations or legal aid organisations?",
    answer:
      "Yes. We offer special pricing for bar associations, legal aid clinics, and NGOs working in the legal space. Please contact our sales team with details of your organisation.",
  },
  {
    question: "Is GST included in the displayed prices?",
    answer:
      "Prices shown are exclusive of GST. Applicable GST (currently 18%) will be added at checkout. A valid GST invoice is provided for all paid subscriptions.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, and NEFT/RTGS for yearly plans. All payments are processed securely via Razorpay.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Monthly plans can be cancelled anytime; unused days are not refunded. Yearly plans are eligible for a full refund within the first 30 days. After 30 days, yearly plans are non-refundable.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Legal disclaimer
// ─────────────────────────────────────────────────────────────────────────────

export const PRICING_DISCLAIMER =
  "All prices are in Indian Rupees (₹) and exclude GST at 18%. " +
  "NyayVakil reserves the right to revise pricing with 30 days' advance notice to existing subscribers. " +
  "Continued use after a price change constitutes acceptance of the new pricing.";
