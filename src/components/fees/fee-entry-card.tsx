"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FeeEntry } from "@/types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentPercentage,
  isOverdue,
  titleCase,
} from "@/lib/utils/index";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  CalendarClock,
  Bell,
  FileText,
  CircleDollarSign,
} from "lucide-react";

interface FeeEntryCardProps {
  feeEntry: FeeEntry;
  clientName?: string;
  matterTitle?: string;
  onLogPayment?: (fee: FeeEntry) => void;
  onViewLedger?: (fee: FeeEntry) => void;
  onSendReminder?: (fee: FeeEntry) => void;
}

export function FeeEntryCard({
  feeEntry,
  clientName,
  matterTitle,
  onLogPayment,
  onViewLedger,
  onSendReminder,
}: FeeEntryCardProps) {
  const pct = getPaymentPercentage(feeEntry.totalAmount, feeEntry.receivedAmount);
  const overdue = feeEntry.status === "overdue" || (!!feeEntry.dueDate && isOverdue(feeEntry.dueDate) && feeEntry.status !== "paid");

  return (
    <Card
      className={cn(
        "p-4 transition-shadow hover:shadow-md",
        overdue && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Left: Names + description */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {clientName ?? "Unknown Client"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {matterTitle ?? feeEntry.description}
              </p>
              {matterTitle && (
                <p className="text-xs text-slate-500 mt-0.5">{feeEntry.description}</p>
              )}
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs border", getStatusColor(feeEntry.status))}
            >
              {titleCase(feeEntry.status)}
            </Badge>
          </div>

          {/* Amounts row */}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-slate-500">Total Agreed</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(feeEntry.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Received</p>
              <p className="font-semibold text-green-700">
                {formatCurrency(feeEntry.receivedAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p
                className={cn(
                  "font-semibold",
                  overdue ? "text-red-700" : "text-slate-700 dark:text-slate-300"
                )}
              >
                {formatCurrency(feeEntry.pendingAmount)}
              </p>
            </div>
            {feeEntry.dueDate && (
              <div>
                <p className="text-xs text-slate-500">Due Date</p>
                <p
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    overdue ? "text-red-700" : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDate(feeEntry.dueDate)}
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Payment progress</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {pct}%
              </span>
            </div>
            <Progress aria-label="Amount received"
              value={pct}
              className="h-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 sm:items-stretch shrink-0">
          {onLogPayment && feeEntry.status !== "paid" && (
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 text-xs"
              onClick={() => onLogPayment(feeEntry)}
            >
              <IndianRupee className="h-3.5 w-3.5" />
              Log Payment
            </Button>
          )}
          {onViewLedger && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => onViewLedger(feeEntry)}
            >
              <FileText className="h-3.5 w-3.5" />
              Ledger
            </Button>
          )}
          {onSendReminder && feeEntry.status !== "paid" && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs text-orange-700 hover:text-orange-700 hover:bg-orange-50"
              onClick={() => onSendReminder(feeEntry)}
            >
              <Bell className="h-3.5 w-3.5" />
              Remind
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
