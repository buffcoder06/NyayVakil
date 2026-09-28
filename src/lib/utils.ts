import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { daysFromTodayIST } from "@/lib/dates"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatCurrencyCompact(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return formatCurrency(n);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  return daysFromTodayIST(dateStr) < 0;
}

/** Calendar days from today in India (0 = today). */
export function getDaysUntil(dateStr: string): number {
  return daysFromTodayIST(dateStr);
}

export function getPaymentPercentage(total: number, received: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((received / total) * 100));
}

export function truncateText(text: string, maxLen: number): string {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

export function titleCase(str: string): string {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    on_hold: "bg-slate-50 text-slate-600 border-slate-200",
    disposed: "bg-blue-50 text-blue-700 border-blue-200",
    closed: "bg-slate-100 text-slate-500 border-slate-200",
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    attended: "bg-emerald-50 text-emerald-700 border-emerald-200",
    adjourned: "bg-orange-50 text-orange-700 border-orange-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    missed: "bg-red-50 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-600 border-slate-200",
  };
  return map[priority] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

export function getPriorityDotColor(priority: string): string {
  const map: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-slate-400",
  };
  return map[priority] ?? "bg-slate-400";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function buildWhatsAppLink(mobile: string, message: string): string {
  const phone = `91${mobile.replace(/\D/g, "")}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return "—";
  const days = getDaysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days}d`;
  return formatDate(dateStr);
}
