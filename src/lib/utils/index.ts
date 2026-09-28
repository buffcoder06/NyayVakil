// src/lib/utils/index.ts
// Shared utility functions for NyayVakil – Indian Legal Practice Management SaaS
import { daysFromTodayIST } from '@/lib/dates';

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupees using the en-IN locale.
 * Example: formatCurrency(125000) → "₹1,25,000"
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as compact Indian currency (₹1.25L, ₹2.5Cr, etc.)
 * Useful for dashboard cards where space is limited.
 */
export const formatCurrencyCompact = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE & TIME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string (or YYYY-MM-DD) to DD/MM/YYYY.
 * Example: formatDate("2026-03-20") → "20/03/2026"
 */
export const formatDate = (date: string): string => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return '—';
  }
};

/**
 * Format an ISO datetime string to DD/MM/YYYY, HH:mm (24-hour IST-friendly format).
 * Example: formatDateTime("2026-03-20T10:30:00Z") → "20/03/2026, 10:30"
 */
export const formatDateTime = (date: string): string => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return '—';
  }
};

/**
 * Format a date to a relative human-readable string.
 * Example: "2 days ago", "in 3 days", "Today"
 */
export const formatRelativeDate = (date: string): string => {
  if (!date) return '—';
  if (isNaN(new Date(date).getTime())) return '—';
  const diffDays = daysFromTodayIST(date);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(date);
};

/**
 * Format a time string (HH:mm or H:mm) to 12-hour format with AM/PM.
 * Example: formatTime("14:30") → "2:30 PM"
 */
export const formatTime = (time: string): string => {
  if (!time) return '—';
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ?? '00';
  if (isNaN(hours)) return time;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${minutes} ${period}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the number of days from today to the given date.
 * Positive = future, negative = past.
 * Example: getDaysUntil("2026-03-20") → 6 (if today is 2026-03-14)
 */
export const getDaysUntil = (date: string): number => daysFromTodayIST(date);

/**
 * Check if a date string is in the past (overdue).
 * Example: isOverdue("2026-03-01") → true (if today is 2026-03-14)
 */
export const isOverdue = (date: string): boolean => {
  if (!date) return false;
  return getDaysUntil(date) < 0;
};

/**
 * Check if a date falls within the next N days (inclusive of today).
 */
export const isDueWithinDays = (date: string, days: number): boolean => {
  const d = getDaysUntil(date);
  return d >= 0 && d <= days;
};

/**
 * Get the start and end of the current month as ISO strings.
 */
export const getCurrentMonthRange = (): { start: string; end: string } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { start, end };
};

// ─────────────────────────────────────────────────────────────────────────────
// FINANCIAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the pending (unpaid) amount.
 * Clamps at 0 to handle floating-point edge cases.
 */
export const calculatePendingAmount = (total: number, paid: number): number =>
  Math.max(0, total - paid);

/**
 * Calculate the payment completion percentage (0–100).
 */
export const getPaymentPercentage = (total: number, paid: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((paid / total) * 100));
};

// ─────────────────────────────────────────────────────────────────────────────
// COLOR HELPERS (returns Tailwind CSS class strings)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return Tailwind badge/text colour classes for a given entity status string.
 */
export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    // Matter statuses
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    disposed: 'bg-blue-100 text-blue-800 border-blue-200',
    on_hold: 'bg-orange-100 text-orange-800 border-orange-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',

    // Hearing statuses
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    attended: 'bg-green-100 text-green-800 border-green-200',
    adjourned: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    missed: 'bg-red-100 text-red-800 border-red-200',

    // Fee statuses
    paid: 'bg-green-100 text-green-800 border-green-200',
    partially_paid: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    not_started: 'bg-gray-100 text-gray-600 border-gray-200',

    // Task statuses
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-200',

    // Reminder statuses
    sent: 'bg-green-100 text-green-800 border-green-200',
    acknowledged: 'bg-teal-100 text-teal-800 border-teal-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

/**
 * Return Tailwind colour classes for a priority level.
 */
export const getPriorityColor = (priority: string): string => {
  const map: Record<string, string> = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[priority] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

/**
 * Return a Tailwind dot/indicator colour class for quick visual priority scanning.
 */
export const getPriorityDotColor = (priority: string): string => {
  const map: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-gray-400',
  };
  return map[priority] ?? 'bg-gray-400';
};

/**
 * Return a Tailwind colour for a court level badge.
 */
export const getCourtLevelColor = (level: string): string => {
  const map: Record<string, string> = {
    supreme_court: 'bg-purple-100 text-purple-800 border-purple-200',
    high_court: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    district_court: 'bg-blue-100 text-blue-800 border-blue-200',
    sessions_court: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    magistrate_court: 'bg-teal-100 text-teal-800 border-teal-200',
    family_court: 'bg-pink-100 text-pink-800 border-pink-200',
    consumer_court: 'bg-orange-100 text-orange-800 border-orange-200',
    tribunal: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[level] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

/**
 * Return a Tailwind colour for a user role badge.
 */
export const getRoleColor = (role: string): string => {
  const map: Record<string, string> = {
    advocate: 'bg-purple-100 text-purple-800 border-purple-200',
    junior: 'bg-blue-100 text-blue-800 border-blue-200',
    clerk: 'bg-green-100 text-green-800 border-green-200',
    admin: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return map[role] ?? 'bg-gray-100 text-gray-600 border-gray-200';
};

// ─────────────────────────────────────────────────────────────────────────────
// STRING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Truncate text to a given character length, appending "…".
 * Example: truncateText("This is a long title", 10) → "This is a…"
 */
export const truncateText = (text: string, length: number): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
};

/**
 * Generate initials from a full name (max 2 characters).
 * Example: getInitials("Adv. Priya Sharma") → "PS"
 *          getInitials("Kapoor Textiles Pvt. Ltd.") → "KT"
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  // Remove titles like Adv., Dr., Mr., Mrs., Ms.
  const cleaned = name.replace(/^(Adv\.|Dr\.|Mr\.|Mrs\.|Ms\.|Shri|Smt\.)\s*/i, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Slugify a string (for URL-safe identifiers).
 * Example: slugify("Civil Suit") → "civil-suit"
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/**
 * Capitalise the first letter of each word.
 * Example: titleCase("consumer_court") → "Consumer Court"
 */
export const titleCase = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Mask a phone number for display (show only last 4 digits).
 * Example: maskPhone("9820341567") → "xxxxxx1567"
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 4) return phone;
  return 'x'.repeat(phone.length - 4) + phone.slice(-4);
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Validate a 10-digit Indian mobile number */
export const isValidIndianMobile = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

/** Validate an Indian PIN code (6 digits) */
export const isValidPincode = (pincode: string): boolean => /^\d{6}$/.test(pincode);

/** Validate a PAN number format */
export const isValidPAN = (pan: string): boolean =>
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());

/** Validate a GSTIN format */
export const isValidGSTIN = (gstin: string): boolean =>
  /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(gstin.toUpperCase());

/** Validate a CNR number format (Court Number Record) */
export const isValidCNR = (cnr: string): boolean =>
  /^[A-Z]{4}\d{2}-\d{6}-\d{4}$/.test(cnr.toUpperCase());

// ─────────────────────────────────────────────────────────────────────────────
// ARRAY / OBJECT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Group an array of objects by a given key.
 * Example: groupBy(hearings, 'date') → { '2026-03-20': [Hearing, ...], ... }
 */
export const groupBy = <T>(items: T[], key: keyof T): Record<string, T[]> =>
  items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );

/**
 * Sort an array of objects by a date key (ascending).
 */
export const sortByDate = <T>(items: T[], dateKey: keyof T, order: 'asc' | 'desc' = 'asc'): T[] =>
  [...items].sort((a, b) => {
    const aTime = new Date(String(a[dateKey])).getTime();
    const bTime = new Date(String(b[dateKey])).getTime();
    return order === 'asc' ? aTime - bTime : bTime - aTime;
  });

/**
 * Remove duplicate values from an array.
 */
export const unique = <T>(items: T[]): T[] => [...new Set(items)];

/**
 * Deep clone an object (safe for JSON-serialisable data).
 */
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// ─────────────────────────────────────────────────────────────────────────────
// FILE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return a human-readable file size string.
 * Example: formatFileSize(1536000) → "1.46 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

/**
 * Get the appropriate icon name for a file type (for use with icon libraries).
 */
export const getFileIcon = (fileType: string): string => {
  const icons: Record<string, string> = {
    pdf: 'file-text',
    doc: 'file-text',
    docx: 'file-text',
    xls: 'file-spreadsheet',
    xlsx: 'file-spreadsheet',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    zip: 'archive',
    rar: 'archive',
  };
  return icons[fileType.toLowerCase()] ?? 'file';
};

// ─────────────────────────────────────────────────────────────────────────────
// MISC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Debounce a function call.
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Generate a simple unique ID string (not cryptographically secure).
 */
export const generateId = (prefix = 'id'): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * Check if running in a browser environment.
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Copy text to clipboard.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isBrowser()) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Build a WhatsApp deep link for the given phone number and message.
 */
export const buildWhatsAppLink = (phone: string, message: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
