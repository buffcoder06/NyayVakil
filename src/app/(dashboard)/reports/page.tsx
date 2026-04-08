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

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const COLORS = ["#1e3a5f", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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

function BarRow({ label, value, max, color = "bg-[#1e3a5f]" }: { label: string; value: number; max: number; color?: string }) {
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

export default function ReportsPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [fees, setFees] = useState<FeeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Export feature — coming soon.")}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Tabs defaultValue="financial">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="financial" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger value="matters" className="gap-1.5">
            <TrendingUp className="h-4 w-4" /> Matters
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
            <div className="rounded-xl border p-4 bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Total Agreed</p>
              <p className="text-xl font-bold text-slate-800">{fmt(financialStats.totalAgreed)}</p>
            </div>
            <div className="rounded-xl border p-4 bg-emerald-50">
              <p className="text-xs text-emerald-600 mb-1">Total Collected</p>
              <p className="text-xl font-bold text-emerald-800">{fmt(financialStats.totalCollected)}</p>
            </div>
            <div className="rounded-xl border p-4 bg-amber-50">
              <p className="text-xs text-amber-600 mb-1">Total Pending</p>
              <p className="text-xl font-bold text-amber-800">{fmt(financialStats.totalPending)}</p>
            </div>
            <div className="rounded-xl border p-4 bg-blue-50">
              <p className="text-xs text-blue-600 mb-1">Recovery Rate</p>
              <p className="text-xl font-bold text-blue-800">{financialStats.recoveryRate.toFixed(0)}%</p>
            </div>
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
                  <Legend />
                  <Bar dataKey="collected" name="Collected" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
            <SectionCard title="Matter Status Distribution">
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
            <SectionCard title="Matter Type Distribution">
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
            <div className="rounded-xl border p-4 bg-emerald-50">
              <p className="text-xl font-bold text-emerald-800">{matters.filter((m) => m.status === "active").length}</p>
              <p className="text-xs text-emerald-600 mt-1">Active Matters</p>
            </div>
            <div className="rounded-xl border p-4 bg-amber-50">
              <p className="text-xl font-bold text-amber-800">{matters.filter((m) => m.priority === "high").length}</p>
              <p className="text-xs text-amber-600 mt-1">High Priority</p>
            </div>
            <div className="rounded-xl border p-4 bg-red-50">
              <p className="text-xl font-bold text-red-800">{matters.filter((m) => m.nextHearingDate && new Date(m.nextHearingDate) < new Date()).length}</p>
              <p className="text-xs text-red-600 mt-1">Overdue Hearings</p>
            </div>
            <div className="rounded-xl border p-4 bg-slate-50">
              <p className="text-xl font-bold text-slate-800">{matters.filter((m) => m.status === "disposed").length}</p>
              <p className="text-xs text-slate-500 mt-1">Disposed</p>
            </div>
          </div>
        </TabsContent>

        {/* HEARINGS */}
        <TabsContent value="hearings" className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "Upcoming", count: hearingStats.upcoming, color: "bg-blue-50 text-blue-800" },
              { label: "Attended", count: hearingStats.attended, color: "bg-emerald-50 text-emerald-800" },
              { label: "Adjourned", count: hearingStats.adjourned, color: "bg-amber-50 text-amber-800" },
              { label: "Completed", count: hearingStats.completed, color: "bg-slate-50 text-slate-700" },
              { label: "Missed", count: hearingStats.missed, color: "bg-red-50 text-red-800" },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-xl border p-4", s.color)}>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Today's hearings */}
          <SectionCard title="Today's Hearings">
            {hearings.filter((h) => h.date === new Date().toISOString().split("T")[0]).length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No hearings scheduled for today.</p>
            ) : (
              <div className="space-y-2">
                {hearings
                  .filter((h) => h.date === new Date().toISOString().split("T")[0])
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
              const today = new Date().toISOString().split("T")[0];
              const weekEnd = new Date();
              weekEnd.setDate(weekEnd.getDate() + 7);
              const weekEndStr = weekEnd.toISOString().split("T")[0];
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
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-xl font-bold text-amber-800">{taskStats.pending}</p>
                <p className="text-xs text-amber-600 mt-0.5">Pending</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-xl font-bold text-emerald-800">{taskStats.completed}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Completed</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xl font-bold text-red-800">{taskStats.overdue.length}</p>
                <p className="text-xs text-red-600 mt-0.5">Overdue</p>
              </div>
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
