import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/services/tasks";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const data = await getTasks(FIRM_ID, {
      matterId: s.get("matterId") ?? undefined,
      assignedTo: s.get("assignedTo") ?? undefined,
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
    const task = await createTask(FIRM_ID, body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
