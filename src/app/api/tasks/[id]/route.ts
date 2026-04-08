import { NextRequest, NextResponse } from "next/server";
import { updateTask, completeTask, deleteTask } from "@/lib/services/tasks";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const task = body.complete
      ? await completeTask(id)
      : await updateTask(id, body);
    return NextResponse.json({ success: true, data: task });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ success: true, data: null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
