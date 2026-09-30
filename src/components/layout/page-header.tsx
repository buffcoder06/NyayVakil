import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      className="flex items-center gap-1 text-xs text-slate-500 mb-1"
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="flex items-center hover:text-[#14213D] transition-colors"
        aria-label="Dashboard"
      >
        <Home className="h-3 w-3" />
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-slate-300" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-[#14213D] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                i === items.length - 1
                  ? "text-slate-700 font-semibold"
                  : "hover:text-[#14213D] transition-colors font-medium"
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between mb-6",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} />
        )}

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 mt-3 sm:mt-0 sm:ml-6">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
