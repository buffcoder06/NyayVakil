// src/lib/validation/index.ts
// Request-body schemas for every API endpoint. z.object() strips unknown keys, so
// fields like firmId, createdBy, receivedAmount or status-on-create can never be set
// by the client — the server derives them.

import { z } from "zod";
import { parseDateOnly } from "@/lib/dates";

// ── Building blocks ──────────────────────────────────────────────────────────

/** Treat "" like "not provided" so HTML form values behave. */
const blankToUndefined = (v: unknown) => (v === "" ? undefined : v);

const text = (max = 200) => z.string().trim().min(1, "is required").max(max);

/** Optional text; null clears the field on update. */
const optText = (max = 2000) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max).nullish());

const id = z.string().trim().min(1, "is required").max(64);
const optId = z.preprocess(blankToUndefined, z.string().trim().max(64).nullish());

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}/, "must be a date (YYYY-MM-DD)")
  .transform(parseDateOnly);
const optDateOnly = z.preprocess(blankToUndefined, dateOnly.nullish());

/** Rupees, rounded to paise. */
const money = z.coerce
  .number({ error: "must be a number" })
  .nonnegative("cannot be negative")
  .max(10_000_000_000, "is too large")
  .transform((v) => Math.round(v * 100) / 100);
const positiveMoney = money.refine((v) => v > 0, "must be greater than zero");

const phone = z
  .string()
  .transform((v) => v.replace(/\D/g, "").slice(-10))
  .refine((v) => v.length === 10, "must be a 10-digit mobile number");
const optPhone = z.preprocess(blankToUndefined, phone.nullish());

const email = z.string().trim().toLowerCase().pipe(z.email("must be a valid email"));
const optEmail = z.preprocess(blankToUndefined, email.nullish());

// ── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: text(200),
  password: z.string().min(1, "is required").max(200),
});

export const signupSchema = z.object({
  name: text(120),
  email,
  phone,
  password: z.string().min(8, "must be at least 8 characters").max(200),
  barCouncilNumber: optText(50),
  chamberName: text(200),
});

// ── Clients ──────────────────────────────────────────────────────────────────

export const clientCreateSchema = z.object({
  name: text(200),
  mobile: phone,
  alternateMobile: optPhone,
  email: optEmail,
  address: optText(500),
  city: optText(100),
  state: optText(100),
  pincode: optText(10),
  clientType: z.enum(["individual", "company", "family", "organization"]).default("individual"),
  notes: optText(),
  isActive: z.boolean().optional(),
});
export const clientUpdateSchema = clientCreateSchema.partial();

// ── Matters ──────────────────────────────────────────────────────────────────

const courtLevel = z.enum([
  "supreme_court",
  "high_court",
  "district_court",
  "sessions_court",
  "magistrate_court",
  "family_court",
  "consumer_court",
  "tribunal",
  "other",
]);

export const matterCreateSchema = z.object({
  matterTitle: text(300),
  clientId: id,
  caseType: text(100),
  courtName: text(200),
  courtLevel: courtLevel.default("district_court"),
  status: z.enum(["active", "pending", "disposed", "on_hold", "closed"]).default("active"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  caseNumber: optText(100),
  cnrNumber: optText(32),
  caseStage: optText(100),
  filingDate: optDateOnly,
  nextHearingDate: optDateOnly,
  judgeName: optText(200),
  oppositeParty: optText(300),
  oppositeAdvocate: optText(200),
  advocateOnRecord: optText(200),
  actSection: optText(300),
  policeStation: optText(200),
  assignedJuniorId: optId,
  assignedClerkId: optId,
  totalFeeAgreed: money.default(0),
  notes: optText(),
});
export const matterUpdateSchema = matterCreateSchema.partial();

// ── Hearings ─────────────────────────────────────────────────────────────────

const hearingStatus = z.enum(["upcoming", "attended", "adjourned", "completed", "missed"]);

export const hearingCreateSchema = z.object({
  matterId: id,
  date: dateOnly,
  time: z.preprocess(blankToUndefined, z.string().regex(/^\d{2}:\d{2}$/, "must be HH:mm").nullish()),
  courtName: optText(200),
  purpose: optText(200),
  notes: optText(),
  nextAction: optText(500),
  nextHearingDate: optDateOnly,
  assignedToId: optId,
  appearanceStatus: optText(100),
  status: hearingStatus.default("upcoming"),
});
export const hearingUpdateSchema = hearingCreateSchema.omit({ matterId: true }).partial();

// ── Fees & payments ──────────────────────────────────────────────────────────

export const feeCreateSchema = z.object({
  matterId: id,
  description: text(300),
  totalAmount: positiveMoney,
  dueDate: optDateOnly,
  notes: optText(),
});
export const feeUpdateSchema = feeCreateSchema.omit({ matterId: true }).partial();

export const paymentCreateSchema = z.object({
  feeEntryId: id,
  amount: positiveMoney,
  paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "upi", "other"]).default("cash"),
  paymentDate: dateOnly,
  referenceNumber: optText(100),
  receiptNumber: optText(100),
  notes: optText(),
});

// ── Expenses ─────────────────────────────────────────────────────────────────

export const expenseCreateSchema = z.object({
  date: dateOnly,
  expenseType: z.enum([
    "court_fee",
    "clerk_expense",
    "photocopy",
    "typing",
    "travel",
    "affidavit",
    "filing",
    "stamp",
    "miscellaneous",
  ]),
  description: text(300),
  amount: positiveMoney,
  paidBy: text(120),
  isRecoverable: z.boolean().default(false),
  isRecovered: z.boolean().default(false),
  matterId: optId,
  notes: optText(),
});
export const expenseUpdateSchema = expenseCreateSchema.partial();

// ── Documents ────────────────────────────────────────────────────────────────

export const documentCreateSchema = z.object({
  name: text(300),
  category: z
    .enum([
      "vakalatnama",
      "affidavit",
      "notice",
      "petition",
      "written_statement",
      "evidence",
      "receipt",
      "invoice",
      "id_proof",
      "court_order",
      "miscellaneous",
    ])
    .default("miscellaneous"),
  fileType: text(50).default("PDF"),
  fileSize: z.string().trim().max(50).default("—"),
  fileUrl: optText(1000),
  description: optText(),
  tags: z.array(z.string().trim().max(50)).max(20).default([]),
  matterId: optId,
  clientId: optId,
});

// ── Tasks ────────────────────────────────────────────────────────────────────

export const taskCreateSchema = z.object({
  title: text(300),
  description: optText(),
  matterId: optId,
  assignedToId: id,
  dueDate: optDateOnly,
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  notes: optText(),
});
export const taskUpdateSchema = taskCreateSchema.partial().extend({
  /** Shortcut used by the UI's "mark complete" checkbox. */
  complete: z.boolean().optional(),
});

// ── Reminders ────────────────────────────────────────────────────────────────

export const reminderCreateSchema = z.object({
  type: z.enum(["hearing", "payment", "document", "follow_up", "general"]),
  title: text(200),
  message: text(2000),
  clientId: optId,
  matterId: optId,
  scheduledAt: z.coerce.date({ error: "must be a date/time" }),
  channel: z.enum(["whatsapp", "sms", "email", "internal"]).default("internal"),
});
export const reminderUpdateSchema = reminderCreateSchema.partial().extend({
  action: z.enum(["markSent", "cancel"]).optional(),
});
