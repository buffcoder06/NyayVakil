import { withAuth, readBody, readPagination, param } from "@/lib/server/route";
import { getClients, createClient } from "@/lib/services/clients";
import { clientCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getClients(session.firmId, {
    search: param(s, "search"),
    clientType: param(s, "clientType"),
    isActive: s.has("isActive") ? s.get("isActive") === "true" : undefined,
    ...readPagination(s),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createClient(session.firmId, await readBody(req, clientCreateSchema)),
  { status: 201 }
);
