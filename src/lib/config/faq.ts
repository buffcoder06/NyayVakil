// ─────────────────────────────────────────────────────────────────────────────
// NyayVakil – FAQ Configuration
// Organised by category for use across landing page, help centre, and chatbot.
// ─────────────────────────────────────────────────────────────────────────────

export type FaqCategoryId =
  | "general"
  | "features"
  | "pricing"
  | "technical"
  | "onboarding";

export interface FaqCategory {
  id: FaqCategoryId;
  label: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  /** 2–3 sentence answer in professional Indian English. */
  answer: string;
  category: FaqCategoryId;
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    description: "Basic questions about NyayVakil and who it is built for.",
  },
  {
    id: "features",
    label: "Features",
    description: "Details about specific features and how they work.",
  },
  {
    id: "pricing",
    label: "Pricing & Plans",
    description: "Questions about subscription plans, billing, and refunds.",
  },
  {
    id: "technical",
    label: "Technical",
    description: "Device compatibility, data security, and system requirements.",
  },
  {
    id: "onboarding",
    label: "Onboarding & Support",
    description: "Getting started, training, and how to reach our support team.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FAQ items
// ─────────────────────────────────────────────────────────────────────────────

export const FAQ_ITEMS: FaqItem[] = [
  // ── General ──────────────────────────────────────────────────────────────

  {
    id: "general-what-is-nyayvakil",
    question: "What is NyayVakil and who is it built for?",
    answer:
      "NyayVakil is a cloud-based legal practice management platform designed specifically for Indian advocates, chambers, and law firms. " +
      "It helps legal professionals manage their cases, court diaries, clients, fees, documents, and tasks in one organised workspace. " +
      "Whether you are a solo advocate or part of a 20-member firm, NyayVakil scales to fit the way you work.",
    category: "general",
  },
  {
    id: "general-solo-advocate",
    question: "Is NyayVakil useful for a solo advocate with a small practice?",
    answer:
      "Yes, NyayVakil was designed with the solo advocate in mind. The Starter plan (₹799/month) gives you a full court diary, case tracking, client records, and fee management — everything you need to keep your practice organised without the overhead of complex enterprise software. " +
      "Many solo advocates tell us that simply having all their hearing dates and client information in one place saves them several hours every week.",
    category: "general",
  },
  {
    id: "general-chambers",
    question: "Can an advocate's chamber with juniors and clerks use NyayVakil?",
    answer:
      "Absolutely. The Chamber plan supports up to 5 users, so your juniors and clerks can log hearing updates, add notes, and track tasks under their respective cases. " +
      "Role-based visibility ensures that each team member sees only what is relevant to their work. " +
      "The senior advocate retains full oversight of all cases and financials.",
    category: "general",
  },
  {
    id: "general-data-security",
    question: "How is my client data kept secure?",
    answer:
      "All data stored on NyayVakil is encrypted at rest using AES-256 and encrypted in transit using TLS 1.3. " +
      "Our servers are hosted in ISO 27001-certified data centres located in India, ensuring your data does not leave Indian jurisdiction. " +
      "We perform daily automated backups and you can export your data at any time.",
    category: "general",
  },
  {
    id: "general-legal-compliance",
    question: "Does NyayVakil comply with Indian data protection laws?",
    answer:
      "Yes. NyayVakil is built in compliance with the Information Technology (Amendment) Act, 2008 and aligns with the requirements of the Digital Personal Data Protection Act, 2023. " +
      "We do not sell or share your client data with any third party. " +
      "Enterprise customers can request a formal Data Processing Agreement (DPA).",
    category: "general",
  },
  {
    id: "general-practice-types",
    question: "Which courts and practice areas does NyayVakil support?",
    answer:
      "NyayVakil is practice-area agnostic and works for civil, criminal, family, corporate, consumer, labour, and tax cases across all levels of courts — from subordinate civil courts to the Supreme Court of India. " +
      "You can customise case types and fields to match the specific nomenclature and workflows of your practice area.",
    category: "general",
  },

  // ── Features ─────────────────────────────────────────────────────────────

  {
    id: "features-hearing-diary",
    question: "How does the court hearing diary work?",
    answer:
      "The hearing diary lets you log every upcoming date for each case along with the court, bench, and purpose of the hearing. " +
      "You can view your schedule by day, week, or month, and export it to Google Calendar or any ICS-compatible calendar app. " +
      "Automated SMS and email reminders are sent to you (and optionally to your client) before each hearing date.",
    category: "features",
  },
  {
    id: "features-reminders",
    question: "What kind of reminders does NyayVakil send?",
    answer:
      "NyayVakil sends hearing reminders via SMS and email by default, with WhatsApp reminders available on the Chamber and Firm plans. " +
      "You can configure how far in advance the reminder is sent — 24 hours, 48 hours, or a custom lead time. " +
      "Task due-date reminders and fee-follow-up nudges can also be configured for each case.",
    category: "features",
  },
  {
    id: "features-fee-tracking",
    question: "Can I track fees and expenses against each case?",
    answer:
      "Yes. Each case has a dedicated finance section where you can record retainer fees, appearance fees, drafting charges, court fees paid, and any out-of-pocket expenses. " +
      "The Chamber and Firm plans also let you generate client invoices and mark payments as received, so you always know your outstanding receivables. " +
      "Summary financial reports can be exported as PDF or Excel for your accounts.",
    category: "features",
  },
  {
    id: "features-documents",
    question: "How does document management work?",
    answer:
      "You can upload and attach documents — vakalatnama, plaints, written statements, orders, judgements — directly to the relevant case. " +
      "Documents are stored in encrypted cloud storage and can be accessed from any device. " +
      "The Firm plan adds full-text search across all uploaded documents, making it easy to find a specific order or clause.",
    category: "features",
  },
  {
    id: "features-tasks",
    question: "Can I create and assign tasks related to a case?",
    answer:
      "Yes. NyayVakil includes a task module where you can create action items linked to a specific case, set a due date, and assign them to any member of your team. " +
      "Tasks can be marked as pending, in-progress, or completed, and you receive a reminder when a task is approaching its due date. " +
      "This is particularly useful for tracking research, drafting, filing, and follow-up actions.",
    category: "features",
  },
  {
    id: "features-client-records",
    question: "What information can I store for each client?",
    answer:
      "Each client profile stores contact details, address, identification references, communication history, and a list of all linked cases. " +
      "You can also store details of opposing parties, their advocates, and counsel on the other side — useful for conflict-of-interest checks. " +
      "All client data is tied to your account and is not visible to other NyayVakil users.",
    category: "features",
  },
  {
    id: "features-expenses",
    question: "Can I track my own office expenses separately from client expenses?",
    answer:
      "Yes. NyayVakil distinguishes between client-billable expenses (charged to a specific case) and internal office expenses (overhead costs). " +
      "You can log court filing fees, stamp duties, travel expenses, and printing costs against the relevant case for billing purposes. " +
      "Office-level expenses such as rent, subscriptions, and staff salaries can be tracked in a separate expense register.",
    category: "features",
  },
  {
    id: "features-reports",
    question: "What kind of reports and insights does NyayVakil provide?",
    answer:
      "The Chamber and Firm plans include an analytics dashboard showing case status distribution, upcoming hearings, pending fees, task completion rates, and monthly billing summaries. " +
      "You can generate and export case-wise fee reports, client-wise activity reports, and court-wise hearing logs. " +
      "These reports help you identify which clients or cases consume the most time versus what they contribute to revenue.",
    category: "features",
  },

  // ── Pricing & Plans ───────────────────────────────────────────────────────

  {
    id: "pricing-plan-difference",
    question: "What is the main difference between the Starter, Chamber, and Firm plans?",
    answer:
      "The Starter plan is designed for a single advocate managing up to 50 cases independently. " +
      "The Chamber plan adds team collaboration for up to 5 users, a higher case limit of 500, invoicing, and WhatsApp reminders — ideal for a senior advocate working with juniors or clerks. " +
      "The Firm plan supports up to 20 users, unlimited cases, role-based access, audit trails, and advanced analytics for established law offices.",
    category: "pricing",
  },
  {
    id: "pricing-upgrade",
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "You can upgrade your plan at any time from within your account settings and the cost difference will be prorated for the remainder of the billing period. " +
      "Downgrades take effect at the start of your next billing cycle, so you continue to enjoy your current plan's features until then. " +
      "If you downgrade to a plan with lower limits, you will not lose any existing data — you will simply be unable to add new records beyond the plan limits.",
    category: "pricing",
  },
  {
    id: "pricing-refund",
    question: "What is the refund policy?",
    answer:
      "Monthly subscriptions can be cancelled anytime, but unused days in the current month are not refunded. " +
      "Yearly subscriptions are fully refundable within the first 30 days from the date of purchase. " +
      "After 30 days, yearly subscriptions are non-refundable, though you may continue using the plan until the subscription term ends.",
    category: "pricing",
  },
  {
    id: "pricing-yearly-discount",
    question: "How much do I save on the yearly plan?",
    answer:
      "Choosing annual billing saves you approximately 17% compared to paying month to month. " +
      "For example, the Chamber plan costs ₹2,499/month when billed monthly (₹29,988/year), but only ₹24,999 when billed annually — a saving of nearly ₹5,000. " +
      "The yearly amount is charged upfront in a single transaction.",
    category: "pricing",
  },
  {
    id: "pricing-gst",
    question: "Is GST included in the listed prices?",
    answer:
      "No, the prices listed on our website are exclusive of GST. Applicable GST at 18% is added at the time of checkout. " +
      "A GST-compliant tax invoice is generated automatically for every subscription payment and can be downloaded from your billing dashboard. " +
      "If you are registered under GST, you may be eligible to claim input tax credit on your subscription.",
    category: "pricing",
  },
  {
    id: "pricing-free-trial",
    question: "Is there a free trial available?",
    answer:
      "Yes, every plan comes with a 14-day free trial and no credit card is required to start. " +
      "You get full access to all features of the plan you select during the trial period. " +
      "At the end of the trial, you can choose to subscribe or your account will be paused — your data is retained for 30 days in case you wish to return.",
    category: "pricing",
  },

  // ── Technical ─────────────────────────────────────────────────────────────

  {
    id: "technical-mobile",
    question: "Is there a mobile app for NyayVakil?",
    answer:
      "NyayVakil is a mobile-responsive web application that works on any smartphone browser — no download required. " +
      "You can add it to your home screen on Android or iOS for a near-native app experience. " +
      "A dedicated Android and iOS app is on our roadmap for a future release.",
    category: "technical",
  },
  {
    id: "technical-browsers",
    question: "Which browsers are supported?",
    answer:
      "NyayVakil works on all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari (version 15 and above). " +
      "We recommend using Google Chrome for the best experience. " +
      "Internet Explorer is not supported.",
    category: "technical",
  },
  {
    id: "technical-data-migration",
    question: "Can I import my existing data into NyayVakil?",
    answer:
      "Yes. NyayVakil supports bulk import of client and case records via structured CSV/Excel templates that you can download from within the app. " +
      "Documents can be uploaded in bulk using our batch upload tool. " +
      "Enterprise customers are provided dedicated data migration assistance to help move data from existing systems or spreadsheets.",
    category: "technical",
  },
  {
    id: "technical-internet",
    question: "Does NyayVakil require a constant internet connection?",
    answer:
      "Yes, NyayVakil is a cloud-based platform and requires an active internet connection to use. " +
      "However, all pages load quickly even on a standard 4G mobile connection, so you can access your case details and hearing diary from court premises. " +
      "Offline functionality is planned as a future enhancement.",
    category: "technical",
  },
  {
    id: "technical-backups",
    question: "How is my data backed up?",
    answer:
      "NyayVakil performs automated daily backups of all user data, stored in geographically redundant locations within India. " +
      "Backups are retained for 30 days. In the event of data loss due to a system failure on our side, we can restore your data to within 24 hours of the incident. " +
      "You can also export a full copy of your data at any time from your account settings.",
    category: "technical",
  },
  {
    id: "technical-data-export",
    question: "Can I export my data if I decide to leave NyayVakil?",
    answer:
      "Yes. You own your data and can export all your case records, client information, and financial data as CSV/Excel files at any time. " +
      "Documents can be downloaded individually or as a bulk ZIP archive. " +
      "We believe in giving you full control over your data without lock-in.",
    category: "technical",
  },

  // ── Onboarding & Support ──────────────────────────────────────────────────

  {
    id: "onboarding-setup-time",
    question: "How long does it take to set up NyayVakil?",
    answer:
      "Most advocates are up and running within 30 minutes. Creating your account, setting up your profile, and adding your first few cases takes under an hour even for those who are not very familiar with technology. " +
      "For chambers and firms importing existing data, a typical setup takes one to two business days with the help of our onboarding team. " +
      "We provide step-by-step guides, video tutorials, and live support to help you get started.",
    category: "onboarding",
  },
  {
    id: "onboarding-training",
    question: "Is any training provided?",
    answer:
      "Yes. All users have access to our self-paced video tutorial library and detailed help articles in English and Hindi. " +
      "Chamber and Firm plan subscribers receive a one-on-one onboarding call with a product specialist who walks you through setup and best practices. " +
      "Enterprise customers receive custom in-person or virtual training sessions for their entire team.",
    category: "onboarding",
  },
  {
    id: "onboarding-support-channels",
    question: "How can I reach the support team?",
    answer:
      "You can reach us via email at info@nyayvakil.in, through the in-app live chat (available on all plans), or by phone (available on the Firm and Enterprise plans). " +
      "Our support team is available Monday to Saturday, 9 AM to 7 PM IST. " +
      "Email support response times depend on your plan: 48 hours for Starter, 24 hours for Chamber, and 8 hours for Firm.",
    category: "onboarding",
  },
  {
    id: "onboarding-help-language",
    question: "Is support available in Hindi or regional languages?",
    answer:
      "Our support team can assist you in English and Hindi. " +
      "Help documentation is currently available in English, with Hindi translations being added progressively. " +
      "If you prefer to communicate in another language, please let us know and we will do our best to accommodate you.",
    category: "onboarding",
  },
  {
    id: "onboarding-onboarding-call",
    question: "What happens during the onboarding call?",
    answer:
      "The onboarding call is a 30–45 minute video call with a NyayVakil product specialist who helps you configure your account, import any existing data, and set up your team members. " +
      "We also walk through the key workflows relevant to your practice type so you can start using the platform confidently from day one. " +
      "You can book the call at a time that suits your schedule through the link sent to you after subscribing.",
    category: "onboarding",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all FAQ items belonging to the given category.
 *
 * @example
 * const pricingFAQs = getFAQByCategory("pricing");
 */
export function getFAQByCategory(category: FaqCategoryId): FaqItem[] {
  return FAQ_ITEMS.filter((item) => item.category === category);
}
