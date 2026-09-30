"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function MarketingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="NyayVakil – Home"
            >
              <Logo tone="light" size="sm" tagline />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "text-[#14213D] bg-[#14213D]/8"
                        : "text-slate-600 hover:text-[#14213D] hover:bg-[#14213D]/6"
                    )}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 inset-x-3.5 h-0.5 rounded-full"
                        style={{ backgroundColor: "#14213D" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors duration-150",
                  "border-[#14213D]/40 text-[#14213D] hover:border-[#14213D] hover:bg-[#14213D]/6"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-150",
                  "hover:opacity-90 active:scale-[0.98]"
                )}
                style={{ backgroundColor: "#14213D" }}
              >
                Start Free
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors",
                "text-slate-600 hover:text-[#14213D] hover:bg-[#14213D]/8"
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[min(320px,85vw)] bg-white shadow-2xl flex flex-col md:hidden",
          "transition-transform duration-250 ease-in-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <Logo tone="light" size="xs" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-11 h-11 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center min-h-11 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-[#14213D] text-white"
                    : "text-slate-700 hover:bg-[#14213D]/8 hover:text-[#14213D]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer CTAs */}
        <div className="px-4 py-5 border-t border-slate-100 space-y-2.5">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center justify-center w-full min-h-11 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-150",
              "border-[#14213D]/40 text-[#14213D] hover:border-[#14213D] hover:bg-[#14213D]/6"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#14213D" }}
          >
            Start Free
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="text-center text-xs text-slate-500 pt-1">
            Free during early access &middot; No credit card
          </p>
        </div>
      </div>

      {/* Spacer so content isn't hidden under fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
