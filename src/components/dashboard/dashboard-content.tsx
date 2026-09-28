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

  const { today, stats, hearings, matters, totalMatters, fees, tasks, clients } =
    await getDashboardData(session.firmId);

  const todaysHearings = hearings.filter((h) => h.date === today);

  // Determine if this is a new user (fewer than 3 matters = onboarding)
  const isNewUser = totalMatters < 3;

  return (
    <div className="space-y-6">
      {/* Onboarding checklist — shown only to new users */}
      {isNewUser && <OnboardingChecklist />}

      {/* Row 1 — Quick Actions (full width, prominent) */}
      <QuickActions />

      {/* Row 2 — Stats (4 key numbers) */}
      <StatsRow stats={stats} todayHearingsCount={todaysHearings.length} />

      {/* Row 3 — Today's Court Diary (3/5) + Pending Fees summary (2/5) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TodaysDiary hearings={todaysHearings} today={today} />
        </div>
        <div className="lg:col-span-2">
          <PendingFeesWidget fees={fees} />
        </div>
      </div>

      {/* Row 4 — My Tasks (1/2) + Recent Cases (1/2) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TasksWidget tasks={tasks} />
        <RecentMattersWidget matters={matters} clients={clients} />
      </div>

      {/* Row 5 — Upcoming hearings this week (full width) */}
      <UpcomingHearingsWidget hearings={hearings} />
    </div>
  );
}
