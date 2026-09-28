// src/components/dashboard/upcoming-hearings-widget.tsx
"use client";

import Link from "next/link";
import { CalendarDays, MapPin, User, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDate, formatTime, formatRelativeDate, getDaysUntil, getStatusColor } from "@/lib/utils";
import type { Hearing } from "@/types";
import { addDays, todayIST } from "@/lib/dates";

function getDaysLabel(date: string): { label: string; className: string } {
  const days = getDaysUntil(date);
  if (days < 0)
    return {
      label: `${Math.abs(days)}d overdue`,
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    };
  if (days === 0)
    return {
      label: "Today",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    };
  if (days === 1)
    return {
      label: "Tomorrow",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    };
  return {
    label: `In ${days}d`,
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
}

interface UpcomingHearingsWidgetProps {
  hearings: Hearing[];
}

export function UpcomingHearingsWidget({ hearings }: UpcomingHearingsWidgetProps) {
  // Show hearings in the next 7 days (upcoming only), max 5
  const today = todayIST();
  const sevenDaysLater = addDays(today, 7);

  const filtered = hearings
    .filter(
      (h) =>
        h.status === "upcoming" && h.date >= today && h.date <= sevenDaysLater
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          <CalendarDays className="h-4 w-4 text-blue-500" />
          Upcoming Hearings
          <span className="ml-auto text-xs font-normal text-slate-400">
            Next 7 days
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="h-9 w-9 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No upcoming hearings in the next 7 days
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((hearing) => {
              const { label, className: dayClass } = getDaysLabel(hearing.date);
              return (
                <li
                  key={hearing.id}
                  className="flex items-start gap-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {hearing.matterTitle}
                      </p>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${dayClass}`}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {hearing.courtName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(hearing.date)}
                        {hearing.time && ` · ${formatTime(hearing.time)}`}
                      </span>
                      {hearing.assignedTo && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <User className="h-3 w-3" />
                          {hearing.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-0.5 shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                      hearing.status
                    )}`}
                  >
                    {hearing.status.charAt(0).toUpperCase() +
                      hearing.status.slice(1)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Link
          href="/hearings"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          View all hearings
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
