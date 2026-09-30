"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Scale, ArrowLeft, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface TrialFormData {
  name: string;
  mobile: string;
  email: string;
  firmName: string;
  city: string;
  userCount: string;
  role: string;
  practiceType: string;
}

const PRACTICE_TYPES = [
  "Solo Advocate",
  "Advocate's Chamber",
  "Small Law Firm",
  "Legal Department",
  "Other",
];

const TEAM_SIZES = [
  "Just me",
  "2–5 members",
  "6–10 members",
  "11–20 members",
  "20+ members",
];

const ROLES = [
  { value: "advocate", label: "Advocate" },
  { value: "junior", label: "Junior Advocate" },
  { value: "clerk", label: "Clerk / Office Staff" },
  { value: "admin", label: "Office Manager / Admin" },
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Ranchi",
  "Kochi",
  "Coimbatore",
  "Surat",
  "Vadodara",
  "Other",
];

const TRIAL_BENEFITS = [
  "14-day free trial, no credit card required",
  "Full access to all Chamber plan features",
  "Pre-loaded with sample data to explore",
  "Up to 5 team members during trial",
  "Email support included",
  "Cancel anytime, no questions asked",
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function FreeTrialPage() {
  const [form, setForm] = useState<TrialFormData>({
    name: "",
    mobile: "",
    email: "",
    firmName: "",
    city: "",
    userCount: "Just me",
    role: "advocate",
    practiceType: "Solo Advocate",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TrialFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TrialFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.replace(/\s/g, "")))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.city) newErrors.city = "Please select your city";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // TODO: Replace with real API call to /api/leads/trial-signup
      console.log("[NyayVakil Leads] Trial signup:", form);
      await new Promise((res) => setTimeout(res, 900));
      const ref = `NV-TRIAL-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(ref);
      setSubmitted(true);
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TrialFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Trial account created!
          </h2>
          <p className="text-slate-500 mb-4 text-sm leading-relaxed">
            We are setting up your NyayVakil workspace. You will receive login
            details on <strong>{form.email}</strong> within a few minutes.
          </p>
          <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="text-slate-500">Reference: </span>
            <span className="font-mono font-semibold text-slate-800">
              {referenceId}
            </span>
          </div>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[#14213D] hover:bg-[#0E182E] text-white text-sm font-medium py-3 rounded-xl transition-colors text-center"
            >
              Go to Login
            </Link>
            <Link
              href="/demo"
              className="block w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-3 rounded-xl transition-colors text-center"
            >
              Try Interactive Demo first
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            Questions? Write to{" "}
            <a
              href="mailto:hello@nyayvakil.in"
              className="text-[#14213D] hover:underline"
            >
              hello@nyayvakil.in
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#14213D] rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#14213D] text-lg">NyayVakil</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#14213D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to website
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left: Benefits */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Start your free trial
              </h1>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Try NyayVakil free for 14 days. No credit card needed. Full
                access to explore everything the platform offers.
              </p>

              <div className="space-y-3 mb-8">
                {TRIAL_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#14213D] rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold text-white/80 mb-1">
                  Trial Plan Includes
                </p>
                <p className="text-xl font-bold mb-3">Chamber Plan</p>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Up to 5 team members</p>
                  <p>• 500 matters</p>
                  <p>• Document vault</p>
                  <p>• Team tasks and reminders</p>
                  <p>• Reports and insights</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                After the trial, you can choose any plan. Your data is
                preserved.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Create your trial account
              </h2>
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#14213D]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Mobile + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors ${
                        errors.mobile
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200 focus:border-[#14213D]"
                      }`}
                    />
                    {errors.mobile && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@chamber.in"
                      className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200 focus:border-[#14213D]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Firm Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Chamber / Firm Name{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="firmName"
                    value={form.firmName}
                    onChange={handleChange}
                    placeholder="Your chamber or firm name"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#14213D] text-sm outline-none transition-colors"
                  />
                </div>

                {/* City + Practice Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors bg-white ${
                        errors.city
                          ? "border-red-400"
                          : "border-slate-200 focus:border-[#14213D]"
                      }`}
                    >
                      <option value="">Select city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Practice Type
                    </label>
                    <select
                      name="practiceType"
                      value={form.practiceType}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#14213D] text-sm outline-none transition-colors bg-white"
                    >
                      {PRACTICE_TYPES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Role + Team Size */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your Role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#14213D] text-sm outline-none transition-colors bg-white"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Team Size
                    </label>
                    <select
                      name="userCount"
                      value={form.userCount}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#14213D] text-sm outline-none transition-colors bg-white"
                    >
                      {TEAM_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#14213D] hover:bg-[#0E182E] disabled:opacity-70 text-white font-medium py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-[#14213D] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#14213D] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>

            {/* Alternative: Try demo */}
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                Not ready to sign up?{" "}
                <Link
                  href="/login"
                  className="text-[#14213D] font-medium hover:underline"
                >
                  Try the interactive demo instead →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
