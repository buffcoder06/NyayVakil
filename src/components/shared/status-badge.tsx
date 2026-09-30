import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type {
  MatterStatus,
  TaskStatus,
  FeeStatus,
  HearingStatus,
  ReminderStatus,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type StatusType =
  | "matter"
  | "task"
  | "fee"
  | "hearing"
  | "reminder"
  | "generic";

export type AnyStatus =
  | MatterStatus
  | TaskStatus
  | FeeStatus
  | HearingStatus
  | ReminderStatus
  | string;

export interface StatusBadgeProps {
  status: AnyStatus;
  type?: StatusType;
  size?: "sm" | "md";
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  className: string;
}

// Matter status
const MATTER_STATUS_CONFIG: Record<MatterStatus, StatusConfig> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  disposed: {
    label: "Disposed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  on_hold: {
    label: "On Hold",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

// Task status
const TASK_STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

// Fee status
const FEE_STATUS_CONFIG: Record<FeeStatus, StatusConfig> = {
  paid: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  partially_paid: {
    label: "Partial",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  not_started: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

// Hearing status
const HEARING_STATUS_CONFIG: Record<HearingStatus, StatusConfig> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  attended: {
    label: "Attended",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  adjourned: {
    label: "Adjourned",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  missed: {
    label: "Missed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

// Reminder status
const REMINDER_STATUS_CONFIG: Record<ReminderStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  sent: {
    label: "Sent",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  acknowledged: {
    label: "Acknowledged",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: resolve config
// ─────────────────────────────────────────────────────────────────────────────

function getStatusConfig(status: AnyStatus, type: StatusType): StatusConfig {
  switch (type) {
    case "matter":
      return (
        MATTER_STATUS_CONFIG[status as MatterStatus] ?? {
          label: status,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    case "task":
      return (
        TASK_STATUS_CONFIG[status as TaskStatus] ?? {
          label: status,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    case "fee":
      return (
        FEE_STATUS_CONFIG[status as FeeStatus] ?? {
          label: status,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    case "hearing":
      return (
        HEARING_STATUS_CONFIG[status as HearingStatus] ?? {
          label: status,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    case "reminder":
      return (
        REMINDER_STATUS_CONFIG[status as ReminderStatus] ?? {
          label: status,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    default: {
      // Auto-detect from value
      const allConfigs = {
        ...MATTER_STATUS_CONFIG,
        ...TASK_STATUS_CONFIG,
        ...FEE_STATUS_CONFIG,
        ...HEARING_STATUS_CONFIG,
        ...REMINDER_STATUS_CONFIG,
      };
      return (
        allConfigs[status as keyof typeof allConfigs] ?? {
          label: String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          className: "bg-slate-100 text-slate-600 border-slate-200",
        }
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function StatusBadge({
  status,
  type = "generic",
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = getStatusConfig(status, type);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold border",
        size === "sm"
          ? "text-[12px] px-1.5 py-0 h-5"
          : "text-xs px-2 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
