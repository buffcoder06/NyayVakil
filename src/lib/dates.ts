// src/lib/dates.ts
// Calendar-date helpers. Court days, due dates, payment dates etc. are stored as
// Postgres DATE (Prisma gives them back as UTC-midnight Date objects) and travel over
// the API as "YYYY-MM-DD". "Today" is always the Indian (IST) calendar day, regardless
// of the server's timezone (Vercel runs in UTC).

const IST_TIMEZONE = "Asia/Kolkata";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Today's calendar date in India as "YYYY-MM-DD". */
export function todayIST(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST_TIMEZONE }).format(now);
}

/** "YYYY-MM-DD" (or a full ISO timestamp) → Date suitable for a @db.Date column. */
export function parseDateOnly(value: string): Date {
  const day = value.slice(0, 10);
  if (!DATE_ONLY.test(day)) throw new Error(`Invalid date: ${value}`);
  return new Date(`${day}T00:00:00.000Z`);
}

/** Date from a @db.Date column → "YYYY-MM-DD". */
export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/**
 * Whole calendar days from today (IST) to `value`: 0 = today, 1 = tomorrow,
 * -1 = yesterday. Accepts "YYYY-MM-DD" or a full ISO timestamp (converted to its
 * IST calendar day). Returns 0 for empty or invalid input.
 */
export function daysFromTodayIST(value: string): number {
  if (!value) return 0;
  let day = value.slice(0, 10);
  if (value.length > 10) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return 0;
    day = todayIST(d);
  }
  if (!DATE_ONLY.test(day)) return 0;
  return Math.round((parseDateOnly(day).getTime() - parseDateOnly(todayIST()).getTime()) / 86_400_000);
}

/** Adds whole days to a "YYYY-MM-DD" string. */
export function addDays(day: string, days: number): string {
  const d = parseDateOnly(day);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDateOnly(d);
}

/** First and last calendar day of the IST month containing `day`. */
export function monthRange(day: string): { start: string; end: string } {
  const [y, m] = day.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return { start: formatDateOnly(start), end: formatDateOnly(end) };
}
