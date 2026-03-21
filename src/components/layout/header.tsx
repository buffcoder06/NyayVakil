"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
  Search,
  Bell,
  Scale,
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
  "/hearings": "Hearings",
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

function getPageTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  // Match parent route
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route + "/")) return title;
  }
  return "NyayVakil";
}

function getBreadcrumb(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let cumPath = "";
  for (const seg of segments) {
    cumPath += "/" + seg;
    const label = ROUTE_TITLES[cumPath] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: cumPath });
  }
  return crumbs;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS BELL
// ─────────────────────────────────────────────────────────────────────────────

function NotificationsBell() {
  // In a real app, this count would come from a query
  const count = 3;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl h-9 w-9"
      aria-label={`${count} notifications`}
    >
      <Bell className="h-4.5 w-4.5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Button>
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
        className="relative h-9 w-9 rounded-xl p-0 hover:bg-slate-100 inline-flex items-center justify-center"
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-[#1e3a5f] text-white text-xs font-semibold">
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
          <DropdownMenuItem onClick={() => router.push("/profile")} className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")} className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
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
  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = getBreadcrumb(pathname);

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
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <Scale className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-[#1e3a5f] tracking-tight">NyayVakil</span>
        </Link>
      </div>

      {/* Desktop: Page title & breadcrumb */}
      <div className="hidden lg:flex flex-col justify-center flex-1 min-w-0">
        {breadcrumbs.length <= 1 ? (
          <h1 className="text-lg font-semibold text-slate-900 truncate">{pageTitle}</h1>
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
                        className="hover:text-[#1e3a5f] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="h-3 w-3" />
                    </>
                  ) : (
                    <span className="font-medium text-slate-700">{crumb.label}</span>
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
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl h-9 w-9"
          aria-label="Search"
        >
          <Search className="h-4.5 w-4.5" />
        </Button>

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
