import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  IndianRupee,
  Users,
  FolderOpen,
  ListTodo,
  Bell,
  BarChart3,
  Check,
  X,
  ArrowRight,
  Hash,
  Layers,
  Flag,
  UserRound,
  Handshake,
  History,
  CalendarCheck,
  RotateCcw,
  Eye,
  CreditCard,
  Receipt,
  AlertCircle,
  Building2,
  Phone,
  LinkIcon,
  FileText,
  Tag,
  Search,
  Shield,
  ClipboardList,
  Clock,
  MessageSquare,
  Mail,
  TrendingUp,
  PieChart,
  Wallet,
} from "lucide-react";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore NyayVakil's full feature set — case management, court diary, fee tracking, client records, documents, team coordination, and more. Built for Indian advocates.",
};

// ─── Navigation tabs ──────────────────────────────────────────────────────────

const FEATURE_TABS = [
  { label: "Case Management", href: "#case-management" },
  { label: "Court Diary", href: "#hearing-diary" },
  { label: "Fee Tracking", href: "#fee-tracking" },
  { label: "Clients", href: "#clients" },
  { label: "Documents", href: "#documents" },
  { label: "Team", href: "#team" },
  { label: "Reminders", href: "#reminders" },
  { label: "Reports", href: "#reports" },
];

// ─── Comparison data ──────────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  {
    feature: "Hearing management",
    with: "Calendar view, adjournment tracking, appearance status, auto-reminders",
    without: "Manual diary or Excel sheet — easy to miss dates",
  },
  {
    feature: "Fee tracking",
    with: "Per-case fee agreements, received vs pending, overdue alerts, payment history",
    without: "Rough notes or separate spreadsheets — prone to errors",
  },
  {
    feature: "Client records",
    with: "Unified client profile with linked cases, outstanding balance, and activity history",
    without: "Scattered across files, registers, and WhatsApp messages",
  },
  {
    feature: "Document storage",
    with: "Categorised vault with tagging, search, and client/case linking",
    without: "Physical files or unorganised hard drive folders",
  },
  {
    feature: "Team coordination",
    with: "Task assignment to junior/clerk, due dates, priority, shared case visibility",
    without: "Verbal instructions, forgotten tasks, no accountability",
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 uppercase"
      style={{ backgroundColor: "#14213D15", color: "#14213D" }}
    >
      {children}
    </span>
  );
}

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
        style={{ backgroundColor: "#14213D18" }}
      >
        <Icon className="w-3.5 h-3.5 text-[#14213D]" strokeWidth={2} />
      </div>
      <span className="text-sm text-slate-700 leading-snug">{label}</span>
    </div>
  );
}

// ─── Mock UI placeholders ─────────────────────────────────────────────────────

function MatterCardMock() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Case</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
        >
          Active
        </span>
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">Sharma v. Municipal Corporation</p>
        <p className="text-xs text-slate-500 mt-0.5">CNR: DLHC01-000123-2024</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ["Court", "Delhi HC"],
          ["Type", "Civil Writ"],
          ["Priority", "High"],
          ["Opposite", "Adv. Mehta"],
        ].map(([k, v]) => (
          <div key={k} className="bg-slate-50 rounded-lg px-2.5 py-2">
            <p className="text-slate-400 mb-0.5">{k}</p>
            <p className="font-semibold text-slate-700">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 pt-1">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs text-slate-500">Next hearing: 28 Mar 2026</span>
      </div>
    </div>
  );
}

function DiaryMock() {
  const entries = [
    { time: "10:00", matter: "Sharma v. Corp", court: "Delhi HC – Room 5", purpose: "Arguments" },
    { time: "11:30", matter: "Gupta Estate", court: "Dist. Court – F12", purpose: "Evidence" },
    { time: "14:00", matter: "Kumar v. State", court: "SC – Chamber 3", purpose: "Judgment" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 font-medium">Today's Diary</p>
          <p className="text-sm font-bold text-slate-800">Friday, 28 Mar 2026</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#eff6ff", color: "#14213D" }}
        >
          3 hearings
        </span>
      </div>
      <div className="space-y-2.5">
        {entries.map((e) => (
          <div
            key={e.matter}
            className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div className="text-center shrink-0">
              <p className="text-xs font-bold" style={{ color: "#14213D" }}>{e.time}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{e.matter}</p>
              <p className="text-xs text-slate-500">{e.court}</p>
              <span className="text-[10px] text-slate-400">{e.purpose}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeeTrackerMock() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-4">
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Fee Summary</p>
        <p className="text-sm font-bold text-slate-800 mt-0.5">Sharma v. Municipal Corp.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { label: "Total Agreed", val: "₹75,000", color: "#334155" },
          { label: "Received", val: "₹45,000", color: "#065f46" },
          { label: "Pending", val: "₹30,000", color: "#b45309" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-2.5">
            <p className="text-slate-400 mb-1">{label}</p>
            <p className="font-bold text-sm" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>
      <div className="pt-1">
        <p className="text-xs text-slate-500 font-medium mb-2">Recent payments</p>
        {[
          { date: "15 Mar", amount: "₹20,000", method: "UPI" },
          { date: "02 Feb", amount: "₹25,000", method: "Bank Transfer" },
        ].map((p) => (
          <div key={p.date} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
            <span className="text-slate-500">{p.date}</span>
            <span className="font-semibold text-slate-700">{p.amount}</span>
            <span className="text-slate-400">{p.method}</span>
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 p-2.5 rounded-xl text-xs"
        style={{ backgroundColor: "#fef3c7" }}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-amber-800">Payment overdue by 12 days</span>
      </div>
    </div>
  );
}

function ClientProfileMock() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: "#14213D" }}
        >
          RS
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">Rajesh Sharma</p>
          <p className="text-xs text-slate-500">Individual Client</p>
        </div>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
        >
          ₹30,000 due
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: "Phone", val: "+91 98765 43210" },
          { label: "Cases", val: "3 active" },
          { label: "Total fees", val: "₹1,20,000" },
          { label: "Member since", val: "Jan 2024" },
        ].map(({ label, val }) => (
          <div key={label} className="bg-slate-50 rounded-lg px-2.5 py-2">
            <p className="text-slate-400 mb-0.5">{label}</p>
            <p className="font-semibold text-slate-700">{val}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1.5">Linked cases</p>
        {["Sharma v. Corp", "Sharma Prop. Dispute", "PF Claim – 2025"].map((m) => (
          <div key={m} className="flex items-center gap-1.5 text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#14213D" }} />
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentVaultMock() {
  const docs = [
    { name: "Vakalatnama.pdf", tag: "Vakalatnama", size: "120 KB" },
    { name: "WP_Petition_2024.pdf", tag: "Petition", size: "2.4 MB" },
    { name: "Affidavit_RS.pdf", tag: "Affidavit", size: "340 KB" },
    { name: "Court_Order_Mar.pdf", tag: "Order", size: "780 KB" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-800">Document Register</p>
        <span className="text-xs text-slate-400">4 files</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-400">
        <Search className="w-3.5 h-3.5" />
        Search documents...
      </div>
      <div className="space-y-2">
        {docs.map((d) => (
          <div key={d.name} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{d.name}</p>
              <p className="text-[10px] text-slate-400">{d.size}</p>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: "#eff6ff", color: "#14213D" }}
            >
              {d.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskBoardMock() {
  const tasks = [
    { title: "File WP petition", assignee: "Jr. Priya", priority: "High", due: "25 Mar", color: "#fee2e2", textColor: "#991b1b" },
    { title: "Prepare cross-exam questions", assignee: "Self", priority: "Medium", due: "27 Mar", color: "#fef3c7", textColor: "#92400e" },
    { title: "Send vakalatnama to client", assignee: "Clerk Raju", priority: "Low", due: "29 Mar", color: "#d1fae5", textColor: "#065f46" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-3">
      <p className="text-sm font-bold text-slate-800">Team Tasks</p>
      {tasks.map((t) => (
        <div key={t.title} className="p-3 rounded-xl border border-slate-100 space-y-2">
          <p className="text-xs font-semibold text-slate-800">{t.title}</p>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: "#14213D" }}
            >
              {t.assignee.charAt(0)}
            </div>
            <span className="text-xs text-slate-500">{t.assignee}</span>
            <span
              className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: t.color, color: t.textColor }}
            >
              {t.priority}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            Due {t.due}
          </div>
        </div>
      ))}
    </div>
  );
}

function RemindersMock() {
  const reminders = [
    { type: "Hearing", matter: "Sharma v. Corp", channel: "WhatsApp", time: "1 day before" },
    { type: "Payment", matter: "Gupta Estate fees", channel: "SMS", time: "Overdue" },
    { type: "Hearing", matter: "Kumar v. State", channel: "Email", time: "2 hours before" },
  ];

  const channelIcon: Record<string, React.ReactNode> = {
    WhatsApp: <MessageSquare className="w-3.5 h-3.5 text-green-600" />,
    SMS: <Phone className="w-3.5 h-3.5 text-blue-500" />,
    Email: <Mail className="w-3.5 h-3.5 text-slate-500" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-3">
      <p className="text-sm font-bold text-slate-800">Scheduled Reminders</p>
      {reminders.map((r) => (
        <div key={r.matter} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
          <Bell className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#14213D" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800">{r.matter}</p>
            <p className="text-[10px] text-slate-400">{r.type} reminder · {r.time}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {channelIcon[r.channel]}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px] text-slate-500">
        {["WhatsApp", "SMS", "Email"].map((c) => (
          <div key={c} className="bg-slate-50 rounded-lg py-1.5 font-medium">{c}</div>
        ))}
      </div>
    </div>
  );
}

function ReportsMock() {
  const bars = [
    { month: "Nov", income: 65, expense: 30 },
    { month: "Dec", income: 80, expense: 40 },
    { month: "Jan", income: 55, expense: 25 },
    { month: "Feb", income: 90, expense: 45 },
    { month: "Mar", income: 75, expense: 35 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 w-full max-w-sm mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-800">Income vs Expenses</p>
        <span className="text-xs text-slate-400">Last 5 months</span>
      </div>
      {/* Simple bar chart */}
      <div className="flex items-end gap-2 h-24">
        {bars.map((b) => (
          <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5">
              <div
                className="flex-1 rounded-t"
                style={{ height: `${b.income}%`, backgroundColor: "#14213D" }}
              />
              <div
                className="flex-1 rounded-t"
                style={{ height: `${b.expense}%`, backgroundColor: "#94a3b8" }}
              />
            </div>
            <span className="text-[9px] text-slate-400">{b.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#14213D" }} />
          Income
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
          Expenses
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { label: "Net income", val: "₹2.1L", color: "#065f46" },
          { label: "Outstanding", val: "₹68K", color: "#b45309" },
          { label: "Tasks done", val: "34", color: "#14213D" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-2">
            <p className="text-slate-400 mb-0.5">{label}</p>
            <p className="font-bold text-sm" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Sections ─────────────────────────────────────────────────────────

function FeatureSection({
  id,
  label,
  title,
  description,
  features,
  visual,
  reversed = false,
}: {
  id: string;
  label: string;
  title: string;
  description: string;
  features: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string }[];
  visual: React.ReactNode;
  reversed?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20",
        reversed ? "bg-slate-50/60" : "bg-white",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={[
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            reversed ? "lg:[&>*:first-child]:order-2" : "",
          ].join(" ")}
        >
          {/* Content */}
          <div>
            <SectionLabel>{label}</SectionLabel>
            <h2 className="font-brand text-2xl sm:text-3xl font-normal text-slate-900 mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">{description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map(({ icon, label: fl }) => (
                <FeaturePill key={fl} icon={icon} label={fl} />
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="flex items-center justify-center">{visual}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 uppercase"
            style={{ backgroundColor: "#14213D15", color: "#14213D" }}
          >
            Features
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 leading-tight mb-5">
            Everything your legal practice needs
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            NyayVakil brings your cases, hearings, fees, documents, and team under one roof —
            designed specifically for how Indian advocates work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#14213D" }}
            >
              Start Free
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Navigation Tabs ──────────────────────────────────────── */}
      <div
        className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
        aria-label="Feature sections"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px" aria-label="Feature navigation">
            {FEATURE_TABS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="shrink-0 px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300 transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Case & Matter Management ─────────────────────────────────────── */}
      <FeatureSection
        id="case-management"
        label="Case Management"
        title="Every case, perfectly organised"
        description="Create and manage cases with all the details you need — CNR numbers, court levels, case types, parties, and fee agreements. Track every stage of a case from first instruction to final disposal."
        features={[
          { icon: Hash, label: "Case creation with CNR number" },
          { icon: Layers, label: "Case type categorisation" },
          { icon: Building2, label: "Court level tracking" },
          { icon: Briefcase, label: "Case status — active / pending / disposed" },
          { icon: Flag, label: "Priority flags" },
          { icon: UserRound, label: "Opposite party and advocate details" },
          { icon: Handshake, label: "Fee agreement linked to case" },
          { icon: History, label: "Case timeline (coming soon)" },
        ]}
        visual={<MatterCardMock />}
      />

      {/* ── Court Diary & Hearings ───────────────────────────────────────── */}
      <FeatureSection
        id="hearing-diary"
        label="Court Diary & Hearings"
        title="Never miss a hearing date"
        description="Your entire court diary in one place. View hearings by date, log adjournments, track appearance status, and link each hearing to the relevant case and client — no more missed dates."
        features={[
          { icon: CalendarDays, label: "Calendar-style hearing management" },
          { icon: CalendarCheck, label: "Date-wise diary view" },
          { icon: RotateCcw, label: "Adjournment tracking" },
          { icon: ListTodo, label: "Hearing purpose tracking" },
          { icon: Eye, label: "Appearance status logging" },
          { icon: LinkIcon, label: "Case and client linked to each hearing" },
        ]}
        visual={<DiaryMock />}
        reversed
      />

      {/* ── Fee & Payment Tracking ───────────────────────────────────────── */}
      <FeatureSection
        id="fee-tracking"
        label="Fee & Payment Tracking"
        title="Know exactly who owes you what"
        description="Set the total fee agreed per case and track every payment received. Get instant visibility into outstanding balances, overdue fees and full payment history — case by case and client by client."
        features={[
          { icon: IndianRupee, label: "Total fee agreed per case" },
          { icon: Wallet, label: "Received vs pending breakdown" },
          { icon: AlertCircle, label: "Overdue fees flagged automatically" },
          { icon: CreditCard, label: "Payment method tracking (cash, UPI, bank, cheque)" },
          { icon: Receipt, label: "Fee reports as CSV for Excel" },
          { icon: Users, label: "Client-wise outstanding balance" },
        ]}
        visual={<FeeTrackerMock />}
      />

      {/* ── Client Management ────────────────────────────────────────────── */}
      <FeatureSection
        id="clients"
        label="Client Management"
        title="Complete client profiles at your fingertips"
        description="Maintain a clean, searchable client database. Each client profile links their cases and payments and shows outstanding dues — so you always have context before a call or meeting."
        features={[
          { icon: UserRound, label: "Individual and company clients" },
          { icon: Phone, label: "Contact details and notes" },
          { icon: LinkIcon, label: "Linked cases per client" },
          { icon: IndianRupee, label: "Outstanding balance at a glance" },
          { icon: History, label: "Activity history (coming soon)" },
          { icon: Building2, label: "Company and entity support" },
        ]}
        visual={<ClientProfileMock />}
        reversed
      />

      {/* ── Document Vault ───────────────────────────────────────────────── */}
      <FeatureSection
        id="documents"
        label="Document Register"
        title="All your legal documents, always findable"
        description="Keep a register of every vakalatnama, petition, affidavit and court order — categorised and linked to its case and client, so everything is where you'd expect it. Uploading the files themselves is coming soon."
        features={[
          { icon: FolderOpen, label: "Document register per case" },
          { icon: Tag, label: "Categories — vakalatnama, affidavit, petitions" },
          { icon: FolderOpen, label: "File uploads (coming soon)" },
          { icon: Search, label: "Search by name and category" },
          { icon: LinkIcon, label: "Linked to client and case" },
          { icon: Shield, label: "Secure and private" },
        ]}
        visual={<DocumentVaultMock />}
      />

      {/* ── Team Coordination ────────────────────────────────────────────── */}
      <FeatureSection
        id="team"
        label="Team Coordination"
        title="Keep every task on track"
        description="Track drafting, filing and follow-ups with due dates and priorities, linked to each case. Team access is coming soon, so you'll be able to assign work to your junior and clerk and see what everyone is doing."
        features={[
          { icon: ClipboardList, label: "Assign tasks to junior / clerk (coming soon)" },
          { icon: Clock, label: "Due dates and priority levels" },
          { icon: Eye, label: "Team visibility into cases (coming soon)" },
          { icon: Shield, label: "Role-based access (coming soon)" },
          { icon: ListTodo, label: "Task status tracking" },
          { icon: Users, label: "Multi-user support (coming soon)" },
        ]}
        visual={<TaskBoardMock />}
        reversed
      />

      {/* ── Reminders & Notifications ────────────────────────────────────── */}
      <FeatureSection
        id="reminders"
        label="Reminders & Notifications"
        title="Never forget to update a client"
        description="Prepare reminders for hearings, pending fees and document requests from ready-made templates. The bell tells you when each one is due. Automatic sending by WhatsApp, SMS and email is coming soon."
        features={[
          { icon: Bell, label: "Hearing reminders" },
          { icon: IndianRupee, label: "Payment due reminders" },
          { icon: MessageSquare, label: "Automatic WhatsApp sending (coming soon)" },
          { icon: Phone, label: "Automatic SMS sending (coming soon)" },
          { icon: Mail, label: "Automatic email sending (coming soon)" },
          { icon: FileText, label: "Reminder templates" },
          { icon: Clock, label: "Due-reminder alerts in the app" },
        ]}
        visual={<RemindersMock />}
      />

      {/* ── Reports & Insights ───────────────────────────────────────────── */}
      <FeatureSection
        id="reports"
        label="Reports & Insights"
        title="Run your practice with data, not gut feel"
        description="Monthly collections vs expenses, case status breakdowns, outstanding fees by client and task progress — with every report downloadable as CSV for Excel."
        features={[
          { icon: TrendingUp, label: "Monthly income vs expenses chart" },
          { icon: PieChart, label: "Case status breakdown" },
          { icon: Wallet, label: "Outstanding receivables overview" },
          { icon: Users, label: "Task progress" },
          { icon: BarChart3, label: "CSV export for Excel" },
          { icon: IndianRupee, label: "Revenue and collection metrics" },
        ]}
        visual={<ReportsMock />}
        reversed
      />

      {/* ── Comparison Table ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Why NyayVakil</SectionLabel>
            <h2 className="font-brand text-2xl sm:text-3xl font-normal text-slate-900 mb-3">
              NyayVakil vs manual methods
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              See how NyayVakil compares to the Excel sheets, paper registers, and scattered
              files most advocates rely on today.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-left font-semibold text-slate-700 w-1/3">
                    Area
                  </th>
                  <th className="px-5 py-4 text-left font-semibold" style={{ color: "#14213D" }}>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                      With NyayVakil
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 shrink-0 text-slate-400" strokeWidth={2.5} />
                      Without (Excel / Paper)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={[
                      "border-t border-slate-100",
                      i % 2 === 1 ? "bg-slate-50/60" : "",
                    ].join(" ")}
                  >
                    <td className="px-5 py-4 font-semibold text-slate-700">{row.feature}</td>
                    <td className="px-5 py-4 text-slate-700 align-top">
                      <div className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "#14213D" }}
                          strokeWidth={2.5}
                        />
                        {row.with}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 align-top">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" strokeWidth={2} />
                        {row.without}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-center"
        style={{ backgroundColor: "#14213D" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-brand text-2xl sm:text-3xl font-normal text-white mb-4">
            Ready to modernise your practice?
          </h2>
          <p className="text-slate-300 mb-8 text-base leading-relaxed">
            Set up your chamber in two minutes and manage your practice smarter with NyayVakil.
            Free during early access — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white transition-all hover:bg-slate-100 active:scale-[0.98]"
              style={{ color: "#14213D" }}
            >
              Start Free
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Free during early access · No credit card required
          </p>
        </div>
      </section>
    </div>
  );
}
