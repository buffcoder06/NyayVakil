// src/lib/auth/rate-limit.ts
// Login throttling backed by the login_attempts table (in-memory counters don't
// work on serverless, where every request may hit a different instance).

import "server-only";
import { db } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IDENTIFIER = 5;
const MAX_FAILURES_PER_IP = 20;

export async function isLoginBlocked(identifier: string, ip: string | null): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const [byIdentifier, byIp] = await Promise.all([
    db.loginAttempt.count({ where: { identifier, success: false, createdAt: { gte: since } } }),
    ip
      ? db.loginAttempt.count({ where: { ipAddress: ip, success: false, createdAt: { gte: since } } })
      : Promise.resolve(0),
  ]);
  return byIdentifier >= MAX_FAILURES_PER_IDENTIFIER || byIp >= MAX_FAILURES_PER_IP;
}

export async function recordLoginAttempt(
  identifier: string,
  ip: string | null,
  success: boolean
): Promise<void> {
  await db.loginAttempt.create({ data: { identifier, ipAddress: ip, success } });

  if (success) {
    // A successful login clears the identifier's failure streak
    await db.loginAttempt.deleteMany({ where: { identifier, success: false } });
  }

  // Opportunistic cleanup instead of a cron job
  if (Math.random() < 0.01) {
    await db.loginAttempt.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
  }
}
