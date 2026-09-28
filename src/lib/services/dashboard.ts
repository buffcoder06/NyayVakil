// src/lib/services/dashboard.ts
import "server-only";
import type { DashboardStats } from "@/types";
import { db } from "@/lib/db";
import { addDays, monthRange, parseDateOnly, todayIST } from "@/lib/dates";
import { clientInclude, toClient } from "@/lib/server/dto";
import { getFeeEntries } from "./fees";
import { getHearings } from "./hearings";
import { getMatters } from "./matters";
import { getTasks } from "./tasks";

export async function getDashboardStats(firmId: string): Promise<DashboardStats> {
  const todayStr = todayIST();
  const today = parseDateOnly(todayStr);
  const { start, end } = monthRange(todayStr);
  const monthStart = parseDateOnly(start);
  const monthEnd = parseDateOnly(end);

  const [
    totalActiveMatters,
    todayHearings,
    upcomingHearings,
    overduePayments,
    pendingPayments,
    monthlyCollections,
    pendingTasks,
    totalClients,
    monthlyExpenses,
  ] = await Promise.all([
    db.matter.count({ where: { firmId, status: "active" } }),
    db.hearing.count({ where: { firmId, date: today } }),
    db.hearing.count({ where: { firmId, date: { gt: today }, status: "upcoming" } }),
    db.feeEntry.count({ where: { firmId, status: { not: "paid" }, dueDate: { lt: today } } }),
    db.feeEntry.aggregate({ where: { firmId, status: { not: "paid" } }, _sum: { pendingAmount: true } }),
    db.payment.aggregate({
      where: { firmId, paymentDate: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    db.task.count({ where: { firmId, status: { in: ["pending", "in_progress"] } } }),
    db.client.count({ where: { firmId, isActive: true } }),
    db.expense.aggregate({
      where: { firmId, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalActiveMatters,
    todayHearings,
    upcomingHearings,
    overduePayments,
    pendingPayments: pendingPayments._sum.pendingAmount?.toNumber() ?? 0,
    monthlyCollections: monthlyCollections._sum.amount?.toNumber() ?? 0,
    pendingTasks,
    totalClients,
    monthlyExpenses: monthlyExpenses._sum.amount?.toNumber() ?? 0,
  };
}

/** Everything the dashboard page renders, fetched in parallel and bounded in size. */
export async function getDashboardData(firmId: string) {
  const today = todayIST();

  const [stats, hearings, matters, fees, tasks] = await Promise.all([
    getDashboardStats(firmId),
    getHearings(firmId, { dateFrom: today, dateTo: addDays(today, 7), pageSize: 100 }),
    getMatters(firmId, { pageSize: 10 }),
    getFeeEntries(firmId),
    getTasks(firmId),
  ]);

  const clientIds = [...new Set(matters.data.map((m) => m.clientId))];
  const clients = await db.client.findMany({
    where: { firmId, id: { in: clientIds } },
    include: clientInclude,
  });

  return {
    today,
    stats,
    hearings: hearings.data,
    matters: matters.data,
    totalMatters: matters.total,
    fees: fees.filter((f) => f.status !== "paid"),
    tasks: tasks.filter((t) => t.status === "pending" || t.status === "in_progress"),
    clients: clients.map(toClient),
  };
}
