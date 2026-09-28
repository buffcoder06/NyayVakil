import { withAuth, readBody } from "@/lib/server/route";
import { getOfficeSettings, saveOfficeSettings } from "@/lib/services/account";
import { officeSettingsSchema } from "@/lib/validation";

export const GET = withAuth(async ({ session }) => getOfficeSettings(session.firmId));

/** Only the owner/admin can change the chamber's office details. */
export const PUT = withAuth(
  async ({ req, session }) => saveOfficeSettings(session.firmId, await readBody(req, officeSettingsSchema)),
  { roles: ["advocate", "admin"] }
);
