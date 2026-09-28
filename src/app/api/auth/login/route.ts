import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, getClientIp } from "@/lib/auth/session";
import { isLoginBlocked, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { errorResponse } from "@/lib/server/route";
import { toUser } from "@/lib/server/dto";
import { loginSchema } from "@/lib/validation";

// Compared against when the user doesn't exist, so response time doesn't reveal
// which emails/phones are registered.
const DUMMY_HASH = "$2b$12$z.2LKxT3Ht.TAgN11GmwEex1SS.mOtHPimPXL5cLfmEU3gEMJoHOq";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = loginSchema.parse(await req.json());

    const trimmed = identifier.trim();
    const isEmail = trimmed.includes("@");
    // Phone: strip non-digits and keep the last 10 (drops +91 / leading 0)
    const key = isEmail ? trimmed.toLowerCase() : trimmed.replace(/\D/g, "").slice(-10);
    const ip = getClientIp(req.headers);

    if (await isLoginBlocked(key, ip)) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const user = await db.user.findUnique({ where: isEmail ? { email: key } : { phone: key } });
    const passwordValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !user.isActive || !passwordValid) {
      await recordLoginAttempt(key, ip, false);
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    await recordLoginAttempt(key, ip, true);
    await createSession(user);

    return NextResponse.json({ success: true, user: toUser(user) });
  } catch (err) {
    return errorResponse(err);
  }
}
