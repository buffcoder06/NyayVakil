import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, barCouncilNumber, chamberName } = body as {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: string;
      barCouncilNumber?: string;
      chamberName: string;
    };

    if (!name || !email || !phone || !password || !role || !chamberName) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

    // Check duplicates
    const [existingEmail, existingPhone] = await Promise.all([
      db.user.findUnique({ where: { email: normalizedEmail } }),
      db.user.findUnique({ where: { phone: normalizedPhone } }),
    ]);

    if (existingEmail) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    if (existingPhone) {
      return NextResponse.json({ error: "An account with this phone number already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create firm + user + subscription in a transaction
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const [firm, user] = await db.$transaction(async (tx) => {
      const newFirm = await tx.firm.create({ data: { name: chamberName } });

      const newUser = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          phone: normalizedPhone,
          passwordHash,
          role: role as any,
          barCouncilNumber: barCouncilNumber?.trim() || null,
          chamberName,
          firmId: newFirm.id,
          specialization: [],
          isActive: true,
        },
      });

      await tx.subscription.create({
        data: {
          firmId: newFirm.id,
          plan: "free",
          status: "trialing",
          trialEndsAt,
        },
      });

      return [newFirm, newUser];
    });

    const token = crypto.randomUUID();

    return NextResponse.json(
      {
        user: {
          id: user.id,
          firmId: user.firmId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar ?? undefined,
          barCouncilNumber: user.barCouncilNumber ?? undefined,
          specialization: user.specialization,
          chamberName: user.chamberName ?? undefined,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        token,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[auth/signup]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
