-- Auth sessions (hashed tokens), login throttling, Decimal money, DATE columns,
-- FK-backed assignee/uploader, derived matter totals, and tenant indexes.
-- Data tables were empty when this was written, so the column type changes are lossless.

-- users_phone_key was added as a CONSTRAINT by a raw script; Prisma manages it as an index.
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_phone_key";

-- DropIndex
DROP INDEX "sessions_token_key";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "uploadedBy",
ADD COLUMN     "uploadedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "fee_entries" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "receivedAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "pendingAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "dueDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "hearings" DROP COLUMN "assignedTo",
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "courtName" TEXT,
ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "nextHearingDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "matters" DROP COLUMN "totalExpenses",
DROP COLUMN "totalFeePaid",
ALTER COLUMN "filingDate" SET DATA TYPE DATE,
ALTER COLUMN "nextHearingDate" SET DATA TYPE DATE,
ALTER COLUMN "totalFeeAgreed" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "paymentDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "token",
ADD COLUMN     "tokenHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "dueDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "ipAddress" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "login_attempts_identifier_createdAt_idx" ON "login_attempts"("identifier", "createdAt");

-- CreateIndex
CREATE INDEX "login_attempts_ipAddress_createdAt_idx" ON "login_attempts"("ipAddress", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "case_types_firmId_name_key" ON "case_types"("firmId", "name");

-- CreateIndex
CREATE INDEX "clients_firmId_isActive_idx" ON "clients"("firmId", "isActive");

-- CreateIndex
CREATE INDEX "clients_firmId_createdAt_idx" ON "clients"("firmId", "createdAt");

-- CreateIndex
CREATE INDEX "documents_firmId_matterId_idx" ON "documents"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "documents_firmId_uploadedAt_idx" ON "documents"("firmId", "uploadedAt");

-- CreateIndex
CREATE INDEX "expenses_firmId_date_idx" ON "expenses"("firmId", "date");

-- CreateIndex
CREATE INDEX "expenses_firmId_matterId_idx" ON "expenses"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "fee_entries_firmId_status_idx" ON "fee_entries"("firmId", "status");

-- CreateIndex
CREATE INDEX "fee_entries_firmId_matterId_idx" ON "fee_entries"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "fee_entries_firmId_clientId_idx" ON "fee_entries"("firmId", "clientId");

-- CreateIndex
CREATE INDEX "hearings_firmId_date_idx" ON "hearings"("firmId", "date");

-- CreateIndex
CREATE INDEX "hearings_firmId_matterId_idx" ON "hearings"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "matters_firmId_status_idx" ON "matters"("firmId", "status");

-- CreateIndex
CREATE INDEX "matters_firmId_clientId_idx" ON "matters"("firmId", "clientId");

-- CreateIndex
CREATE INDEX "matters_firmId_createdAt_idx" ON "matters"("firmId", "createdAt");

-- CreateIndex
CREATE INDEX "payments_firmId_paymentDate_idx" ON "payments"("firmId", "paymentDate");

-- CreateIndex
CREATE INDEX "payments_firmId_matterId_idx" ON "payments"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "payments_feeEntryId_idx" ON "payments"("feeEntryId");

-- CreateIndex
CREATE INDEX "reminders_firmId_status_scheduledAt_idx" ON "reminders"("firmId", "status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "tasks_firmId_status_idx" ON "tasks"("firmId", "status");

-- CreateIndex
CREATE INDEX "tasks_firmId_assignedTo_idx" ON "tasks"("firmId", "assignedTo");

-- CreateIndex
CREATE INDEX "tasks_firmId_matterId_idx" ON "tasks"("firmId", "matterId");

-- CreateIndex
CREATE INDEX "timeline_entries_firmId_entityId_createdAt_idx" ON "timeline_entries"("firmId", "entityId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_firmId_idx" ON "users"("firmId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hearings" ADD CONSTRAINT "hearings_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_types" ADD CONSTRAINT "case_types_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

