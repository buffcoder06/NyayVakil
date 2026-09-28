import { withAuth, readBody, param } from "@/lib/server/route";
import { getDocuments, createDocument } from "@/lib/services/documents";
import { documentCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  return getDocuments(session.firmId, {
    matterId: param(s, "matterId"),
    clientId: param(s, "clientId"),
    category: param(s, "category"),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createDocument(session, await readBody(req, documentCreateSchema)),
  { status: 201 }
);
