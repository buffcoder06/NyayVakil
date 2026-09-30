import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  Briefcase,
  CalendarDays,
  CreditCard,
  Users,
  FolderOpen,
  ClipboardList,
  CheckCircle,
  Star,
  ArrowRight,
  Scale,
  Bell,
  FileText,
  TrendingUp,
  Shield,
  Smartphone,
} from "lucide-react";

// ─────────────────────────────────────────────
// NyayVakil — Main Landing Page (Server Component)
// ─────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Logo tone="light" size="sm" />
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/features" className="text-sm text-slate-600 hover:text-[#14213D]">Features</Link>
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-[#14213D]">Pricing</Link>
            <Link href="/demo" className="text-sm text-slate-600 hover:text-[#14213D]">Demo</Link>
            <Link href="/faq" className="text-sm text-slate-600 hover:text-[#14213D]">FAQ</Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:text-[#14213D]">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-600 hover:text-[#14213D] md:block"
            >
              Sign In
            </Link>
            <Link
              href="/free-trial"
              className="rounded-lg bg-[#14213D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0E182E] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* ── Section 1: Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 px-6 pb-24 pt-20">
        {/* Accent shape top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-10"
          style={{ background: "#14213D" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-16 top-8 h-64 w-64 rounded-full opacity-5"
          style={{ background: "#14213D" }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Now in early access — join 500+ advocates
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#14213D] sm:text-5xl lg:text-6xl">
            Your Legal Practice,{" "}
            <span className="relative">
              <span className="relative z-10">Organised.</span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-0 -z-0 h-3 w-full opacity-20 rounded"
                style={{ background: "#14213D" }}
              />
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
            NyayVakil helps Indian advocates, chambers, and small law firms manage cases, hearings, fees, clients, and documents — all from one place.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-trial"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#0E182E] transition-colors"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#14213D] px-8 py-3.5 text-base font-semibold text-[#14213D] hover:bg-slate-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            No credit card required · Setup in minutes · Cancel anytime
          </p>
        </div>

        {/* Mock Dashboard Screenshot */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="ml-4 flex-1 rounded-md bg-white px-4 py-1 text-xs text-slate-400">
                app.nyayvakil.in/dashboard
              </div>
            </div>
            {/* Fake dashboard UI */}
            <div className="bg-slate-50 p-6">
              {/* Top stats row */}
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Active Matters", value: "34" },
                  { label: "Today's Hearings", value: "6" },
                  { label: "Fee Pending", value: "₹84,500" },
                  { label: "Tasks Due", value: "11" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-[#14213D]">{stat.value}</p>
                  </div>
                ))}
              </div>
              {/* Two column layout */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Hearing list mock */}
                <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Today's Court Diary</p>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-[#14213D]">Delhi HC</span>
                  </div>
                  {[
                    { time: "10:30 AM", matter: "Sharma v. State of Delhi", court: "Court No. 4" },
                    { time: "12:00 PM", matter: "Mehta Industries Ltd.", court: "Court No. 11" },
                    { time: "02:15 PM", matter: "Gupta & Sons v. HDFC", court: "Court No. 7" },
                  ].map((h) => (
                    <div key={h.time} className="flex items-center gap-3 border-t border-slate-100 py-2.5">
                      <span className="w-16 shrink-0 text-xs font-medium text-[#14213D]">{h.time}</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700">{h.matter}</p>
                        <p className="text-xs text-slate-400">{h.court}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">Scheduled</span>
                    </div>
                  ))}
                </div>
                {/* Fee overview mock */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Fee Overview</p>
                  {[
                    { label: "Total Agreed", value: "₹3,20,000", color: "bg-slate-200" },
                    { label: "Received", value: "₹2,35,500", color: "bg-emerald-400" },
                    { label: "Pending", value: "₹84,500", color: "bg-amber-400" },
                  ].map((f) => (
                    <div key={f.label} className="mb-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">{f.label}</span>
                        <span className="font-semibold text-slate-700">{f.value}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-1.5 rounded-full ${f.color}`}
                          style={{ width: f.label === "Total Agreed" ? "100%" : f.label === "Received" ? "73%" : "26%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Trust Stats ── */}
      <section className="border-y border-slate-100 bg-white px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { stat: "500+", label: "Advocates" },
              { stat: "12,000+", label: "Matters Tracked" },
              { stat: "45,000+", label: "Hearings Logged" },
              { stat: "₹2.4Cr+", label: "Fee Recoveries" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center"
              >
                <p className="text-3xl font-extrabold text-[#14213D]">{item.stat}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Problem → Solution ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              Built for how Indian lawyers actually work
            </h2>
            <p className="mt-3 text-slate-500">
              We designed NyayVakil around the real challenges of daily legal practice in India.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                problem: "Paper diaries miss hearing dates",
                solution: "Digital court diary with reminders",
                problemIcon: "📋",
                solutionIcon: "📅",
              },
              {
                problem: "Fee recoveries tracked in Excel",
                solution: "Automatic payment tracking and alerts",
                problemIcon: "📊",
                solutionIcon: "💰",
              },
              {
                problem: "WhatsApp messages for case updates",
                solution: "Structured client and matter records",
                problemIcon: "💬",
                solutionIcon: "📁",
              },
            ].map((item) => (
              <div key={item.problem} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Problem */}
                <div className="border-b border-slate-100 bg-red-50 px-6 py-5">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">Before</p>
                  <p className="text-sm font-medium text-slate-700">{item.problem}</p>
                </div>
                {/* Arrow indicator */}
                <div className="flex items-center justify-center py-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#14213D] text-white text-xs">
                    ↓
                  </div>
                </div>
                {/* Solution */}
                <div className="border-t border-slate-100 bg-emerald-50 px-6 py-5">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600">With NyayVakil</p>
                  <p className="text-sm font-semibold text-slate-800">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Key Features ── */}
      <section id="features" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              Everything your practice needs
            </h2>
            <p className="mt-3 text-slate-500">
              Purpose-built features for the Indian legal workflow — nothing you don't need, everything you do.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Briefcase className="h-6 w-6" />,
                title: "Case & Matter Management",
                desc: "Track every case, CNR number, court, status, and timeline in one structured workspace.",
              },
              {
                icon: <CalendarDays className="h-6 w-6" />,
                title: "Court Diary",
                desc: "Date-wise hearing schedule with adjournment tracking and next date visibility.",
              },
              {
                icon: <CreditCard className="h-6 w-6" />,
                title: "Fee & Payment Tracking",
                desc: "Know exactly what is due, received, and overdue — broken down by matter and client.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Client Records",
                desc: "Individual and firm clients with full matter linkage, contact history, and documents.",
              },
              {
                icon: <FolderOpen className="h-6 w-6" />,
                title: "Document Vault",
                desc: "Upload and organise vakalatnamas, affidavits, petitions, and all case files securely.",
              },
              {
                icon: <ClipboardList className="h-6 w-6" />,
                title: "Team Tasks",
                desc: "Assign work to your junior or clerk with due dates, priority, and completion tracking.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#14213D]/10 text-[#14213D] group-hover:bg-[#14213D] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Who Is This For ── */}
      <section id="who-its-for" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              Whether you are a solo advocate or running a small firm
            </h2>
            <p className="mt-3 text-slate-500">
              NyayVakil scales with the size and structure of your practice.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: <Scale className="h-7 w-7" />,
                title: "Solo Advocate",
                desc: "Manage your entire practice yourself — cases, hearings, fees, and clients in one organised workspace.",
                highlight: "Best for independent advocates",
              },
              {
                icon: <Users className="h-7 w-7" />,
                title: "Advocate's Chamber",
                desc: "Coordinate with your junior and clerk, assign tasks, track matters across your team — without losing control.",
                highlight: "Best for chambers with 2–5 members",
              },
              {
                icon: <Briefcase className="h-7 w-7" />,
                title: "Small Law Firm",
                desc: "Multi-user access, role-based permissions, and team-wide visibility into all active matters and deadlines.",
                highlight: "Best for firms with 5–25 lawyers",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213D] text-white">
                  {card.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#14213D]">{card.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-600">{card.desc}</p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#14213D]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {card.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Feature Deep Dive — Hearing Diary ── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#14213D]">
                <CalendarDays className="h-3.5 w-3.5" />
                Court Diary
              </div>
              <h2 className="mb-6 text-3xl font-bold text-[#14213D] sm:text-4xl">
                Never miss a hearing date
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: <CalendarDays className="h-5 w-5" />, text: "Court diary organised by date — see every hearing at a glance" },
                  { icon: <ArrowRight className="h-5 w-5" />, text: "Adjournment tracking with next hearing date automatically saved" },
                  { icon: <FileText className="h-5 w-5" />, text: "Matter and client linked to each hearing for instant context" },
                  { icon: <CheckCircle className="h-5 w-5" />, text: "Appearance status tracking — present, absent, or adjourned" },
                  { icon: <Bell className="h-5 w-5" />, text: "Send hearing reminders to clients via WhatsApp" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-[#14213D]">{item.icon}</span>
                    <span className="text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual placeholder */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">March 2026 — Court Diary</p>
                <span className="rounded-full bg-[#14213D]/10 px-2.5 py-0.5 text-xs font-medium text-[#14213D]">6 hearings</span>
              </div>
              {[
                { date: "Mon, 21 Mar", matter: "Sharma v. State", court: "Delhi HC — Court 4", status: "Scheduled", color: "bg-blue-100 text-blue-700" },
                { date: "Mon, 21 Mar", matter: "Mehta Industries Ltd.", court: "Delhi HC — Court 11", status: "Completed", color: "bg-emerald-100 text-emerald-700" },
                { date: "Wed, 23 Mar", matter: "Gupta & Sons v. HDFC", court: "Tis Hazari — Court 7", status: "Scheduled", color: "bg-blue-100 text-blue-700" },
                { date: "Thu, 24 Mar", matter: "Anand v. Municipal Corp.", court: "Saket DC — Court 2", status: "Adjourned", color: "bg-amber-100 text-amber-700" },
                { date: "Fri, 25 Mar", matter: "Kapoor Estates", court: "Delhi HC — Court 9", status: "Scheduled", color: "bg-blue-100 text-blue-700" },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-3 border-t border-slate-100 py-3">
                  <div className="w-24 shrink-0">
                    <p className="text-xs font-medium text-[#14213D]">{h.date}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700">{h.matter}</p>
                    <p className="text-xs text-slate-400">{h.court}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${h.color}`}>{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Feature Deep Dive — Fee Recovery ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Visual placeholder */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-5 text-sm font-semibold text-slate-700">Fee Recovery Overview</p>
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Total Agreed", value: "₹8,40,000", color: "text-slate-700" },
                  { label: "Received", value: "₹6,15,500", color: "text-emerald-600" },
                  { label: "Pending", value: "₹2,24,500", color: "text-amber-600" },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className={`text-base font-bold ${f.color}`}>{f.value}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{f.label}</p>
                  </div>
                ))}
              </div>
              {/* Bar chart mock */}
              <p className="mb-2 text-xs font-medium text-slate-500">Client-wise outstanding</p>
              {[
                { name: "Mehta Industries", amount: "₹85,000", pct: "78%" },
                { name: "Kapoor Estates", amount: "₹62,000", pct: "55%" },
                { name: "Anand & Co.", amount: "₹45,500", pct: "40%" },
                { name: "Gupta Transport", amount: "₹32,000", pct: "28%" },
              ].map((c) => (
                <div key={c.name} className="mb-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{c.name}</span>
                    <span className="font-semibold text-[#14213D]">{c.amount}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[#14213D]"
                      style={{ width: c.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#14213D]">
                <CreditCard className="h-3.5 w-3.5" />
                Fee Tracking
              </div>
              <h2 className="mb-6 text-3xl font-bold text-[#14213D] sm:text-4xl">
                Know exactly what you are owed
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: <TrendingUp className="h-5 w-5" />, text: "Total fee agreed vs received vs pending — always up to date" },
                  { icon: <Bell className="h-5 w-5" />, text: "Overdue payment alerts so nothing slips through the cracks" },
                  { icon: <FileText className="h-5 w-5" />, text: "Complete payment history broken down by matter" },
                  { icon: <Users className="h-5 w-5" />, text: "Client-wise outstanding balance at a glance" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-[#14213D]">{item.icon}</span>
                    <span className="text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: ROI / Benefits ── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              What changes when you use NyayVakil
            </h2>
            <p className="mt-3 text-slate-500">
              Small shifts in how you manage your practice add up to big results over time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <CalendarDays className="h-6 w-6" />,
                title: "Reduce missed hearings",
                desc: "A reliable digital diary means court dates never fall through the cracks.",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Improve fee recovery",
                desc: "Visibility into overdue payments helps you follow up on time, every time.",
              },
              {
                icon: <FolderOpen className="h-6 w-6" />,
                title: "Centralise case records",
                desc: "Every matter, document, and note in one place — accessible from anywhere.",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Eliminate paper registers",
                desc: "Replace physical diaries, ledgers, and registers with structured digital records.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Coordinate your team better",
                desc: "Assign tasks to your junior or clerk and track progress without constant follow-up.",
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Access from phone or desktop",
                desc: "Check your diary, update a matter, or review fees from court or from home.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6"
              >
                <div className="mt-0.5 shrink-0 rounded-xl bg-[#14213D] p-2.5 text-white">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-slate-800">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: Testimonials ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              What advocates are saying
            </h2>
          </div>
          <p className="mb-12 text-center text-sm text-slate-400">
            (Sample testimonials — actual advocate reviews coming soon)
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote: "I used to maintain three different registers for my hearings, fees, and client details. NyayVakil replaced all of them. I can now check everything from my phone before I enter the courtroom.",
                name: "Adv. Priya Sharma",
                role: "Advocate, Delhi High Court",
                initials: "PS",
              },
              {
                quote: "The fee tracking feature alone is worth it. I always knew I was owed money but never had a clear number. Now I send reminders to clients based on actual data, not memory.",
                name: "Adv. Rohit Mahajan",
                role: "Advocate, Bombay High Court",
                initials: "RM",
              },
              {
                quote: "Managing my chamber's work used to mean WhatsApp groups and shared Excel sheets. With NyayVakil, my junior and I are on the same page without any confusion about who is handling what.",
                name: "Adv. Kavitha Nair",
                role: "Senior Advocate, Madras High Court",
                initials: "KN",
              },
            ].map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-slate-600">
                  "{t.quote}"
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 10: Pricing Teaser ── */}
      <section id="pricing" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              Simple, transparent pricing
            </h2>
          </div>
          <p className="mb-12 text-center text-sm text-slate-400">
            All prices introductory. Custom pricing available for larger firms.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                plan: "Starter",
                price: "₹799",
                period: "/month",
                desc: "Perfect for solo advocates managing their own practice.",
                features: ["1 user", "Unlimited matters", "Court diary", "Fee tracking", "Document vault"],
                highlighted: false,
              },
              {
                plan: "Chamber",
                price: "₹2,499",
                period: "/month",
                desc: "For advocates with a junior, clerk, or small team.",
                features: ["Up to 5 users", "Everything in Starter", "Task assignment", "Team visibility", "Priority support"],
                highlighted: true,
              },
              {
                plan: "Firm",
                price: "₹6,999",
                period: "/month",
                desc: "For small law firms needing multi-user, role-based access.",
                features: ["Up to 25 users", "Everything in Chamber", "Role-based permissions", "Advanced reports", "Dedicated onboarding"],
                highlighted: false,
              },
            ].map((p) => (
              <div
                key={p.plan}
                className={`relative rounded-2xl border p-8 shadow-sm ${
                  p.highlighted
                    ? "border-[#14213D] bg-[#14213D] text-white"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-slate-800">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className={`mb-1 text-sm font-semibold ${p.highlighted ? "text-blue-200" : "text-slate-500"}`}>
                  {p.plan}
                </p>
                <div className="mb-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className={`mb-1 text-sm ${p.highlighted ? "text-blue-200" : "text-slate-400"}`}>{p.period}</span>
                </div>
                <p className={`mb-6 text-sm ${p.highlighted ? "text-blue-100" : "text-slate-500"}`}>{p.desc}</p>
                <ul className="mb-8 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 shrink-0 ${p.highlighted ? "text-emerald-300" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/free-trial"
                  className={`block rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                    p.highlighted
                      ? "bg-white text-[#14213D] hover:bg-slate-100"
                      : "bg-[#14213D] text-white hover:bg-[#0E182E]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#14213D] hover:underline"
            >
              View Full Pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 11: FAQ Snippet ── */}
      <section id="faq" className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[#14213D] sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is NyayVakil suitable for a solo advocate?",
                a: "Yes, absolutely. NyayVakil was designed with solo advocates in mind. The Starter plan gives a single practitioner everything they need — matter management, court diary, fee tracking, client records, and document storage — at a price that makes sense for an individual practice.",
              },
              {
                q: "Can I use this for hearing diary only?",
                a: "Yes. You can start by using just the court diary feature and add other features as you get comfortable. There is no obligation to use everything at once. Many advocates start with the diary and gradually bring in fee tracking and matter management over the first few weeks.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes. You can start a free trial without entering any credit card details. The trial gives you full access to all features for 14 days so you can evaluate whether NyayVakil fits your practice before committing to a paid plan.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-800">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#14213D] hover:underline"
            >
              See all FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 12: Final CTA Banner ── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#14213D" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to organise your practice?
          </h2>
          <p className="mb-10 text-lg text-blue-200">
            Join advocates across India using NyayVakil to manage their daily legal work.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/free-trial"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#14213D] hover:bg-slate-100 transition-colors"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white hover:border-white/70 hover:bg-white/10 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-300">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Logo tone="light" size="xs" />
              <span className="text-sm text-slate-400">— Legal Practice Management</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <Link href="/features" className="hover:text-[#14213D]">Features</Link>
              <Link href="/pricing" className="hover:text-[#14213D]">Pricing</Link>
              <Link href="/faq" className="hover:text-[#14213D]">FAQ</Link>
              <Link href="/contact" className="hover:text-[#14213D]">Contact</Link>
              <Link href="/privacy" className="hover:text-[#14213D]">Privacy</Link>
              <Link href="/terms" className="hover:text-[#14213D]">Terms</Link>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} NyayVakil. All rights reserved. Built for Indian legal professionals.
          </div>
        </div>
      </footer>

    </div>
  );
}
