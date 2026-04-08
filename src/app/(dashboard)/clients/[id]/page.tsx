"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Client, Matter, FeeEntry, TimelineEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Edit,
  Bell,
  Briefcase,
  AlertCircle,
  Calendar,
  FileText,
  IndianRupee,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const matterStatusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  disposed: "bg-slate-50 text-slate-600 border-slate-200",
  on_hold: "bg-orange-50 text-orange-700 border-orange-200",
  closed: "bg-red-50 text-red-700 border-red-200",
};

const feeStatusColor: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partially_paid: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  not_started: "bg-slate-50 text-slate-600 border-slate-200",
};

const feeStatusLabel: Record<string, string> = {
  paid: "Paid",
  partially_paid: "Partially Paid",
  overdue: "Overdue",
  not_started: "Not Started",
};

const timelineIcons: Record<string, React.ElementType> = {
  created: Activity,
  hearing_added: Calendar,
  payment_logged: IndianRupee,
  expense_added: IndianRupee,
  document_uploaded: FileText,
  reminder_created: Bell,
  task_completed: Briefcase,
  status_changed: Activity,
  note_added: FileText,
  hearing_completed: Calendar,
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [fees, setFees] = useState<FeeEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes, fRes] = await Promise.all([
          fetch(`/api/clients/${id}`).then((r) => r.json()),
          fetch(`/api/matters?clientId=${id}&pageSize=50`).then((r) => r.json()),
          fetch(`/api/fees?clientId=${id}`).then((r) => r.json()),
        ]);
        if (!cRes.success) throw new Error(cRes.message);
        setClient(cRes.data);
        setMatters(mRes.data?.data ?? []);
        setFees(fRes.data ?? []);
        setTimeline([]);
      } catch {
        toast.error("Failed to load client details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center py-20 text-slate-400">
        <AlertCircle className="h-12 w-12 mb-3" />
        <p className="text-base font-medium">Client not found</p>
        <Link href="/clients" className="mt-4">
          <Button variant="outline" size="sm">
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  const totalFeeAgreed = fees.reduce((a, f) => a + f.totalAmount, 0);
  const totalFeePaid = fees.reduce((a, f) => a + f.receivedAmount, 0);
  const recoveryPct = totalFeeAgreed > 0 ? (totalFeePaid / totalFeeAgreed) * 100 : 0;

  return (
    <div>
      {/* Back */}
      <div className="mb-4">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <Badge
              variant="outline"
              className="capitalize text-sm"
            >
              {client.clientType}
            </Badge>
            {!client.isActive && (
              <Badge variant="outline" className="text-slate-500">
                Inactive
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {client.mobile}
            </span>
            {client.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {client.email}
              </span>
            )}
            {client.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {[client.city, client.state].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Send Reminder — feature coming soon.")}
            className="gap-1.5"
          >
            <Bell className="h-4 w-4" />
            Reminder
          </Button>
          <Link href={`/clients/${id}/edit`}>
            <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-1.5">
              <Edit className="h-4 w-4" />
              Edit Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Outstanding Banner */}
      {client.totalOutstanding > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Outstanding Amount: {fmt(client.totalOutstanding)}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              This client has pending professional fee payments.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-5 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matters">
            Matters
            {matters.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                {matters.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="fees">Payments</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile</span>
                  <span className="font-medium text-slate-800">{client.mobile}</span>
                </div>
                {client.alternateMobile && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alt. Mobile</span>
                    <span className="font-medium text-slate-800">{client.alternateMobile}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-800">{client.email}</span>
                  </div>
                )}
                <Separator />
                {client.address && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address</span>
                    <span className="font-medium text-slate-800 text-right max-w-48">
                      {client.address}
                    </span>
                  </div>
                )}
                {client.city && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">City</span>
                    <span className="font-medium text-slate-800">{client.city}</span>
                  </div>
                )}
                {client.state && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">State</span>
                    <span className="font-medium text-slate-800">{client.state}</span>
                  </div>
                )}
                {client.pincode && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pincode</span>
                    <span className="font-medium text-slate-800">{client.pincode}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fee Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Fee Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Agreed</span>
                  <span className="font-semibold">{fmt(totalFeeAgreed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Received</span>
                  <span className="font-semibold text-emerald-700">{fmt(totalFeePaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending</span>
                  <span
                    className={cn(
                      "font-semibold",
                      client.totalOutstanding > 0 ? "text-red-600" : "text-slate-800"
                    )}
                  >
                    {fmt(client.totalOutstanding)}
                  </span>
                </div>
                {totalFeeAgreed > 0 && (
                  <div className="pt-1">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Payment Recovery</span>
                      <span>{recoveryPct.toFixed(0)}%</span>
                    </div>
                    <Progress value={recoveryPct} className="h-2" />
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Matters</span>
                  <span className="font-medium">{client.linkedMatterIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Since</span>
                  <span className="font-medium">
                    {new Date(client.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {client.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Matters */}
        <TabsContent value="matters" className="space-y-3">
          {matters.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <Briefcase className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No matters linked to this client</p>
              <Link href="/matters/new" className="mt-3">
                <Button size="sm" variant="outline">
                  Add Matter
                </Button>
              </Link>
            </div>
          ) : (
            matters.map((matter) => (
              <Link key={matter.id} href={`/matters/${matter.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 truncate">
                            {matter.matterTitle}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-xs shrink-0", matterStatusColor[matter.status])}
                          >
                            {matter.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                          <span>{matter.courtName}</span>
                          {matter.caseNumber && (
                            <span className="text-xs">Case No. {matter.caseNumber}</span>
                          )}
                          {matter.nextHearingDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next:{" "}
                              {new Date(matter.nextHearingDate + "T12:00:00").toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {matter.totalFeeAgreed - matter.totalFeePaid > 0 && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-400">Pending</p>
                          <p className="text-sm font-semibold text-amber-700">
                            {fmt(matter.totalFeeAgreed - matter.totalFeePaid)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        {/* Fees */}
        <TabsContent value="fees" className="space-y-3">
          {fees.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <IndianRupee className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No fee records for this client</p>
            </div>
          ) : (
            fees.map((fee) => (
              <Card key={fee.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">
                          {fee.description}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("text-xs shrink-0", feeStatusColor[fee.status])}
                        >
                          {feeStatusLabel[fee.status]}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-slate-500">
                          Total: <span className="font-medium text-slate-800">{fmt(fee.totalAmount)}</span>
                        </span>
                        <span className="text-slate-500">
                          Received:{" "}
                          <span className="font-medium text-emerald-700">
                            {fmt(fee.receivedAmount)}
                          </span>
                        </span>
                        {fee.pendingAmount > 0 && (
                          <span className="text-slate-500">
                            Pending:{" "}
                            <span className="font-medium text-red-600">
                              {fmt(fee.pendingAmount)}
                            </span>
                          </span>
                        )}
                      </div>
                      {fee.dueDate && (
                        <p className="text-xs text-slate-400 mt-1">
                          Due:{" "}
                          {new Date(fee.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  {fee.totalAmount > 0 && (
                    <div className="mt-3">
                      <Progress
                        value={(fee.receivedAmount / fee.totalAmount) * 100}
                        className="h-1.5"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          {timeline.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <Activity className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timeline.map((entry, idx) => {
                const Icon = timelineIcons[entry.type] || Activity;
                return (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-[#1e3a5f]" />
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-100 my-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{entry.title}</p>
                      {entry.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {entry.userName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
