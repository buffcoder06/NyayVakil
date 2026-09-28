import { withAuth, readBody, notFound } from "@/lib/server/route";
import { getUserById } from "@/lib/services/team";
import { updateProfile } from "@/lib/services/account";
import { profileUpdateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ session }) => {
  const user = await getUserById(session.firmId, session.userId);
  if (!user) throw notFound("User");
  return user;
});

/** Update the signed-in user's own profile. */
export const PUT = withAuth(async ({ req, session }) =>
  updateProfile(session.userId, await readBody(req, profileUpdateSchema))
);
