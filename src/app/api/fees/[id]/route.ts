import { withAuth, readBody, FINANCE_ROLES } from "@/lib/server/route";
import { updateFeeEntry, deleteFeeEntry } from "@/lib/services/fees";
import { feeUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const PUT = withAuth<Params>(
  async ({ req, session, params }) => updateFeeEntry(session.firmId, params.id, await readBody(req, feeUpdateSchema)),
  { roles: FINANCE_ROLES }
);

export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await deleteFeeEntry(session.firmId, params.id);
  },
  { roles: FINANCE_ROLES }
);
