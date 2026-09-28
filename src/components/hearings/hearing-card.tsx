"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Hearing } from "@/types";
import { formatDate, formatTime, getStatusColor, titleCase } from "@/lib/utils/index";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ChevronRight,
  Pencil,
  CheckCircle2,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HearingCardProps {
  hearing: Hearing;
  isToday?: boolean;
  isMissed?: boolean;
  onEdit?: (hearing: Hearing) => void;
  onMarkStatus?: (hearing: Hearing) => void;
  onAddNextHearing?: (hearing: Hearing) => void;
  /** True while an action on this hearing is being saved. */
  busy?: boolean;
}

export function HearingCard({
  hearing,
  isToday,
  isMissed,
  onEdit,
  onMarkStatus,
  onAddNextHearing,
  busy = false,
}: HearingCardProps) {
  const leftBorderClass =
    isMissed || hearing.status === "missed"
      ? "border-l-4 border-l-red-500"
      : isToday
      ? "border-l-4 border-l-amber-400"
      : "border-l-4 border-l-transparent";

  const dateBadgeBg =
    hearing.status === "missed"
      ? "bg-red-100 text-red-700"
      : isToday
      ? "bg-amber-100 text-amber-700"
      : hearing.status === "completed" || hearing.status === "attended"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  const dateObj = new Date(hearing.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-IN", { month: "short" });

  return (
    <Card
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 transition-shadow hover:shadow-md",
        leftBorderClass
      )}
    >
      {/* Date badge */}
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[56px] text-center shrink-0",
          dateBadgeBg
        )}
      >
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="text-xs font-medium mt-0.5">{month}</span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {hearing.matterTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {hearing.clientName}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-xs font-medium border", getStatusColor(hearing.status))}
          >
            {titleCase(hearing.status)}
          </Badge>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {hearing.courtName}
          </span>
          {hearing.time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {formatTime(hearing.time)}
            </span>
          )}
          {hearing.purpose && (
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              {hearing.purpose}
            </span>
          )}
          {hearing.assignedTo && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {hearing.assignedTo}
            </span>
          )}
        </div>

        {hearing.notes && (
          <p className="mt-1.5 text-xs text-slate-500 italic truncate">{hearing.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 shrink-0 sm:items-end justify-end sm:justify-center">
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs gap-1"
            onClick={() => onEdit(hearing)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        {onMarkStatus && hearing.status === "upcoming" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs gap-1 text-green-700 hover:text-green-800 hover:bg-green-50"
            onClick={() => onMarkStatus(hearing)}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Status</span>
          </Button>
        )}
        {onAddNextHearing && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => onAddNextHearing(hearing)}
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Next</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
