import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import DashboardLayout from "@/components/layout/dashboard-layout";

// Every dashboard page depends on the signed-in user's firm
export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // Cookie missing, expired or revoked → back to login (proxy.ts never redirects
  // away from /login, so a stale cookie can't cause a redirect loop)
  if (!session) redirect("/login?expired=1");

  return <DashboardLayout>{children}</DashboardLayout>;
}
