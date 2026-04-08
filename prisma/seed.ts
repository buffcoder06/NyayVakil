// prisma/seed.ts
// Creates the default firm + advocate user for development

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default firm
  const firm = await db.firm.upsert({
    where: { id: "default-firm" },
    update: {},
    create: {
      id: "default-firm",
      name: "NyayVakil Demo Firm",
    },
  });
  console.log("✅ Firm:", firm.name);

  // Create default advocate user
  const user = await db.user.upsert({
    where: { email: "advocate@nyayvakil.in" },
    update: {},
    create: {
      id: "default-user",
      name: "Adv. Demo User",
      email: "advocate@nyayvakil.in",
      passwordHash: "demo-hash", // replace with bcrypt hash in production
      phone: "9876543210",
      role: "advocate",
      barCouncilNumber: "MH/1234/2015",
      chamberName: "NyayVakil Chambers",
      specialization: ["Civil", "Criminal"],
      firmId: firm.id,
    },
  });
  console.log("✅ User:", user.name);

  // Create office settings
  await db.officeSettings.upsert({
    where: { firmId: firm.id },
    update: {},
    create: {
      officeName: "NyayVakil Chambers",
      advocateName: "Adv. Demo User",
      barCouncilNumber: "MH/1234/2015",
      address: "123, Law Chambers, Court Road",
      city: "Mumbai",
      state: "Maharashtra",
      phone: "9876543210",
      email: "advocate@nyayvakil.in",
      firmId: firm.id,
    },
  });
  console.log("✅ Office settings created");

  // Create default subscription (trialing)
  await db.subscription.upsert({
    where: { firmId: firm.id },
    update: {},
    create: {
      firmId: firm.id,
      plan: "solo",
      status: "trialing",
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    },
  });
  console.log("✅ Subscription created (14-day trial)");

  console.log("\n🎉 Seed complete!");
  console.log("   Firm ID:", firm.id);
  console.log("   User ID:", user.id);
  console.log("\nAdd this to your .env:");
  console.log(`   DEFAULT_FIRM_ID="${firm.id}"`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
