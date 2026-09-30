"use client";

// src/components/shared/trial-banner.tsx
// In-app banner shown during trial period or demo mode.

import Link from "next/link";
import { X, Zap, CalendarCheck, RotateCcw, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TrialBannerProps {
  /** Days remaining in the free trial (ignored in demo mode). @default 14 */
  daysLeft?: number;
  /** When true, shows the demo workspace banner instead of the trial banner. @default false */
  isDemo?: boolean;
  /** Called when the user clicks the dismiss (X) button. Only available in trial mode. */
  onDismiss?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO BANNER
// ─────────────────────────────────────────────────────────────────────────────

function DemoBanner() {
  function handleResetDemo() {
    // TODO: Connect to actual demo data reset logic
    console.log("[NyayVakil] Demo data reset triggered (placeholder).");
  }

  return (
    <div
      className="w-full sticky top-0 z-50 bg-amber-50 border-b border-amber-200"
      role="status"
      aria-live="polite"
      aria-label="Demo workspace notice"
    >
      <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        {/* Left — message */}
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertCircle
            className="h-4 w-4 text-amber-600 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-amber-800 truncate">
            You are viewing a{" "}
            <span className="font-semibold">demo workspace</span> with sample
            legal practice data.
          </p>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-300 bg-white rounded-md hover:bg-amber-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Demo Data
          </button>

          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-300 bg-white rounded-md hover:bg-amber-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Book Demo
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            style={{ backgroundColor: "#14213D" }}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIAL BANNER
// ─────────────────────────────────────────────────────────────────────────────

function TrialModeBanner({
  daysLeft,
  onDismiss,
}: {
  daysLeft: number;
  onDismiss?: () => void;
}) {
  const isUrgent = daysLeft <= 3;

  return (
    <div
      className={`w-full sticky top-0 z-50 border-b ${
        isUrgent
          ? "bg-red-50 border-red-200"
          : "bg-blue-50 border-blue-200"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Trial period notice"
    >
      <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left — message */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Zap
            className={`h-4 w-4 shrink-0 ${
              isUrgent ? "text-red-600" : "text-blue-600"
            }`}
            aria-hidden="true"
          />
          <p
            className={`text-sm font-medium truncate ${
              isUrgent ? "text-red-800" : "text-blue-700"
            }`}
          >
            {isUrgent ? (
              <>
                Your free trial expires in{" "}
                <span className="font-bold">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"}
                </span>
                . Upgrade now to avoid losing access.
              </>
            ) : (
              <>
                Your free trial ends in{" "}
                <span className="font-bold">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"}
                </span>
                .
              </>
            )}
          </p>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ backgroundColor: "#14213D" }}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Upgrade Now
          </Link>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss trial notice"
              className={`flex items-center justify-center h-7 w-7 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isUrgent
                  ? "text-red-500 hover:bg-red-100"
                  : "text-blue-500 hover:bg-blue-100"
              }`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function TrialBanner({
  daysLeft = 14,
  isDemo = false,
  onDismiss,
}: TrialBannerProps) {
  if (isDemo) {
    return <DemoBanner />;
  }

  return <TrialModeBanner daysLeft={daysLeft} onDismiss={onDismiss} />;
}
