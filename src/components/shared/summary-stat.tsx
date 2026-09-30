// src/components/shared/summary-stat.tsx
// The summary tile at the top of list pages: white card, navy number, gold icon.
// Colour is kept for meaning only — an "alert" stat turns red while its value is above zero.

import { cn } from "@/lib/utils";

export interface SummaryStatProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  /** "alert" = red while the count is non-zero (overdue, missed). "positive" = green figure (collected, paid). */
  tone?: "default" | "alert" | "positive";
  /** Numeric value used to decide whether an alert is active (defaults to `value` when it is a number). */
  count?: number;
  className?: string;
}

export function SummaryStat({ label, value, icon: Icon, tone = "default", count, className }: SummaryStatProps) {
  const n = count ?? (typeof value === "number" ? value : 0);
  const alert = tone === "alert" && n > 0;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900",
        alert ? "border-red-200 dark:border-red-900" : "border-slate-200 dark:border-slate-800",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            alert ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gold-bright/15 text-gold dark:bg-gold-bright/20 dark:text-gold-bright",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0">
        <p
          className={cn(
            "text-2xl font-bold leading-none tabular-nums",
            alert ? "text-red-700 dark:text-red-400" : tone === "positive" ? "text-emerald-700 dark:text-emerald-400" : "text-navy dark:text-slate-100",
          )}
        >
          {value}
        </p>
        <p className="mt-1.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
