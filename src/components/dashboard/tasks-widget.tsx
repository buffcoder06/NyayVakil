// src/components/dashboard/tasks-widget.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, ClipboardList } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getPriorityColor, getPriorityDotColor, isOverdue, truncateText } from "@/lib/utils";
import { apiFetch } from "@/lib/http";
import { todayIST } from "@/lib/dates";
import { toast } from "sonner";
import type { Task } from "@/types";

const priorityLabelMap: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

interface TasksWidgetProps {
  tasks: Task[];
}

export function TasksWidget({ tasks: initialTasks }: TasksWidgetProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [completing, setCompleting] = useState<string | null>(null);

  const today = todayIST();

  // Tasks due today or overdue (pending/in_progress)
  const dueTasks = tasks
    .filter(
      (t) =>
        (t.status === "pending" || t.status === "in_progress") &&
        t.dueDate &&
        t.dueDate <= today
    )
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    })
    .slice(0, 6);

  async function handleComplete(taskId: string) {
    if (completing) return;
    setCompleting(taskId);
    try {
      await apiFetch(`/api/tasks/${taskId}`, { method: "PUT", body: { complete: true } });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "completed" as const } : t
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete task.");
    } finally {
      setCompleting(null);
    }
  }

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
          <CheckSquare className="h-4 w-4 text-gold" />
          Tasks Due Today
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-4">
        {dueTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="h-9 w-9 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No tasks due today
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {dueTasks.map((task) => {
              const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
              const isCompleting = completing === task.id;
              const isCompleted = task.status === "completed";

              return (
                <li
                  key={task.id}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-opacity ${
                    isCompleted ? "opacity-50" : ""
                  } ${
                    overdue && !isCompleted
                      ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                  }`}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={isCompleted}
                    disabled={isCompleting || isCompleted}
                    onCheckedChange={() => handleComplete(task.id)}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`text-sm font-medium cursor-pointer ${
                          isCompleted
                            ? "line-through text-slate-400"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {truncateText(task.title, 40)}
                      </label>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getPriorityDotColor(
                            task.priority
                          )}`}
                        />
                        {priorityLabelMap[task.priority] ?? task.priority}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {task.assignedTo}
                      </span>
                      {task.matterTitle && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {truncateText(task.matterTitle, 25)}
                        </span>
                      )}
                      {overdue && !isCompleted && (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          Overdue
                        </span>
                      )}
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
          href="/tasks"
          className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold dark:text-gold-bright dark:hover:text-gold-bright/80 transition-colors"
        >
          View all tasks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
