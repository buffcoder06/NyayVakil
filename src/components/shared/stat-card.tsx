import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type StatCardColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "indigo"
  | "teal"
  | "navy";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  color?: StatCardColor;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_CONFIG: Record<
  StatCardColor,
  { bg: string; text: string; icon: string; ring: string }
> = {
  navy: {
    bg: "bg-[#14213D]/10",
    text: "text-[#14213D]",
    icon: "text-[#14213D]",
    ring: "ring-[#14213D]/20",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "text-blue-600",
    ring: "ring-blue-200",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "text-red-700",
    ring: "ring-red-200",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-700",
    ring: "ring-amber-200",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-600",
    ring: "ring-purple-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    icon: "text-indigo-600",
    ring: "ring-indigo-200",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: "text-teal-600",
    ring: "ring-teal-200",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-5 animate-pulse", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-200 rounded w-24" />
          <div className="h-7 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-32" />
        </div>
        <div className="h-11 w-11 bg-slate-200 rounded-xl" />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "navy",
  onClick,
  loading,
  className,
}: StatCardProps) {
  if (loading) return <StatCardSkeleton className={className} />;

  const colors = COLOR_CONFIG[color];

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-200 bg-white border border-slate-200",
        onClick &&
          "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 leading-none mb-1">
            {value}
          </p>

          {/* Trend or subtitle */}
          {trend ? (
            <div className="flex items-center gap-1.5 mt-2">
              {trend.positive ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.positive ? "text-emerald-700" : "text-red-700"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-slate-500">{trend.label}</span>
            </div>
          ) : subtitle ? (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          ) : null}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ring-1",
            colors.bg,
            colors.ring
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
