import { NextRequest, NextResponse } from "next/server";
import { getMatterById, updateMatter, deleteMatter } from "@/lib/services/matters";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const matter = await getMatterById(id, FIRM_ID);
    if (!matter) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: matter });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const matter = await updateMatter(id, FIRM_ID, body);
    return NextResponse.json({ success: true, data: matter });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteMatter(id, FIRM_ID);
    return NextResponse.json({ success: true, data: null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
