import { NextRequest, NextResponse } from "next/server";
import { getClientById, updateClient, deleteClient } from "@/lib/services/clients";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await getClientById(id, FIRM_ID);
    if (!client) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: client });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await updateClient(id, FIRM_ID, body);
    return NextResponse.json({ success: true, data: client });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteClient(id, FIRM_ID);
    return NextResponse.json({ success: true, data: null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
