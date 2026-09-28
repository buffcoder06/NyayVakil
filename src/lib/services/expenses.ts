// src/lib/services/expenses.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { expenseInclude, toExpense } from "@/lib/server/dto";
import type { expenseCreateSchema, expenseUpdateSchema } from "@/lib/validation";
import { requireMatter } from "./tenant";

export async function getExpenses(
  firmId: string,
  params: { matterId?: string; clientId?: string; expenseType?: string } = {}
) {
  const { matterId, clientId, expenseType } = params;
  const rows = await db.expense.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(expenseType && { expenseType: expenseType as Prisma.EnumExpenseTypeFilter["equals"] }),
    },
    include: expenseInclude,
    orderBy: { date: "desc" },
  });
  return rows.map(toExpense);
}

/** The client of an expense always follows its matter. */
async function clientFor(firmId: string, matterId: string | null | undefined) {
  if (matterId === undefined) return {};
  if (matterId === null) return { matterId: null, clientId: null };
  const matter = await requireMatter(firmId, matterId);
  return { matterId, clientId: matter.clientId };
}

export async function createExpense(firmId: string, data: z.infer<typeof expenseCreateSchema>) {
  const expense = await db.expense.create({
    data: { ...data, ...(await clientFor(firmId, data.matterId)), firmId },
    include: expenseInclude,
  });
  return toExpense(expense);
}

export async function updateExpense(firmId: string, id: string, data: z.infer<typeof expenseUpdateSchema>) {
  const expense = await db.expense.update({
    where: { id, firmId },
    data: { ...data, ...(await clientFor(firmId, data.matterId)) },
    include: expenseInclude,
  });
  return toExpense(expense);
}

export async function deleteExpense(firmId: string, id: string) {
  await db.expense.delete({ where: { id, firmId } });
}
