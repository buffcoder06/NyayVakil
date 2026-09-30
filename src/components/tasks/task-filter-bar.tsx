'use client';

// src/components/tasks/task-filter-bar.tsx

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskPriority, TaskStatus } from '@/types';

export interface TaskFilters {
  search: string;
  assignedTo: string;
  matterId: string;
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  dueDateRange: 'all' | 'today' | 'this_week' | 'overdue';
}

interface TaskFilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  teamMembers?: Array<{ id: string; name: string }>;
  matters?: Array<{ id: string; matterTitle: string }>;
}

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const DUE_DATE_OPTIONS = [
  { value: 'all', label: 'Any Due Date' },
  { value: 'today', label: 'Due Today' },
  { value: 'this_week', label: 'Due This Week' },
  { value: 'overdue', label: 'Overdue' },
];

export function TaskFilterBar({ filters, onChange, teamMembers = [], matters = [] }: TaskFilterBarProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.assignedTo !== 'all' ||
    filters.matterId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.dueDateRange !== 'all';

  function resetFilters() {
    onChange({
      search: '',
      assignedTo: 'all',
      matterId: 'all',
      priority: 'all',
      status: 'all',
      dueDateRange: 'all',
    });
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Assigned To */}
        <Select
          value={filters.assignedTo}
          onValueChange={(val) => val !== null && onChange({ ...filters, assignedTo: val })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Matter */}
        <Select
          value={filters.matterId}
          onValueChange={(val) => val !== null && onChange({ ...filters, matterId: val })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Case" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            {matters.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.matterTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority}
          onValueChange={(val) => onChange({ ...filters, priority: val as TaskPriority | 'all' })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(val) => onChange({ ...filters, status: val as TaskStatus | 'all' })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due Date */}
        <Select
          value={filters.dueDateRange}
          onValueChange={(val) =>
            onChange({ ...filters, dueDateRange: val as TaskFilters['dueDateRange'] })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            {DUE_DATE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-slate-500">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
