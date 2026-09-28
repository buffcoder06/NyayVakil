// src/lib/server/dto.ts
// Maps Prisma rows to the API/UI shapes in "@/types". This is the only place that
// knows about Decimal and @db.Date, so the frontend always gets plain numbers and
// "YYYY-MM-DD" strings.

import "server-only";
import type { Prisma } from "@prisma/client";
import type {
  Client,
  Document,
  Expense,
  FeeEntry,
  FeeStatus,
  Hearing,
  Matter,
  Payment,
  Reminder,
  Task,
  TeamMember,
  User,
} from "@/types";
import { formatDateOnly } from "@/lib/dates";

type Decimal = Prisma.Decimal;

const num = (d: Decimal | null | undefined): number => (d ? d.toNumber() : 0);
const day = (d: Date | null | undefined): string | undefined => (d ? formatDateOnly(d) : undefined);
const iso = (d: Date): string => d.toISOString();
const opt = <T>(v: T | null | undefined): T | undefined => v ?? undefined;

// ── Include fragments (keep queries and mappers in step) ─────────────────────

export const clientInclude = {
  matters: { select: { id: true } },
  feeEntries: { select: { pendingAmount: true } },
} satisfies Prisma.ClientInclude;

export const matterInclude = {
  client: { select: { name: true } },
} satisfies Prisma.MatterInclude;

export const hearingInclude = {
  matter: { select: { matterTitle: true, courtName: true, client: { select: { name: true } } } },
  assignedTo: { select: { name: true } },
} satisfies Prisma.HearingInclude;

export const feeInclude = {
  matter: { select: { matterTitle: true } },
  client: { select: { name: true } },
} satisfies Prisma.FeeEntryInclude;

export const expenseInclude = {
  matter: { select: { matterTitle: true } },
} satisfies Prisma.ExpenseInclude;

export const documentInclude = {
  uploadedBy: { select: { name: true } },
} satisfies Prisma.DocumentInclude;

export const taskInclude = {
  matter: { select: { matterTitle: true } },
  assignee: { select: { name: true } },
  assigner: { select: { name: true } },
} satisfies Prisma.TaskInclude;

export const reminderInclude = {
  client: { select: { name: true } },
  matter: { select: { matterTitle: true } },
} satisfies Prisma.ReminderInclude;

// ── Mappers ──────────────────────────────────────────────────────────────────

export function toUser(u: Prisma.UserGetPayload<object>): User {
  return {
    id: u.id,
    firmId: u.firmId,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatar: opt(u.avatar),
    barCouncilNumber: opt(u.barCouncilNumber),
    specialization: u.specialization,
    chamberName: opt(u.chamberName),
    isActive: u.isActive,
    createdAt: iso(u.createdAt),
    updatedAt: iso(u.updatedAt),
  };
}

export function toTeamMember(u: Prisma.UserGetPayload<object>): TeamMember {
  return { id: u.id, name: u.name, role: u.role, phone: u.phone, email: u.email, isActive: u.isActive };
}

export function toClient(c: Prisma.ClientGetPayload<{ include: typeof clientInclude }>): Client {
  return {
    id: c.id,
    name: c.name,
    mobile: c.mobile,
    alternateMobile: opt(c.alternateMobile),
    email: opt(c.email),
    address: opt(c.address),
    city: opt(c.city),
    state: opt(c.state),
    pincode: opt(c.pincode),
    clientType: c.clientType,
    notes: opt(c.notes),
    linkedMatterIds: c.matters.map((m) => m.id),
    totalOutstanding: c.feeEntries.reduce((sum, f) => sum + num(f.pendingAmount), 0),
    isActive: c.isActive,
    createdAt: iso(c.createdAt),
    updatedAt: iso(c.updatedAt),
  };
}

export interface MatterTotals {
  totalFeePaid: number;
  totalExpenses: number;
}

export function toMatter(
  m: Prisma.MatterGetPayload<{ include: typeof matterInclude }>,
  totals: MatterTotals = { totalFeePaid: 0, totalExpenses: 0 }
): Matter {
  return {
    id: m.id,
    matterTitle: m.matterTitle,
    caseNumber: opt(m.caseNumber),
    cnrNumber: opt(m.cnrNumber),
    caseType: m.caseType,
    courtName: m.courtName,
    courtLevel: m.courtLevel,
    caseStage: opt(m.caseStage),
    filingDate: day(m.filingDate),
    nextHearingDate: day(m.nextHearingDate),
    oppositeParty: opt(m.oppositeParty),
    oppositeAdvocate: opt(m.oppositeAdvocate),
    advocateOnRecord: opt(m.advocateOnRecord),
    assignedJuniorId: opt(m.assignedJuniorId),
    assignedClerkId: opt(m.assignedClerkId),
    status: m.status,
    priority: m.priority,
    judgeName: opt(m.judgeName),
    policeStation: opt(m.policeStation),
    actSection: opt(m.actSection),
    notes: opt(m.notes),
    clientId: m.clientId,
    clientName: m.client.name,
    totalFeeAgreed: num(m.totalFeeAgreed),
    totalFeePaid: totals.totalFeePaid,
    totalExpenses: totals.totalExpenses,
    createdAt: iso(m.createdAt),
    updatedAt: iso(m.updatedAt),
    createdBy: m.createdBy,
  };
}

export function toHearing(h: Prisma.HearingGetPayload<{ include: typeof hearingInclude }>): Hearing {
  return {
    id: h.id,
    matterId: h.matterId,
    matterTitle: h.matter.matterTitle,
    clientName: h.matter.client.name,
    courtName: h.courtName ?? h.matter.courtName,
    date: formatDateOnly(h.date),
    time: opt(h.time),
    purpose: opt(h.purpose),
    notes: opt(h.notes),
    nextAction: opt(h.nextAction),
    nextHearingDate: day(h.nextHearingDate),
    assignedTo: h.assignedTo?.name,
    assignedToId: opt(h.assignedToId),
    appearanceStatus: opt(h.appearanceStatus),
    status: h.status,
    createdAt: iso(h.createdAt),
    updatedAt: iso(h.updatedAt),
  };
}

/** Stored status is paid / partially_paid / not_started; overdue is derived from the due date. */
export function effectiveFeeStatus(
  f: { status: FeeStatus; dueDate: Date | null; pendingAmount: Decimal },
  today: string
): FeeStatus {
  if (f.status === "paid" || f.pendingAmount.lte(0)) return "paid";
  if (f.dueDate && formatDateOnly(f.dueDate) < today) return "overdue";
  return f.status;
}

export function toFeeEntry(f: Prisma.FeeEntryGetPayload<{ include: typeof feeInclude }>, today: string): FeeEntry {
  return {
    id: f.id,
    matterId: f.matterId,
    matterTitle: f.matter.matterTitle,
    clientId: f.clientId,
    clientName: f.client.name,
    description: f.description,
    totalAmount: num(f.totalAmount),
    receivedAmount: num(f.receivedAmount),
    pendingAmount: num(f.pendingAmount),
    dueDate: day(f.dueDate),
    status: effectiveFeeStatus(f, today),
    notes: opt(f.notes),
    createdAt: iso(f.createdAt),
    updatedAt: iso(f.updatedAt),
  };
}

export function toPayment(p: Prisma.PaymentGetPayload<object>): Payment {
  return {
    id: p.id,
    feeEntryId: p.feeEntryId,
    matterId: p.matterId,
    clientId: p.clientId,
    amount: num(p.amount),
    paymentMethod: p.paymentMethod,
    paymentDate: formatDateOnly(p.paymentDate),
    referenceNumber: opt(p.referenceNumber),
    receiptNumber: opt(p.receiptNumber),
    notes: opt(p.notes),
    createdAt: iso(p.createdAt),
  };
}

export function toExpense(e: Prisma.ExpenseGetPayload<{ include: typeof expenseInclude }>): Expense {
  return {
    id: e.id,
    matterId: opt(e.matterId),
    matterTitle: e.matter?.matterTitle,
    clientId: opt(e.clientId),
    date: formatDateOnly(e.date),
    expenseType: e.expenseType,
    description: e.description,
    amount: num(e.amount),
    paidBy: e.paidBy,
    isRecoverable: e.isRecoverable,
    isRecovered: e.isRecovered,
    notes: opt(e.notes),
    receiptUrl: opt(e.receiptUrl),
    createdAt: iso(e.createdAt),
  };
}

export function toDocument(d: Prisma.DocumentGetPayload<{ include: typeof documentInclude }>): Document {
  return {
    id: d.id,
    matterId: opt(d.matterId),
    clientId: opt(d.clientId),
    name: d.name,
    category: d.category,
    fileType: d.fileType,
    fileSize: d.fileSize,
    fileUrl: opt(d.fileUrl),
    description: opt(d.description),
    uploadedBy: d.uploadedBy.name,
    uploadedById: d.uploadedById,
    uploadedAt: iso(d.uploadedAt),
    tags: d.tags,
  };
}

export function toTask(t: Prisma.TaskGetPayload<{ include: typeof taskInclude }>): Task {
  return {
    id: t.id,
    title: t.title,
    description: opt(t.description),
    matterId: opt(t.matterId),
    matterTitle: t.matter?.matterTitle,
    clientId: opt(t.clientId),
    assignedTo: t.assignee.name,
    assignedToId: t.assignedTo,
    assignedBy: t.assigner.name,
    dueDate: day(t.dueDate),
    priority: t.priority,
    status: t.status,
    notes: opt(t.notes),
    completedAt: t.completedAt ? iso(t.completedAt) : undefined,
    createdAt: iso(t.createdAt),
    updatedAt: iso(t.updatedAt),
  };
}

export function toReminder(r: Prisma.ReminderGetPayload<{ include: typeof reminderInclude }>): Reminder {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    clientId: opt(r.clientId),
    clientName: r.client?.name,
    matterId: opt(r.matterId),
    matterTitle: r.matter?.matterTitle,
    scheduledAt: iso(r.scheduledAt),
    status: r.status,
    sentAt: r.sentAt ? iso(r.sentAt) : undefined,
    channel: r.channel,
    createdAt: iso(r.createdAt),
  };
}
