"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Calendar,
  CheckCircle2,
  Briefcase,
  BookOpen,
  IndianRupee,
  Users,
  FolderOpen,
  ClipboardList,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
  fullName: string;
  mobile: string;
  email: string;
  organisation: string;
  practiceType: string;
  teamSize: string;
  preferredDate: string;
  preferredTime: string;
  questions: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type SubmitState = "idle" | "loading" | "success";

// ── Demo feature cards data ───────────────────────────────────────────────────

const DEMO_FEATURES = [
  {
    icon: Briefcase,
    title: "Case Management",
    description:
      "Track all your matters with client details, court names, filing dates, and case status — all in one place.",
  },
  {
    icon: BookOpen,
    title: "Hearing Diary",
    description:
      "Date-wise hearing schedule with next date alerts. Never miss a court appearance.",
  },
  {
    icon: IndianRupee,
    title: "Fee Tracking",
    description:
      "Record professional fees, track pending payments, and see what is outstanding at a glance.",
  },
  {
    icon: Users,
    title: "Client Records",
    description:
      "Maintain clean client profiles with contact information, matter history, and communication logs.",
  },
  {
    icon: FolderOpen,
    title: "Document Vault",
    description:
      "Store vakalatnamas, court orders, and client documents securely. Retrieve them in seconds.",
  },
  {
    icon: ClipboardList,
    title: "Team Tasks",
    description:
      "Assign tasks to clerks and junior advocates. Track progress and deadlines within your team.",
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "How long does the live demo take?",
    answer:
      "The live walkthrough is approximately 30 minutes. Our team will show you the features most relevant to your practice and answer any questions you have along the way. There is no obligation to sign up afterwards.",
  },
  {
    question: "Can I try the product before booking a live demo?",
    answer:
      "Yes. The interactive demo lets you explore the full product with pre-loaded sample data — no sign-up required. You can launch it directly from this page. The live demo is for when you want a personalised walkthrough with one of our team members.",
  },
  {
    question: "What happens after I submit the booking form?",
    answer:
      "Our team will contact you within 24 hours on the mobile number or email you provide to confirm the date and time. We will send you a meeting link (Google Meet or similar) before the session. If the requested slot is unavailable, we will suggest the nearest alternative.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeatureCheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600">
      <CheckCircle2
        className="w-4 h-4 mt-0.5 shrink-0"
        style={{ color: "#14213D" }}
        strokeWidth={2}
      />
      {text}
    </li>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-800">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white">
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    email: "",
    organisation: "",
    practiceType: "",
    teamSize: "",
    preferredDate: "",
    preferredTime: "",
    questions: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [referenceNumber, setReferenceNumber] = useState("");

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState("loading");

    // TODO: Replace mock submission with real API call to /api/leads/book-demo
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const ref = `NV-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNumber(ref);
    setSubmitState("success");
  };

  const handleBookAnother = () => {
    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      organisation: "",
      practiceType: "",
      teamSize: "",
      preferredDate: "",
      preferredTime: "",
      questions: "",
    });
    setErrors({});
    setSubmitState("idle");
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14213D]/25 focus:border-[#14213D] transition-colors";

  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20 text-center"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              backgroundColor: "#14213D10",
              borderColor: "#14213D30",
              color: "#14213D",
            }}
          >
            <Play className="w-3.5 h-3.5" strokeWidth={2.5} />
            See it before you commit
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            See NyayVakil in action
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto">
            Explore the product yourself with sample data, or let our team walk
            you through it personally. Either way, no sign-up required to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?demo=true"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#14213D" }}
            >
              <Play className="w-4 h-4" strokeWidth={2.5} />
              Try Interactive Demo
            </Link>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-4 h-4" strokeWidth={2} />
              Book a Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Two option cards ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A – Interactive Demo */}
            <div className="rounded-2xl border border-slate-200 p-7 flex flex-col">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "#14213D12" }}
              >
                <Play
                  className="w-5 h-5"
                  style={{ color: "#14213D" }}
                  strokeWidth={2.5}
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Try the Interactive Demo
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                Explore the full product with sample legal practice data. No
                sign-up required.
              </p>

              <ul className="space-y-2.5 mb-7">
                <FeatureCheckItem text="Pre-loaded matter and client data" />
                <FeatureCheckItem text="Sample hearing diary with upcoming dates" />
                <FeatureCheckItem text="Demo fees and expenses recorded" />
                <FeatureCheckItem text="No real data, no commitment" />
              </ul>

              <div className="mt-auto">
                <Link
                  href="/login?demo=true"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: "#14213D" }}
                >
                  Launch Demo →
                </Link>
                <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                  Demo data resets automatically
                </p>
              </div>
            </div>

            {/* Card B – Live Walkthrough */}
            <div
              className="rounded-2xl border p-7 flex flex-col"
              style={{ backgroundColor: "#14213D", borderColor: "#14213D" }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/15 mb-5">
                <Calendar
                  className="w-5 h-5 text-white"
                  strokeWidth={2}
                />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                Book a Live Walkthrough
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed mb-5">
                Our team will walk you through the product and answer your
                specific questions about your practice.
              </p>

              <ul className="space-y-2.5 mb-7">
                {[
                  "30-minute personalised walkthrough",
                  "See how it fits your practice",
                  "Q&A with our team",
                  "No obligation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-blue-100"
                  >
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 shrink-0 text-white"
                      strokeWidth={2}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#14213D] bg-white transition-all hover:bg-blue-50 active:scale-[0.98]"
                >
                  Schedule a Demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you'll see ────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              What you will see in the demo
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              The demo covers the core features that advocates use every day to
              manage their practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#14213D10" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "#14213D" }}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Demo Booking Form ─────────────────────────────────────────── */}
      <section className="py-16 bg-white" ref={formRef} id="book-demo">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Book a live demo
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Fill in the form below and our team will reach out to confirm your
              slot within 24 hours.
            </p>
          </div>

          {submitState === "success" ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2
                  className="w-7 h-7 text-green-600"
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Demo booked successfully!
              </h3>
              <p className="text-sm text-slate-600 mb-1">
                We will contact you within 24 hours to confirm.
              </p>
              <p className="text-xs font-mono text-slate-500 mb-7">
                Reference: {referenceNumber}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleBookAnother}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Book Another
                </button>
                <Link
                  href="/login?demo=true"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#14213D" }}
                >
                  Try the Demo Now
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Adv. Priya Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName}</p>
                )}
              </div>

              {/* Mobile + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.mobile && (
                    <p className={errorClass}>{errors.mobile}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className={errorClass}>{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Organisation */}
              <div>
                <label
                  htmlFor="organisation"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                >
                  Organisation / Chamber Name
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  placeholder="Sharma & Associates"
                  value={formData.organisation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Practice Type + Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="practiceType"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Practice Type
                  </label>
                  <select
                    id="practiceType"
                    name="practiceType"
                    value={formData.practiceType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select type</option>
                    <option value="solo">Solo Advocate</option>
                    <option value="chamber">Advocate&apos;s Chamber</option>
                    <option value="small-firm">Small Law Firm</option>
                    <option value="legal-dept">Legal Department</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="teamSize"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select size</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2–5</option>
                    <option value="6-10">6–10</option>
                    <option value="11-20">11–20</option>
                    <option value="20+">20+</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Preferred Date
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="preferredTime"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    Preferred Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select time slot</option>
                    <option value="10-11">10 AM – 11 AM</option>
                    <option value="11-12">11 AM – 12 PM</option>
                    <option value="14-15">2 PM – 3 PM</option>
                    <option value="15-16">3 PM – 4 PM</option>
                    <option value="16-17">4 PM – 5 PM</option>
                  </select>
                </div>
              </div>

              {/* Questions */}
              <div>
                <label
                  htmlFor="questions"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
                >
                  Any specific questions or areas of interest?
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  rows={4}
                  placeholder="e.g. How does the hearing diary work? Can I import my existing data?"
                  value={formData.questions}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#14213D" }}
              >
                {submitState === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    Schedule a Demo
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Our team will contact you within 24 hours to confirm.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section
        className="py-12 text-center border-t border-slate-100"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <p className="text-slate-500 text-sm mb-4">
            Just want to explore on your own?
          </p>
          <Link
            href="/login?demo=true"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#14213D" }}
          >
            Launch Demo Workspace →
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            No account needed &middot; Sample data pre-loaded &middot; Resets
            automatically
          </p>
        </div>
      </section>
    </div>
  );
}
