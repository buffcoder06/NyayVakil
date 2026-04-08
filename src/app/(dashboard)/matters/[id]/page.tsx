"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type {
  Matter,
  Client,
  Hearing,
  FeeEntry,
  Expense,
  Document,
  Task,
  TimelineEntry,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Plus,
  Calendar,
  AlertCircle,
  FileText,
  CheckSquare,
  Activity,
  IndianRupee,
  Building2,
  User,
  Gavel,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  disposed: { label: "Disposed", className: "bg-slate-50 text-slate-600 border-slate-200" },
  on_hold: { label: "On Hold", className: "bg-orange-50 text-orange-700 border-orange-200" },
  closed: { label: "Closed", className: "bg-red-50 text-red-700 border-red-200" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-50 text-red-600 border-red-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-600 border-amber-200" },
  low: { label: "Low", className: "bg-slate-50 text-slate-500 border-slate-200" },
};

const hearingStatusColor: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  attended: "bg-emerald-50 text-emerald-700 border-emerald-200",
  adjourned: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-50 text-slate-600 border-slate-200",
  missed: "bg-red-50 text-red-700 border-red-200",
};

const feeStatusColor: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partially_paid: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  not_started: "bg-slate-50 text-slate-600 border-slate-200",
};

const taskStatusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-50 text-slate-500 border-slate-200",
};

const docCategoryColor: Record<string, string> = {
  vakalatnama: "bg-blue-50 text-blue-700",
  affidavit: "bg-indigo-50 text-indigo-700",
  notice: "bg-amber-50 text-amber-700",
  petition: "bg-violet-50 text-violet-700",
  written_statement: "bg-slate-50 text-slate-700",
  evidence: "bg-orange-50 text-orange-700",
  receipt: "bg-green-50 text-green-700",
  invoice: "bg-emerald-50 text-emerald-700",
  id_proof: "bg-cyan-50 text-cyan-700",
  court_order: "bg-red-50 text-red-700",
  miscellaneous: "bg-gray-50 text-gray-700",
};

const expenseTypeLabel: Record<string, string> = {
  court_fee: "Court Fee",
  clerk_expense: "Clerk Expense",
  photocopy: "Photocopy",
  typing: "Typing",
  travel: "Travel",
  affidavit: "Affidavit/Notary",
  filing: "Filing Fee",
  stamp: "Stamp Duty",
  miscellaneous: "Miscellaneous",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-2 py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}

const courtLevelLabel: Record<string, string> = {
  district_court: "District Court",
  high_court: "High Court",
  supreme_court: "Supreme Court",
  sessions_court: "Sessions Court",
  magistrate_court: "Magistrate Court",
  family_court: "Family Court",
  consumer_court: "Consumer Court",
  tribunal: "Tribunal",
  other: "Other",
};

export default function MatterDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [matter, setMatter] = useState<Matter | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [fees, setFees] = useState<FeeEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const mRes = await fetch(`/api/matters/${id}`).then((r) => r.json());
        if (!mRes.success) throw new Error(mRes.message);
        const m = mRes.data;
        setMatter(m);

        const [cRes, hRes, fRes, eRes, dRes, tRes] = await Promise.all([
          fetch(`/api/clients/${m.clientId}`).then((r) => r.json()),
          fetch(`/api/hearings?matterId=${id}&pageSize=50`).then((r) => r.json()),
          fetch(`/api/fees?matterId=${id}`).then((r) => r.json()),
          fetch(`/api/expenses?matterId=${id}`).then((r) => r.json()),
          fetch(`/api/documents?matterId=${id}`).then((r) => r.json()),
          fetch(`/api/tasks?matterId=${id}`).then((r) => r.json()),
        ]);
        setClient(cRes.data ?? null);
        setHearings(hRes.data?.data ?? []);
        setFees(fRes.data ?? []);
        setExpenses(eRes.data ?? []);
        setDocuments(dRes.data ?? []);
        setTasks(tRes.data ?? []);
        setTimeline([]);
      } catch {
        toast.error("Failed to load matter details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!matter) {
    return (
      <div className="flex flex-col items-center py-20 text-slate-400">
        <AlertCircle className="h-12 w-12 mb-3" />
        <p>Matter not found.</p>
        <Link href="/matters" className="mt-4">
          <Button variant="outline" size="sm">Back to Matters</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[matter.status];
  const priority = priorityConfig[matter.priority];
  const pendingFee = matter.totalFeeAgreed - matter.totalFeePaid;
  const recoveryPct =
    matter.totalFeeAgreed > 0 ? (matter.totalFeePaid / matter.totalFeeAgreed) * 100 : 0;

  const handleTaskComplete = async (task: Task) => {
    try {
      const r = await fetch(`/api/tasks/${task.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ complete: true }) }).then((r) => r.json());
      if (!r.success) throw new Error(r.message);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t))
      );
      toast.success("Task marked as complete.");
    } catch {
      toast.error("Failed to update task.");
    }
  };

  return (
    <div>
      {/* Back */}
      <div className="mb-4">
        <Link href="/matters" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Matters
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">{matter.matterTitle}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={cn("text-sm", status.className)}>
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", priority.className)}>
              {priority.label} Priority
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-500">
              {matter.caseType}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {matter.courtName}
            </span>
            {matter.caseNumber && (
              <span className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                {matter.caseNumber}
              </span>
            )}
            {client && (
              <Link href={`/clients/${client.id}`} className="flex items-center gap-1 hover:text-[#1e3a5f] transition-colors">
                <User className="h-3.5 w-3.5" />
                {client.name}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/matters/${id}/edit`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-1.5"
            onClick={() => toast.info("Add hearing — coming soon.")}
          >
            <Plus className="h-4 w-4" />
            Add Hearing
          </Button>
        </div>
      </div>

      {/* Next Hearing Banner */}
      {matter.nextHearingDate && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Next Hearing:{" "}
              {new Date(matter.nextHearingDate + "T12:00:00").toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">{matter.courtName}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-5 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hearings">
            Hearings
            {hearings.length > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{hearings.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses
            {expenses.length > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{expenses.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {documents.length > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{documents.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks
            {tasks.filter((t) => t.status !== "completed").length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                {tasks.filter((t) => t.status !== "completed").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Matter Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Case Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Court Level" value={courtLevelLabel[matter.courtLevel]} />
                <InfoRow label="Case Stage" value={matter.caseStage} />
                <InfoRow label="Filing Date" value={matter.filingDate ? new Date(matter.filingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null} />
                <InfoRow label="CNR Number" value={matter.cnrNumber} />
                <InfoRow label="Judge" value={matter.judgeName} />
                <InfoRow label="Act / Section" value={matter.actSection} />
                <InfoRow label="Police Station" value={matter.policeStation} />
                <InfoRow label="Opposite Party" value={matter.oppositeParty} />
                <InfoRow label="Opposite Advocate" value={matter.oppositeAdvocate} />
                <InfoRow label="Advocate on Record" value={matter.advocateOnRecord} />
              </CardContent>
            </Card>

            {/* Fee Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Fee Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Agreed</span>
                  <span className="font-semibold">{fmt(matter.totalFeeAgreed)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Received</span>
                  <span className="font-semibold text-emerald-700">{fmt(matter.totalFeePaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pending</span>
                  <span className={cn("font-semibold", pendingFee > 0 ? "text-red-600" : "text-slate-800")}>
                    {fmt(pendingFee)}
                  </span>
                </div>
                {matter.totalFeeAgreed > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Payment Recovery</span>
                      <span>{recoveryPct.toFixed(0)}%</span>
                    </div>
                    <Progress value={recoveryPct} className="h-2" />
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Expenses</span>
                  <span className="font-semibold">{fmt(matter.totalExpenses)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {matter.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">{matter.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* HEARINGS */}
        <TabsContent value="hearings" className="space-y-3">
          {hearings.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <Calendar className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No hearings scheduled</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.info("Add hearing — navigate to Hearing Diary.")}>
                <Plus className="h-4 w-4 mr-1" /> Add Hearing
              </Button>
            </div>
          ) : (
            hearings.sort((a, b) => b.date.localeCompare(a.date)).map((h) => (
              <Card key={h.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">
                          {new Date(h.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {h.time && <span className="text-sm text-slate-500">{h.time}</span>}
                        <Badge variant="outline" className={cn("text-xs", hearingStatusColor[h.status])}>
                          {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                        </Badge>
                      </div>
                      {h.purpose && <p className="text-sm text-slate-600 mt-1">{h.purpose}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">{h.courtName}</p>
                      {h.assignedTo && <p className="text-xs text-slate-400">Assigned: {h.assignedTo}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* FEES */}
        <TabsContent value="fees" className="space-y-3">
          {fees.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <IndianRupee className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No fee entries</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="rounded-xl border p-3 text-center bg-slate-50">
                  <p className="text-lg font-bold text-slate-800">{fmt(fees.reduce((a, f) => a + f.totalAmount, 0))}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Total Agreed</p>
                </div>
                <div className="rounded-xl border p-3 text-center bg-emerald-50">
                  <p className="text-lg font-bold text-emerald-700">{fmt(fees.reduce((a, f) => a + f.receivedAmount, 0))}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Received</p>
                </div>
                <div className="rounded-xl border p-3 text-center bg-red-50">
                  <p className="text-lg font-bold text-red-600">{fmt(fees.reduce((a, f) => a + f.pendingAmount, 0))}</p>
                  <p className="text-xs text-red-500 mt-0.5">Pending</p>
                </div>
              </div>
              {fees.map((fee) => (
                <Card key={fee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900">{fee.description}</span>
                          <Badge variant="outline" className={cn("text-xs", feeStatusColor[fee.status])}>
                            {fee.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex items-center gap-4 text-sm">
                          <span className="text-slate-500">Total: <strong>{fmt(fee.totalAmount)}</strong></span>
                          <span className="text-emerald-700">Received: <strong>{fmt(fee.receivedAmount)}</strong></span>
                          {fee.pendingAmount > 0 && (
                            <span className="text-red-600">Pending: <strong>{fmt(fee.pendingAmount)}</strong></span>
                          )}
                        </div>
                        {fee.dueDate && (
                          <p className="text-xs text-slate-400 mt-1">
                            Due: {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    {fee.totalAmount > 0 && (
                      <Progress value={(fee.receivedAmount / fee.totalAmount) * 100} className="h-1.5 mt-3" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* EXPENSES */}
        <TabsContent value="expenses" className="space-y-3">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <AlertCircle className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No expenses recorded</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border mb-2">
                <span className="text-sm text-slate-600">Total Expenses</span>
                <span className="font-bold text-slate-900">{fmt(expenses.reduce((a, e) => a + e.amount, 0))}</span>
              </div>
              {expenses.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-slate-900">{exp.description}</span>
                          <Badge variant="outline" className="text-xs text-slate-500">
                            {expenseTypeLabel[exp.expenseType] || exp.expenseType}
                          </Badge>
                          {exp.isRecoverable && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {exp.isRecovered ? "Recovered" : "Recoverable"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · Paid by: {exp.paidBy}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">{fmt(exp.amount)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <FileText className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No documents uploaded</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.info("Upload documents from the Documents page.")}>
                <Plus className="h-4 w-4 mr-1" /> Upload Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Document viewer — coming soon.")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4.5 w-4.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={cn("text-xs", docCategoryColor[doc.category])}>
                            {doc.category.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-slate-400">{doc.fileSize}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(doc.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TASKS */}
        <TabsContent value="tasks" className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <CheckSquare className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No tasks assigned</p>
            </div>
          ) : (
            tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("font-medium text-sm", task.status === "completed" ? "line-through text-slate-400" : "text-slate-900")}>
                          {task.title}
                        </span>
                        <Badge variant="outline" className={cn("text-xs", taskStatusColor[task.status])}>
                          {task.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs", priorityConfig[task.priority]?.className)}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                        <span>Assigned to: {task.assignedTo}</span>
                        {task.dueDate && (
                          <span>Due: {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        )}
                      </div>
                    </div>
                    {task.status !== "completed" && (
                      <Button size="sm" variant="outline" className="shrink-0 text-xs h-7" onClick={() => handleTaskComplete(task)}>
                        Mark Done
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline">
          {timeline.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <Activity className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timeline.map((entry, idx) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-[#1e3a5f]" />
                    </div>
                    {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{entry.title}</p>
                    {entry.description && <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })} · {entry.userName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
