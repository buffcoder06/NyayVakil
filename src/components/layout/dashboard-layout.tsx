"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
// import TrialBanner from "@/components/shared/trial-banner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE SIDEBAR SHEET
// ─────────────────────────────────────────────────────────────────────────────

function MobileSidebarSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="p-0 w-64 border-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE FAB
// ─────────────────────────────────────────────────────────────────────────────

function MobileFAB() {
  const openModal = useAppStore((s) => s.openModal);

  // Context-sensitive FAB: opens the most relevant modal based on route
  const handleFAB = () => {
    openModal("add_matter");
  };

  return (
    <Button
      onClick={handleFAB}
      className="fixed bottom-20 right-4 z-30 lg:hidden h-14 w-14 rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white shadow-lg shadow-[#1e3a5f]/30 p-0"
      aria-label="Quick add"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </Button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-slate-200/60",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar Sheet */}
      <MobileSidebarSheet
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onMobileMenuOpen={() => setMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "px-4 py-4 lg:px-6 lg:py-6",
            // Bottom padding for mobile nav
            "pb-20 lg:pb-6"
          )}
        >
          <div className="max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Mobile Floating Action Button */}
      <MobileFAB />
    </div>
  );
}
