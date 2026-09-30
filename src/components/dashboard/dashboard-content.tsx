// src/components/dashboard/dashboard-content.tsx
// Server component – loads the signed-in firm's data straight from the services
// (no HTTP round-trip) and composes the dashboard layout.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/services/dashboard";
import { StatsRow } from "./stats-row";
import { TodaysDiary } from "./todays-diary";
import { QuickActions } from "./quick-actions";
import { UpcomingHearingsWidget } from "./upcoming-hearings-widget";
import { PendingFeesWidget } from "./pending-fees-widget";
import { RecentMattersWidget } from "./recent-matters-widget";
import { TasksWidget } from "./tasks-widget";
import { OnboardingChecklist } from "./onboarding-checklist";

export default async function DashboardContent() {
  const session = await getSession();
  if (!session) redirect("/login?expired=1");

  const { today, stats, hearings, matters, fees, tasks, clients, onboardingDone } =
    await getDashboardData(session.firmId);

  const todaysHearings = hearings.filter((h) => h.date === today);

  return (
    // On phones today's diary comes first (order-*); from lg the DOM order applies
    <div className="flex flex-col gap-6">
      {/* Onboarding checklist — ticks come from real data; hides itself once all steps are done */}
      <OnboardingChecklist completedItemIds={onboardingDone} />

      {/* Quick Actions — a compact scrolling row on phones */}
      <div className="order-2 lg:order-none">
        <QuickActions />
      </div>

      {/* Stats (4 key numbers) */}
      <div className="order-3 lg:order-none">
        <StatsRow stats={stats} todayHearingsCount={todaysHearings.length} />
      </div>

      {/* Hearings — today, then the rest of the week (3/5) + Pending Fees (2/5) */}
      <div className="order-1 grid grid-cols-1 items-start gap-4 lg:order-none lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <TodaysDiary hearings={todaysHearings} today={today} />
          <UpcomingHearingsWidget hearings={hearings} />
        </div>
        <div className="lg:col-span-2">
          <PendingFeesWidget fees={fees} />
        </div>
      </div>

      {/* My Tasks (1/2) + Recent Cases (1/2) */}
      <div className="order-4 grid grid-cols-1 gap-4 lg:order-none lg:grid-cols-2">
        <TasksWidget tasks={tasks} />
        <RecentMattersWidget matters={matters} clients={clients} />
      </div>
    </div>
  );
}
