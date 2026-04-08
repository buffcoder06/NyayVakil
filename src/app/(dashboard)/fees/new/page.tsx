"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Matter, Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, IndianRupee, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const schema = z.object({
  matterId: z.string().min(1, "Select a matter"),
  clientId: z.string().min(1, "Select a client"),
  description: z.string().min(2, "Description is required"),
  totalAmount: z.string().min(1, "Amount is required"),
  dueDate: z.string().optional(),
  status: z.enum(["not_started", "overdue", "partially_paid", "paid"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewFeePage() {
  const router = useRouter();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      matterId: "",
      clientId: "",
      description: "",
      totalAmount: "",
      dueDate: "",
      status: "not_started",
      notes: "",
    },
  });

  const selectedMatterId = form.watch("matterId");

  useEffect(() => {
    Promise.all([
      fetch("/api/matters?pageSize=200").then((r) => r.json()),
      fetch("/api/clients?pageSize=200").then((r) => r.json()),
    ]).then(([mRes, cRes]) => {
      setMatters(mRes.data?.data ?? []);
      setClients(cRes.data?.data ?? []);
    });
  }, []);

  // Auto-fill clientId when matter is selected
  useEffect(() => {
    if (!selectedMatterId) return;
    const matter = matters.find((m) => m.id === selectedMatterId);
    if (matter) form.setValue("clientId", matter.clientId);
  }, [selectedMatterId, matters, form]);

  async function onSubmit(values: FormValues) {
    const totalAmount = parseFloat(values.totalAmount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      form.setError("totalAmount", { message: "Enter a valid amount" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matterId: values.matterId,
          clientId: values.clientId,
          description: values.description,
          totalAmount,
          receivedAmount: 0,
          dueDate: values.dueDate || undefined,
          status: values.status,
          notes: values.notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      toast.success("Fee entry created");
      router.push("/fees");
    } catch {
      toast.error("Failed to create fee entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/fees">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Fee Entry</h1>
          <p className="text-sm text-slate-500">Add a fee agreement for a matter</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-[#1e3a5f]" />
            Fee Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Matter */}
              <FormField
                control={form.control}
                name="matterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matter *</FormLabel>
                    <Select value={field.value} onValueChange={(v) => v !== null && field.onChange(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a matter…" />
                      </SelectTrigger>
                      <SelectContent>
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

              {/* Client (auto-filled) */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select value={field.value} onValueChange={(v) => v !== null && field.onChange(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client…" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Retainer fee, Hearing fee, Consultation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Total Amount */}
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (₹) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input type="number" min={0} className="pl-9" placeholder="50000" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={(v) => v !== null && field.onChange(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="partially_paid">Partially Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this fee arrangement…"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link href="/fees">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving} className="bg-[#1e3a5f] hover:bg-[#16304f]">
                  {saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />Create Fee Entry</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
