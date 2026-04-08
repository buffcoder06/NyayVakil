import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard";

const FIRM_ID = process.env.DEFAULT_FIRM_ID ?? "default";

export async function GET() {
  try {
    const stats = await getDashboardStats(FIRM_ID);
    return NextResponse.json({ success: true, data: stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
