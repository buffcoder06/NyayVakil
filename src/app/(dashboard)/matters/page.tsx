"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Matter, Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FolderOpen,
  Calendar,
  Building2,
  User,
  AlertCircle,
  ArrowRight,
  Scale,
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

const CASE_TYPES = [
  "Civil", "Criminal", "Family", "Consumer", "Property",
  "Recovery", "Labour", "Cheque Bounce", "Arbitration", "Corporate",
];

function MatterCard({ matter, clientName }: { matter: Matter; clientName: string }) {
  const status = statusConfig[matter.status] || statusConfig.active;
  const priority = priorityConfig[matter.priority] || priorityConfig.medium;
  const pendingFee = matter.totalFeeAgreed - matter.totalFeePaid;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-900 leading-snug">{matter.matterTitle}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", priority.className)}>
                {priority.label} Priority
              </Badge>
              <Badge variant="outline" className="text-xs text-slate-500">
                {matter.caseType}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span>{matter.courtName}</span>
                {matter.caseNumber && (
                  <span className="text-xs text-slate-400">· Case No. {matter.caseNumber}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{clientName}</span>
              </div>
              {matter.nextHearingDate ? (
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    Next Hearing:{" "}
                    {new Date(matter.nextHearingDate + "T12:00:00").toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>No hearing scheduled</span>
                </div>
              )}
              {pendingFee > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span className="text-amber-700 font-semibold">
                    {fmt(pendingFee)} fee pending
                  </span>
                </div>
              )}
            </div>
          </div>
          <Link href={`/matters/${matter.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1 text-xs group-hover:bg-[#1e3a5f] group-hover:text-white group-hover:border-[#1e3a5f] transition-all"
            >
              View
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  label, value, className,
}: { label: string; value: number; className: string }) {
  return (
    <div className={cn("rounded-xl border p-4", className)}>
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="text-xs mt-1 font-medium opacity-75">{label}</p>
    </div>
  );
}

export default function MattersPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [caseTypeFilter, setCaseTypeFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
          fetch("/api/clients?pageSize=200").then((r) => r.json()),
        ]);
        setMatters(mRes.data?.data ?? []);
        setClients(cRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load matters.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const clientMap = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.name])),
    [clients]
  );

  const filtered = useMemo(() => {
    return matters.filter((m) => {
      const matchSearch =
        !search ||
        m.matterTitle.toLowerCase().includes(search.toLowerCase()) ||
        m.caseNumber?.toLowerCase().includes(search.toLowerCase()) ||
        m.courtName.toLowerCase().includes(search.toLowerCase()) ||
        clientMap[m.clientId]?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchPriority = priorityFilter === "all" || m.priority === priorityFilter;
      const matchCaseType = caseTypeFilter === "all" || m.caseType === caseTypeFilter;
      return matchSearch && matchStatus && matchPriority && matchCaseType;
    });
  }, [matters, search, statusFilter, priorityFilter, caseTypeFilter, clientMap]);

  const stats = useMemo(() => ({
    active: matters.filter((m) => m.status === "active").length,
    pending: matters.filter((m) => m.status === "pending").length,
    highPriority: matters.filter((m) => m.priority === "high").length,
    disposed: matters.filter((m) => m.status === "disposed").length,
  }), [matters]);

  return (
    <div>
      <PageHeader
        title="Matters"
        description="Manage all cases and legal matters."
        actions={
          <Link href="/matters/new">
            <Button className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
              <Plus className="h-4 w-4" />
              Add Matter
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Active Matters" value={stats.active} className="bg-emerald-50 text-emerald-700 border-emerald-200" />
          <StatCard label="Pending" value={stats.pending} className="bg-amber-50 text-amber-700 border-amber-200" />
          <StatCard label="High Priority" value={stats.highPriority} className="bg-red-50 text-red-700 border-red-200" />
          <StatCard label="Disposed" value={stats.disposed} className="bg-slate-50 text-slate-600 border-slate-200" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search matter, case no., court, client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v !== null && setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="disposed">Disposed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => v !== null && setPriorityFilter(v)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={caseTypeFilter} onValueChange={(v) => v !== null && setCaseTypeFilter(v)}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Case Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CASE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <Scale className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-base font-medium">No matters found</p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "all" || priorityFilter !== "all" || caseTypeFilter !== "all"
              ? "Try adjusting your filters."
              : "Add your first matter to get started."}
          </p>
          {!search && statusFilter === "all" && priorityFilter === "all" && caseTypeFilter === "all" && (
            <Link href="/matters/new" className="mt-4">
              <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
                <Plus className="h-4 w-4" /> Add Matter
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            Showing {filtered.length} of {matters.length} matters
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map((matter) => (
              <MatterCard
                key={matter.id}
                matter={matter}
                clientName={clientMap[matter.clientId] || "Unknown Client"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
