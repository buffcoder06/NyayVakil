import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body as { identifier: string; password: string };

    if (!identifier || !password) {
      return NextResponse.json({ error: "Identifier and password are required." }, { status: 400 });
    }

    const trimmed = identifier.trim();
    const isEmail = trimmed.includes("@");

    let user;

    if (isEmail) {
      user = await db.user.findUnique({
        where: { email: trimmed.toLowerCase() },
      });
    } else {
      // Normalize phone: strip all non-digit chars, take last 10 digits
      const digits = trimmed.replace(/\D/g, "");
      const phone = digits.slice(-10);
      user = await db.user.findUnique({
        where: { phone },
      });
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Simple session token — replace with signed JWT in production
    const token = crypto.randomUUID();

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
