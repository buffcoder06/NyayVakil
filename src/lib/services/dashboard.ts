// src/lib/services/dashboard.ts
import { db } from "@/lib/db";

export async function getDashboardStats(firmId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalActiveMatters,
    todayHearings,
    upcomingHearings,
    overduePayments,
    monthlyCollections,
    pendingTasks,
    totalClients,
    monthlyExpenses,
  ] = await Promise.all([
    db.matter.count({ where: { firmId, status: "active" } }),
    db.hearing.count({ where: { firmId, date: { gte: today, lt: tomorrow } } }),
    db.hearing.count({ where: { firmId, date: { gt: today }, status: "upcoming" } }),
    db.feeEntry.count({ where: { firmId, status: "overdue" } }),
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

  const pendingPayments = await db.feeEntry.aggregate({
    where: { firmId, status: { in: ["overdue", "partially_paid", "not_started"] } },
    _sum: { pendingAmount: true },
  });

  return {
    totalActiveMatters,
    todayHearings,
    upcomingHearings,
    overduePayments,
    pendingPayments: pendingPayments._sum.pendingAmount ?? 0,
    monthlyCollections: monthlyCollections._sum.amount ?? 0,
    pendingTasks,
    totalClients,
    monthlyExpenses: monthlyExpenses._sum.amount ?? 0,
  };
}
