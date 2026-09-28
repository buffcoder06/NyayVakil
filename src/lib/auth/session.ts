// src/lib/auth/session.ts
// Server-side sessions: an opaque random token in an httpOnly cookie, with only its
// SHA-256 hash stored in the sessions table. Revoking = deleting the row.

import "server-only";
import { createHash, randomBytes } from "crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import type { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "nv_session";
const SESSION_TTL_DAYS = 30;

export interface Session {
  sessionId: string;
  userId: string;
  firmId: string;
  role: UserRole;
  name: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a session row and sets the session cookie. Call from route handlers only. */
export async function createSession(user: { id: string; firmId: string }): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const h = await headers();

  await db.session.create({
    data: {
      tokenHash: hashToken(token),
      userId: user.id,
      firmId: user.firmId,
      expiresAt,
      ipAddress: getClientIp(h),
      deviceInfo: h.get("user-agent")?.slice(0, 255) ?? null,
    },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Resolves the current request's session, or null. Memoised per request, so
 * layouts, pages and handlers can all call it without extra queries.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, firmId: true, role: true, name: true, isActive: true } } },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;

  return {
    sessionId: session.id,
    userId: session.user.id,
    firmId: session.user.firmId,
    role: session.user.role,
    name: session.user.name,
  };
});

/** Deletes the current session row (if any) and clears the cookie. */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  jar.delete(SESSION_COOKIE);
}

export function getClientIp(h: Headers): string | null {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
}
