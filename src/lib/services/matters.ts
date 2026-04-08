// src/lib/services/matters.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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
    ...(status && { status: status as any }),
    ...(priority && { priority: priority as any }),
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

  const [data, total] = await Promise.all([
    db.matter.findMany({
      where,
      include: { client: { select: { name: true, mobile: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.matter.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getMatterById(id: string, firmId: string) {
  return db.matter.findFirst({
    where: { id, firmId },
    include: { client: { select: { name: true, mobile: true } } },
  });
}

export async function createMatter(
  firmId: string,
  data: Omit<Prisma.MatterUncheckedCreateInput, "firmId">
) {
  return db.matter.create({ data: { ...data, firmId } });
}

export async function updateMatter(
  id: string,
  firmId: string,
  data: Prisma.MatterUpdateInput
) {
  return db.matter.update({ where: { id }, data });
}

export async function deleteMatter(id: string, firmId: string) {
  return db.matter.update({
    where: { id },
    data: { status: "closed" },
  });
}
