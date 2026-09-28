// src/lib/services/matters.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { matterInclude, toMatter, type MatterTotals } from "@/lib/server/dto";
import type { matterCreateSchema, matterUpdateSchema } from "@/lib/validation";
import { optional, requireClient, requireMember, type Actor } from "./tenant";

/** Fees received and expenses per matter, computed from the source rows. */
async function getMatterTotals(firmId: string, matterIds: string[]): Promise<Map<string, MatterTotals>> {
  const totals = new Map<string, MatterTotals>(
    matterIds.map((id) => [id, { totalFeePaid: 0, totalExpenses: 0 }])
  );
  if (matterIds.length === 0) return totals;

  const [paid, spent] = await Promise.all([
    db.payment.groupBy({
      by: ["matterId"],
      where: { firmId, matterId: { in: matterIds } },
      _sum: { amount: true },
    }),
    db.expense.groupBy({
      by: ["matterId"],
      where: { firmId, matterId: { in: matterIds } },
      _sum: { amount: true },
    }),
  ]);

  for (const p of paid) totals.get(p.matterId)!.totalFeePaid = p._sum.amount?.toNumber() ?? 0;
  for (const e of spent) {
    if (e.matterId) totals.get(e.matterId)!.totalExpenses = e._sum.amount?.toNumber() ?? 0;
  }
  return totals;
}

export async function getMatters(
  firmId: string,
  params: {
    search?: string;
    status?: string;
    priority?: string;
    clientId?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { search, status, priority, clientId, page = 1, pageSize = 50 } = params;

  const where: Prisma.MatterWhereInput = {
    firmId,
    ...(status && { status: status as Prisma.EnumMatterStatusFilter["equals"] }),
    ...(priority && { priority: priority as Prisma.EnumMatterPriorityFilter["equals"] }),
    ...(clientId && { clientId }),
    ...(search && {
      OR: [
        { matterTitle: { contains: search, mode: "insensitive" } },
        { caseNumber: { contains: search, mode: "insensitive" } },
        { cnrNumber: { contains: search, mode: "insensitive" } },
        { oppositeParty: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [rows, total] = await Promise.all([
    db.matter.findMany({
      where,
      include: matterInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.matter.count({ where }),
  ]);

  const totals = await getMatterTotals(firmId, rows.map((m) => m.id));
  return {
    data: rows.map((m) => toMatter(m, totals.get(m.id))),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getMatterById(firmId: string, id: string) {
  const matter = await db.matter.findFirst({ where: { id, firmId }, include: matterInclude });
  if (!matter) return null;
  const totals = await getMatterTotals(firmId, [id]);
  return toMatter(matter, totals.get(id));
}

type MatterInput = z.infer<typeof matterUpdateSchema>;

async function checkMatterRefs(firmId: string, data: MatterInput) {
  await Promise.all([
    optional(data.clientId, (id) => requireClient(firmId, id)),
    optional(data.assignedJuniorId, (id) => requireMember(firmId, id)),
    optional(data.assignedClerkId, (id) => requireMember(firmId, id)),
  ]);
}

export async function createMatter(actor: Actor, data: z.infer<typeof matterCreateSchema>) {
  await checkMatterRefs(actor.firmId, data);
  const matter = await db.matter.create({
    data: { ...data, firmId: actor.firmId, createdBy: actor.userId },
    include: matterInclude,
  });
  return toMatter(matter);
}

export async function updateMatter(actor: Actor, id: string, data: MatterInput) {
  await checkMatterRefs(actor.firmId, data);
  const matter = await db.matter.update({
    where: { id, firmId: actor.firmId },
    data,
    include: matterInclude,
  });
  const totals = await getMatterTotals(actor.firmId, [id]);
  return toMatter(matter, totals.get(id));
}

/** Matters are closed, not deleted — their history must be preserved. */
export async function closeMatter(firmId: string, id: string) {
  await db.matter.update({ where: { id, firmId }, data: { status: "closed" } });
}
