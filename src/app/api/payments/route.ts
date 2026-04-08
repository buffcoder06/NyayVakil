import { NextRequest, NextResponse } from "next/server";
import { getPayments, createPayment } from "@/lib/services/fees";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const data = await getPayments(FIRM_ID, {
      matterId: s.get("matterId") ?? undefined,
      clientId: s.get("clientId") ?? undefined,
      feeEntryId: s.get("feeEntryId") ?? undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment = await createPayment(FIRM_ID, body);
    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
