// src/components/dashboard/quick-actions.tsx
"use client";

import Link from "next/link";
import { FolderPlus, UserPlus, CalendarPlus, IndianRupee, Plus } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Case",
    description: "Register a new case",
    icon: <FolderPlus className="h-6 w-6" />,
    href: "/matters/new",
  },
  {
    label: "Add Client",
    description: "Add a new client",
    icon: <UserPlus className="h-6 w-6" />,
    href: "/clients/new",
  },
  {
    label: "Add Hearing",
    description: "Schedule a court date",
    icon: <CalendarPlus className="h-6 w-6" />,
    href: "/hearings",
  },
  {
    label: "Log Fee",
    description: "Record a fee or payment",
    icon: <IndianRupee className="h-6 w-6" />,
    href: "/fees/new",
  },
  {
    label: "Add Task",
    description: "Create a to-do item",
    icon: <Plus className="h-6 w-6" />,
    href: "/tasks",
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
            className={`group flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-3 py-5 text-center shadow-sm transition-all duration-150 hover:shadow-md hover:border-gold-bright/60 dark:hover:border-gold-bright/40`}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-bright/15 transition-colors group-hover:bg-gold-bright/25 dark:bg-gold-bright/20"
            >
              <span className="text-gold dark:text-gold-bright">{action.icon}</span>
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
