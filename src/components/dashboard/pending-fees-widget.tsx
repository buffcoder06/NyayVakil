// src/components/dashboard/pending-fees-widget.tsx
"use client";

import Link from "next/link";
import { IndianRupee, ArrowRight, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  formatCurrency,
  formatDate,
  getPaymentPercentage,
  isOverdue,
} from "@/lib/utils";
import type { FeeEntry } from "@/types";

interface PendingFeesWidgetProps {
  fees: FeeEntry[];
}

export function PendingFeesWidget({ fees }: PendingFeesWidgetProps) {
  // Every unpaid fee, overdue first then by amount; the list shows the top 5
  const unpaid = fees.filter((f) => f.status !== "paid" && f.pendingAmount > 0);
  const totalPending = unpaid.reduce((sum, f) => sum + f.pendingAmount, 0);
  const pending = [...unpaid]
    .sort((a, b) => {
      const aOverdue = a.dueDate ? isOverdue(a.dueDate) : false;
      const bOverdue = b.dueDate ? isOverdue(b.dueDate) : false;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return b.pendingAmount - a.pendingAmount;
    })
    .slice(0, 5);


  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <IndianRupee className="h-4 w-4 text-gold" />
            Pending Fees
          </CardTitle>
          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
            {formatCurrency(totalPending)} total
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-4">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IndianRupee className="h-9 w-9 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No pending fees. All clear!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((fee) => {
              const pct = getPaymentPercentage(fee.totalAmount, fee.receivedAmount);
              const overdue = fee.dueDate ? isOverdue(fee.dueDate) : false;

              return (
                <li
                  key={fee.id}
                  className={`rounded-lg border px-4 py-3 ${
                    overdue
                      ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {overdue && (
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                        )}
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {fee.description}
                        </p>
                      </div>
                      {fee.dueDate && (
                        <p
                          className={`text-xs mt-0.5 ${
                            overdue
                              ? "text-red-700 dark:text-red-400 font-medium"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          Due: {formatDate(fee.dueDate)}
                          {overdue && " (Overdue)"}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-red-700 dark:text-red-400">
                        {formatCurrency(fee.pendingAmount)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        of {formatCurrency(fee.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Paid
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          overdue
                            ? "bg-red-400"
                            : pct >= 75
                            ? "bg-emerald-500"
                            : pct >= 40
                            ? "bg-yellow-500"
                            : "bg-orange-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Link
          href="/fees"
          className="flex items-center gap-1 text-xs font-medium pointer-coarse:min-h-11 text-navy hover:text-gold-deep dark:text-gold-bright dark:hover:text-gold-bright/80 transition-colors"
        >
          View all fees
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
