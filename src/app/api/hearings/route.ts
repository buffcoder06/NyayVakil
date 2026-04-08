import { NextRequest, NextResponse } from "next/server";
import { getHearings, getTodayHearings, createHearing } from "@/lib/services/hearings";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    if (s.get("today") === "true") {
      const data = await getTodayHearings(FIRM_ID);
      return NextResponse.json({ success: true, data });
    }
    const result = await getHearings(FIRM_ID, {
      matterId: s.get("matterId") ?? undefined,
      status: s.get("status") ?? undefined,
      dateFrom: s.get("dateFrom") ?? undefined,
      dateTo: s.get("dateTo") ?? undefined,
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
    const hearing = await createHearing(FIRM_ID, body);
    return NextResponse.json({ success: true, data: hearing }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
