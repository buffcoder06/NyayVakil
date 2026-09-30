"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads-client";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactFormData = {
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

type CallbackFormData = {
  name: string;
  mobile: string;
  callbackTime: string;
  message: string;
};

type CallbackFormErrors = Partial<Record<keyof CallbackFormData, string>>;

type SubmitState = "idle" | "loading" | "success";

// ── Why book a demo points ────────────────────────────────────────────────────

const WHY_DEMO_POINTS = [
  {
    title: "See the product live",
    description:
      "No screenshots, no marketing slides. Watch the product work with real legal practice workflows.",
  },
  {
    title: "Tailored to your practice",
    description:
      "Whether you are a solo advocate or managing a chamber, we show you the features that matter most to you.",
  },
  {
    title: "Get your questions answered",
    description:
      "Ask anything directly — about features, pricing, data migration, or how we handle court-specific requirements.",
  },
  {
    title: "No pressure, no obligation",
    description:
      "We are here to help you make an informed decision, not to push you into a subscription.",
  },
];

// ── Shared input class ────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14213D]/25 focus:border-[#14213D] transition-colors";

const errorClass = "mt-1 text-xs text-red-600";

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
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

    if (!formData.message.trim()) {
      newErrors.message = "Please write a message before submitting.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState("loading");

    try {
      const ref = await submitLead({
        kind: "contact",
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        message: formData.message,
        details: { subject: formData.subject },
      });
      setReferenceNumber(ref);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("idle");
      toast.error(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    }
  };

  if (submitState === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-600" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Message received!
        </h3>
        <p className="text-sm text-slate-600 mb-1">
          We will get back to you within 24–48 hours.
        </p>
        <p className="text-xs font-mono text-slate-500 mb-6">
          Reference: {referenceNumber}
        </p>
        <button
          onClick={() => {
            setFormData({
              name: "",
              mobile: "",
              email: "",
              subject: "",
              message: "",
            });
            setErrors({});
            setSubmitState("idle");
          }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Adv. Rahul Verma"
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="contact-mobile"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
          >
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="demo">Book a Demo</option>
          <option value="pricing">Pricing Question</option>
          <option value="support">Technical Support</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us how we can help you..."
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#14213D" }}
      >
        {submitState === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" strokeWidth={2} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

// ── Callback Form ─────────────────────────────────────────────────────────────

function CallbackForm() {
  const [formData, setFormData] = useState<CallbackFormData>({
    name: "",
    mobile: "",
    callbackTime: "",
    message: "",
  });
  const [errors, setErrors] = useState<CallbackFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CallbackFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: CallbackFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState("loading");

    try {
      await submitLead({
        kind: "callback",
        name: formData.name,
        mobile: formData.mobile,
        message: formData.message,
        details: { callbackTime: formData.callbackTime },
      });
      setSubmitState("success");
    } catch (err) {
      setSubmitState("idle");
      toast.error(err instanceof Error ? err.message : "Could not request a callback. Please try again.");
    }
  };

  if (submitState === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" strokeWidth={2} />
        <p className="text-sm font-semibold text-slate-800">
          Callback request received!
        </p>
        <p className="text-xs text-slate-500 mt-1">
          We will call you at your preferred time. Mon–Sat, 9 AM – 7 PM IST.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cb-name"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cb-name"
            name="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <label
            htmlFor="cb-mobile"
            className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
          >
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            id="cb-mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
        </div>
      </div>

      <div>
        <label
          htmlFor="cb-time"
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
        >
          Preferred Callback Time
        </label>
        <select
          id="cb-time"
          name="callbackTime"
          value={formData.callbackTime}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select preferred time</option>
          <option value="morning">Morning (9 AM – 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM – 4 PM)</option>
          <option value="evening">Evening (4 PM – 7 PM)</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="cb-message"
          className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide"
        >
          Message (optional)
        </label>
        <textarea
          id="cb-message"
          name="message"
          rows={2}
          placeholder="Anything you would like us to know before the call..."
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#14213D" }}
      >
        {submitState === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Requesting...
          </>
        ) : (
          <>
            <Phone className="w-4 h-4" strokeWidth={2} />
            Request Callback
          </>
        )}
      </button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section
        className="py-14 sm:py-18 text-center"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Have a question, want to book a demo, or just want to know more
            about NyayVakil? We are here to help. Reach out through any channel
            that suits you.
          </p>
        </div>
      </section>

      {/* ── Two-column: form + info ────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Left: Contact form */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Right: Contact info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Book a Demo */}
              <div
                className="rounded-xl border p-5 text-white"
                style={{ backgroundColor: "#14213D" }}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      Book a Demo
                    </h3>
                    <p className="text-xs text-blue-100 leading-relaxed mb-3">
                      Schedule a 30-minute walkthrough with our team and see
                      NyayVakil working for your practice.
                    </p>
                    <Link
                      href="/demo"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-blue-100 transition-colors"
                    >
                      Schedule now
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "#14213D10" }}
                  >
                    <Mail
                      className="w-4.5 h-4.5"
                      style={{ color: "#14213D" }}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-0.5">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@nyayvakil.in"
                      className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      hello@nyayvakil.in
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">
                      We respond within 24–48 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "#14213D10" }}
                  >
                    <Clock
                      className="w-4.5 h-4.5"
                      style={{ color: "#14213D" }}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-0.5">
                      Office Hours
                    </h3>
                    <p className="text-sm text-slate-500">
                      Mon – Sat, 9 AM – 7 PM IST
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Closed on Sundays and national holidays
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Request Callback ──────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#14213D12" }}
              >
                <Phone
                  className="w-5 h-5"
                  style={{ color: "#14213D" }}
                  strokeWidth={2}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Request a Callback
                </h2>
                <p className="text-xs text-slate-500">
                  Prefer to speak on the phone? We will call you.
                </p>
              </div>
            </div>
            <CallbackForm />
          </div>
        </div>
      </section>

      {/* ── Why book a demo ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Why book a demo?
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              A 30-minute conversation with our team can save you hours of
              figuring things out on your own.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_DEMO_POINTS.map(({ title, description }, idx) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 p-5 flex gap-4"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white mt-0.5"
                  style={{ backgroundColor: "#14213D" }}
                >
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#14213D" }}
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
