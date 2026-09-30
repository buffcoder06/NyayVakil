import Link from "next/link";
import { Logo } from "@/components/brand/logo";

// ── Social icon SVGs (inline, no external deps) ──────────────────────────────

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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

            <p className="mt-3 text-xs font-medium text-slate-500 tracking-wide uppercase">
              Built for Indian legal professionals
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/8 text-slate-400 hover:text-white hover:bg-white/14 transition-colors"
                aria-label="Follow NyayVakil on Twitter / X"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/8 text-slate-400 hover:text-white hover:bg-white/14 transition-colors"
                aria-label="Follow NyayVakil on LinkedIn"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>
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
                            ? "text-sm text-slate-500 cursor-not-allowed select-none"
                            : "text-sm text-slate-400 hover:text-white transition-colors"
                        }
                        aria-disabled={placeholder}
                        tabIndex={placeholder ? -1 : undefined}
                      >
                        {label}
                        {placeholder && (
                          <span className="ml-1.5 text-xs text-slate-600 font-medium">
                            (soon)
                          </span>
                        )}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className={
                          placeholder
                            ? "text-sm text-slate-500 cursor-not-allowed select-none pointer-events-none"
                            : "text-sm text-slate-400 hover:text-white transition-colors"
                        }
                        aria-disabled={placeholder}
                        tabIndex={placeholder ? -1 : undefined}
                      >
                        {label}
                        {placeholder && (
                          <span className="ml-1.5 text-xs text-slate-600 font-medium">
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
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} NyayVakil. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-700" aria-hidden="true">
              &middot;
            </span>
            <p className="text-xs text-slate-600 font-medium">
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
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
