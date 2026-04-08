// src/lib/services/expenses.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getExpenses(
  firmId: string,
  params: { matterId?: string; clientId?: string; expenseType?: string } = {}
) {
  const { matterId, clientId, expenseType } = params;
  return db.expense.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(expenseType && { expenseType: expenseType as any }),
    },
    include: {
      matter: { select: { matterTitle: true } },
      client: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function createExpense(
  firmId: string,
  data: Omit<Prisma.ExpenseUncheckedCreateInput, "firmId">
) {
  return db.$transaction(async (tx) => {
    const expense = await tx.expense.create({ data: { ...data, firmId } });

    if (data.matterId) {
      await tx.matter.update({
        where: { id: data.matterId },
        data: { totalExpenses: { increment: data.amount } },
      });
    }

    return expense;
  });
}

export async function updateExpense(id: string, data: Prisma.ExpenseUpdateInput) {
  return db.expense.update({ where: { id }, data });
}

export async function deleteExpense(id: string) {
  return db.expense.delete({ where: { id } });
}
