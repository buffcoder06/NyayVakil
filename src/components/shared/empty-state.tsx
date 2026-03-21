import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Inbox,
  Briefcase,
  Users,
  CalendarDays,
  Banknote,
  CheckSquare,
  FileText,
  Bell,
  Receipt,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT PRESETS
// ─────────────────────────────────────────────────────────────────────────────

type EmptyStateVariant =
  | "cases"
  | "clients"
  | "hearings"
  | "fees"
  | "tasks"
  | "documents"
  | "reminders"
  | "expenses";

interface VariantConfig {
  icon: LucideIcon;
  title: string;
  description: string;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  cases: {
    icon: Briefcase,
    title: "No cases added yet",
    description:
      "Add your first case to track hearings, fees, and documents. Cases help you stay organized and never miss a hearing.",
  },
  clients: {
    icon: Users,
    title: "No clients yet",
    description:
      "Add client details to connect them with cases and payment records.",
  },
  hearings: {
    icon: CalendarDays,
    title: "No hearings scheduled",
    description:
      "Add hearing dates for your cases to track court appearances and set reminders.",
  },
  fees: {
    icon: Banknote,
    title: "No fee records yet",
    description:
      "Track the fees agreed and payments received for each case. Never miss a pending payment.",
  },
  tasks: {
    icon: CheckSquare,
    title: "No tasks right now",
    description:
      "Create tasks for yourself, your junior, or clerk. Keep your team organized.",
  },
  documents: {
    icon: FileText,
    title: "No documents uploaded",
    description:
      "Upload vakalatnamas, affidavits, court orders, and other case documents.",
  },
  reminders: {
    icon: Bell,
    title: "No reminders set",
    description:
      "Set WhatsApp, SMS, or email reminders for hearings, payments, and follow-ups.",
  },
  expenses: {
    icon: Receipt,
    title: "No expenses recorded",
    description:
      "Record court fees, clerk charges, travel, and other case expenses.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost";
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  /** Use a preset variant to auto-fill icon, title and description. */
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    container: "py-10",
    iconWrapper: "h-12 w-12",
    icon: "h-6 w-6",
    title: "text-sm font-semibold",
    description: "text-xs max-w-xs",
  },
  md: {
    container: "py-16",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-base font-semibold",
    description: "text-sm max-w-sm",
  },
  lg: {
    container: "py-24",
    iconWrapper: "h-20 w-20",
    icon: "h-10 w-10",
    title: "text-xl font-bold",
    description: "text-base max-w-md",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTION BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function ActionButton({
  action,
  isSecondary = false,
}: {
  action: EmptyStateAction;
  isSecondary?: boolean;
}) {
  const Icon = action.icon;
  const variant =
    action.variant ?? (isSecondary ? "outline" : "default");

  const content = (
    <Button
      variant={variant}
      onClick={action.onClick}
      className={cn(
        !isSecondary &&
          "bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
      )}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {action.label}
    </Button>
  );

  if (action.href) {
    return (
      <a href={action.href} className="inline-flex">
        {content}
      </a>
    );
  }

  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EmptyState({
  variant,
  icon: iconProp,
  title: titleProp,
  description: descriptionProp,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  // Resolve values: explicit props override variant presets
  const preset = variant ? VARIANT_CONFIG[variant] : undefined;

  const Icon = iconProp ?? preset?.icon ?? Inbox;
  const title = titleProp ?? preset?.title ?? "Nothing here yet";
  const description = descriptionProp ?? preset?.description;

  const sizes = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        sizes.container,
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Icon */}
      <div
        className={cn(
          "rounded-2xl bg-slate-100 flex items-center justify-center mb-5",
          sizes.iconWrapper
        )}
      >
        <Icon
          className={cn("text-slate-400", sizes.icon)}
          strokeWidth={1.5}
        />
      </div>

      {/* Text */}
      <h3 className={cn("text-slate-900 mb-2", sizes.title)}>{title}</h3>
      {description && (
        <p className={cn("text-slate-500 leading-relaxed mx-auto", sizes.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
          {action && <ActionButton action={action} />}
          {secondaryAction && (
            <ActionButton action={secondaryAction} isSecondary />
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
