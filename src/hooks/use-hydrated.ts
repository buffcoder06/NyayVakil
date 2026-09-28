// src/hooks/use-hydrated.ts
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and until React has hydrated on the client, then true.
 * Use it to keep submit buttons disabled until React's onSubmit handler is attached;
 * otherwise an early click submits the form natively.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
