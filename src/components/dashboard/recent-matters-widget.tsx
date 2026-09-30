// src/components/dashboard/recent-matters-widget.tsx
"use client";

import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDate, getStatusColor, truncateText, titleCase } from "@/lib/utils";
import type { Matter, Client } from "@/types";

const statusLabelMap: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  disposed: "Disposed",
  on_hold: "On Hold",
  closed: "Closed",
};

interface RecentMattersWidgetProps {
  matters: Matter[];
  clients: Client[];
}

export function RecentMattersWidget({ matters, clients }: RecentMattersWidgetProps) {
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  const recent = [...matters]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          <Briefcase className="h-4 w-4 text-slate-500" />
          Recent Cases
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-4 px-0">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Briefcase className="h-9 w-9 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No cases found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/60">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Case
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                    Next Hearing
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent.map((matter) => {
                  const client = clientMap.get(matter.clientId);
                  return (
                    <tr
                      key={matter.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/matters/${matter.id}`}
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-gold-deep dark:hover:text-gold-bright transition-colors pointer-coarse:inline-block pointer-coarse:py-2.5"
                        >
                          {truncateText(matter.matterTitle, 30)}
                        </Link>
                        {matter.caseNumber && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {matter.caseNumber}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-slate-700 dark:text-slate-300">
                          {client?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                          {titleCase(matter.caseType)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                            matter.status
                          )}`}
                        >
                          {statusLabelMap[matter.status] ?? matter.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-xs">
                        {matter.nextHearingDate
                          ? formatDate(matter.nextHearingDate)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Link
          href="/matters"
          className="flex items-center gap-1 text-xs font-medium pointer-coarse:min-h-11 text-navy hover:text-gold-deep dark:text-gold-bright dark:hover:text-gold-bright/80 transition-colors"
        >
          View all cases
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
