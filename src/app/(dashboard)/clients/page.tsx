"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Client } from "@/types";

// Real client shape returned from /api/clients
type RealClient = Client & {
  _count?: { matters: number };
  feeEntries?: { pendingAmount: number }[];
};
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
  Users,
  Building2,
  UserCircle,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const clientTypeLabel: Record<string, string> = {
  individual: "Individual",
  company: "Company",
  family: "Family",
  organization: "Organization",
};

const clientTypeColor: Record<string, string> = {
  individual: "bg-blue-50 text-blue-700 border-blue-200",
  company: "bg-violet-50 text-violet-700 border-violet-200",
  family: "bg-emerald-50 text-emerald-700 border-emerald-200",
  organization: "bg-amber-50 text-amber-700 border-amber-200",
};

function ClientCard({ client }: { client: RealClient }) {
  const Icon =
    client.clientType === "company" || client.clientType === "organization"
      ? Building2
      : UserCircle;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#1e3a5f]/10 transition-colors">
              <Icon className="h-5 w-5 text-slate-500 group-hover:text-[#1e3a5f] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-900 truncate">{client.name}</h3>
                <Badge
                  variant="outline"
                  className={cn("text-xs shrink-0", clientTypeColor[client.clientType])}
                >
                  {clientTypeLabel[client.clientType]}
                </Badge>
                {!client.isActive && (
                  <Badge variant="outline" className="text-xs text-slate-500 shrink-0">
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{client.mobile}</span>
                </div>
                {(client.city || client.state) && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {[client.city, client.state].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-600 font-medium">
                    {client._count?.matters ?? 0}
                  </span>
                  <span className="text-slate-400">
                    {(client._count?.matters ?? 0) === 1 ? "matter" : "matters"}
                  </span>
                </div>
                {(client.feeEntries?.reduce((a, f) => a + f.pendingAmount, 0) ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-700 font-semibold">
                      {fmt(client.feeEntries!.reduce((a, f) => a + f.pendingAmount, 0))} pending
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link href={`/clients/${client.id}`}>
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
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={cn("rounded-xl border p-4 flex items-center gap-3", color)}>
      <Icon className="h-7 w-7 opacity-60 shrink-0" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs mt-1 font-medium opacity-75">{label}</p>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<RealClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/clients?pageSize=200");
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setClients(json.data.data);
      } catch {
        toast.error("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.city?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || c.clientType === typeFilter;
      return matchSearch && matchType;
    });
  }, [clients, search, typeFilter]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.isActive).length,
    companies: clients.filter(
      (c) => c.clientType === "company" || c.clientType === "organization"
    ).length,
    individuals: clients.filter((c) => c.clientType === "individual").length,
  }), [clients]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your clients and their matters."
        actions={
          <Link href="/clients/new">
            <Button className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Clients"
            value={stats.total}
            icon={Users}
            color="bg-slate-50 text-slate-700 border-slate-200"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={UserCircle}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
          <StatCard
            label="Companies / Orgs"
            value={stats.companies}
            icon={Building2}
            color="bg-violet-50 text-violet-700 border-violet-200"
          />
          <StatCard
            label="Individuals"
            value={stats.individuals}
            icon={UserCircle}
            color="bg-blue-50 text-blue-700 border-blue-200"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by name, phone, email, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => v !== null && setTypeFilter(v)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Client Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-base font-medium">No clients found</p>
          <p className="text-sm mt-1">
            {search || typeFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Add your first client to get started."}
          </p>
          {!search && typeFilter === "all" && (
            <Link href="/clients/new" className="mt-4">
              <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            Showing {filtered.length} of {clients.length} clients
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
