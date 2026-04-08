import { NextRequest, NextResponse } from "next/server";
import { updateHearing, deleteHearing } from "@/lib/services/hearings";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const hearing = await updateHearing(id, "", body);
    return NextResponse.json({ success: true, data: hearing });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteHearing(id);
    return NextResponse.json({ success: true, data: null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
