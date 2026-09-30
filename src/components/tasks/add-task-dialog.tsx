'use client';

// src/components/tasks/add-task-dialog.tsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Pencil, Plus } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/http';
import type { Task, Matter, PaginatedResponse, TeamMember } from '@/types';
import { toast } from 'sonner';

const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  matterId: z.string().optional(),
  assignedTo: z.string().min(1, 'Please select a team member'),
  dueDate: z.date().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (task: Task) => void;
  defaultMatterId?: string;
  /** When set, the dialog edits this task instead of creating a new one. */
  task?: Task | null;
}

const NO_MATTER = 'none';

export function AddTaskDialog({ open, onOpenChange, onSuccess, defaultMatterId, task }: AddTaskDialogProps) {
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string }>>([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      matterId: defaultMatterId ?? NO_MATTER,
      assignedTo: '',
      priority: 'medium',
      notes: '',
    },
  });

  // Pre-fill the form when editing
  useEffect(() => {
    if (!open || !task) return;
    form.reset({
      title: task.title,
      description: task.description ?? '',
      matterId: task.matterId ?? NO_MATTER,
      assignedTo: task.assignedToId ?? '',
      dueDate: task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : undefined,
      priority: task.priority,
      notes: task.notes ?? '',
    });
  }, [open, task, form]);

  useEffect(() => {
    if (!open) return;
    // Fetch matters and team members of the signed-in firm
    Promise.all([
      apiFetch<PaginatedResponse<Matter>>('/api/matters?pageSize=200'),
      apiFetch<TeamMember[]>('/api/team'),
    ])
      .then(([matterPage, team]) => {
        setMatters(matterPage.data);
        setTeamMembers(team.map((u) => ({ id: u.id, name: u.name })));
      })
      .catch(() => toast.error('Failed to load cases and team members.'));
  }, [open]);

  async function onSubmit(values: TaskFormValues) {
    setLoading(true);
    try {
      const body = {
        title: values.title,
        description: values.description,
        matterId: values.matterId && values.matterId !== NO_MATTER ? values.matterId : isEdit ? null : undefined,
        assignedToId: values.assignedTo,
        dueDate: values.dueDate ? format(values.dueDate, 'yyyy-MM-dd') : isEdit ? null : undefined,
        priority: values.priority,
        notes: values.notes,
      };
      const saved = isEdit
        ? await apiFetch<Task>(`/api/tasks/${task!.id}`, { method: 'PUT', body })
        : await apiFetch<Task>('/api/tasks', { method: 'POST', body });
      toast.success(isEdit ? 'Task updated' : 'Task created successfully');
      onSuccess?.(saved);
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Pencil className="h-5 w-5 text-slate-600" /> : <Plus className="h-5 w-5 text-slate-600" />}
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prepare written statement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what needs to be done..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Matter */}
              <FormField
                control={form.control}
                name="matterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Case">
                          <SelectValue placeholder="Select case" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        <SelectItem value={NO_MATTER}>None</SelectItem>
                        {matters.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.matterTitle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assign To */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Assign To">
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger
                          className={cn(
                            'flex h-9 w-full items-center justify-start rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'dd/MM/yyyy') : 'Pick a date'}
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                            High
                          </span>
                        </SelectItem>
                        <SelectItem value="medium">
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
                            Medium
                          </span>
                        </SelectItem>
                        <SelectItem value="low">
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                            Low
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or instructions..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
