import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ProductShot } from "@/components/marketing/product-shot";
import {
  Briefcase,
  CalendarDays,
  CreditCard,
  Users,
  FolderOpen,
  ClipboardList,
  CheckCircle,
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
              href="/signup"
              className="rounded-lg bg-[#14213D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0E182E] transition-colors"
            >
              Start Free
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
            Now in early access · Free for Indian advocates
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
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#0E182E] transition-colors"
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#14213D] px-8 py-3.5 text-base font-semibold text-[#14213D] hover:bg-slate-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Free during early access · No credit card · Set up in 2 minutes
          </p>
        </div>

        {/* Real product screenshot */}
        <div className="mx-auto mt-16 max-w-5xl">
          <ProductShot
            src="/screens/dashboard.jpg"
            alt="NyayVakil dashboard showing today's court diary, pending fees and tasks"
            width={2880}
            height={1800}
            url="www.nyayvakil.in/dashboard"
            priority
          />
        </div>
      </section>

      {/* ── Section 2: Trust Stats ── */}
      <section className="border-y border-slate-100 bg-white px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { stat: "Free", label: "During early access" },
              { stat: "2 min", label: "To set up your chamber" },
              { stat: "₹ · IST", label: "Built for Indian courts" },
              { stat: "Any device", label: "Phone, tablet or desktop" },
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
                desc: "Individuals, families and companies — with every case, fee and payment linked to them.",
              },
              {
                icon: <FolderOpen className="h-6 w-6" />,
                title: "Document Register",
                desc: "Record vakalatnamas, affidavits, petitions and orders against each case. File uploads coming soon.",
              },
              {
                icon: <ClipboardList className="h-6 w-6" />,
                title: "Tasks & Reminders",
                desc: "Track drafting, filing and follow-ups with due dates and priorities, linked to each case.",
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
                desc: "Run the chamber's cases, court diary and fees from one place. Team logins for juniors and clerks are coming soon.",
                highlight: "Team access coming soon",
              },
              {
                icon: <Briefcase className="h-7 w-7" />,
                title: "Small Law Firm",
                desc: "Multi-user access with role-based permissions is on our roadmap. Join early access and help us shape it.",
                highlight: "On our roadmap",
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
                  { icon: <CheckCircle className="h-5 w-5" />, text: "Mark hearings attended, adjourned or missed in one tap" },
                  { icon: <Bell className="h-5 w-5" />, text: "Prepare client reminders — automatic WhatsApp & SMS sending coming soon" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-[#14213D]">{item.icon}</span>
                    <span className="text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ProductShot
              src="/screens/court-diary.jpg"
              alt="NyayVakil court diary listing hearings with court, time, purpose and status"
              width={2000}
              height={1300}
              url="www.nyayvakil.in/hearings"
            />
          </div>
        </div>
      </section>

      {/* ── Section 7: Feature Deep Dive — Fee Recovery ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <ProductShot
              src="/screens/fees.jpg"
              alt="NyayVakil fee management showing agreed, collected and pending fees per case"
              width={2000}
              height={1300}
              url="www.nyayvakil.in/fees"
            />

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
                  { icon: <Bell className="h-5 w-5" />, text: "Overdue fees flagged automatically so nothing slips through the cracks" },
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
                desc: "Every case, hearing, fee and note in one place — accessible from anywhere.",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Eliminate paper registers",
                desc: "Replace physical diaries, ledgers, and registers with structured digital records.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Stay on top of every task",
                desc: "Drafting, filing and client follow-ups tracked with due dates, so nothing depends on memory.",
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

      {/* ── Section 9: Early access ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm sm:px-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-bright/15 px-3 py-1 text-xs font-semibold text-gold">
            Early access
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#14213D] sm:text-4xl">Built with advocates, for advocates</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
            NyayVakil is in early access. We&apos;re working closely with our first advocates to shape every
            feature around real court practice. Join free today and tell us what your chamber needs next —
            AI document analysis, WhatsApp reminders and team access are already on the way.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0E182E]">
              Join early access — free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-[#14213D] hover:bg-slate-50">
              Book a demo
            </Link>
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
            Free during early access — these are the planned prices once paid plans launch.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                plan: "Starter",
                price: "₹799",
                period: "/month",
                desc: "Perfect for solo advocates managing their own practice.",
                features: ["1 user", "Unlimited matters", "Court diary", "Fee tracking", "Document register"],
                highlighted: false,
              },
              {
                plan: "Chamber",
                price: "₹2,499",
                period: "/month",
                desc: "For advocates with a junior, clerk, or small team.",
                features: ["Everything in Starter", "Reports & CSV export", "Up to 5 users (coming soon)", "Task assignment (coming soon)", "Priority support"],
                highlighted: true,
              },
              {
                plan: "Firm",
                price: "₹6,999",
                period: "/month",
                desc: "For small law firms needing multi-user, role-based access.",
                features: ["Everything in Chamber", "Dedicated onboarding", "Up to 25 users (coming soon)", "Role-based permissions (coming soon)", "Advanced reports (coming soon)"],
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
                  href="/signup"
                  className={`block rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                    p.highlighted
                      ? "bg-white text-[#14213D] hover:bg-slate-100"
                      : "bg-[#14213D] text-white hover:bg-[#0E182E]"
                  }`}
                >
                  Start free
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
                a: "Yes, absolutely. NyayVakil was designed with solo advocates in mind. The Starter plan gives a single practitioner everything they need — case management, court diary, fee tracking, client records and a document register — and it's free during early access.",
              },
              {
                q: "Can I use this for hearing diary only?",
                a: "Yes. You can start by using just the court diary feature and add other features as you get comfortable. There is no obligation to use everything at once. Many advocates start with the diary and gradually bring in fee tracking and matter management over the first few weeks.",
              },
              {
                q: "Is NyayVakil free?",
                a: "Yes — NyayVakil is free during early access, with no credit card needed. When paid plans launch you'll get advance notice, and everything you've entered stays with you.",
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
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#14213D] hover:bg-slate-100 transition-colors"
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white hover:border-white/70 hover:bg-white/10 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-300">
            Free during early access · No credit card required
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
