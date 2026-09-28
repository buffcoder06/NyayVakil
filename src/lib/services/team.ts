// src/lib/services/team.ts
import "server-only";
import { db } from "@/lib/db";
import { toTeamMember, toUser } from "@/lib/server/dto";

export async function getTeamMembers(firmId: string) {
  const users = await db.user.findMany({
    where: { firmId, isActive: true },
    orderBy: { name: "asc" },
  });
  return users.map(toTeamMember);
}

export async function getUserById(firmId: string, id: string) {
  const user = await db.user.findFirst({ where: { id, firmId } });
  return user ? toUser(user) : null;
}
