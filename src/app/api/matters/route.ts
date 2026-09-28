import { withAuth, readBody, readPagination, param, MATTER_EDIT_ROLES } from "@/lib/server/route";
import { getMatters, createMatter } from "@/lib/services/matters";
import { matterCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getMatters(session.firmId, {
    search: param(s, "search"),
    status: param(s, "status"),
    priority: param(s, "priority"),
    clientId: param(s, "clientId"),
    ...readPagination(s),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createMatter(session, await readBody(req, matterCreateSchema)),
  { status: 201, roles: MATTER_EDIT_ROLES }
);
