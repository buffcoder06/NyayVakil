// src/lib/services/documents.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { documentInclude, toDocument } from "@/lib/server/dto";
import type { documentCreateSchema } from "@/lib/validation";
import { optional, requireClient, requireMatter, type Actor } from "./tenant";

export async function getDocuments(
  firmId: string,
  params: { matterId?: string; clientId?: string; category?: string } = {}
) {
  const { matterId, clientId, category } = params;
  const rows = await db.document.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(category && { category: category as Prisma.EnumDocumentCategoryFilter["equals"] }),
    },
    include: documentInclude,
    orderBy: { uploadedAt: "desc" },
  });
  return rows.map(toDocument);
}

export async function createDocument(actor: Actor, data: z.infer<typeof documentCreateSchema>) {
  const { firmId } = actor;
  const matter = await optional(data.matterId, (id) => requireMatter(firmId, id));
  await optional(data.clientId, (id) => requireClient(firmId, id));

  const doc = await db.document.create({
    data: {
      ...data,
      clientId: data.clientId ?? matter?.clientId,
      firmId,
      uploadedById: actor.userId,
    },
    include: documentInclude,
  });
  return toDocument(doc);
}

export async function deleteDocument(firmId: string, id: string) {
  await db.document.delete({ where: { id, firmId } });
}
