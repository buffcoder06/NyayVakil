import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument } from "@/lib/services/documents";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const data = await getDocuments(FIRM_ID, {
      matterId: s.get("matterId") ?? undefined,
      clientId: s.get("clientId") ?? undefined,
      category: s.get("category") ?? undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = await createDocument(FIRM_ID, body);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
