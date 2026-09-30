// src/lib/db.ts
// Prisma client singleton using pg driver adapter (Prisma 7)
//
// On Vercel every function instance opens its own pool, so keep it small and point
// DATABASE_URL at the Supabase transaction pooler (port 6543) in production.

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const CONNECT_RETRIES = 2;

function isConnectError(err: unknown) {
  const msg = err instanceof Error ? err.message : "";
  return /timeout exceeded when trying to connect|Connection terminated|ECONNRESET|ETIMEDOUT/i.test(msg);
}

// When several connections open at once, the Supabase pooler occasionally leaves one
// handshake hanging. Fail that attempt fast and retry instead of failing the whole page.
class RetryingPool extends Pool {
  // pg calls connect() both with a callback (pool.query) and without (transactions)
  connect(...args: unknown[]): never {
    const attempt = async () => {
      for (let i = 0; ; i++) {
        try {
          return await super.connect();
        } catch (err) {
          if (i >= CONNECT_RETRIES || !isConnectError(err)) throw err;
        }
      }
    };
    const cb = args[0] as ((err?: Error, client?: unknown, done?: () => void) => void) | undefined;
    if (typeof cb === "function") {
      attempt().then((client) => cb(undefined, client, () => client.release()), (err) => cb(err));
      return undefined as never;
    }
    return attempt() as never;
  }
}

function createPrismaClient() {
  const pool = new RetryingPool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 3_000,
    // Supabase requires TLS; its certificate chain isn't in Node's default store
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
