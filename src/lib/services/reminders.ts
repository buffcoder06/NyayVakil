// src/lib/services/reminders.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getReminders(
  firmId: string,
  params: { matterId?: string; clientId?: string; status?: string } = {}
) {
  const { matterId, clientId, status } = params;
  return db.reminder.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(clientId && { clientId }),
      ...(status && { status: status as any }),
    },
    include: {
      client: { select: { name: true } },
      matter: { select: { matterTitle: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
}

export async function createReminder(
  firmId: string,
  data: Omit<Prisma.ReminderUncheckedCreateInput, "firmId">
) {
  return db.reminder.create({ data: { ...data, firmId } });
}

export async function updateReminder(id: string, data: Prisma.ReminderUpdateInput) {
  return db.reminder.update({ where: { id }, data });
}

export async function markReminderSent(id: string) {
  return db.reminder.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });
}

export async function cancelReminder(id: string) {
  return db.reminder.update({ where: { id }, data: { status: "cancelled" } });
}

export async function getReminderTemplates(firmId: string) {
  return db.reminderTemplate.findMany({ where: { firmId } });
}
