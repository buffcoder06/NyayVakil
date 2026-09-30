import { withAuth, readBody, notFound, MATTER_EDIT_ROLES } from "@/lib/server/route";
import { getMatterById, updateMatter, closeMatter } from "@/lib/services/matters";
import { matterUpdateSchema } from "@/lib/validation";

type Params = { id: string };

export const GET = withAuth<Params>(async ({ session, params }) => {
  const matter = await getMatterById(session.firmId, params.id);
  if (!matter) throw notFound("Case");
  return matter;
});

export const PUT = withAuth<Params>(
  async ({ req, session, params }) => updateMatter(session, params.id, await readBody(req, matterUpdateSchema)),
  { roles: MATTER_EDIT_ROLES }
);

/** Closes the matter; matters are never hard-deleted. */
export const DELETE = withAuth<Params>(
  async ({ session, params }) => {
    await closeMatter(session.firmId, params.id);
  },
  { roles: MATTER_EDIT_ROLES }
);
