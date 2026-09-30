import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Heart } from "lucide-react";

// ── Values data ───────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Heart,
    title: "Simplicity",
    description:
      "Legal practice is already demanding. The tools you use should reduce your load, not add to it. NyayVakil is designed to be learnt in minutes, not days. If a feature requires a manual to understand, we need to redesign it.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description:
      "Your client information is confidential. We treat it with the same seriousness that you do. Your data is encrypted, kept separate for every chamber, and never shared with third parties. You remain the owner of everything you put into NyayVakil.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Court deadlines do not wait. You should be able to check a hearing date, record a fee, or pull up a client's matter in a few taps — not navigate through menus and loading screens. Speed is not a nice-to-have; it is a core requirement.",
  },
  {
    icon: Globe,
    title: "Indian-first design",
    description:
      "Most legal software is built for American or European law firms and then adapted for India as an afterthought. NyayVakil starts from the reality of Indian legal practice — district courts, High Courts, the language of Indian legal work, and the way Indian advocates actually operate.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: "#14213D12" }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: "#14213D" }}
          strokeWidth={2}
        />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            About NyayVakil
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            NyayVakil is a legal practice management platform built specifically
            for Indian advocates. Our goal is straightforward: help every legal
            professional in India manage their practice with clarity, without the
            chaos of scattered registers, forgotten dates, and untracked fees.
          </p>
        </div>
      </section>

      {/* ── Why we built this ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-1.5 h-6 rounded-full"
              style={{ backgroundColor: "#14213D" }}
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-slate-900">
              Why we built this
            </h2>
          </div>

          <div className="space-y-5 text-slate-600 leading-relaxed text-[15px]">
            <p>
              Talk to most practising advocates in India and you will find the
              same picture: a physical diary for hearings, a notebook or
              register for client matters, a separate ledger or Excel sheet for
              fee collection, and WhatsApp groups for coordinating with clerks
              and juniors. Some of this works — until it does not. A missed
              hearing date, a fee entry that was never recorded, a document that
              cannot be found before a client meeting. The stakes in legal work
              are high, and the tools most advocates rely on were not built for
              this.
            </p>
            <p>
              General-purpose software — CRMs, spreadsheets, calendar apps — can
              be jury-rigged to handle some of this, but they do not understand
              the structure of Indian legal practice. They do not know the
              difference between a matter number and a diary number, they cannot
              track next dates the way a court diary needs to, and they are not
              built around how Indian advocates think about their work.
            </p>
            <p>
              We built NyayVakil because this gap is real and the people who work
              within it deserve better. Indian advocates — whether they are
              handling criminal matters at a district court or civil litigation at
              a High Court — are serious professionals managing complex work with
              significant consequences. The software they use should match that
              seriousness.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our mission ───────────────────────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: "#14213D" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-4">
            Our Mission
          </p>
          <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            &ldquo;To help every Indian advocate manage their practice with
            dignity and clarity.&rdquo;
          </blockquote>
          <p className="mt-6 text-blue-100 text-sm leading-relaxed max-w-xl mx-auto">
            Every advocate — regardless of the size of their practice — deserves
            tools that work reliably, respect their time, and help them serve
            their clients better. That is the standard we hold ourselves to.
          </p>
        </div>
      </section>

      {/* ── What we believe ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              What we believe
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              These are the principles that shape how we build the product and
              how we work with our users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* ── The team ──────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-1.5 h-6 rounded-full"
              style={{ backgroundColor: "#14213D" }}
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-slate-900">The team</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 leading-relaxed text-[15px]">
              NyayVakil is built by a small team passionate about legal
              technology in India. We work closely with practising advocates —
              from district courts to High Courts — to understand how they
              actually run their practices. Every feature we build is informed by
              real conversations with real practitioners, not assumptions about
              what legal software should do.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed text-[15px]">
              We are a product-focused team, which means we spend more time
              making existing features work well than racing to add new ones. We
              respond personally to support requests. We take feedback seriously.
              And we ship continuously based on what we hear from users.
            </p>
            <p className="mt-4 text-slate-500 text-sm">
              If you would like to share feedback, report an issue, or just talk
              about how we can make NyayVakil better for your practice, we
              genuinely want to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Want to talk to us?
          </h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            Whether you have a question, want to see the product in action, or
            want to share what you are looking for in legal software — we would
            like to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#14213D" }}
            >
              Get in Touch
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
