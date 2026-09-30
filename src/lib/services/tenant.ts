// src/lib/services/tenant.ts
// Ownership checks for ids that arrive in request bodies. A record from another firm
// is reported exactly like a missing one, so ids can't be probed across tenants.

import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/server/route";

type Tx = Prisma.TransactionClient | typeof db;

/** Who is acting: every service call is scoped to this firm. */
export interface Actor {
  firmId: string;
  userId: string;
  name: string;
}

export async function requireClient(firmId: string, id: string, tx: Tx = db) {
  const client = await tx.client.findFirst({ where: { id, firmId }, select: { id: true } });
  if (!client) throw new ApiError(400, "Selected client was not found.");
  return client;
}

export async function requireMatter(firmId: string, id: string, tx: Tx = db) {
  const matter = await tx.matter.findFirst({
    where: { id, firmId },
    select: { id: true, clientId: true, matterTitle: true },
  });
  if (!matter) throw new ApiError(400, "Selected case was not found.");
  return matter;
}

export async function requireMember(firmId: string, id: string, tx: Tx = db) {
  const user = await tx.user.findFirst({ where: { id, firmId, isActive: true }, select: { id: true, name: true } });
  if (!user) throw new ApiError(400, "Selected team member was not found.");
  return user;
}

/** Checks an optional id; null/undefined pass through unchanged. */
export async function optional<T>(
  id: string | null | undefined,
  check: (id: string) => Promise<T>
): Promise<T | undefined> {
  return id ? check(id) : undefined;
}
