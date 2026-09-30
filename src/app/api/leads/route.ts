// Public endpoint for website enquiries (Book a Demo, Contact, Request a Callback).
// Leads are stored in the "leads" table (Supabase → Table Editor → leads).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/auth/session";
import { errorResponse } from "@/lib/server/route";
import { leadSchema } from "@/lib/validation";

const MAX_PER_IP_PER_HOUR = 10;

export async function POST(req: NextRequest) {
  try {
    const data = leadSchema.parse(await req.json());
    const ip = getClientIp(req.headers);

    if (ip) {
      const recent = await db.lead.count({
        where: { ipAddress: ip, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
      });
      if (recent >= MAX_PER_IP_PER_HOUR) {
        return NextResponse.json(
          { success: false, message: "Too many requests. Please try again later or email us." },
          { status: 429 }
        );
      }
    }

    const lead = await db.lead.create({
      data: {
        kind: data.kind,
        name: data.name,
        mobile: data.mobile,
        email: data.email ?? null,
        organisation: data.organisation ?? null,
        message: data.message ?? null,
        details: data.details ?? undefined,
        ipAddress: ip,
      },
    });

    // Short, human-friendly reference for the confirmation screen
    const prefix = { demo: "NV-DEMO", contact: "NV-MSG", callback: "NV-CALL" }[data.kind];
    return NextResponse.json(
      { success: true, data: { reference: `${prefix}-${lead.id.slice(-6).toUpperCase()}` } },
      { status: 201 }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
