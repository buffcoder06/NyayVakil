import { withAuth } from "@/lib/server/route";
import { getDashboardStats } from "@/lib/services/dashboard";

export const GET = withAuth(async ({ session }) => getDashboardStats(session.firmId));
