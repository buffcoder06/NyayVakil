import { withAuth, readBody, readPagination, param } from "@/lib/server/route";
import { getHearings, getHearingsOn, createHearing } from "@/lib/services/hearings";
import { hearingCreateSchema } from "@/lib/validation";

export const GET = withAuth(async ({ req, session }) => {
  const s = req.nextUrl.searchParams;
  if (s.get("today") === "true") return getHearingsOn(session.firmId);
  return getHearings(session.firmId, {
    matterId: param(s, "matterId"),
    status: param(s, "status"),
    dateFrom: param(s, "dateFrom"),
    dateTo: param(s, "dateTo"),
    ...readPagination(s),
  });
});

export const POST = withAuth(
  async ({ req, session }) => createHearing(session.firmId, await readBody(req, hearingCreateSchema)),
  { status: 201 }
);
