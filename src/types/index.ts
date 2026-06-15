// src/types/index.ts
// Core TypeScript types for NyayVakil - Indian Legal Practice Management SaaS

// ─────────────────────────────────────────────────────────────────────────────
// USER & AUTH
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'advocate' | 'junior' | 'clerk' | 'admin';

export interface User {
  id: string;
  firmId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  barCouncilNumber?: string;
  specialization?: string[];
  chamberName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────────────────────────────────────

export type ClientType = 'individual' | 'company' | 'family' | 'organization';

export interface Client {
  id: string;
  name: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  clientType: ClientType;
  notes?: string;
  linkedMatterIds: string[];
  totalOutstanding: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MATTER (CASE)
// ─────────────────────────────────────────────────────────────────────────────

export type MatterStatus = 'active' | 'pending' | 'disposed' | 'on_hold' | 'closed';
export type MatterPriority = 'high' | 'medium' | 'low';
export type CourtLevel =
  | 'supreme_court'
  | 'high_court'
  | 'district_court'
  | 'sessions_court'
  | 'magistrate_court'
  | 'family_court'
  | 'consumer_court'
  | 'tribunal'
  | 'other';

export interface Matter {
  id: string;
  matterTitle: string;
  caseNumber?: string;
  cnrNumber?: string;
  caseType: string;
  courtName: string;
  courtLevel: CourtLevel;
  caseStage?: string;
  filingDate?: string;
  nextHearingDate?: string;
  oppositeParty?: string;
  oppositeAdvocate?: string;
  advocateOnRecord?: string;
  assignedJuniorId?: string;
  assignedClerkId?: string;
  status: MatterStatus;
  priority: MatterPriority;
  judgeName?: string;
  policeStation?: string;
  actSection?: string;
  notes?: string;
  clientId: string;
  totalFeeAgreed: number;
  totalFeePaid: number;
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HEARING
// ─────────────────────────────────────────────────────────────────────────────

export type HearingStatus = 'upcoming' | 'attended' | 'adjourned' | 'completed' | 'missed';

export interface Hearing {
  id: string;
  matterId: string;
  matterTitle: string;
  clientName: string;
  courtName: string;
  date: string;
  time?: string;
  purpose?: string;
  notes?: string;
  nextAction?: string;
  nextHearingDate?: string;
  assignedTo?: string;
  appearanceStatus?: string;
  status: HearingStatus;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEE & PAYMENT
// ─────────────────────────────────────────────────────────────────────────────

export type FeeStatus = 'paid' | 'partially_paid' | 'overdue' | 'not_started';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'cheque' | 'upi' | 'other';

export interface FeeEntry {
  id: string;
  matterId: string;
  clientId: string;
  description: string;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  dueDate?: string;
  status: FeeStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  feeEntryId: string;
  matterId: string;
  clientId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  receiptNumber?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSE
// ─────────────────────────────────────────────────────────────────────────────

export type ExpenseType =
  | 'court_fee'
  | 'clerk_expense'
  | 'photocopy'
  | 'typing'
  | 'travel'
  | 'affidavit'
  | 'filing'
  | 'stamp'
  | 'miscellaneous';

export interface Expense {
  id: string;
  matterId?: string;
  clientId?: string;
  date: string;
  expenseType: ExpenseType;
  description: string;
  amount: number;
  paidBy: string;
  isRecoverable: boolean;
  isRecovered: boolean;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentCategory =
  | 'vakalatnama'
  | 'affidavit'
  | 'notice'
  | 'petition'
  | 'written_statement'
  | 'evidence'
  | 'receipt'
  | 'invoice'
  | 'id_proof'
  | 'court_order'
  | 'miscellaneous';

export interface Document {
  id: string;
  matterId?: string;
  clientId?: string;
  name: string;
  category: DocumentCategory;
  fileType: string;
  fileSize: string;
  fileUrl?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TASK
// ─────────────────────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  matterId?: string;
  matterTitle?: string;
  clientId?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// REMINDER
// ─────────────────────────────────────────────────────────────────────────────

export type ReminderType = 'hearing' | 'payment' | 'document' | 'follow_up' | 'general';
export type ReminderStatus = 'pending' | 'sent' | 'acknowledged' | 'cancelled';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  message: string;
  clientId?: string;
  clientName?: string;
  matterId?: string;
  matterTitle?: string;
  scheduledAt: string;
  status: ReminderStatus;
  sentAt?: string;
  channel: 'whatsapp' | 'sms' | 'email' | 'internal';
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────────────────────────────────────────

export interface TimelineEntry {
  id: string;
  entityType: 'matter' | 'client';
  entityId: string;
  type:
    | 'created'
    | 'hearing_added'
    | 'payment_logged'
    | 'expense_added'
    | 'document_uploaded'
    | 'reminder_created'
    | 'task_completed'
    | 'status_changed'
    | 'note_added'
    | 'hearing_completed';
  title: string;
  description?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalActiveMatters: number;
  todayHearings: number;
  upcomingHearings: number;
  pendingPayments: number;
  monthlyCollections: number;
  pendingTasks: number;
  totalClients: number;
  overduePayments: number;
  monthlyExpenses: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORTING ENTITIES
// ─────────────────────────────────────────────────────────────────────────────

export interface CourtInfo {
  id: string;
  name: string;
  level: CourtLevel;
  location: string;
  state: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  template: string;
}

export interface OfficeSettings {
  officeName: string;
  advocateName: string;
  barCouncilNumber: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  gstin?: string;
  panNumber?: string;
  logo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER / QUERY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface MatterFilters {
  status?: MatterStatus;
  priority?: MatterPriority;
  courtLevel?: CourtLevel;
  caseType?: string;
  clientId?: string;
  assignedJuniorId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface HearingFilters {
  status?: HearingStatus;
  matterId?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
}

export interface ClientFilters {
  clientType?: ClientType;
  isActive?: boolean;
  city?: string;
  state?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
