import { withAuth, notFound } from "@/lib/server/route";
import { getUserById } from "@/lib/services/team";

export const GET = withAuth(async ({ session }) => {
  const user = await getUserById(session.firmId, session.userId);
  if (!user) throw notFound("User");
  return user;
});
