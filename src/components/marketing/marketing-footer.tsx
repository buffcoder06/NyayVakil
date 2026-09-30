import Link from "next/link";
import { Logo } from "@/components/brand/logo";

// ── Social icon SVGs (inline, no external deps) ──────────────────────────────

// ── Link group type ───────────────────────────────────────────────────────────

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  placeholder?: boolean;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

// ── Footer link columns ───────────────────────────────────────────────────────

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/demo" },
      { label: "Changelog", href: "/changelog", placeholder: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about", placeholder: true },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog", placeholder: true },
      { label: "Careers", href: "/careers", placeholder: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/help", placeholder: true },
      { label: "Book a Demo", href: "/demo" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function MarketingFooter() {
  return (
    <footer
      className="text-slate-300"
      style={{ backgroundColor: "#0f2240" }}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">

          {/* Brand column – spans 2 cols on large screens */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
              aria-label="NyayVakil – Home"
            >
              <Logo tone="dark" size="sm" />
            </Link>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              Modern legal practice management for Indian advocates and law
              firms. Manage cases, hearings, fees, and more — all in one place.
            </p>

            <p className="mt-3 text-xs font-medium text-slate-400 tracking-wide uppercase">
              Built for Indian legal professionals
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href, external, placeholder }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          placeholder
                            ? "text-sm text-slate-400 cursor-not-allowed select-none"
                            : "text-sm text-slate-400 hover:text-white transition-colors pointer-coarse:inline-block pointer-coarse:py-2.5"
                        }
                        aria-disabled={placeholder}
                        tabIndex={placeholder ? -1 : undefined}
                      >
                        {label}
                        {placeholder && (
                          <span className="ml-1.5 text-xs text-slate-400 font-medium">
                            (soon)
                          </span>
                        )}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className={
                          placeholder
                            ? "text-sm text-slate-400 cursor-not-allowed select-none pointer-events-none"
                            : "text-sm text-slate-400 hover:text-white transition-colors pointer-coarse:inline-block pointer-coarse:py-2.5"
                        }
                        aria-disabled={placeholder}
                        tabIndex={placeholder ? -1 : undefined}
                      >
                        {label}
                        {placeholder && (
                          <span className="ml-1.5 text-xs text-slate-400 font-medium">
                            (soon)
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/8" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} NyayVakil. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-700" aria-hidden="true">
              &middot;
            </span>
            <p className="text-xs text-slate-400 font-medium">
              Made with care for Indian advocates
            </p>
          </div>

          <nav
            className="flex items-center gap-4"
            aria-label="Footer legal navigation"
          >
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }, idx, arr) => (
              <span key={href} className="flex items-center gap-4">
                <Link
                  href={href}
                  className="text-xs text-slate-400 hover:text-slate-300 transition-colors pointer-coarse:inline-block pointer-coarse:py-2.5"
                >
                  {label}
                </Link>
                {idx < arr.length - 1 && (
                  <span className="text-slate-700" aria-hidden="true">
                    &middot;
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
