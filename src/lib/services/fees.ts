// src/lib/services/fees.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getFeeEntries(
  firmId: string,
  params: { matterId?: string; clientId?: string; status?: string } = {}
) {
  const { matterId, clientId, status } = params;
  return db.feeEntry.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(status && { status: status as any }),
    },
    include: {
      matter: { select: { matterTitle: true } },
      client: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFeeEntry(
  firmId: string,
  data: Omit<Prisma.FeeEntryUncheckedCreateInput, "firmId">
) {
  return db.feeEntry.create({
    data: {
      ...data,
      firmId,
      pendingAmount: data.totalAmount,
    },
  });
}

export async function updateFeeEntry(id: string, data: Prisma.FeeEntryUpdateInput) {
  return db.feeEntry.update({ where: { id }, data });
}

// ── Payments ──────────────────────────────────────

export async function getPayments(
  firmId: string,
  params: { matterId?: string; clientId?: string; feeEntryId?: string } = {}
) {
  return db.payment.findMany({
    where: { firmId, ...params },
    orderBy: { paymentDate: "desc" },
  });
}

export async function createPayment(
  firmId: string,
  data: Omit<Prisma.PaymentUncheckedCreateInput, "firmId">
) {
  // Create payment and update fee entry in a transaction
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.create({ data: { ...data, firmId } });

    const fee = await tx.feeEntry.findUnique({ where: { id: data.feeEntryId } });
    if (!fee) throw new Error("Fee entry not found");

    const newReceived = fee.receivedAmount + data.amount;
    const newPending = fee.totalAmount - newReceived;
    const newStatus =
      newPending <= 0
        ? "paid"
        : newReceived > 0
        ? "partially_paid"
        : fee.status;

    await tx.feeEntry.update({
      where: { id: data.feeEntryId },
      data: {
        receivedAmount: newReceived,
        pendingAmount: Math.max(0, newPending),
        status: newStatus as any,
      },
    });

    // Update matter totalFeePaid
    await tx.matter.update({
      where: { id: data.matterId },
      data: { totalFeePaid: { increment: data.amount } },
    });

    return payment;
  });
}
