// ─────────────────────────────────────────────────────────────────────────────
// NyayVakil – Marketing Content Configuration
// Static content for the landing page, testimonials, stats, and forms.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Lucide icon name string. Keep in sync with the icon set used in the UI. */
export type IconName =
  | "users"
  | "folder"
  | "calendar"
  | "indian-rupee"
  | "briefcase"
  | "bell"
  | "file-text"
  | "bar-chart-2"
  | "check-circle"
  | "shield"
  | "clock"
  | "layout-dashboard";

export interface Testimonial {
  /** Full name of the advocate. */
  name: string;
  /** Professional title, e.g. "Advocate, Delhi High Court". */
  title: string;
  city: string;
  /** 2–3 sentence quote about their experience using NyayVakil. */
  quote: string;
  /** Two-letter initials for the avatar fallback. */
  avatarInitials: string;
  /** Star rating out of 5. */
  stars: 1 | 2 | 3 | 4 | 5;
  /**
   * Indicates this is a placeholder testimonial used during early launch.
   * Set to false when replaced by a verified customer quote.
   */
  isPlaceholder: boolean;
}

export interface TrustStat {
  label: string;
  value: string;
  icon: IconName;
}

export interface FeatureHighlight {
  icon: IconName;
  title: string;
  description: string;
}

export interface RoiPoint {
  /** The pain point the advocate currently faces. */
  problem: string;
  /** How NyayVakil resolves that pain point. */
  solution: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Adv. Priya Menon",
    title: "Advocate, Kerala High Court",
    city: "Ernakulam",
    quote:
      "Before NyayVakil, I maintained three different registers and a separate Excel sheet for fees. " +
      "Now everything is in one place and I can pull up a client's entire history in seconds. " +
      "The hearing reminders alone have saved me from missing critical dates more than once.",
    avatarInitials: "PM",
    stars: 5,
    isPlaceholder: true,
  },
  {
    name: "Adv. Rajesh Sharma",
    title: "Senior Advocate, Delhi High Court",
    city: "New Delhi",
    quote:
      "Running a chamber with three juniors used to mean constant follow-up to know the status of each case. " +
      "NyayVakil gives me a single dashboard where I can see what every junior is working on without interrupting their day. " +
      "The fee tracking and invoicing have also made our billing process much more professional.",
    avatarInitials: "RS",
    stars: 5,
    isPlaceholder: true,
  },
  {
    name: "Adv. Sunita Patil",
    title: "Advocate, Bombay High Court",
    city: "Mumbai",
    quote:
      "I was sceptical about moving from paper registers to software, but the onboarding team walked me through every step patiently. " +
      "Within a week I had all my active cases entered and now I genuinely wonder how I managed without it. " +
      "The WhatsApp reminders to clients have been especially well received.",
    avatarInitials: "SP",
    stars: 5,
    isPlaceholder: true,
  },
  {
    name: "Adv. Mohammed Irfan",
    title: "Advocate, City Civil Court",
    city: "Hyderabad",
    quote:
      "As a solo advocate handling over 80 cases across the civil court and consumer forum, keeping track of dates was becoming unmanageable. " +
      "NyayVakil's hearing diary has completely sorted that problem. " +
      "The mobile-friendly interface means I can check tomorrow's cause list from inside the court corridor.",
    avatarInitials: "MI",
    stars: 4,
    isPlaceholder: true,
  },
  {
    name: "Adv. Kavitha Krishnamurthy",
    title: "Advocate, Madras High Court",
    city: "Chennai",
    quote:
      "What I appreciate most is that the platform understands Indian legal practice — the terminology, the court structure, the way cases are tracked. " +
      "It is not a generic project management tool dressed up for lawyers. " +
      "The document vault is particularly useful for attaching certified copies of orders directly to the case.",
    avatarInitials: "KK",
    stars: 5,
    isPlaceholder: true,
  },
  {
    name: "Adv. Amit Verma",
    title: "Partner, Verma & Associates",
    city: "Lucknow",
    quote:
      "We switched from a complicated legacy system to NyayVakil and the transition was smoother than expected. " +
      "Our team of eight adapted within two weeks and the firm's billing has become noticeably more organised. " +
      "The financial reports at the end of each month are now something I actually look forward to reviewing.",
    avatarInitials: "AV",
    stars: 4,
    isPlaceholder: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Trust statistics
// ─────────────────────────────────────────────────────────────────────────────

export const TRUST_STATS: TrustStat[] = [
  {
    label: "Advocates Onboarded",
    value: "500+",
    icon: "users",
  },
  {
    label: "Cases Tracked",
    value: "12,000+",
    icon: "folder",
  },
  {
    label: "Hearings Logged",
    value: "45,000+",
    icon: "calendar",
  },
  {
    label: "Fee Recoveries",
    value: "₹2.4Cr+",
    icon: "indian-rupee",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Feature highlights (landing page cards)
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    icon: "briefcase",
    title: "Case Management",
    description:
      "Create and organise cases by court, client, and practice area. Track status, key dates, and all related parties from one structured view.",
  },
  {
    icon: "calendar",
    title: "Court Hearing Diary",
    description:
      "Log every hearing date with court, bench, and purpose. View your schedule by day or week and export directly to Google Calendar.",
  },
  {
    icon: "indian-rupee",
    title: "Fee Tracking",
    description:
      "Record retainer fees, appearance fees, and expenses against each case. Generate client invoices and track outstanding payments with ease.",
  },
  {
    icon: "users",
    title: "Client Records",
    description:
      "Maintain comprehensive client profiles including contact details, case history, and communication logs. Ideal for conflict-of-interest checks.",
  },
  {
    icon: "file-text",
    title: "Document Vault",
    description:
      "Attach plaints, orders, vakalatnamas, and written statements directly to the relevant case. Access them securely from any device, anytime.",
  },
  {
    icon: "check-circle",
    title: "Task Management",
    description:
      "Create research, drafting, filing, and follow-up tasks linked to specific cases. Assign them to juniors or clerks and track completion.",
  },
  {
    icon: "bell",
    title: "Reminders",
    description:
      "Automatic SMS, email, and WhatsApp reminders before every hearing. Never miss a date or a task deadline, even on your busiest days.",
  },
  {
    icon: "bar-chart-2",
    title: "Reports & Insights",
    description:
      "Get a clear picture of your practice: pending cases, billing summaries, court-wise hearing counts, and team productivity — all exportable.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROI points (pain points solved)
// ─────────────────────────────────────────────────────────────────────────────

export const ROI_POINTS: RoiPoint[] = [
  {
    problem: "Missing hearing dates due to paper diaries and loose chits",
    solution: "Digital court diary with automatic SMS, email, and WhatsApp reminders",
  },
  {
    problem: "Chasing clients for fees with no clear record of what was billed",
    solution: "Case-wise fee register with invoicing and payment tracking",
  },
  {
    problem: "Searching through physical files and WhatsApp groups for documents",
    solution: "Organised document vault attached to each case, searchable from any device",
  },
  {
    problem: "No visibility into what juniors are working on or what is pending",
    solution: "Shared task board with assignment, due dates, and status tracking",
  },
  {
    problem: "No way to quickly check the history of a client or case before a call",
    solution: "Complete client and case timeline accessible in under 10 seconds",
  },
  {
    problem: "Month-end guesswork about how much the practice actually earned",
    solution: "Automated monthly billing and fee-collection reports, exportable as PDF or Excel",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Form option arrays
// ─────────────────────────────────────────────────────────────────────────────

export const PRACTICE_TYPES = [
  "Solo Advocate",
  "Advocate's Chamber",
  "Small Law Firm",
  "Legal Department",
  "Other",
] as const;

export type PracticeType = (typeof PRACTICE_TYPES)[number];

export const TEAM_SIZES = [
  "Just me",
  "2-5 members",
  "6-10 members",
  "11-20 members",
  "20+ members",
] as const;

export type TeamSize = (typeof TEAM_SIZES)[number];

/** Top 20 Indian cities by legal-sector relevance. */
export const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Bhopal",
  "Patna",
  "Ernakulam",
  "Nagpur",
  "Indore",
  "Coimbatore",
  "Surat",
  "Allahabad",
  "Other",
] as const;

export type City = (typeof CITIES)[number];
