// src/components/dashboard/todays-diary.tsx
"use client";

import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDate, formatTime, getStatusColor } from "@/lib/utils";
import type { Hearing } from "@/types";

const statusBorderMap: Record<string, string> = {
  upcoming: "border-l-blue-500",
  attended: "border-l-green-500",
  adjourned: "border-l-orange-500",
  completed: "border-l-emerald-500",
  missed: "border-l-red-500",
};

const statusLabelMap: Record<string, string> = {
  upcoming: "Upcoming",
  attended: "Attended",
  adjourned: "Adjourned",
  completed: "Completed",
  missed: "Missed",
};

interface TodaysDiaryProps {
  hearings: Hearing[];
  today: string;
}

export function TodaysDiary({ hearings, today }: TodaysDiaryProps) {
  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <CalendarDays className="h-4 w-4 text-gold" />
            Today's Court Diary
          </CardTitle>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(today)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-4">
        {hearings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No hearings scheduled for today
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add a hearing to see it here
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {hearings.map((hearing) => (
              <li
                key={hearing.id}
                className={`relative rounded-lg border border-l-4 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 ${
                  statusBorderMap[hearing.status] ?? "border-l-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {hearing.matterTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {hearing.clientName}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {hearing.courtName}
                      </span>
                      {hearing.time && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          {formatTime(hearing.time)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                      getStatusColor(hearing.status)
                    }`}
                  >
                    {statusLabelMap[hearing.status] ?? hearing.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Link
          href="/hearings"
          className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold dark:text-gold-bright dark:hover:text-gold-bright/80 transition-colors"
        >
          Open court diary
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
