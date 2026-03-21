// src/components/dashboard/onboarding-checklist.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "nv-onboarding-dismissed";

interface ChecklistItem {
  id: string;
  label: string;
  href: string;
  description: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "add_client",
    label: "Add your first client",
    href: "/clients/new",
    description: "Add a client to manage their cases",
  },
  {
    id: "create_case",
    label: "Create your first case",
    href: "/matters/new",
    description: "Register a matter in court",
  },
  {
    id: "add_hearing",
    label: "Add a hearing date",
    href: "/hearings",
    description: "Schedule your next court appearance",
  },
  {
    id: "log_fee",
    label: "Log a fee entry",
    href: "/fees/new",
    description: "Record fees agreed with your client",
  },
  {
    id: "invite_team",
    label: "Invite a team member",
    href: "/settings/team",
    description: "Add a junior or clerk to your chamber",
  },
];

interface OnboardingChecklistProps {
  completedItemIds?: string[];
}

export function OnboardingChecklist({
  completedItemIds = [],
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  // Avoid hydration mismatch
  if (!mounted || dismissed) return null;

  const completedCount = completedItemIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Navy blue accent strip */}
      <div className="h-1 w-full" style={{ backgroundColor: "#1e3a5f" }} />

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Get Started with NyayVakil
            </CardTitle>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Complete these steps to set up your practice
            </p>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss onboarding checklist"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Progress
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#1e3a5f" }}
            >
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#1e3a5f",
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isCompleted = completedItemIds.includes(item.id);
            return (
              <li key={item.id}>
                <Link
                  href={isCompleted ? "#" : item.href}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isCompleted
                      ? "opacity-60 cursor-default"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                  }`}
                  onClick={isCompleted ? (e) => e.preventDefault() : undefined}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: "#1e3a5f" }}
                    />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 mt-0.5 text-slate-300 dark:text-slate-600" />
                  )}
                  <div className="min-w-0">
                    <span
                      className={`block text-sm font-medium leading-tight ${
                        isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
