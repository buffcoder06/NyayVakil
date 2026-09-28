// src/lib/services/clients.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { clientInclude, toClient } from "@/lib/server/dto";
import type { clientCreateSchema, clientUpdateSchema } from "@/lib/validation";

export async function getClients(
  firmId: string,
  params: {
    search?: string;
    clientType?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { search, clientType, isActive, page = 1, pageSize = 50 } = params;

  const where: Prisma.ClientWhereInput = {
    firmId,
    ...(isActive !== undefined && { isActive }),
    ...(clientType && { clientType: clientType as Prisma.EnumClientTypeFilter["equals"] }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [rows, total] = await Promise.all([
    db.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: clientInclude,
    }),
    db.client.count({ where }),
  ]);

  return { data: rows.map(toClient), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getClientById(firmId: string, id: string) {
  const client = await db.client.findFirst({ where: { id, firmId }, include: clientInclude });
  return client ? toClient(client) : null;
}

export async function createClient(firmId: string, data: z.infer<typeof clientCreateSchema>) {
  const client = await db.client.create({ data: { ...data, firmId }, include: clientInclude });
  return toClient(client);
}

export async function updateClient(firmId: string, id: string, data: z.infer<typeof clientUpdateSchema>) {
  const client = await db.client.update({ where: { id, firmId }, data, include: clientInclude });
  return toClient(client);
}

/** Clients are never hard-deleted: matters, fees and payments reference them. */
export async function deactivateClient(firmId: string, id: string) {
  await db.client.update({ where: { id, firmId }, data: { isActive: false } });
}
