import { withAuth, readBody, param, FINANCE_ROLES } from "@/lib/server/route";
import { getFeeEntries, createFeeEntry } from "@/lib/services/fees";
import { feeCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getFeeEntries(session.firmId, {
    matterId: param(s, "matterId"),
    clientId: param(s, "clientId"),
    status: param(s, "status"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createFeeEntry(session.firmId, await readBody(req, feeCreateSchema)),
  { status: 201, roles: FINANCE_ROLES }
);
