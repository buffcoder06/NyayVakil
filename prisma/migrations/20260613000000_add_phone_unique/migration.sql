-- AlterTable: add UNIQUE constraint to users.phone
ALTER TABLE "users" ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");
