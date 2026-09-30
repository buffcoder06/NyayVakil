"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { startNavigationProgress } from "@/components/shared/navigation-progress";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { useAppStore } from "@/lib/store/app-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE → PAGE TITLE MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/matters": "Cases",
  "/clients": "Clients",
  "/hearings": "Court Diary",
  "/fees": "Fees",
  "/expenses": "Expenses",
  "/documents": "Documents",
  "/tasks": "Tasks",
  "/reminders": "Reminders",
  "/reports": "Reports",
  "/settings": "Office Settings",
  "/profile": "My Profile",
  "/help": "Help & Support",
};

/** e.g. "Wednesday, 30 September 2026" in Indian time */
function todayLabel(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

interface Crumb {
  label: string;
  href: string;
  /** Set when the segment is a record id whose name should be shown instead. */
  entity?: { kind: "matters" | "clients"; id: string };
}

// Record ids are cuids (e.g. "cmuld5cef000004i50qtb777n") — never show them to users
const RECORD_ID = /^c[a-z0-9]{20,}$/;

function getBreadcrumb(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let cumPath = "";
  segments.forEach((seg, i) => {
    cumPath += "/" + seg;
    if (RECORD_ID.test(seg)) {
      const parent = segments[i - 1];
      const kind = parent === "matters" || parent === "clients" ? parent : undefined;
      crumbs.push({ label: "Details", href: cumPath, entity: kind && { kind, id: seg } });
      return;
    }
    const label = ROUTE_TITLES[cumPath] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: cumPath });
  });
  return crumbs;
}

// Names already looked up this session, so the breadcrumb doesn't refetch on every page
const entityNames = new Map<string, string>();

/** Case title / client name for a breadcrumb segment, or null while loading. */
function useEntityName(entity: Crumb["entity"]): string | null {
  const key = entity ? `${entity.kind}/${entity.id}` : "";
  const [fetched, setFetched] = useState<{ key: string; name: string } | null>(null);

  useEffect(() => {
    if (!entity || entityNames.has(key)) return;
    let cancelled = false;
    fetch(`/api/${key}`)
      .then((r) => r.json())
      .then((json) => {
        const record = json?.success ? json.data : null;
        const name = record ? (entity.kind === "matters" ? record.matterTitle : record.name) : "Details";
        entityNames.set(key, name);
        if (!cancelled) setFetched({ key, name });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [entity, key]);

  if (!entity) return null;
  return entityNames.get(key) ?? (fetched?.key === key ? fetched.name : null);
}

function CrumbLabel({ crumb }: { crumb: Crumb }) {
  const name = useEntityName(crumb.entity);
  if (!crumb.entity) return <>{crumb.label}</>;
  return <span className="inline-block max-w-[320px] truncate align-bottom">{name ?? "…"}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS BELL
// ─────────────────────────────────────────────────────────────────────────────

/** Badge = client reminders that are due (pending and scheduled for now or earlier). */
function NotificationsBell() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  // Re-check whenever the user moves to another page (e.g. after marking one sent)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/reminders?status=pending")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.success) return;
        const now = Date.now();
        const due = (json.data as { scheduledAt: string }[]).filter((r) => new Date(r.scheduledAt).getTime() <= now);
        setCount(due.length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const label = count === 0 ? "No reminders due" : `${count} reminder${count === 1 ? "" : "s"} due`;
  return (
    <Link
      href="/reminders"
      title={label}
      aria-label={label}
      className="relative inline-flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11"
    >
      <Bell className="h-4.5 w-4.5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

function UserDropdown() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "NF";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 rounded-xl p-0 hover:bg-slate-100 inline-flex items-center justify-center"
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-[#14213D] text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-slate-900">{user?.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => { startNavigationProgress(); router.push("/profile"); }} className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { startNavigationProgress(); router.push("/settings"); }} className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { startNavigationProgress(); router.push("/help"); }} className="flex items-center gap-2 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer text-red-700 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const breadcrumbs = useMemo(() => getBreadcrumb(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile: Hamburger + Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-700"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" aria-label="NyayVakil dashboard">
          <Logo tone="light" size="xs" />
        </Link>
      </div>

      {/* Desktop: Page title & breadcrumb */}
      <div className="hidden lg:flex flex-col justify-center flex-1 min-w-0">
        {breadcrumbs.length <= 1 ? (
          // The page itself shows its title; the top bar shows today's date instead of repeating it
          <p className="text-sm font-medium text-slate-500 truncate" suppressHydrationWarning>
            {todayLabel()}
          </p>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  {i < breadcrumbs.length - 1 ? (
                    <>
                      <Link
                        href={crumb.href}
                        className="hover:text-[#14213D] transition-colors"
                      >
                        <CrumbLabel crumb={crumb} />
                      </Link>
                      <ChevronRight className="h-3 w-3" />
                    </>
                  ) : (
                    <span className="font-medium text-slate-700"><CrumbLabel crumb={crumb} /></span>
                  )}
                </span>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Mobile: flex-1 spacer */}
      <div className="flex-1 lg:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <NotificationsBell />

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User avatar dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}
