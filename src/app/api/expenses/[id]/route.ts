import { withAuth, readBody, FINANCE_ROLES } from "@/lib/server/route";
import { updateExpense, deleteExpense } from "@/lib/services/expenses";
import { expenseUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const PUT = withAuth<Params>(
  async ({ req, session, params }) => updateExpense(session.firmId, params.id, await readBody(req, expenseUpdateSchema)),
  { roles: FINANCE_ROLES }
);

export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await deleteExpense(session.firmId, params.id);
  },
  { roles: FINANCE_ROLES }
);
