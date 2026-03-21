// src/components/dashboard/dashboard-content.tsx
// Server component – fetches all data and composes the dashboard layout.

import { api } from "@/lib/api";
import { StatsRow } from "./stats-row";
import { TodaysDiary } from "./todays-diary";
import { QuickActions } from "./quick-actions";
import { UpcomingHearingsWidget } from "./upcoming-hearings-widget";
import { PendingFeesWidget } from "./pending-fees-widget";
import { RecentMattersWidget } from "./recent-matters-widget";
import { TasksWidget } from "./tasks-widget";
import { OnboardingChecklist } from "./onboarding-checklist";

export default async function DashboardContent() {
  // Fetch all data in parallel
  const [statsRes, hearingsRes, mattersRes, feesRes, tasksRes, clientsRes] =
    await Promise.all([
      api.dashboard.getStats(),
      api.hearings.list(undefined, { page: 1, pageSize: 100 }),
      api.matters.list(undefined, { page: 1, pageSize: 50 }),
      api.fees.list(),
      api.tasks.list(),
      api.clients.list(undefined, { page: 1, pageSize: 100 }),
    ]);

  const stats = statsRes.data;
  const allHearings = hearingsRes.data.data;
  const allMatters = mattersRes.data.data;
  const allFees = feesRes.data;
  const allTasks = tasksRes.data;
  const allClients = clientsRes.data.data;

  const today = new Date().toISOString().split("T")[0];
  const todaysHearings = allHearings.filter((h) => h.date === today);

  // Determine if this is a new user (fewer than 3 matters = onboarding)
  const isNewUser = allMatters.length < 3;

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
          <PendingFeesWidget fees={allFees} />
        </div>
      </div>

      {/* Row 4 — My Tasks (1/2) + Recent Cases (1/2) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TasksWidget tasks={allTasks} />
        <RecentMattersWidget matters={allMatters} clients={allClients} />
      </div>

      {/* Row 5 — Upcoming hearings this week (full width) */}
      <UpcomingHearingsWidget hearings={allHearings} />
    </div>
  );
}
