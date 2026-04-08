import { NextRequest, NextResponse } from "next/server";
import { updateReminder, markReminderSent, cancelReminder } from "@/lib/services/reminders";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    let reminder;
    if (body.action === "markSent") reminder = await markReminderSent(id);
    else if (body.action === "cancel") reminder = await cancelReminder(id);
    else reminder = await updateReminder(id, body);
    return NextResponse.json({ success: true, data: reminder });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
