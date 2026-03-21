"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  DollarSign,
  MoreHorizontal,
  Users,
  Receipt,
  FileText,
  CheckSquare,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Scale,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TAB CONFIG
// ─────────────────────────────────────────────────────────────────────────────

interface TabItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const MAIN_TABS: TabItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cases",     href: "/matters",   icon: FolderOpen      },
  { label: "Hearings",  href: "/hearings",  icon: CalendarDays    },
  { label: "Fees",      href: "/fees",      icon: DollarSign      },
];

const MORE_ITEMS: TabItem[] = [
  { label: "Clients",         href: "/clients",   icon: Users       },
  { label: "Tasks",           href: "/tasks",     icon: CheckSquare },
  { label: "Documents",       href: "/documents", icon: FileText    },
  { label: "Expenses",        href: "/expenses",  icon: Receipt     },
  { label: "Reminders",       href: "/reminders", icon: Bell        },
  { label: "Reports",         href: "/reports",   icon: BarChart3   },
  { label: "Help",            href: "/help",      icon: HelpCircle  },
  { label: "Office Settings", href: "/settings",  icon: Settings    },
];

// ─────────────────────────────────────────────────────────────────────────────
// MORE DRAWER
// ─────────────────────────────────────────────────────────────────────────────

function MoreDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 max-h-[70vh]">
        <SheetHeader className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold text-slate-900">
              More Sections
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-slate-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="px-4 py-3">
          <div className="grid grid-cols-3 gap-3 pb-4">
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-colors",
                    isActive
                      ? "bg-[#1e3a5f] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      isActive ? "text-white" : "text-slate-500"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-xs font-medium leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MOBILE NAV
// ─────────────────────────────────────────────────────────────────────────────

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Check if the current route is in the "more" items
  const isMoreActive = MORE_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200 safe-area-pb"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch h-16">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1 relative transition-colors",
                  isActive ? "text-[#1e3a5f]" : "text-slate-400 hover:text-slate-600"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#1e3a5f] rounded-full" />
                )}
                <Icon
                  className={cn("h-5 w-5 transition-all", isActive && "scale-110")}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    isActive ? "text-[#1e3a5f]" : "text-slate-400"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1 relative transition-colors",
              isMoreActive || moreOpen
                ? "text-[#1e3a5f]"
                : "text-slate-400 hover:text-slate-600"
            )}
            aria-label="More navigation options"
          >
            {(isMoreActive || moreOpen) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#1e3a5f] rounded-full" />
            )}
            <MoreHorizontal
              className={cn(
                "h-5 w-5 transition-all",
                (isMoreActive || moreOpen) && "scale-110"
              )}
              strokeWidth={(isMoreActive || moreOpen) ? 2.5 : 1.75}
            />
            <span
              className={cn(
                "text-[10px] font-medium leading-none",
                isMoreActive || moreOpen ? "text-[#1e3a5f]" : "text-slate-400"
              )}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More drawer */}
      <MoreDrawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
