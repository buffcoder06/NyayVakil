import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { errorResponse } from "@/lib/server/route";
import { toUser } from "@/lib/server/dto";
import { signupSchema } from "@/lib/validation";

/**
 * Self-serve signup always creates a NEW firm with the caller as its owner
 * (role "advocate"). Juniors/clerks must join an existing firm by invitation,
 * so the role is never taken from the request body.
 */
export async function POST(req: NextRequest) {
  try {
    const data = signupSchema.parse(await req.json());

    const [existingEmail, existingPhone] = await Promise.all([
      db.user.findUnique({ where: { email: data.email }, select: { id: true } }),
      db.user.findUnique({ where: { phone: data.phone }, select: { id: true } }),
    ]);
    if (existingEmail) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
    }
    if (existingPhone) {
      return NextResponse.json({ success: false, error: "An account with this phone number already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const user = await db.$transaction(async (tx) => {
      const firm = await tx.firm.create({ data: { name: data.chamberName } });

      const owner = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: "advocate",
          barCouncilNumber: data.barCouncilNumber ?? null,
          chamberName: data.chamberName,
          firmId: firm.id,
          specialization: [],
        },
      });

      await tx.subscription.create({
        data: { firmId: firm.id, plan: "free", status: "trialing", trialEndsAt },
      });

      return owner;
    });

    await createSession(user);

    return NextResponse.json({ success: true, user: toUser(user) }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
