import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { errorResponse } from "@/lib/server/route";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    return errorResponse(err);
  }
}
