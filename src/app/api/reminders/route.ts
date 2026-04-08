import { NextRequest, NextResponse } from "next/server";
import { getReminders, createReminder } from "@/lib/services/reminders";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const data = await getReminders(FIRM_ID, {
      matterId: s.get("matterId") ?? undefined,
      clientId: s.get("clientId") ?? undefined,
      status: s.get("status") ?? undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reminder = await createReminder(FIRM_ID, body);
    return NextResponse.json({ success: true, data: reminder }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
