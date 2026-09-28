'use client';

// src/components/tasks/task-card.tsx

import { useState } from 'react';
import Link from 'next/link';
import { Check, Edit2, Trash2, Calendar, User, Briefcase, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Task } from '@/types';
import { formatDate, getInitials, isOverdue, getStatusColor, getPriorityColor } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void | Promise<void>;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void | Promise<void>;
}

const PRIORITY_BAR_COLOR: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-green-500',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overdue =
    task.status !== 'completed' && task.status !== 'cancelled' && task.dueDate
      ? isOverdue(task.dueDate)
      : false;
  const isCompleted = task.status === 'completed';

  async function handleComplete() {
    if (!onComplete || isCompleted) return;
    setCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setCompleting(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || deleting) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`relative flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* Priority left bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${PRIORITY_BAR_COLOR[task.priority] ?? 'bg-gray-300'}`}
      />

      {/* Checkbox */}
      <div className="mt-0.5 pl-2">
        <Checkbox
          checked={isCompleted}
          disabled={isCompleted || completing}
          onCheckedChange={handleComplete}
          aria-label={`Mark "${task.title}" as complete`}
        />
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p
            className={`font-semibold text-slate-900 dark:text-slate-100 ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getStatusColor(task.status)}`}
            >
              {STATUS_LABELS[task.status] ?? task.status}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {task.matterTitle && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <Link
                href={task.matterId ? `/matters/${task.matterId}` : '#'}
                className="font-medium text-navy-700 hover:underline dark:text-blue-400"
              >
                {task.matterTitle}
              </Link>
            </span>
          )}

          {task.assignedTo && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-slate-200">
                  {getInitials(task.assignedTo)}
                </AvatarFallback>
              </Avatar>
              <span>{task.assignedTo}</span>
            </span>
          )}

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 ${
                overdue ? 'text-red-600 font-semibold' : ''
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {overdue ? 'Overdue · ' : ''}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <TooltipProvider>
          {!isCompleted && (
            <Tooltip>
              <TooltipTrigger
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handleComplete}
                disabled={completing}
                aria-label={`Complete task: ${task.title}`}
              >
                <Check className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Mark Complete</TooltipContent>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip>
              <TooltipTrigger
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                onClick={() => onEdit(task)}
                aria-label={`Edit task: ${task.title}`}
              >
                <Edit2 className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Edit Task</TooltipContent>
            </Tooltip>
          )}

          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Delete Task"
                aria-label={`Delete task: ${task.title}`}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
