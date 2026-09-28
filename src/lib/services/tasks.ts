// src/lib/services/tasks.ts
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { taskInclude, toTask } from "@/lib/server/dto";
import type { taskCreateSchema, taskUpdateSchema } from "@/lib/validation";
import { optional, requireMatter, requireMember, type Actor } from "./tenant";

export async function getTasks(
  firmId: string,
  params: { matterId?: string; assignedTo?: string; status?: string } = {}
) {
  const { matterId, assignedTo, status } = params;
  const rows = await db.task.findMany({
    where: {
      firmId,
      ...(matterId && { matterId }),
      ...(assignedTo && { assignedTo }),
      ...(status && { status: status as Prisma.EnumTaskStatusFilter["equals"] }),
    },
    include: taskInclude,
    orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });
  return rows.map(toTask);
}

export async function createTask(actor: Actor, data: z.infer<typeof taskCreateSchema>) {
  const { firmId } = actor;
  const { assignedToId, ...rest } = data;
  const [matter] = await Promise.all([
    optional(data.matterId, (id) => requireMatter(firmId, id)),
    requireMember(firmId, assignedToId),
  ]);

  const task = await db.task.create({
    data: {
      ...rest,
      firmId,
      assignedTo: assignedToId,
      assignedBy: actor.userId,
      clientId: matter?.clientId,
      completedAt: data.status === "completed" ? new Date() : null,
    },
    include: taskInclude,
  });
  return toTask(task);
}

export async function updateTask(firmId: string, id: string, data: z.infer<typeof taskUpdateSchema>) {
  const { assignedToId, complete, ...rest } = data;
  const [matter] = await Promise.all([
    optional(data.matterId, (mid) => requireMatter(firmId, mid)),
    optional(assignedToId, (uid) => requireMember(firmId, uid)),
  ]);

  const status = complete ? "completed" : rest.status;
  const task = await db.task.update({
    where: { id, firmId },
    data: {
      ...rest,
      ...(assignedToId && { assignedTo: assignedToId }),
      ...(data.matterId !== undefined && { clientId: matter?.clientId ?? null }),
      ...(status && { status, completedAt: status === "completed" ? new Date() : null }),
    },
    include: taskInclude,
  });
  return toTask(task);
}

export async function deleteTask(firmId: string, id: string) {
  await db.task.delete({ where: { id, firmId } });
}
