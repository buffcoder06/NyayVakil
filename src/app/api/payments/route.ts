import { withAuth, readBody, param, FINANCE_ROLES } from "@/lib/server/route";
import { getPayments, createPayment } from "@/lib/services/fees";
import { paymentCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getPayments(session.firmId, {
    matterId: param(s, "matterId"),
    clientId: param(s, "clientId"),
    feeEntryId: param(s, "feeEntryId"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createPayment(session.firmId, await readBody(req, paymentCreateSchema)),
  { status: 201, roles: FINANCE_ROLES }
);
