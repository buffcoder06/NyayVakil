import { NextRequest, NextResponse } from "next/server";
import { getMatters, createMatter } from "@/lib/services/matters";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const result = await getMatters(FIRM_ID, {
      search: s.get("search") ?? undefined,
      status: s.get("status") ?? undefined,
      priority: s.get("priority") ?? undefined,
      clientId: s.get("clientId") ?? undefined,
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
    const matter = await createMatter(FIRM_ID, body);
    return NextResponse.json({ success: true, data: matter }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
