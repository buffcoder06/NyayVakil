// src/lib/services/reminders.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { reminderInclude, toReminder } from "@/lib/server/dto";
import type { reminderCreateSchema, reminderUpdateSchema } from "@/lib/validation";
import { optional, requireClient, requireMatter } from "./tenant";

export async function getReminders(
  firmId: string,
  params: { matterId?: string; clientId?: string; status?: string } = {}
) {
  const { matterId, clientId, status } = params;
  const rows = await db.reminder.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(status && { status: status as Prisma.EnumReminderStatusFilter["equals"] }),
    },
    include: reminderInclude,
    orderBy: { scheduledAt: "asc" },
  });
  return rows.map(toReminder);
}

async function checkRefs(firmId: string, data: { clientId?: string | null; matterId?: string | null }) {
  await Promise.all([
    optional(data.clientId, (id) => requireClient(firmId, id)),
    optional(data.matterId, (id) => requireMatter(firmId, id)),
  ]);
}

export async function createReminder(firmId: string, data: z.infer<typeof reminderCreateSchema>) {
  await checkRefs(firmId, data);
  const reminder = await db.reminder.create({ data: { ...data, firmId }, include: reminderInclude });
  return toReminder(reminder);
}

export async function updateReminder(firmId: string, id: string, data: z.infer<typeof reminderUpdateSchema>) {
  const { action, ...fields } = data;
  await checkRefs(firmId, fields);

  const actionData: Prisma.ReminderUncheckedUpdateInput =
    action === "markSent"
      ? { status: "sent", sentAt: new Date() }
      : action === "cancel"
        ? { status: "cancelled" }
        : {};

  const reminder = await db.reminder.update({
    where: { id, firmId },
    data: { ...fields, ...actionData },
    include: reminderInclude,
  });
  return toReminder(reminder);
}

export async function getReminderTemplates(firmId: string) {
  return db.reminderTemplate.findMany({ where: { firmId } });
}
