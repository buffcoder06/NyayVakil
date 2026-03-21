// src/components/dashboard/quick-actions.tsx
"use client";

import Link from "next/link";
import { FolderPlus, UserPlus, CalendarPlus, IndianRupee, Plus } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Case",
    description: "Register a new matter",
    icon: <FolderPlus className="h-6 w-6" />,
    href: "/matters/new",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60",
    iconColor: "text-blue-700 dark:text-blue-400",
    borderColor: "group-hover:border-blue-300 dark:group-hover:border-blue-700",
  },
  {
    label: "Add Client",
    description: "Add a new client",
    icon: <UserPlus className="h-6 w-6" />,
    href: "/clients/new",
    iconBg: "bg-green-100 dark:bg-green-900/40 group-hover:bg-green-200 dark:group-hover:bg-green-800/60",
    iconColor: "text-green-700 dark:text-green-400",
    borderColor: "group-hover:border-green-300 dark:group-hover:border-green-700",
  },
  {
    label: "Add Hearing",
    description: "Schedule a court date",
    icon: <CalendarPlus className="h-6 w-6" />,
    href: "/hearings",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60",
    iconColor: "text-indigo-700 dark:text-indigo-400",
    borderColor: "group-hover:border-indigo-300 dark:group-hover:border-indigo-700",
  },
  {
    label: "Log Fee",
    description: "Record a fee or payment",
    icon: <IndianRupee className="h-6 w-6" />,
    href: "/fees/new",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "group-hover:border-emerald-300 dark:group-hover:border-emerald-700",
  },
  {
    label: "Add Task",
    description: "Create a to-do item",
    icon: <Plus className="h-6 w-6" />,
    href: "/tasks",
    iconBg: "bg-orange-100 dark:bg-orange-900/40 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/60",
    iconColor: "text-orange-700 dark:text-orange-400",
    borderColor: "group-hover:border-orange-300 dark:group-hover:border-orange-700",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Quick Actions — What do you want to do today?
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Tap any action below to get started quickly
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`group flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-3 py-5 text-center shadow-sm transition-all duration-150 hover:shadow-md ${action.borderColor}`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${action.iconBg}`}
            >
              <span className={action.iconColor}>{action.icon}</span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {action.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400 leading-tight">
                {action.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
