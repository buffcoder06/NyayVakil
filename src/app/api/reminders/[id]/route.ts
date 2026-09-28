import { withAuth, readBody } from "@/lib/server/route";
import { updateReminder } from "@/lib/services/reminders";
import { reminderUpdateSchema } from "@/lib/validation";

type Params = { id: string };

/** Body may carry { action: "markSent" | "cancel" } or plain field updates. */
export const PUT = withAuth<Params>(async ({ req, session, params }) =>
  updateReminder(session.firmId, params.id, await readBody(req, reminderUpdateSchema))
);
