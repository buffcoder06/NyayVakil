// src/lib/services/fees.ts
// Fee entries and payments. FeeEntry.receivedAmount / pendingAmount / status are
// maintained only here, with atomic increments inside a transaction: the UPDATE takes
// a row lock, so concurrent payments on the same fee serialize instead of losing writes.

import "server-only";
import { Prisma, type FeeStatus } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { parseDateOnly, todayIST } from "@/lib/dates";
import { ApiError, notFound } from "@/lib/server/route";
import { feeInclude, toFeeEntry, toPayment } from "@/lib/server/dto";
import type { feeCreateSchema, feeUpdateSchema, paymentCreateSchema } from "@/lib/validation";
import { requireMatter } from "./tenant";

type Tx = Prisma.TransactionClient;

function storedStatus(received: Prisma.Decimal, total: Prisma.Decimal): FeeStatus {
  if (received.gte(total)) return "paid";
  if (received.gt(0)) return "partially_paid";
  return "not_started";
}

/** Recomputes pending + status after receivedAmount/totalAmount changed (row is already locked). */
async function settleFee(tx: Tx, firmId: string, id: string) {
  const fee = await tx.feeEntry.findUniqueOrThrow({ where: { id, firmId } });
  if (fee.receivedAmount.gt(fee.totalAmount)) {
    throw new ApiError(400, "Amount received cannot exceed the total fee.");
  }
  return tx.feeEntry.update({
    where: { id },
    data: {
      pendingAmount: fee.totalAmount.minus(fee.receivedAmount),
      status: storedStatus(fee.receivedAmount, fee.totalAmount),
    },
    include: feeInclude,
  });
}

/** Where-clause for a *displayed* status (overdue is derived from dueDate). */
function statusWhere(status: string, today: Date): Prisma.FeeEntryWhereInput {
  const notOverdue: Prisma.FeeEntryWhereInput = { OR: [{ dueDate: null }, { dueDate: { gte: today } }] };
  switch (status) {
    case "paid":
      return { status: "paid" };
    case "overdue":
      return { status: { not: "paid" }, dueDate: { lt: today } };
    case "partially_paid":
    case "not_started":
      return { status, ...notOverdue };
    default:
      return {};
  }
}

export async function getFeeEntries(
  firmId: string,
  params: { matterId?: string; clientId?: string; status?: string } = {}
) {
  const { matterId, clientId, status } = params;
  const today = todayIST();
  const rows = await db.feeEntry.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(status && statusWhere(status, parseDateOnly(today))),
    },
    include: feeInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((f) => toFeeEntry(f, today));
}

export async function createFeeEntry(firmId: string, data: z.infer<typeof feeCreateSchema>) {
  const matter = await requireMatter(firmId, data.matterId);
  const fee = await db.feeEntry.create({
    data: {
      ...data,
      firmId,
      clientId: matter.clientId,
      pendingAmount: data.totalAmount,
      status: "not_started",
    },
    include: feeInclude,
  });
  return toFeeEntry(fee, todayIST());
}

export async function updateFeeEntry(firmId: string, id: string, data: z.infer<typeof feeUpdateSchema>) {
  const fee = await db.$transaction(async (tx) => {
    await tx.feeEntry.update({ where: { id, firmId }, data });
    return settleFee(tx, firmId, id);
  });
  return toFeeEntry(fee, todayIST());
}

/** Deleting a fee entry also deletes its payments (FK cascade). */
export async function deleteFeeEntry(firmId: string, id: string) {
  await db.feeEntry.delete({ where: { id, firmId } });
}

// ── Payments ──────────────────────────────────────

export async function getPayments(
  firmId: string,
  params: { matterId?: string; clientId?: string; feeEntryId?: string } = {}
) {
  const { matterId, clientId, feeEntryId } = params;
  const rows = await db.payment.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(feeEntryId && { feeEntryId }),
    },
    orderBy: { paymentDate: "desc" },
  });
  return rows.map(toPayment);
}

export async function createPayment(firmId: string, data: z.infer<typeof paymentCreateSchema>) {
  const payment = await db.$transaction(async (tx) => {
    // Atomic increment; also locks the fee row until commit
    const fee = await tx.feeEntry
      .update({
        where: { id: data.feeEntryId, firmId },
        data: { receivedAmount: { increment: data.amount } },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
          throw new ApiError(400, "Selected fee entry was not found.");
        }
        throw err;
      });

    if (fee.receivedAmount.gt(fee.totalAmount)) {
      const pending = fee.totalAmount.minus(fee.receivedAmount.minus(data.amount));
      throw new ApiError(400, `Payment exceeds the pending amount (₹${pending.toFixed(2)}).`);
    }
    await settleFee(tx, firmId, fee.id);

    return tx.payment.create({
      data: { ...data, firmId, matterId: fee.matterId, clientId: fee.clientId },
    });
  });
  return toPayment(payment);
}

export async function deletePayment(firmId: string, id: string) {
  await db.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({ where: { id, firmId } });
    if (!payment) throw notFound("Payment");
    await tx.payment.delete({ where: { id } });
    await tx.feeEntry.update({
      where: { id: payment.feeEntryId },
      data: { receivedAmount: { decrement: payment.amount } },
    });
    await settleFee(tx, firmId, payment.feeEntryId);
  });
}
