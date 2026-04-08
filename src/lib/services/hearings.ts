// src/lib/services/hearings.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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
    ...(status && { status: status as any }),
    ...((dateFrom || dateTo) && {
      date: {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      },
    }),
  };

  const [data, total] = await Promise.all([
    db.hearing.findMany({
      where,
      include: {
        matter: { select: { matterTitle: true, client: { select: { name: true } } } },
      },
      orderBy: { date: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.hearing.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getTodayHearings(firmId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.hearing.findMany({
    where: { firmId, date: { gte: today, lt: tomorrow } },
    include: {
      matter: { select: { matterTitle: true, client: { select: { name: true } } } },
    },
    orderBy: { time: "asc" },
  });
}

export async function createHearing(
  firmId: string,
  data: Omit<Prisma.HearingUncheckedCreateInput, "firmId">
) {
  return db.hearing.create({ data: { ...data, firmId } });
}

export async function updateHearing(
  id: string,
  firmId: string,
  data: Prisma.HearingUpdateInput
) {
  return db.hearing.update({ where: { id }, data });
}

export async function deleteHearing(id: string) {
  return db.hearing.delete({ where: { id } });
}
