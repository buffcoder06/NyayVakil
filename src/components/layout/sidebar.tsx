"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CalendarDays,
  DollarSign,
  Receipt,
  FileText,
  CheckSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Scale,
  HelpCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  /** Empty string means no visible group label */
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "",
    items: [
      { label: "Dashboard",  href: "/dashboard", icon: LayoutDashboard },
      { label: "Cases",      href: "/matters",   icon: FolderOpen      },
      { label: "Clients",    href: "/clients",   icon: Users           },
      { label: "Hearings",   href: "/hearings",  icon: CalendarDays    },
      { label: "Fees",       href: "/fees",      icon: DollarSign      },
      { label: "Tasks",      href: "/tasks",     icon: CheckSquare     },
      { label: "Documents",  href: "/documents", icon: FileText        },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Expenses",        href: "/expenses",  icon: Receipt     },
      { label: "Reminders",       href: "/reminders", icon: Bell        },
      { label: "Reports",         href: "/reports",   icon: BarChart3   },
      { label: "Help",            href: "/help",      icon: HelpCircle  },
      { label: "Office Settings", href: "/settings",  icon: Settings    },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────

function NavItemLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
        isActive
          ? "bg-white text-[#1e3a5f] shadow-sm"
          : "text-white/70 hover:bg-white/10 hover:text-white",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Active left accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#1e3a5f] rounded-full" />
      )}

      <Icon
        className={cn(
          "shrink-0 transition-colors",
          collapsed ? "h-5 w-5" : "h-4.5 w-4.5",
          isActive ? "text-[#1e3a5f]" : "text-white/60 group-hover:text-white"
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />

      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger className="block w-full" tabIndex={-1}>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────────────────────────────────────────

function UserProfile({ collapsed }: { collapsed: boolean }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "NF";

  const roleLabel: Record<string, string> = {
    advocate: "Advocate",
    junior: "Junior Advocate",
    clerk: "Clerk",
    admin: "Admin",
  };

  if (collapsed) {
    return (
      <div className="border-t border-white/10 pt-3 flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger className="cursor-pointer rounded-full">
            <Avatar className="h-9 w-9 ring-2 ring-white/20 hover:ring-white/40 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">{user?.name ?? "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Sign out</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 pt-3">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors group">
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/20">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name ?? "NyayVakil User"}
          </p>
          <p className="text-xs text-white/50 truncate">
            {user?.role ? roleLabel[user.role] : "Advocate"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className="h-7 w-7 shrink-0 text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAppStore((s) => s.toggleSidebarCollapsed);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <TooltipProvider delay={0}>
      <aside
        className={cn(
          "flex flex-col bg-[#1e3a5f] h-full transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 shrink-0 border-b border-white/10",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <Scale className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                NyayVakil
              </span>
            </Link>
          )}

          {collapsed && (
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <Scale className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-thin">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx}>
              {/* Only show group label when expanded and title is non-empty */}
              {!collapsed && group.title && (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavItemLink
                      item={item}
                      collapsed={collapsed}
                      isActive={isActive(item.href)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle (when collapsed) */}
        {collapsed && (
          <div className="px-3 pb-2">
            <Tooltip>
              <TooltipTrigger
                className="h-8 w-8 inline-flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 w-full rounded-lg"
                onClick={toggleCollapsed}
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* User profile */}
        <div className="px-3 pb-4">
          <UserProfile collapsed={collapsed} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
