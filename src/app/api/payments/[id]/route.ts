import { withAuth, FINANCE_ROLES } from "@/lib/server/route";
import { deletePayment } from "@/lib/services/fees";

type Params = { id: string };

/** Reverses a wrongly logged payment and restores the fee's pending amount. */
export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await deletePayment(session.firmId, params.id);
  },
  { roles: FINANCE_ROLES }
);
