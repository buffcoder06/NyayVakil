"use client";

import { useEffect, useState, useMemo } from "react";
import type { Hearing, Matter } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HearingCard } from "@/components/hearings/hearing-card";
import { AddHearingDialog } from "@/components/hearings/add-hearing-dialog";
import { HearingCalendar } from "@/components/hearings/hearing-calendar";
import {
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  Calendar,
  CalendarCheck,
  CalendarX,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, groupBy } from "@/lib/utils/index";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "calendar";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={cn("rounded-xl border p-4 flex items-center gap-3", color)}>
      <Icon className="h-8 w-8 opacity-70 shrink-0" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs mt-1 font-medium opacity-80">{label}</p>
      </div>
    </div>
  );
}

export default function HearingsPage() {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [addOpen, setAddOpen] = useState(false);
  const [filterCourt, setFilterCourt] = useState("all");
  const [filterAssigned, setFilterAssigned] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todayStr = new Date().toISOString().split("T")[0];
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split("T")[0];
  const monthEnd = new Date();
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  const monthEndStr = monthEnd.toISOString().split("T")[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [hRes, mRes] = await Promise.all([
          fetch("/api/hearings?pageSize=200").then((r) => r.json()),
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
        ]);
        setHearings(hRes.data?.data ?? []);
        setMatters(mRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load hearings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const today = hearings.filter((h) => h.date === todayStr).length;
    const thisWeek = hearings.filter(
      (h) => h.date >= todayStr && h.date <= weekEndStr && h.status === "upcoming"
    ).length;
    const overdue = hearings.filter((h) => h.status === "missed").length;
    const thisMonth = hearings.filter(
      (h) => h.date >= todayStr && h.date <= monthEndStr && h.status === "upcoming"
    ).length;
    return { today, thisWeek, overdue, thisMonth };
  }, [hearings, todayStr, weekEndStr, monthEndStr]);

  const courts = useMemo(
    () => [...new Set(hearings.map((h) => h.courtName).filter(Boolean))],
    [hearings]
  );
  const assignedPersons = useMemo(
    () => [...new Set(hearings.map((h) => h.assignedTo).filter(Boolean))],
    [hearings]
  );

  const filteredHearings = useMemo(() => {
    return hearings.filter((h) => {
      if (filterCourt !== "all" && h.courtName !== filterCourt) return false;
      if (filterAssigned !== "all" && h.assignedTo !== filterAssigned) return false;
      if (filterStatus !== "all" && h.status !== filterStatus) return false;
      return true;
    });
  }, [hearings, filterCourt, filterAssigned, filterStatus]);

  const todayHearings = filteredHearings.filter((h) => h.date === todayStr);
  const upcomingHearings = filteredHearings.filter(
    (h) => h.status === "upcoming" && h.date > todayStr
  );
  const missedHearings = filteredHearings.filter((h) => h.status === "missed");
  const completedHearings = filteredHearings.filter(
    (h) => h.status === "completed" || h.status === "attended"
  );

  const navigateDate = (dir: -1 | 1) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d);
  };

  const handleMarkStatus = async (hearing: Hearing) => {
    try {
      await fetch(`/api/hearings/${hearing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "attended" }) });
      setHearings((prev) =>
        prev.map((h) => (h.id === hearing.id ? { ...h, status: "attended" } : h))
      );
      toast.success("Hearing marked as attended.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const renderHearingGroups = (list: Hearing[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <CalendarDays className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm font-medium">No hearings found</p>
          <p className="text-xs mt-1">Schedule a hearing to see it here.</p>
        </div>
      );
    }

    const grouped = groupBy(list, "date");
    const sortedDates = Object.keys(grouped).sort();

    return (
      <div className="space-y-6">
        {sortedDates.map((dateStr) => {
          const dayHearings = grouped[dateStr];
          const isToday = dateStr === todayStr;
          return (
            <div key={dateStr}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isToday ? "text-amber-600" : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {isToday ? "Today — " : ""}
                  {new Date(dateStr + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {dayHearings.length} hearing{dayHearings.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="space-y-3">
                {dayHearings.map((h) => (
                  <HearingCard
                    key={h.id}
                    hearing={h}
                    isToday={dateStr === todayStr}
                    isMissed={h.status === "missed"}
                    onMarkStatus={handleMarkStatus}
                    onEdit={() => toast.info("Edit hearing — coming soon.")}
                    onAddNextHearing={() => {
                      setAddOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Court Diary"
        description="Manage and track all your court hearings."
        actions={
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Hearing
          </Button>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Today"
            value={stats.today}
            icon={Calendar}
            color="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
          />
          <StatCard
            label="This Week"
            value={stats.thisWeek}
            icon={CalendarDays}
            color="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
          />
          <StatCard
            label="Overdue / Missed"
            value={stats.overdue}
            icon={AlertCircle}
            color="bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
          />
          <StatCard
            label="This Month"
            value={stats.thisMonth}
            icon={CalendarCheck}
            color="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
          />
        </div>
      )}

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* View toggle */}
        <div className="flex rounded-lg border overflow-hidden">
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
              viewMode === "list"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
              viewMode === "calendar"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="h-4 w-4" />
            Calendar
          </button>
        </div>

        {/* Date navigation */}
        {viewMode === "list" && (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => navigateDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex-1" />

        {/* Filters */}
        <Select value={filterCourt} onValueChange={(v) => v !== null && setFilterCourt(v)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="All Courts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courts</SelectItem>
            {courts.map((c) => (
              <SelectItem key={c} value={c!}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterAssigned} onValueChange={(v) => v !== null && setFilterAssigned(v)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="All Persons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Persons</SelectItem>
            {assignedPersons.map((p) => (
              <SelectItem key={p} value={p!}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => v !== null && setFilterStatus(v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="attended">Attended</SelectItem>
            <SelectItem value="adjourned">Adjourned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : viewMode === "calendar" ? (
        <HearingCalendar hearings={filteredHearings} />
      ) : (
        <Tabs defaultValue="today">
          <TabsList className="mb-4">
            <TabsTrigger value="today">
              Today
              {todayHearings.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1 text-[10px]" variant="secondary">
                  {todayHearings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              {upcomingHearings.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1 text-[10px]" variant="secondary">
                  {upcomingHearings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="missed">
              Missed
              {missedHearings.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1 text-[10px] bg-red-100 text-red-700">
                  {missedHearings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="today">{renderHearingGroups(todayHearings)}</TabsContent>
          <TabsContent value="upcoming">{renderHearingGroups(upcomingHearings)}</TabsContent>
          <TabsContent value="missed">{renderHearingGroups(missedHearings)}</TabsContent>
          <TabsContent value="completed">{renderHearingGroups(completedHearings)}</TabsContent>
          <TabsContent value="all">{renderHearingGroups(filteredHearings)}</TabsContent>
        </Tabs>
      )}

      <AddHearingDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        matters={matters}
        onSuccess={(h) => setHearings((prev) => [h, ...prev])}
      />
    </div>
  );
}
