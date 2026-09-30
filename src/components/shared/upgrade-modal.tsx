"use client";

// src/components/shared/upgrade-modal.tsx
// Upgrade plan modal shown when the user hits a plan limit.
// Uses Tailwind CSS only — no shadcn Dialog dependency.
// TODO: Connect upgrade buttons to real billing/payment system

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Check, Star, Zap, Building2, Scale, PhoneCall } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type UpgradeTrigger =
  | "matter_limit"
  | "user_limit"
  | "storage_limit"
  | "feature_locked"
  | "general";

export type PlanName = "starter" | "chamber" | "firm";

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: UpgradeTrigger;
  currentPlan?: PlanName;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN DATA
// ─────────────────────────────────────────────────────────────────────────────

interface Plan {
  id: PlanName;
  name: string;
  price: number;
  priceSuffix: string;
  users: string;
  matters: string;
  tagline: string;
  icon: typeof Scale;
  highlighted: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 799,
    priceSuffix: "/mo",
    users: "1 user",
    matters: "50 cases",
    tagline: "Perfect for solo practitioners",
    icon: Scale,
    highlighted: false,
    features: [
      "1 user seat",
      "Up to 50 active cases",
      "Client & hearing management",
      "Fee & expense tracking",
      "Email support",
    ],
  },
  {
    id: "chamber",
    name: "Chamber",
    price: 2499,
    priceSuffix: "/mo",
    users: "5 users",
    matters: "500 cases",
    tagline: "Ideal for small chambers & groups",
    icon: Building2,
    highlighted: true,
    features: [
      "5 user seats",
      "Up to 500 active cases",
      "Team task assignment",
      "Document storage (10 GB)",
      "WhatsApp & SMS reminders",
      "Priority email support",
    ],
  },
  {
    id: "firm",
    name: "Firm",
    price: 6999,
    priceSuffix: "/mo",
    users: "20 users",
    matters: "Unlimited cases",
    tagline: "For established law firms",
    icon: Zap,
    highlighted: false,
    features: [
      "20 user seats",
      "Unlimited active cases",
      "Unlimited document storage",
      "Advanced reports & analytics",
      "Dedicated account manager",
      "Phone & WhatsApp support",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER CONTENT
// ─────────────────────────────────────────────────────────────────────────────

function getTriggerContent(trigger: UpgradeTrigger) {
  switch (trigger) {
    case "matter_limit":
      return {
        title: "Case limit reached",
        description:
          "You have reached the maximum number of active cases allowed on your current plan. Upgrade to add more cases and keep your practice running without interruption.",
      };
    case "user_limit":
      return {
        title: "User seat limit reached",
        description:
          "Your current plan does not allow adding more team members. Upgrade to a higher plan to add more advocates, juniors, or clerks to your workspace.",
      };
    case "storage_limit":
      return {
        title: "Storage limit reached",
        description:
          "You have used all available document storage on your current plan. Upgrade to get more storage and continue uploading case documents, affidavits, and orders.",
      };
    case "feature_locked":
      return {
        title: "Feature not available on your plan",
        description:
          "This feature is not included in your current plan. Upgrade to unlock advanced features including team collaboration, automated reminders, and detailed reports.",
      };
    case "general":
    default:
      return {
        title: "Upgrade your plan",
        description:
          "Unlock more features, more cases, and more team members. Choose the plan that best fits your legal practice.",
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANS TO SHOW based on current plan
// ─────────────────────────────────────────────────────────────────────────────

function getUpgradePlans(currentPlan: PlanName | undefined): Plan[] {
  if (!currentPlan || currentPlan === "starter") {
    // Show Chamber and Firm
    return PLANS.filter((p) => p.id === "chamber" || p.id === "firm");
  }
  if (currentPlan === "chamber") {
    // Show Firm only
    return PLANS.filter((p) => p.id === "firm");
  }
  // Already on Firm — show all for context
  return PLANS;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN CARD
// ─────────────────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onUpgrade,
}: {
  plan: Plan;
  onUpgrade: (plan: Plan) => void;
}) {
  const Icon = plan.icon;

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-5 transition-shadow ${
        plan.highlighted
          ? "border-[#14213D] shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Recommended badge */}
      {plan.highlighted && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: "#14213D" }}
        >
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          Recommended
        </div>
      )}

      {/* Plan header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                plan.highlighted
                  ? "text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
              style={
                plan.highlighted ? { backgroundColor: "#14213D" } : undefined
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
          </div>
          <p className="text-xs text-slate-500">{plan.tagline}</p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-slate-900">
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-slate-500">{plan.priceSuffix}</span>
          <p className="text-xs text-slate-500 mt-0.5">billed monthly</p>
        </div>
      </div>

      {/* Key limits */}
      <div className="flex items-center gap-3 mb-4 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1 bg-slate-100 rounded-full px-2.5 py-0.5">
          {plan.users}
        </span>
        <span className="inline-flex items-center gap-1 bg-slate-100 rounded-full px-2.5 py-0.5">
          {plan.matters}
        </span>
      </div>

      {/* Feature list */}
      <ul className="space-y-1.5 mb-5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
            <Check
              className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onUpgrade(plan)}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213D] ${
          plan.highlighted
            ? "text-white hover:opacity-90"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
        style={plan.highlighted ? { backgroundColor: "#14213D" } : undefined}
      >
        Upgrade to {plan.name}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function UpgradeModal({
  isOpen,
  onClose,
  trigger = "general",
  currentPlan = "starter",
}: UpgradeModalProps) {
  const { title, description } = getTriggerContent(trigger);
  const upgradePlans = getUpgradePlans(currentPlan);

  // ── Keyboard & scroll management ─────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleKeyDown]);

  // ── Upgrade action ────────────────────────────────────────────────────────
  function handleUpgrade(plan: Plan) {
    // TODO: Connect to real billing/payment system (e.g., Razorpay subscription flow)
    console.log(
      `[NyayVakil] Upgrade initiated to plan: ${plan.id} (placeholder)`
    );
    onClose();
  }

  if (!isOpen) return null;

  // Determine grid cols based on how many plans we show
  const gridCols =
    upgradePlans.length === 1
      ? "grid-cols-1 max-w-sm"
      : upgradePlans.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* ── Modal panel ──────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close upgrade modal"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 z-10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Header */}
          <div
            className="px-6 pt-6 pb-5 border-b border-slate-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white shrink-0"
                style={{ backgroundColor: "#14213D" }}
              >
                <Zap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2
                id="upgrade-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {title}
              </h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed ml-12">
              {description}
            </p>
          </div>

          {/* Plan cards */}
          <div className={`p-6 grid gap-4 mx-auto ${gridCols}`}>
            {upgradePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onUpgrade={handleUpgrade} />
            ))}
          </div>

          {/* Footer actions */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <a
              href="mailto:info@nyayvakil.in"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Contact Sales for Enterprise
            </a>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14213D] hover:underline"
              onClick={onClose}
            >
              View all plans &amp; compare features →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
