// src/lib/services/hearings.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { parseDateOnly, todayIST } from "@/lib/dates";
import { hearingInclude, toHearing } from "@/lib/server/dto";
import type { hearingCreateSchema, hearingUpdateSchema } from "@/lib/validation";
import { optional, requireMatter, requireMember } from "./tenant";

type Tx = Prisma.TransactionClient;

/** Keeps Matter.nextHearingDate equal to the earliest upcoming hearing from today on. */
async function syncNextHearingDate(tx: Tx, firmId: string, matterId: string) {
  const next = await tx.hearing.findFirst({
    where: { firmId, matterId, status: "upcoming", date: { gte: parseDateOnly(todayIST()) } },
    orderBy: { date: "asc" },
    select: { date: true },
  });
  await tx.matter.update({
    where: { id: matterId, firmId },
    data: { nextHearingDate: next?.date ?? null },
  });
}

export async function getHearings(
  firmId: string,
  params: {
    matterId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { matterId, status, dateFrom, dateTo, page = 1, pageSize = 50 } = params;

  const where: Prisma.HearingWhereInput = {
    firmId,
    ...(matterId && { matterId }),
    ...(status && { status: status as Prisma.EnumHearingStatusFilter["equals"] }),
    ...((dateFrom || dateTo) && {
      date: {
        ...(dateFrom && { gte: parseDateOnly(dateFrom) }),
        ...(dateTo && { lte: parseDateOnly(dateTo) }),
      },
    }),
  };

  const [rows, total] = await Promise.all([
    db.hearing.findMany({
      where,
      include: hearingInclude,
      orderBy: [{ date: "asc" }, { time: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.hearing.count({ where }),
  ]);

  return { data: rows.map(toHearing), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/** Hearings on one IST calendar day (defaults to today). */
export async function getHearingsOn(firmId: string, day: string = todayIST()) {
  const rows = await db.hearing.findMany({
    where: { firmId, date: parseDateOnly(day) },
    include: hearingInclude,
    orderBy: { time: "asc" },
  });
  return rows.map(toHearing);
}

async function checkAssignee(firmId: string, assignedToId: string | null | undefined) {
  await optional(assignedToId, (id) => requireMember(firmId, id));
}

export async function createHearing(firmId: string, data: z.infer<typeof hearingCreateSchema>) {
  await Promise.all([requireMatter(firmId, data.matterId), checkAssignee(firmId, data.assignedToId)]);

  const hearing = await db.$transaction(async (tx) => {
    const created = await tx.hearing.create({ data: { ...data, firmId }, include: hearingInclude });
    await syncNextHearingDate(tx, firmId, data.matterId);
    return created;
  });
  return toHearing(hearing);
}

export async function updateHearing(firmId: string, id: string, data: z.infer<typeof hearingUpdateSchema>) {
  await checkAssignee(firmId, data.assignedToId);

  const hearing = await db.$transaction(async (tx) => {
    const updated = await tx.hearing.update({ where: { id, firmId }, data, include: hearingInclude });
    await syncNextHearingDate(tx, firmId, updated.matterId);
    return updated;
  });
  return toHearing(hearing);
}

export async function deleteHearing(firmId: string, id: string) {
  await db.$transaction(async (tx) => {
    const deleted = await tx.hearing.delete({ where: { id, firmId } });
    await syncNextHearingDate(tx, firmId, deleted.matterId);
  });
}
