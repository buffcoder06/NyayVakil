import { withAuth, readBody } from "@/lib/server/route";
import { changePassword } from "@/lib/services/account";
import { passwordChangeSchema } from "@/lib/validation";

/** Change the signed-in user's password; other devices are signed out. */
export const POST = withAuth(async ({ req, session }) => {
  await changePassword(session.userId, session.sessionId, await readBody(req, passwordChangeSchema));
});
