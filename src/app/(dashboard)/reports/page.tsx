"use client";

import { useEffect, useState, useMemo } from "react";
import type { Matter, Hearing, FeeEntry, Expense, Task, Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download, BarChart3, TrendingUp, Calendar, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addDays, todayIST } from "@/lib/dates";
import { titleCase } from "@/lib/utils/index";
import { SummaryStat } from "@/components/shared/summary-stat";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Brand palette: navy and gold first, then muted tints that stay distinguishable
const COLORS = ["#14213D", "#D9A441", "#5B6B8C", "#A8741F", "#94A3B8", "#E9CF94"];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BarRow({ label, value, max, color = "bg-[#14213D]" }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm text-slate-600 w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-slate-800 w-8 text-right shrink-0">{value}</span>
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────

type ReportTab = "financial" | "matters" | "hearings" | "tasks";

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  // Stop spreadsheets from treating a cell as a formula
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(filename: string, header: string[], rows: unknown[][]) {
  const body = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  // BOM so Excel reads UTF-8 (₹, Devanagari names)
  const blob = new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [fees, setFees] = useState<FeeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ReportTab>("financial");

  const exportCsv = () => {
    const stamp = todayIST();
    const clientName = (id?: string) => clients.find((c) => c.id === id)?.name ?? "";
    const matterTitle = (id?: string) => matters.find((m) => m.id === id)?.matterTitle ?? "";
    if (tab === "financial") {
      downloadCsv(`nyayvakil-fees-${stamp}.csv`,
        ["Case", "Client", "Description", "Total (INR)", "Received (INR)", "Pending (INR)", "Due date", "Status"],
        fees.map((f) => [f.matterTitle ?? matterTitle(f.matterId), f.clientName ?? clientName(f.clientId), f.description, f.totalAmount, f.receivedAmount, f.pendingAmount, f.dueDate ?? "", titleCase(f.status)]));
    } else if (tab === "matters") {
      downloadCsv(`nyayvakil-matters-${stamp}.csv`,
        ["Case", "Case number", "CNR", "Client", "Court", "Case type", "Status", "Priority", "Filing date", "Next hearing", "Fee agreed (INR)", "Fee paid (INR)", "Expenses (INR)"],
        matters.map((m) => [m.matterTitle, m.caseNumber ?? "", m.cnrNumber ?? "", m.clientName ?? clientName(m.clientId), m.courtName, m.caseType, titleCase(m.status), titleCase(m.priority), m.filingDate ?? "", m.nextHearingDate ?? "", m.totalFeeAgreed, m.totalFeePaid, m.totalExpenses]));
    } else if (tab === "hearings") {
      downloadCsv(`nyayvakil-hearings-${stamp}.csv`,
        ["Date", "Time", "Case", "Client", "Court", "Purpose", "Assigned to", "Status"],
        [...hearings].sort((a, b) => a.date.localeCompare(b.date)).map((h) => [h.date, h.time ?? "", h.matterTitle, h.clientName, h.courtName, h.purpose ?? "", h.assignedTo ?? "", titleCase(h.status)]));
    } else {
      downloadCsv(`nyayvakil-tasks-${stamp}.csv`,
        ["Task", "Case", "Assigned to", "Due date", "Priority", "Status", "Completed at"],
        tasks.map((t) => [t.title, t.matterTitle ?? "", t.assignedTo, t.dueDate ?? "", titleCase(t.priority), titleCase(t.status), t.completedAt ? new Date(t.completedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""]));
    }
    toast.success("Report downloaded.");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, hRes, fRes, eRes, tRes, cRes] = await Promise.all([
          fetch("/api/matters?pageSize=500").then((r) => r.json()),
          fetch("/api/hearings?pageSize=500").then((r) => r.json()),
          fetch("/api/fees").then((r) => r.json()),
          fetch("/api/expenses").then((r) => r.json()),
          fetch("/api/tasks").then((r) => r.json()),
          fetch("/api/clients?pageSize=500").then((r) => r.json()),
        ]);
        setMatters(mRes.data?.data ?? []);
        setHearings(hRes.data?.data ?? []);
        setFees(fRes.data ?? []);
        setExpenses(eRes.data ?? []);
        setTasks(tRes.data ?? []);
        setClients(cRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Financial computations
  const financialStats = useMemo(() => {
    const totalAgreed = fees.reduce((a, f) => a + f.totalAmount, 0);
    const totalCollected = fees.reduce((a, f) => a + f.receivedAmount, 0);
    const totalPending = fees.reduce((a, f) => a + f.pendingAmount, 0);
    const recoveryRate = totalAgreed > 0 ? (totalCollected / totalAgreed) * 100 : 0;
    return { totalAgreed, totalCollected, totalPending, recoveryRate };
  }, [fees]);

  // Monthly collection data (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const collected = fees
        .filter((f) => f.updatedAt?.startsWith(monthStr))
        .reduce((a, f) => a + f.receivedAmount, 0);
      const expTotal = expenses
        .filter((e) => e.date?.startsWith(monthStr))
        .reduce((a, e) => a + e.amount, 0);
      data.push({
        month: MONTH_NAMES[d.getMonth()],
        collected,
        expenses: expTotal,
      });
    }
    return data;
  }, [fees, expenses]);

  // Outstanding by client
  const clientOutstanding = useMemo(() => {
    return clients
      .filter((c) => c.totalOutstanding > 0)
      .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
      .slice(0, 8);
  }, [clients]);

  // Matter status distribution
  const matterStatusDist = useMemo(() => {
    const statuses = ["active", "pending", "on_hold", "disposed", "closed"];
    return statuses.map((s) => ({
      name: s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: matters.filter((m) => m.status === s).length,
    })).filter((s) => s.value > 0);
  }, [matters]);

  // Matter type distribution
  const matterTypeDist = useMemo(() => {
    const types: Record<string, number> = {};
    matters.forEach((m) => { types[m.caseType] = (types[m.caseType] || 0) + 1; });
    return Object.entries(types)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [matters]);

  // Expense type breakdown
  const expenseTypeDist = useMemo(() => {
    const types: Record<string, number> = {};
    expenses.forEach((e) => { types[e.expenseType] = (types[e.expenseType] || 0) + e.amount; });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // Hearing stats
  const hearingStats = useMemo(() => ({
    upcoming: hearings.filter((h) => h.status === "upcoming").length,
    attended: hearings.filter((h) => h.status === "attended").length,
    adjourned: hearings.filter((h) => h.status === "adjourned").length,
    completed: hearings.filter((h) => h.status === "completed").length,
    missed: hearings.filter((h) => h.status === "missed").length,
  }), [hearings]);

  // Task stats
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const overdue = tasks.filter(
      (t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()
    );
    const assignees: Record<string, number> = {};
    tasks.forEach((t) => { assignees[t.assignedTo] = (assignees[t.assignedTo] || 0) + 1; });
    return { total, completed, pending, overdue, assignees, completionRate: total > 0 ? (completed / total) * 100 : 0 };
  }, [tasks]);

  const expenseTypeLabel: Record<string, string> = {
    court_fee: "Court Fee", clerk_expense: "Clerk", photocopy: "Photocopy",
    typing: "Typing", travel: "Travel", affidavit: "Affidavit",
    filing: "Filing", stamp: "Stamp", miscellaneous: "Misc",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Practice analytics, financial reports, and operational insights."
        actions={
          <Button variant="outline" className="gap-2" onClick={exportCsv} disabled={loading}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ReportTab)}>
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="financial" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger value="matters" className="gap-1.5">
            <TrendingUp className="h-4 w-4" /> Cases
          </TabsTrigger>
          <TabsTrigger value="hearings" className="gap-1.5">
            <Calendar className="h-4 w-4" /> Hearings
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5">
            <CheckSquare className="h-4 w-4" /> Tasks
          </TabsTrigger>
        </TabsList>

        {/* FINANCIAL */}
        <TabsContent value="financial" className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryStat label="Total Agreed" value={fmt(financialStats.totalAgreed)} />
            <SummaryStat label="Total Collected" value={fmt(financialStats.totalCollected)} tone="positive" />
            <SummaryStat label="Total Pending" value={fmt(financialStats.totalPending)} />
            <SummaryStat label="Recovery Rate" value={`${financialStats.recoveryRate.toFixed(0)}%`} />
          </div>

          {/* Monthly Chart */}
          <SectionCard title="Monthly Collection vs Expenses (Last 6 Months)">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => [fmt(Number(value)), ""]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  />
                  <Legend formatter={(value: string) => <span style={{ color: "#475569" }}>{value}</span>} />
                  <Bar dataKey="collected" name="Collected" fill="#14213D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#D9A441" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Outstanding Clients */}
          <SectionCard title="Outstanding by Client (Top 8)">
            {clientOutstanding.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No outstanding amounts. All collected!</p>
            ) : (
              <div className="space-y-3">
                {clientOutstanding.map((client) => (
                  <div key={client.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800 truncate">{client.name}</span>
                        <span className="text-sm font-bold text-red-600 shrink-0 ml-2">{fmt(client.totalOutstanding)}</span>
                      </div>
                      <Progress
                        value={(client.totalOutstanding / (clientOutstanding[0]?.totalOutstanding || 1)) * 100}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Expense Breakdown */}
          <SectionCard title="Expense Breakdown by Type">
            <div className="space-y-1">
              {expenseTypeDist.map((t) => (
                <BarRow
                  key={t.name}
                  label={expenseTypeLabel[t.name] || t.name}
                  value={t.value}
                  max={Math.max(...expenseTypeDist.map((x) => x.value))}
                  color="bg-amber-400"
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* MATTERS */}
        <TabsContent value="matters" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Status Pie Chart */}
            <SectionCard title="Case Status Distribution">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={matterStatusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}>
                      {matterStatusDist.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Type Distribution */}
            <SectionCard title="Case Type Distribution">
              <div className="space-y-1">
                {matterTypeDist.map((t) => (
                  <BarRow
                    key={t.name}
                    label={t.name}
                    value={t.value}
                    max={Math.max(...matterTypeDist.map((x) => x.value))}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryStat label="Active Cases" value={matters.filter((m) => m.status === "active").length} />
            <SummaryStat label="High Priority" value={matters.filter((m) => m.priority === "high").length} />
            <SummaryStat label="Overdue Hearings" value={matters.filter((m) => m.nextHearingDate && m.nextHearingDate < todayIST()).length} tone="alert" />
            <SummaryStat label="Disposed" value={matters.filter((m) => m.status === "disposed").length} />
          </div>
        </TabsContent>

        {/* HEARINGS */}
        <TabsContent value="hearings" className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "Upcoming", count: hearingStats.upcoming },
              { label: "Attended", count: hearingStats.attended },
              { label: "Adjourned", count: hearingStats.adjourned },
              { label: "Completed", count: hearingStats.completed },
              { label: "Missed", count: hearingStats.missed, tone: "alert" as const },
            ].map((s) => (
              <SummaryStat key={s.label} label={s.label} value={s.count} tone={s.tone} />
            ))}
          </div>

          {/* Today's hearings */}
          <SectionCard title="Today's Hearings">
            {hearings.filter((h) => h.date === todayIST()).length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No hearings scheduled for today.</p>
            ) : (
              <div className="space-y-2">
                {hearings
                  .filter((h) => h.date === todayIST())
                  .map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div>
                        <p className="font-medium text-sm text-slate-900">{h.matterTitle}</p>
                        <p className="text-xs text-slate-500">{h.courtName} {h.time && `· ${h.time}`}</p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                        {h.purpose || "Hearing"}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </SectionCard>

          {/* Upcoming */}
          <SectionCard title="Upcoming Hearings (Next 7 Days)">
            {(() => {
              const today = todayIST();
              const weekEndStr = addDays(today, 7);
              const upcoming = hearings.filter(
                (h) => h.date > today && h.date <= weekEndStr && h.status === "upcoming"
              );
              return upcoming.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No hearings in the next 7 days.</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.sort((a, b) => a.date.localeCompare(b.date)).map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div>
                        <p className="font-medium text-sm text-slate-900">{h.matterTitle}</p>
                        <p className="text-xs text-slate-500">{h.courtName} · {h.clientName}</p>
                      </div>
                      <p className="text-xs font-semibold text-blue-700">
                        {new Date(h.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </SectionCard>
        </TabsContent>

        {/* TASKS */}
        <TabsContent value="tasks" className="space-y-5">
          {/* Task Completion */}
          <SectionCard title="Task Completion Rate">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Completed Tasks</span>
                <span className="font-bold text-slate-900">{taskStats.completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={taskStats.completionRate} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>{taskStats.completed} completed</span>
                <span>{taskStats.total} total</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <SummaryStat label="Pending" value={taskStats.pending} />
              <SummaryStat label="Completed" value={taskStats.completed} />
              <SummaryStat label="Overdue" value={taskStats.overdue.length} tone="alert" />
            </div>
          </SectionCard>

          {/* Tasks by Assignee */}
          <SectionCard title="Tasks by Assignee">
            <div className="space-y-1">
              {Object.entries(taskStats.assignees)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <BarRow
                    key={name}
                    label={name}
                    value={count}
                    max={Math.max(...Object.values(taskStats.assignees))}
                  />
                ))}
            </div>
          </SectionCard>

          {/* Overdue Tasks */}
          {taskStats.overdue.length > 0 && (
            <SectionCard title="Overdue Tasks">
              <div className="space-y-2">
                {taskStats.overdue.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.assignedTo} · {task.matterTitle}</p>
                    </div>
                    {task.dueDate && (
                      <p className="text-xs font-semibold text-red-700">
                        {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
