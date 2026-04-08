// src/lib/services/clients.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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
    ...(clientType && { clientType: clientType as any }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    db.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.client.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getClientById(id: string, firmId: string) {
  return db.client.findFirst({ where: { id, firmId } });
}

export async function createClient(
  firmId: string,
  data: Omit<Prisma.ClientCreateInput, "firm">
) {
  return db.client.create({
    data: { ...data, firm: { connect: { id: firmId } } },
  });
}

export async function updateClient(
  id: string,
  firmId: string,
  data: Prisma.ClientUpdateInput
) {
  return db.client.update({ where: { id }, data });
}

export async function deleteClient(id: string, firmId: string) {
  return db.client.update({
    where: { id },
    data: { isActive: false },
  });
}
