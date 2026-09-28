import { withAuth } from "@/lib/server/route";
import { getTeamMembers } from "@/lib/services/team";

/** Active members of the caller's firm (for assignee pickers). */
export const GET = withAuth(async ({ session }) => getTeamMembers(session.firmId));
