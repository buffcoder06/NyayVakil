"use client";

import { useState, useMemo } from "react";
import type { Hearing } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime, titleCase, getStatusColor } from "@/lib/utils/index";
import { todayIST } from "@/lib/dates";

interface HearingCalendarProps {
  hearings: Hearing[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getHearingDotColor(status: string): string {
  if (status === "upcoming") return "bg-blue-500";
  if (status === "missed") return "bg-red-500";
  if (status === "completed" || status === "attended") return "bg-green-500";
  if (status === "adjourned") return "bg-orange-500";
  return "bg-slate-400";
}

export function HearingCalendar({ hearings }: HearingCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = todayIST();

  const hearingsByDate = useMemo(() => {
    const map: Record<string, Hearing[]> = {};
    hearings.forEach((h) => {
      if (!map[h.date]) map[h.date] = [];
      map[h.date].push(h);
    });
    return map;
  }, [hearings]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    // pad to fill last row
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const getDateStr = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  const selectedHearings = selectedDate ? (hearingsByDate[selectedDate] ?? []) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Calendar grid */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {MONTHS[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => {
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                    setSelectedDate(todayStr);
                  }}
                >
                  Today
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-slate-500 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="bg-white dark:bg-slate-800 h-14 sm:h-16" />;
                }
                const dateStr = getDateStr(day);
                const dayHearings = hearingsByDate[dateStr] ?? [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const hasHearings = dayHearings.length > 0;

                return (
                  <button
                    key={idx}
                    className={cn(
                      "relative bg-white dark:bg-slate-800 h-14 sm:h-16 flex flex-col items-center pt-1.5 transition-colors",
                      hasHearings ? "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30" : "cursor-default",
                      isSelected && "bg-blue-50 dark:bg-blue-950/40 ring-2 ring-inset ring-blue-400",
                    )}
                    onClick={() => hasHearings && setSelectedDate(isSelected ? null : dateStr)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                        isToday && "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900",
                        !isToday && isSelected && "text-blue-700 font-bold",
                        !isToday && !isSelected && "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {day}
                    </span>
                    {hasHearings && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center px-1 max-w-full">
                        {dayHearings.slice(0, 3).map((h, i) => (
                          <span
                            key={i}
                            className={cn("h-1.5 w-1.5 rounded-full", getHearingDotColor(h.status))}
                          />
                        ))}
                        {dayHearings.length > 3 && (
                          <span className="text-[12px] text-slate-500 font-medium">
                            +{dayHearings.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Upcoming</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Missed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500" /> Adjourned</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected day hearings */}
      <div>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              {selectedDate
                ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate && (
              <p className="text-sm text-slate-500 text-center py-8">
                Click a day with hearings to view details.
              </p>
            )}
            {selectedDate && selectedHearings.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">
                No hearings on this date.
              </p>
            )}
            <div className="space-y-3">
              {selectedHearings.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                      {h.matterTitle}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[12px] shrink-0 border", getStatusColor(h.status))}
                    >
                      {titleCase(h.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{h.clientName}</p>
                  <p className="text-xs text-slate-500">{h.courtName}{h.time ? ` · ${formatTime(h.time)}` : ""}</p>
                  {h.purpose && (
                    <p className="text-xs text-slate-500">{h.purpose}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
