import { withAuth, readBody, param, FINANCE_ROLES } from "@/lib/server/route";
import { getExpenses, createExpense } from "@/lib/services/expenses";
import { expenseCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getExpenses(session.firmId, {
    matterId: param(s, "matterId"),
    clientId: param(s, "clientId"),
    expenseType: param(s, "expenseType"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createExpense(session.firmId, await readBody(req, expenseCreateSchema)),
  { status: 201, roles: FINANCE_ROLES }
);
