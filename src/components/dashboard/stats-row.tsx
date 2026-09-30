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
        highlight ? "ring-2 ring-gold-bright/70" : ""
      }`}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1.5 text-3xl font-bold text-navy dark:text-slate-100 tabular-nums">
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
  const tasksDueToday = stats.tasksDue;

  const cards: StatCardProps[] = [
    {
      title: "Today's Hearings",
      value: todayHearingsCount,
      subtitle:
        todayHearingsCount === 0
          ? "No court today"
          : `${stats.upcomingHearings} more this week`,
      icon: <CalendarDays className="h-5 w-5" />,
      iconBg: "bg-gold-bright/15 dark:bg-gold-bright/20",
      iconColor: "text-gold dark:text-gold-bright",
      highlight: todayHearingsCount > 0,
    },
    {
      title: "Active Cases",
      value: stats.totalActiveMatters,
      subtitle: "Across all courts",
      icon: <Briefcase className="h-5 w-5" />,
      iconBg: "bg-gold-bright/15 dark:bg-gold-bright/20",
      iconColor: "text-gold dark:text-gold-bright",
    },
    {
      title: "Pending Fees",
      // Total rupees still owed across all unpaid fee entries
      value: formatCurrencyCompact(stats.pendingPayments),
      subtitle:
        stats.overduePayments > 0
          ? `${stats.overduePayments} overdue entries`
          : "All payments on track",
      icon: <IndianRupee className="h-5 w-5" />,
      // red only carries meaning when something is actually overdue
      iconBg:
        stats.overduePayments > 0
          ? "bg-red-100 dark:bg-red-900/40"
          : "bg-gold-bright/15 dark:bg-gold-bright/20",
      iconColor:
        stats.overduePayments > 0
          ? "text-red-600 dark:text-red-400"
          : "text-gold dark:text-gold-bright",
    },
    {
      title: "Tasks Due Today",
      value: tasksDueToday,
      subtitle: tasksDueToday === 0 ? "All caught up!" : "Due today or overdue",
      icon: <ClipboardList className="h-5 w-5" />,
      iconBg: "bg-gold-bright/15 dark:bg-gold-bright/20",
      iconColor: "text-gold dark:text-gold-bright",
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
