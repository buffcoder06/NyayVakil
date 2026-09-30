'use client';

// src/app/(dashboard)/tasks/page.tsx

import { useCallback, useEffect, useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ListTodo,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskCard } from '@/components/tasks/task-card';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { TaskFilterBar, type TaskFilters } from '@/components/tasks/task-filter-bar';
import type { Matter, Task, TeamMember, PaginatedResponse } from '@/types';
import { apiFetch } from '@/lib/http';
import { todayIST } from '@/lib/dates';
import { useAuthStore } from '@/lib/store/auth-store';
import { isOverdue, getDaysUntil } from '@/lib/utils';
import { toast } from 'sonner';
import { SummaryStat } from "@/components/shared/summary-stat";

type ViewTab = 'my_tasks' | 'team_tasks' | 'overdue' | 'completed';

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  tone?: 'alert';
}

function groupTasksByDue(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    'This Week': [],
    Later: [],
    'No Due Date': [],
  };

  tasks.forEach((t) => {
    if (t.status === 'completed' || t.status === 'cancelled') return;
    if (!t.dueDate) {
      groups['No Due Date'].push(t);
      return;
    }
    const d = getDaysUntil(t.dueDate);
    if (d < 0) groups['Overdue'].push(t);
    else if (d === 0) groups['Today'].push(t);
    else if (d === 1) groups['Tomorrow'].push(t);
    else if (d <= 7) groups['This Week'].push(t);
    else groups['Later'].push(t);
  });

  return groups;
}

export default function TasksPage() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('my_tasks');
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    assignedTo: 'all',
    matterId: 'all',
    priority: 'all',
    status: 'all',
    dueDateRange: 'all',
  });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await apiFetch<Task[]>('/api/tasks'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Options for the filter bar
  useEffect(() => {
    Promise.all([
      apiFetch<TeamMember[]>('/api/team'),
      apiFetch<PaginatedResponse<Matter>>('/api/matters?pageSize=200'),
    ])
      .then(([team, matterPage]) => {
        setTeamMembers(team);
        setMatters(matterPage.data);
      })
      .catch(() => {
        // Filters still work on the loaded tasks without these options
      });
  }, []);

  // Stats
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate)
  ).length;
  const completedToday = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    return todayIST(new Date(t.completedAt)) === todayIST();
  }).length;

  const stats: StatCard[] = [
    {
      label: 'Pending',
      value: pending,
      icon: ListTodo,
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      tone: 'alert',
    },
    {
      label: 'Completed Today',
      value: completedToday,
      icon: CheckCircle,
    },
  ];

  // Filter tasks by tab
  let visibleTasks = tasks.filter((t) => {
    if (activeTab === 'my_tasks') return t.assignedToId === currentUserId && t.status !== 'completed' && t.status !== 'cancelled';
    if (activeTab === 'team_tasks') return t.assignedToId !== currentUserId && t.status !== 'completed' && t.status !== 'cancelled';
    if (activeTab === 'overdue') return t.status !== 'completed' && t.status !== 'cancelled' && t.dueDate && isOverdue(t.dueDate);
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  // Apply search & filter
  visibleTasks = visibleTasks.filter((t) => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.assignedTo !== 'all' && t.assignedToId !== filters.assignedTo) return false;
    if (filters.matterId !== 'all' && t.matterId !== filters.matterId) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.dueDateRange === 'today' && t.dueDate && getDaysUntil(t.dueDate) !== 0) return false;
    if (filters.dueDateRange === 'this_week' && t.dueDate) {
      const d = getDaysUntil(t.dueDate);
      if (d < 0 || d > 7) return false;
    }
    if (filters.dueDateRange === 'overdue' && !(t.dueDate && isOverdue(t.dueDate))) return false;
    return true;
  });

  const grouped = groupTasksByDue(visibleTasks);

  async function handleComplete(id: string) {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: 'PUT', body: { complete: true } });
      toast.success('Task marked as complete');
      loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to complete task');
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      toast.success('Task deleted');
      loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage and track all legal tasks across your practice."
        actions={
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <SummaryStat key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ViewTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="my_tasks" className="gap-2">
            My Tasks
            {pending > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="team_tasks">Team Tasks</TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            Overdue
            {overdue > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {overdue}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <TaskFilterBar
          filters={filters}
          onChange={setFilters}
          teamMembers={teamMembers}
          matters={matters}
        />

        {/* Task List */}
        <div className="mt-4 space-y-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : activeTab === 'completed' ? (
            visibleTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )
          ) : (
            Object.entries(grouped).map(([group, groupTasks]) => {
              if (groupTasks.length === 0) return null;
              return (
                <div key={group}>
                  <div className="mb-2 flex items-center gap-2">
                    <h3
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        group === 'Overdue' ? 'text-red-700' : 'text-slate-500'
                      }`}
                    >
                      {group}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {groupTasks.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {groupTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleComplete}
                        onEdit={setEditTask}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {!loading && visibleTasks.length === 0 && activeTab !== 'completed' && (
            <EmptyState />
          )}
        </div>
      </Tabs>

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => loadTasks()}
      />

      {/* Edit Task Dialog – reuse AddTaskDialog in edit mode if needed */}
      {editTask && (
        <AddTaskDialog
          open={!!editTask}
          task={editTask}
          onOpenChange={(open) => { if (!open) setEditTask(null); }}
          onSuccess={() => { loadTasks(); setEditTask(null); }}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-16 text-center dark:bg-slate-900">
      <CheckSquare className="mb-3 h-10 w-10 text-slate-300" />
      <p className="text-base font-medium text-slate-600">No tasks found</p>
      <p className="mt-1 text-sm text-slate-500">
        Click &quot;Add Task&quot; to create a new task.
      </p>
    </div>
  );
}
