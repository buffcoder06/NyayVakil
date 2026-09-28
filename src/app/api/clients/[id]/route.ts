import { withAuth, readBody, notFound, MATTER_EDIT_ROLES } from "@/lib/server/route";
import { getClientById, updateClient, deactivateClient } from "@/lib/services/clients";
import { clientUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const GET = withAuth<Params>(async ({ session, params }) => {
  const client = await getClientById(session.firmId, params.id);
  if (!client) throw notFound("Client");
  return client;
});

export const PUT = withAuth<Params>(async ({ req, session, params }) =>
  updateClient(session.firmId, params.id, await readBody(req, clientUpdateSchema))
);

export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await deactivateClient(session.firmId, params.id);
  },
  { roles: MATTER_EDIT_ROLES }
);
