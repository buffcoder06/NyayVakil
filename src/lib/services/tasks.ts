// src/lib/services/tasks.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function getTasks(
  firmId: string,
  params: { matterId?: string; assignedTo?: string; status?: string } = {}
) {
  const { matterId, assignedTo, status } = params;
  return db.task.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(assignedTo && { assignedTo }),
      ...(status && { status: status as any }),
    },
    include: {
      matter: { select: { matterTitle: true } },
      assignee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(
  firmId: string,
  data: Omit<Prisma.TaskUncheckedCreateInput, "firmId">
) {
  return db.task.create({ data: { ...data, firmId } });
}

export async function updateTask(id: string, data: Prisma.TaskUpdateInput) {
  return db.task.update({ where: { id }, data });
}

export async function completeTask(id: string) {
  return db.task.update({
    where: { id },
    data: { status: "completed", completedAt: new Date() },
  });
}

export async function deleteTask(id: string) {
  return db.task.delete({ where: { id } });
}
