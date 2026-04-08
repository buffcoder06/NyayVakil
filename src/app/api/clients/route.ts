import { NextRequest, NextResponse } from "next/server";
import { getClients, createClient } from "@/lib/services/clients";

// Temporary: hardcode firmId until auth is wired up
const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const result = await getClients(FIRM_ID, {
      search: s.get("search") ?? undefined,
      clientType: s.get("clientType") ?? undefined,
      isActive: s.has("isActive") ? s.get("isActive") === "true" : undefined,
      page: s.has("page") ? Number(s.get("page")) : 1,
      pageSize: s.has("pageSize") ? Number(s.get("pageSize")) : 50,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await createClient(FIRM_ID, body);
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
