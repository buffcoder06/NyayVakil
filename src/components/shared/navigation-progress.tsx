"use client";

// Thin progress bar at the top of the viewport during client-side navigation.
// Starts when an internal link is clicked (or startNavigationProgress() is called
// before router.push) and completes when the pathname/query changes.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const START_EVENT = "nv:navigation-start";

/** Call before a programmatic router.push()/replace() to show the bar. */
export function startNavigationProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}

function isInternalNavigation(e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return false;
  }
  const anchor = (e.target as Element | null)?.closest?.("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page (incl. hash-only changes) doesn't trigger a navigation
  return url.pathname + url.search !== window.location.pathname + window.location.search;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<number[]>([]);
  const location = useRef<string>("");

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Start on internal link clicks and explicit start events
  useEffect(() => {
    const start = () => {
      clearTimers();
      location.current = window.location.pathname + window.location.search;
      setVisible(true);
      setProgress(8);
      // Ease towards 90% while waiting; never completes on its own
      [150, 400, 800, 1500, 3000, 6000].forEach((delay, i) => {
        timers.current.push(window.setTimeout(() => setProgress([25, 45, 60, 72, 82, 90][i]), delay));
      });
      // Safety net: hide after 15s even if no route change was observed
      timers.current.push(window.setTimeout(() => finish(), 15000));
    };
    const finish = () => {
      clearTimers();
      setProgress(100);
      timers.current.push(
        window.setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 250)
      );
    };
    const onClick = (e: MouseEvent) => {
      if (isInternalNavigation(e)) start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, start);
    window.addEventListener("nv:navigation-finish", finish);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, start);
      window.removeEventListener("nv:navigation-finish", finish);
      clearTimers();
    };
  }, []);

  // Route changed → complete the bar
  useEffect(() => {
    const current = window.location.pathname + window.location.search;
    if (current !== location.current) window.dispatchEvent(new Event("nv:navigation-finish"));
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      role="progressbar"
      aria-label="Loading page"
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-[#1e3a5f] shadow-[0_0_8px_rgba(30,58,95,0.6)] transition-[width] duration-300 ease-out dark:bg-sky-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
