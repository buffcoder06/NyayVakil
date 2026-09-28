import { withAuth, readBody } from "@/lib/server/route";
import { updateHearing, deleteHearing } from "@/lib/services/hearings";
import { hearingUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const PUT = withAuth<Params>(async ({ req, session, params }) =>
  updateHearing(session.firmId, params.id, await readBody(req, hearingUpdateSchema))
);

export const DELETE = withAuth<Params>(async ({ session, params }) => {
  await deleteHearing(session.firmId, params.id);
});
