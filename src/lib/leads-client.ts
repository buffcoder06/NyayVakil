// src/lib/leads-client.ts
// Browser helper for the website's enquiry forms → POST /api/leads.

export type LeadKind = "demo" | "contact" | "callback";

export interface LeadPayload {
  kind: LeadKind;
  name: string;
  mobile: string;
  email?: string;
  organisation?: string;
  message?: string;
  details?: Record<string, string | number | boolean | null>;
}

/** Saves the enquiry and returns its reference (e.g. "NV-DEMO-7F3K2A"). Throws with a readable message. */
export async function submitLead(payload: LeadPayload): Promise<string> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Could not send your request. Please try again or email support@nyayvakil.in.");
  }
  return json.data.reference as string;
}
