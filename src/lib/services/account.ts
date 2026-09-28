// src/lib/services/account.ts
// The signed-in user's own profile/password and the chamber's office settings.

import "server-only";
import bcrypt from "bcryptjs";
import type { z } from "zod";
import type { OfficeSettings } from "@/types";
import { db } from "@/lib/db";
import { ApiError, notFound } from "@/lib/server/route";
import { toUser } from "@/lib/server/dto";
import type { officeSettingsSchema, passwordChangeSchema, profileUpdateSchema } from "@/lib/validation";

export async function updateProfile(userId: string, data: z.infer<typeof profileUpdateSchema>) {
  const [emailOwner, phoneOwner] = await Promise.all([
    db.user.findUnique({ where: { email: data.email }, select: { id: true } }),
    db.user.findUnique({ where: { phone: data.phone }, select: { id: true } }),
  ]);
  if (emailOwner && emailOwner.id !== userId) throw new ApiError(409, "Another account already uses this email.");
  if (phoneOwner && phoneOwner.id !== userId) throw new ApiError(409, "Another account already uses this mobile number.");

  const user = await db.user.update({ where: { id: userId }, data });
  return toUser(user);
}

/** Verifies the current password, stores the new hash and signs out every other session. */
export async function changePassword(
  userId: string,
  currentSessionId: string,
  data: z.infer<typeof passwordChangeSchema>
) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound("User");
  if (!(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
    throw new ApiError(400, "Current password is incorrect.");
  }
  if (data.currentPassword === data.newPassword) {
    throw new ApiError(400, "The new password must be different from the current one.");
  }
  const passwordHash = await bcrypt.hash(data.newPassword, 12);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { passwordHash } }),
    db.session.deleteMany({ where: { userId, id: { not: currentSessionId } } }),
  ]);
}

/** Office settings for the firm; defaults come from the firm and its owner until first saved. */
export async function getOfficeSettings(firmId: string): Promise<OfficeSettings> {
  const saved = await db.officeSettings.findUnique({ where: { firmId } });
  if (saved) {
    const { id: _id, firmId: _f, updatedAt: _u, ...rest } = saved;
    return {
      ...rest,
      website: rest.website ?? "",
      gstin: rest.gstin ?? "",
      panNumber: rest.panNumber ?? "",
      logo: rest.logo ?? undefined,
    };
  }
  const [firm, owner] = await Promise.all([
    db.firm.findUnique({ where: { id: firmId }, select: { name: true } }),
    db.user.findFirst({ where: { firmId, role: "advocate" }, orderBy: { createdAt: "asc" } }),
  ]);
  return {
    officeName: firm?.name ?? "",
    advocateName: owner?.name ?? "",
    barCouncilNumber: owner?.barCouncilNumber ?? "",
    address: "",
    city: "",
    state: "",
    phone: owner?.phone ?? "",
    email: owner?.email ?? "",
    website: "",
    gstin: "",
    panNumber: "",
  };
}

export async function saveOfficeSettings(firmId: string, data: z.infer<typeof officeSettingsSchema>) {
  const clean = { ...data, website: data.website ?? null, gstin: data.gstin ?? null, panNumber: data.panNumber ?? null };
  await db.$transaction([
    db.officeSettings.upsert({ where: { firmId }, update: clean, create: { ...clean, firmId } }),
    // The chamber name shown across the app follows the office name
    db.firm.update({ where: { id: firmId }, data: { name: data.officeName } }),
  ]);
  return getOfficeSettings(firmId);
}
