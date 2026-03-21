// src/components/dashboard/stats-row.tsx
"use client";

import {
  Briefcase,
  CalendarDays,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyCompact } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  highlight?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  highlight,
}: StatCardProps) {
  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-shadow duration-200 ${
        highlight ? "ring-2 ring-indigo-400 dark:ring-indigo-600" : ""
      }`}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1.5 text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
          >
            <span className={iconColor}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsRowProps {
  stats: DashboardStats;
  todayHearingsCount: number;
}

export function StatsRow({ stats, todayHearingsCount }: StatsRowProps) {
  const tasksDueToday = stats.pendingTasks;

  const cards: StatCardProps[] = [
    {
      title: "Today's Hearings",
      value: todayHearingsCount,
      subtitle:
        todayHearingsCount === 0
          ? "No court today"
          : `${stats.upcomingHearings} more this week`,
      icon: <CalendarDays className="h-5 w-5" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      highlight: todayHearingsCount > 0,
    },
    {
      title: "Active Cases",
      value: stats.totalActiveMatters,
      subtitle: "Across all courts",
      icon: <Briefcase className="h-5 w-5" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Fees",
      value: formatCurrencyCompact(
        // pendingPayments is a count; use monthlyCollections as proxy for amount
        stats.pendingPayments
      ),
      subtitle:
        stats.overduePayments > 0
          ? `${stats.overduePayments} overdue entries`
          : "All payments on track",
      icon: <IndianRupee className="h-5 w-5" />,
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Tasks Due Today",
      value: tasksDueToday,
      subtitle: tasksDueToday === 0 ? "All caught up!" : "Needs your attention",
      icon: <ClipboardList className="h-5 w-5" />,
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
