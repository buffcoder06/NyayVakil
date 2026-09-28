import { withAuth, MATTER_EDIT_ROLES } from "@/lib/server/route";
import { deleteDocument } from "@/lib/services/documents";

type Params = { id: string };

export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await deleteDocument(session.firmId, params.id);
  },
  { roles: MATTER_EDIT_ROLES }
);
