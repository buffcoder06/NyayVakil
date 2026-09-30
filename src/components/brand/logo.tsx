// src/components/brand/logo.tsx
// NyayVakil brand: scales-of-justice mark on a rounded tile + two-tone serif wordmark.
//
//   tone="light" → for light backgrounds: navy tile, gold scales, navy "Nyay" + gold "Vakil"
//   tone="dark"  → for navy backgrounds: gold tile, navy scales, cream "Nyay" + bright-gold "Vakil"

import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

/** Scales of justice, drawn in currentColor on a 100×100 grid. */
export function ScalesGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        {/* pillar and beam */}
        <path d="M50 20 V80" />
        <path d="M21 31 H79" />
        {/* pan chains */}
        <path d="M25 33 L15 55 M25 33 L35 55" />
        <path d="M75 33 L65 55 M75 33 L85 55" />
        {/* base */}
        <path d="M36 82 H64" />
      </g>
      <g fill="currentColor">
        <circle cx="50" cy="15" r="6" />
        {/* pans */}
        <path d="M11 55 H39 Q39 66 25 66 Q11 66 11 55 Z" />
        <path d="M61 55 H89 Q89 66 75 66 Q61 66 61 55 Z" />
      </g>
    </svg>
  );
}

const MARK_SIZES = { xs: "h-7 w-7", sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14", xl: "h-20 w-20" } as const;
type Size = keyof typeof MARK_SIZES;

/** The app icon: scales on a rounded tile. */
export function LogoMark({ tone = "light", size = "sm", className }: { tone?: Tone; size?: Size; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[22%]",
        tone === "light" ? "bg-navy text-gold" : "bg-gold-bright text-navy",
        MARK_SIZES[size],
        className
      )}
    >
      <ScalesGlyph className="h-[72%] w-[72%]" />
    </span>
  );
}

const WORD_SIZES = { xs: "text-base", sm: "text-lg", md: "text-xl", lg: "text-3xl", xl: "text-5xl" } as const;

/** "Nyay" + "Vakil" in the brand serif. */
export function Wordmark({ tone = "light", size = "sm", className }: { tone?: Tone; size?: Size; className?: string }) {
  return (
    <span className={cn("font-brand leading-none tracking-tight whitespace-nowrap", WORD_SIZES[size], className)}>
      <span className={tone === "light" ? "text-navy" : "text-cream"}>Nyay</span>
      <span className={tone === "light" ? "text-gold" : "text-gold-bright"}>Vakil</span>
    </span>
  );
}

/** Full lock-up: mark + wordmark, optionally with the "Legal Practice Manager" tagline. */
export function Logo({
  tone = "light",
  size = "sm",
  tagline = false,
  className,
}: {
  tone?: Tone;
  size?: Size;
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", size === "xl" && "gap-5", size === "lg" && "gap-3.5", className)}>
      <LogoMark tone={tone} size={size} />
      <span className="flex flex-col gap-1.5">
        <Wordmark tone={tone} size={size} />
        {tagline && (
          <span
            className={cn(
              "font-semibold uppercase tracking-[0.22em] leading-none",
              size === "xl" ? "text-sm" : "text-[12px]",
              tone === "light" ? "text-brand-slate" : "text-cream/70"
            )}
          >
            Legal Practice Manager
          </span>
        )}
      </span>
    </span>
  );
}
