// src/config/index.ts
// Application-wide configuration constants for NyayVakil.

import type { CourtLevel, ExpenseType, DocumentCategory, UserRole } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// APP METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const APP_NAME = 'NyayVakil' as const;
export const APP_TAGLINE = 'Smart Legal Practice Management' as const;
export const APP_VERSION = '1.0.0' as const;
export const APP_SUPPORT_EMAIL = 'info@nyayvakil.in' as const;
export const APP_WEBSITE = 'https://nyayvakil.in' as const;

// ─────────────────────────────────────────────────────────────────────────────
// CASE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const CASE_TYPES: string[] = [
  'Civil Suit',
  'Criminal Complaint',
  'Writ Petition',
  'Appeal',
  'Revision',
  'Arbitration',
  'Divorce Petition',
  'Maintenance Application',
  'Child Custody',
  'Consumer Complaint',
  'Motor Accident Claim',
  'Labour / Industrial Dispute',
  'Property Dispute',
  'Recovery Suit',
  'Cheque Bounce (NI Act)',
  'Tax Appeal',
  'Regulatory / Compliance',
  'Injunction',
  'Specific Performance',
  'Insolvency / Bankruptcy',
  'Corporate / Company Law',
  'Intellectual Property',
  'Service Matter',
  'Public Interest Litigation (PIL)',
  'Habeas Corpus',
  'Bail Application',
  'Anticipatory Bail',
  'Execution Petition',
  'Other',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// COURT LEVELS
// ─────────────────────────────────────────────────────────────────────────────

export const COURT_LEVELS: Record<CourtLevel, string> = {
  supreme_court: 'Supreme Court of India',
  high_court: 'High Court',
  district_court: 'District / City Civil Court',
  sessions_court: 'Sessions Court',
  magistrate_court: 'Magistrate Court (MM / JMFC)',
  family_court: 'Family Court',
  consumer_court: 'Consumer Disputes Redressal Forum / Commission',
  tribunal: 'Tribunal / Arbitration',
  other: 'Other',
} as const;

export const COURT_LEVEL_OPTIONS = Object.entries(COURT_LEVELS).map(([value, label]) => ({
  value: value as CourtLevel,
  label,
}));

// ─────────────────────────────────────────────────────────────────────────────
// CASE STAGES
// ─────────────────────────────────────────────────────────────────────────────

export const CASE_STAGES: string[] = [
  'Pre-Filing / Consultation',
  'Draft Preparation',
  'Filing',
  'Admission',
  'Notice Issued',
  'Written Statement / Reply Filed',
  'Summons Issued',
  'Plaintiff Evidence',
  'Defendant Evidence',
  'Cross Examination',
  'Arguments',
  'Judgment Reserved',
  'Judgment Delivered',
  'Execution',
  'Appeal Filed',
  'Disposed',
  'Settlement',
  'Other',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const EXPENSE_TYPES: Array<{ value: ExpenseType; label: string }> = [
  { value: 'court_fee', label: 'Court Fee' },
  { value: 'clerk_expense', label: 'Clerk Expense' },
  { value: 'photocopy', label: 'Photocopy / Scanning' },
  { value: 'typing', label: 'Typing / Drafting' },
  { value: 'travel', label: 'Travel' },
  { value: 'affidavit', label: 'Affidavit / Notary' },
  { value: 'filing', label: 'Filing Charges' },
  { value: 'stamp', label: 'Stamp Duty' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
] as const;

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = Object.fromEntries(
  EXPENSE_TYPES.map(({ value, label }) => [value, label])
) as Record<ExpenseType, string>;

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export const DOCUMENT_CATEGORIES: Array<{ value: DocumentCategory; label: string }> = [
  { value: 'vakalatnama', label: 'Vakalatnama' },
  { value: 'affidavit', label: 'Affidavit' },
  { value: 'notice', label: 'Legal Notice' },
  { value: 'petition', label: 'Petition / Plaint / Application' },
  { value: 'written_statement', label: 'Written Statement / Reply' },
  { value: 'evidence', label: 'Evidence / Exhibit' },
  { value: 'receipt', label: 'Receipt / Acknowledgement' },
  { value: 'invoice', label: 'Invoice / Bill' },
  { value: 'id_proof', label: 'Identity / KYC Document' },
  { value: 'court_order', label: 'Court Order / Judgment' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
] as const;

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = Object.fromEntries(
  DOCUMENT_CATEGORIES.map(({ value, label }) => [value, label])
) as Record<DocumentCategory, string>;

// ─────────────────────────────────────────────────────────────────────────────
// TASK & MATTER PRIORITIES
// ─────────────────────────────────────────────────────────────────────────────

export const TASK_PRIORITIES = [
  { value: 'high', label: 'High', color: 'text-red-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'low', label: 'Low', color: 'text-gray-500' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────────────────────────────────────

export const USER_ROLES: Array<{ value: UserRole; label: string; description: string }> = [
  {
    value: 'advocate',
    label: 'Advocate (Senior)',
    description: 'Full access to all features including billing and settings.',
  },
  {
    value: 'junior',
    label: 'Junior Advocate',
    description: 'Can manage matters, hearings, and tasks. Limited billing access.',
  },
  {
    value: 'clerk',
    label: 'Clerk',
    description: 'Can manage documents, tasks, and reminders. Read-only on matters.',
  },
  {
    value: 'admin',
    label: 'Admin / Office Manager',
    description: 'Can manage billing, expenses, and office settings.',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'upi', label: 'UPI' },
  { value: 'other', label: 'Other' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const CLIENT_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company / Business' },
  { value: 'family', label: 'Family (Joint)' },
  { value: 'organization', label: 'Organisation / Trust / NGO' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// REMINDER CHANNELS
// ─────────────────────────────────────────────────────────────────────────────

export const REMINDER_CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp', icon: 'message-circle' },
  { value: 'sms', label: 'SMS', icon: 'smartphone' },
  { value: 'email', label: 'Email', icon: 'mail' },
  { value: 'internal', label: 'Internal Note', icon: 'bell' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// INDIAN STATES & UTs
// ─────────────────────────────────────────────────────────────────────────────

export const INDIAN_STATES: string[] = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HIGH COURTS (for quick reference)
// ─────────────────────────────────────────────────────────────────────────────

export const HIGH_COURTS: Array<{ name: string; state: string; city: string }> = [
  { name: 'Allahabad High Court', state: 'Uttar Pradesh', city: 'Prayagraj' },
  { name: 'Bombay High Court', state: 'Maharashtra', city: 'Mumbai' },
  { name: 'Calcutta High Court', state: 'West Bengal', city: 'Kolkata' },
  { name: 'Delhi High Court', state: 'Delhi', city: 'New Delhi' },
  { name: 'Gauhati High Court', state: 'Assam', city: 'Guwahati' },
  { name: 'Gujarat High Court', state: 'Gujarat', city: 'Ahmedabad' },
  { name: 'Himachal Pradesh High Court', state: 'Himachal Pradesh', city: 'Shimla' },
  { name: 'Jammu & Kashmir High Court', state: 'Jammu and Kashmir', city: 'Srinagar' },
  { name: 'Jharkhand High Court', state: 'Jharkhand', city: 'Ranchi' },
  { name: 'Karnataka High Court', state: 'Karnataka', city: 'Bengaluru' },
  { name: 'Kerala High Court', state: 'Kerala', city: 'Kochi' },
  { name: 'Madhya Pradesh High Court', state: 'Madhya Pradesh', city: 'Jabalpur' },
  { name: 'Madras High Court', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Manipur High Court', state: 'Manipur', city: 'Imphal' },
  { name: 'Meghalaya High Court', state: 'Meghalaya', city: 'Shillong' },
  { name: 'Orissa High Court', state: 'Odisha', city: 'Cuttack' },
  { name: 'Patna High Court', state: 'Bihar', city: 'Patna' },
  { name: 'Punjab & Haryana High Court', state: 'Punjab', city: 'Chandigarh' },
  { name: 'Rajasthan High Court', state: 'Rajasthan', city: 'Jodhpur' },
  { name: 'Sikkim High Court', state: 'Sikkim', city: 'Gangtok' },
  { name: 'Telangana High Court', state: 'Telangana', city: 'Hyderabad' },
  { name: 'Tripura High Court', state: 'Tripura', city: 'Agartala' },
  { name: 'Uttarakhand High Court', state: 'Uttarakhand', city: 'Nainital' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DATE & TIME
// ─────────────────────────────────────────────────────────────────────────────

export const DATE_FORMAT = 'DD/MM/YYYY' as const;
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm' as const;
export const TIME_ZONE = 'Asia/Kolkata' as const;

// ─────────────────────────────────────────────────────────────────────────────
// HEARING ALERT THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

export const HEARING_ALERTS = {
  /** Days before a hearing to show as "urgent" */
  URGENT_DAYS: 3,
  /** Days before a hearing to show in "upcoming" dashboard widget */
  UPCOMING_DAYS: 14,
  /** Default reminder schedule in days before hearing */
  DEFAULT_REMINDER_DAYS: [1, 3],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT ALERT THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_ALERTS = {
  /** Days before due date to mark as "due soon" */
  DUE_SOON_DAYS: 7,
  /** Default reminder schedule in days before due date */
  DEFAULT_REMINDER_DAYS: [3, 7],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FILE UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 25,
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/zip',
  ],
  ALLOWED_EXTENSIONS: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp', 'zip'],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURES = {
  WHATSAPP_REMINDERS: true,
  SMS_REMINDERS: true,
  EMAIL_REMINDERS: true,
  DOCUMENT_PREVIEW: true,
  DARK_MODE: true,
  EXPORT_PDF: false, // Coming soon
  ECOURT_INTEGRATION: false, // Coming soon
  BULK_IMPORT: false, // Coming soon
  AI_DRAFT_ASSIST: false, // Coming soon
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIG (swappable for real endpoints)
// ─────────────────────────────────────────────────────────────────────────────

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION ITEMS
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { id: 'matters', label: 'Matters', href: '/matters', icon: 'briefcase' },
  { id: 'hearings', label: 'Hearings', href: '/hearings', icon: 'calendar' },
  { id: 'clients', label: 'Clients', href: '/clients', icon: 'users' },
  { id: 'fees', label: 'Fees & Payments', href: '/fees', icon: 'indian-rupee' },
  { id: 'expenses', label: 'Expenses', href: '/expenses', icon: 'receipt' },
  { id: 'documents', label: 'Documents', href: '/documents', icon: 'folder-open' },
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: 'check-square' },
  { id: 'reminders', label: 'Reminders', href: '/reminders', icon: 'bell' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
] as const;
