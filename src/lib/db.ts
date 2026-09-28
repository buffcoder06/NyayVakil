// src/lib/db.ts
// Prisma client singleton using pg driver adapter (Prisma 7)
//
// On Vercel every function instance opens its own pool, so keep it small and point
// DATABASE_URL at the Supabase transaction pooler (port 6543) in production.

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Supabase requires TLS; its certificate chain isn't in Node's default store
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
