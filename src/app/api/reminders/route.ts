import { withAuth, readBody, param } from "@/lib/server/route";
import { getReminders, createReminder } from "@/lib/services/reminders";
import { reminderCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getReminders(session.firmId, {
    matterId: param(s, "matterId"),
    clientId: param(s, "clientId"),
    status: param(s, "status"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createReminder(session.firmId, await readBody(req, reminderCreateSchema)),
  { status: 201 }
);
