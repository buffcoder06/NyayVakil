import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations need a direct (non-pooled) connection. DIRECT_URL is the Supabase
// direct/session connection; DATABASE_URL may point at the transaction pooler,
// which can't run migrations. Falls back to DATABASE_URL for local setups.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
