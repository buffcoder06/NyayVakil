/**
 * Run this script once to:
 * 1. Add UNIQUE constraint to users.phone
 * 2. Set a proper bcrypt hash on the seed user (password: admin123)
 *
 * Usage:  node scripts/apply-auth-migration.js
 */

const { Client } = require("pg");
require("dotenv").config();

const BCRYPT_HASH_ADMIN123 =
  "$2b$12$qQCsRWdNYJtm2At8sNjAreVUYlAvq67mY1pAzkMqM9zaVrb/tBXcu";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log("Connected to database.");

  // 1. Add unique constraint on phone (idempotent)
  const { rows: constraints } = await client.query(`
    SELECT constraint_name FROM information_schema.table_constraints
    WHERE table_name = 'users' AND constraint_name = 'users_phone_key'
  `);
  if (constraints.length === 0) {
    await client.query(`ALTER TABLE "users" ADD CONSTRAINT "users_phone_key" UNIQUE ("phone")`);
    console.log("Added UNIQUE constraint on users.phone.");
  } else {
    console.log("UNIQUE constraint on users.phone already exists.");
  }

  // 2. Update seed user password hash
  const result = await client.query(
    `UPDATE "users" SET "passwordHash" = $1 WHERE id = 'default-user'`,
    [BCRYPT_HASH_ADMIN123]
  );
  console.log(`Updated passwordHash for seed user (rows affected: ${result.rowCount}).`);

  await client.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
