import { withAuth, readBody, param } from "@/lib/server/route";
import { getTasks, createTask } from "@/lib/services/tasks";
import { taskCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getTasks(session.firmId, {
    matterId: param(s, "matterId"),
    assignedTo: param(s, "assignedTo"),
    status: param(s, "status"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createTask(session, await readBody(req, taskCreateSchema)),
  { status: 201 }
);
