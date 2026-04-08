// src/lib/services/documents.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getDocuments(
  firmId: string,
  params: { matterId?: string; clientId?: string; category?: string } = {}
) {
  const { matterId, clientId, category } = params;
  return db.document.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(category && { category: category as any }),
    },
    include: {
      matter: { select: { matterTitle: true } },
      client: { select: { name: true } },
    },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function createDocument(
  firmId: string,
  data: Omit<Prisma.DocumentUncheckedCreateInput, "firmId">
) {
  return db.document.create({ data: { ...data, firmId } });
}

export async function deleteDocument(id: string) {
  return db.document.delete({ where: { id } });
}
