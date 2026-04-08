"use client";

import { useEffect, useState, useMemo } from "react";
import type { Reminder, Client, Matter } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Calendar,
  IndianRupee,
  FileText,
  MessageSquare,
  CheckCircle2,
  Plus,
  Send,
  X,
  Loader2,
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const reminderTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  hearing: { label: "Hearing", icon: Calendar, color: "text-blue-600" },
  payment: { label: "Payment", icon: IndianRupee, color: "text-amber-600" },
  document: { label: "Document", icon: FileText, color: "text-violet-600" },
  follow_up: { label: "Follow-up", icon: MessageSquare, color: "text-teal-600" },
  general: { label: "General", icon: Bell, color: "text-slate-500" },
};

const reminderStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  sent: { label: "Sent", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  acknowledged: { label: "Acknowledged", className: "bg-blue-50 text-blue-700 border-blue-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-50 text-slate-500 border-slate-200" },
};

const channelConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, className: "bg-green-50 text-green-700 border-green-200" },
  sms: { label: "SMS", icon: Smartphone, className: "bg-blue-50 text-blue-700 border-blue-200" },
  email: { label: "Email", icon: Mail, className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  internal: { label: "Internal", icon: Bell, className: "bg-slate-50 text-slate-600 border-slate-200" },
};

const REMINDER_TEMPLATES = [
  {
    id: "t1",
    name: "Hearing Reminder",
    type: "hearing" as const,
    template: "Dear [Client], your next hearing in matter [Matter] is scheduled on [Date] at [Court]. Please be available. — [Advocate]",
  },
  {
    id: "t2",
    name: "Payment Reminder",
    type: "payment" as const,
    template: "Dear [Client], your professional fee of ₹[Amount] is pending. Kindly make the payment at your earliest convenience. — [Advocate]",
  },
  {
    id: "t3",
    name: "Document Request",
    type: "document" as const,
    template: "Dear [Client], please share the following documents at the earliest: [Documents]. These are required for your matter [Matter]. — [Advocate]",
  },
  {
    id: "t4",
    name: "Follow-up",
    type: "follow_up" as const,
    template: "Dear [Client], following up on your matter [Matter]. Please contact our office to discuss the current status. — [Advocate]",
  },
  {
    id: "t5",
    name: "Matter Update",
    type: "general" as const,
    template: "Dear [Client], we would like to update you on the status of your matter [Matter]. Please call our office at your convenience. — [Advocate]",
  },
];

function ReminderCard({
  reminder,
  onMarkSent,
  onCancel,
}: {
  reminder: Reminder;
  onMarkSent: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const typeConf = reminderTypeConfig[reminder.type] || reminderTypeConfig.general;
  const statusConf = reminderStatusConfig[reminder.status] || reminderStatusConfig.pending;
  const channelConf = channelConfig[reminder.channel] || channelConfig.internal;
  const TypeIcon = typeConf.icon;
  const ChannelIcon = channelConf.icon;

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-slate-100")}>
            <TypeIcon className={cn("h-4.5 w-4.5", typeConf.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h4 className="font-semibold text-sm text-slate-900">{reminder.title}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className={cn("text-xs", channelConf.className)}>
                  <ChannelIcon className="h-3 w-3 mr-1" />
                  {channelConf.label}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", statusConf.className)}>
                  {statusConf.label}
                </Badge>
              </div>
            </div>

            {(reminder.clientName || reminder.matterTitle) && (
              <p className="text-xs text-slate-500 mt-0.5">
                {[reminder.clientName, reminder.matterTitle].filter(Boolean).join(" · ")}
              </p>
            )}

            <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
              {reminder.message}
            </p>

            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <p className="text-xs text-slate-400">
                {reminder.status === "sent" && reminder.sentAt
                  ? `Sent: ${new Date(reminder.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                  : `Scheduled: ${new Date(reminder.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
              </p>
              {reminder.status === "pending" && (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-[#1e3a5f] hover:bg-[#162d4a] gap-1"
                    onClick={() => onMarkSent(reminder.id)}
                  >
                    <Send className="h-3 w-3" />
                    Mark Sent
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                    onClick={() => onCancel(reminder.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateReminderDialog({
  open,
  onOpenChange,
  clients,
  matters,
  prefillMessage,
  prefillType,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: Client[];
  matters: Matter[];
  prefillMessage: string;
  prefillType: string;
  onSuccess: (reminder: Reminder) => void;
}) {
  const [type, setType] = useState(prefillType || "general");
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("none");
  const [matterId, setMatterId] = useState("none");
  const [message, setMessage] = useState(prefillMessage);
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().split("T")[0]);
  const [channel, setChannel] = useState("whatsapp");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMessage(prefillMessage);
    setType(prefillType || "general");
  }, [prefillMessage, prefillType]);

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedMatter = matters.find((m) => m.id === matterId);

  const handleSubmit = async () => {
    if (!title || !message || !scheduledAt) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          message,
          clientId: clientId !== "none" ? clientId : undefined,
          matterId: matterId !== "none" ? matterId : undefined,
          scheduledAt: scheduledAt + "T09:00:00.000Z",
          status: "pending",
          channel,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      onSuccess(res.data);
      toast.success("Reminder created.");
      onOpenChange(false);
      setTitle(""); setMessage(""); setClientId("none"); setMatterId("none");
    } catch {
      toast.error("Failed to create reminder.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type *</Label>
              <Select value={type} onValueChange={(v) => v !== null && setType(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hearing">Hearing</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Channel *</Label>
              <Select value={channel} onValueChange={(v) => v !== null && setChannel(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Title *</Label>
            <Input className="mt-1" placeholder="Reminder title…" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Client</Label>
            <Select value={clientId} onValueChange={(v) => v !== null && setClientId(v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select client (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Matter</Label>
            <Select value={matterId} onValueChange={(v) => v !== null && setMatterId(v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select matter (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {matters.map((m) => <SelectItem key={m.id} value={m.id}>{m.matterTitle}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Message *</Label>
            <Textarea className="mt-1 resize-none" rows={4} placeholder="Reminder message…" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div>
            <Label>Scheduled Date *</Label>
            <Input type="date" className="mt-1" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState("");
  const [prefillType, setPrefillType] = useState("general");

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, cRes, mRes] = await Promise.all([
          fetch("/api/reminders").then((r) => r.json()),
          fetch("/api/clients?pageSize=200").then((r) => r.json()),
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
        ]);
        setReminders(rRes.data ?? []);
        setClients(cRes.data?.data ?? []);
        setMatters(mRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load reminders.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => ({
    pending: reminders.filter((r) => r.status === "pending").length,
    sent: reminders.filter((r) => r.status === "sent" || r.status === "acknowledged").length,
    overdue: reminders.filter(
      (r) => r.status === "pending" && new Date(r.scheduledAt) < new Date()
    ).length,
    total: reminders.length,
  }), [reminders]);

  const byType = useMemo(() => ({
    all: reminders,
    pending: reminders.filter((r) => r.status === "pending"),
    sent: reminders.filter((r) => r.status === "sent" || r.status === "acknowledged"),
    hearing: reminders.filter((r) => r.type === "hearing"),
    payment: reminders.filter((r) => r.type === "payment"),
  }), [reminders]);

  const handleMarkSent = async (id: string) => {
    try {
      await fetch(`/api/reminders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markSent" }) });
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "sent", sentAt: new Date().toISOString() } : r))
      );
      toast.success("Reminder marked as sent.");
    } catch {
      toast.error("Failed to update reminder.");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await fetch(`/api/reminders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
      toast.success("Reminder cancelled.");
    } catch {
      toast.error("Failed to cancel reminder.");
    }
  };

  const openWithTemplate = (template: typeof REMINDER_TEMPLATES[0]) => {
    setPrefillMessage(template.template);
    setPrefillType(template.type);
    setCreateOpen(true);
  };

  const renderReminders = (list: Reminder[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <Bell className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No reminders in this category</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {list.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onMarkSent={handleMarkSent}
            onCancel={handleCancel}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Reminders"
        description="Send and track client communication and follow-up reminders."
        actions={
          <Button onClick={() => { setPrefillMessage(""); setPrefillType("general"); setCreateOpen(true); }} className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
            <Plus className="h-4 w-4" />
            Create Reminder
          </Button>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-amber-50">
            <p className="text-2xl font-bold text-amber-800">{stats.pending}</p>
            <p className="text-xs text-amber-600 mt-1">Pending</p>
          </div>
          <div className="rounded-xl border p-4 bg-emerald-50">
            <p className="text-2xl font-bold text-emerald-800">{stats.sent}</p>
            <p className="text-xs text-emerald-600 mt-1">Sent / Acknowledged</p>
          </div>
          <div className="rounded-xl border p-4 bg-red-50">
            <p className="text-2xl font-bold text-red-800">{stats.overdue}</p>
            <p className="text-xs text-red-600 mt-1">Overdue</p>
          </div>
          <div className="rounded-xl border p-4 bg-slate-50">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total</p>
          </div>
        </div>
      )}

      {/* Templates */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-600">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {REMINDER_TEMPLATES.map((t) => {
              const conf = reminderTypeConfig[t.type];
              const Icon = conf.icon;
              return (
                <button
                  key={t.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-[#1e3a5f]/40 hover:bg-[#1e3a5f]/5 transition-all text-center group"
                  onClick={() => openWithTemplate(t)}
                >
                  <Icon className={cn("h-5 w-5", conf.color)} />
                  <span className="text-xs font-medium text-slate-700 group-hover:text-[#1e3a5f] transition-colors">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{byType.all.length}</Badge></TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {byType.pending.length > 0 && <Badge className="ml-1.5 h-4 px-1 text-[10px] bg-amber-100 text-amber-700">{byType.pending.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="hearing">Hearing</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{renderReminders(byType.all)}</TabsContent>
          <TabsContent value="pending">{renderReminders(byType.pending)}</TabsContent>
          <TabsContent value="sent">{renderReminders(byType.sent)}</TabsContent>
          <TabsContent value="hearing">{renderReminders(byType.hearing)}</TabsContent>
          <TabsContent value="payment">{renderReminders(byType.payment)}</TabsContent>
        </Tabs>
      )}

      <CreateReminderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        clients={clients}
        matters={matters}
        prefillMessage={prefillMessage}
        prefillType={prefillType}
        onSuccess={(r) => setReminders((prev) => [r, ...prev])}
      />
    </div>
  );
}
