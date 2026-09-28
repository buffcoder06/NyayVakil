// Shown instantly inside the dashboard shell (sidebar/header stay put) while the
// next page's server response is on its way.
import { PageSkeleton } from "@/components/shared/loading-skeleton";

export default function Loading() {
  return <PageSkeleton />;
}
