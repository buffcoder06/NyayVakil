"use client";

import { useEffect, useState, useMemo } from "react";
import type { FeeEntry, Matter, Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const feeStatusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  partially_paid: { label: "Partially Paid", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  not_started: { label: "Not Started", className: "bg-slate-50 text-slate-600 border-slate-200", icon: Clock },
};

function FeeCard({
  fee,
  matterTitle,
  clientName,
  onLogPayment,
}: {
  fee: FeeEntry;
  matterTitle: string;
  clientName: string;
  onLogPayment: (fee: FeeEntry) => void;
}) {
  const config = feeStatusConfig[fee.status] || feeStatusConfig.not_started;
  const Icon = config.icon;
  const pct = fee.totalAmount > 0 ? (fee.receivedAmount / fee.totalAmount) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-slate-900 text-sm">{fee.description}</span>
              <Badge variant="outline" className={cn("text-xs shrink-0", config.className)}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{matterTitle}</p>
            <p className="text-xs text-slate-400">{clientName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400">Total</p>
            <p className="font-bold text-slate-900">{fmt(fee.totalAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center mb-3">
          <div className="rounded-lg bg-emerald-50 p-2">
            <p className="text-xs text-emerald-600">Received</p>
            <p className="font-semibold text-emerald-800 text-sm">{fmt(fee.receivedAmount)}</p>
          </div>
          <div className={cn("rounded-lg p-2", fee.pendingAmount > 0 ? "bg-red-50" : "bg-slate-50")}>
            <p className={cn("text-xs", fee.pendingAmount > 0 ? "text-red-600" : "text-slate-500")}>Pending</p>
            <p className={cn("font-semibold text-sm", fee.pendingAmount > 0 ? "text-red-700" : "text-slate-700")}>
              {fmt(fee.pendingAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-xs text-slate-500">Recovery</p>
            <p className="font-semibold text-slate-700 text-sm">{pct.toFixed(0)}%</p>
          </div>
        </div>

        <Progress value={pct} className="h-1.5 mb-3" />

        <div className="flex items-center justify-between">
          {fee.dueDate && (
            <p className="text-xs text-slate-400">
              Due: {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
          <div className="flex gap-2 ml-auto">
            {fee.status !== "paid" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => onLogPayment(fee)}
                >
                  Log Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddFeeDialog({
  open,
  onOpenChange,
  matters,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  matters: Matter[];
  onSuccess: (fee: FeeEntry) => void;
}) {
  const [matterId, setMatterId] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedMatter = matters.find((m) => m.id === matterId);

  const handleSubmit = async () => {
    if (!matterId || !description || !totalAmount) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matterId,
          clientId: selectedMatter?.clientId || "",
          description,
          totalAmount: Number(totalAmount),
          receivedAmount: 0,
          dueDate: dueDate || undefined,
          status: "not_started",
          notes: notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      onSuccess(res.data);
      toast.success("Fee entry added.");
      onOpenChange(false);
      setMatterId(""); setDescription(""); setTotalAmount(""); setDueDate(""); setNotes("");
    } catch {
      toast.error("Failed to add fee entry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Fee Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Matter *</Label>
            <Select value={matterId} onValueChange={(v) => v !== null && setMatterId(v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select matter" /></SelectTrigger>
              <SelectContent>
                {matters.map((m) => <SelectItem key={m.id} value={m.id}>{m.matterTitle}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description *</Label>
            <Input className="mt-1" placeholder="e.g. Professional fee for civil matter" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Total Amount (₹) *</Label>
            <Input type="number" min={0} className="mt-1" placeholder="0" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" className="mt-1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea className="mt-1 resize-none" rows={2} placeholder="Additional notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Fee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LogPaymentDialog({
  open,
  onOpenChange,
  fees,
  selectedFee,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fees: FeeEntry[];
  selectedFee: FeeEntry | null;
  onSuccess: () => void;
}) {
  const [feeId, setFeeId] = useState(selectedFee?.id || "");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFeeId(selectedFee?.id || "");
  }, [selectedFee]);

  const fee = fees.find((f) => f.id === feeId);

  const handleSubmit = async () => {
    if (!feeId || !amount || !paymentDate) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeEntryId: feeId,
          matterId: fee?.matterId || "",
          clientId: fee?.clientId || "",
          amount: Number(amount),
          paymentMethod,
          paymentDate,
          referenceNumber: referenceNumber || undefined,
          notes: notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      onSuccess();
      toast.success("Payment logged successfully.");
      onOpenChange(false);
      setAmount(""); setReferenceNumber(""); setNotes("");
    } catch {
      toast.error("Failed to log payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Fee Entry *</Label>
            <Select value={feeId} onValueChange={(v) => v !== null && setFeeId(v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select fee entry" /></SelectTrigger>
              <SelectContent>
                {fees.filter((f) => f.status !== "paid").map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.description} — {fmt(f.pendingAmount)} pending</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fee && (
            <div className="p-3 bg-amber-50 rounded-lg text-sm">
              <p className="text-amber-800 font-medium">Pending: {fmt(fee.pendingAmount)}</p>
            </div>
          )}
          <div>
            <Label>Amount (₹) *</Label>
            <Input type="number" min={0} max={fee?.pendingAmount} className="mt-1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={(v) => v !== null && setPaymentMethod(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer (NEFT/RTGS)</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Date *</Label>
            <Input type="date" className="mt-1" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </div>
          <div>
            <Label>Reference / Cheque Number</Label>
            <Input className="mt-1" placeholder="Transaction / Cheque No." value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input className="mt-1" placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Log Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FeesPage() {
  const [fees, setFees] = useState<FeeEntry[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [addFeeOpen, setAddFeeOpen] = useState(false);
  const [logPaymentOpen, setLogPaymentOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeEntry | null>(null);

  const loadFees = async () => {
    const res = await fetch("/api/fees").then((r) => r.json());
    setFees(res.data ?? []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [fRes, mRes, cRes] = await Promise.all([
          fetch("/api/fees").then((r) => r.json()),
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
          fetch("/api/clients?pageSize=200").then((r) => r.json()),
        ]);
        setFees(fRes.data ?? []);
        setMatters(mRes.data?.data ?? []);
        setClients(cRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load fee data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const matterMap = useMemo(
    () => Object.fromEntries(matters.map((m) => [m.id, m.matterTitle])),
    [matters]
  );

  const clientMap = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.name])),
    [clients]
  );

  const stats = useMemo(() => {
    const totalAgreed = fees.reduce((a, f) => a + f.totalAmount, 0);
    const totalCollected = fees.reduce((a, f) => a + f.receivedAmount, 0);
    const totalPending = fees.reduce((a, f) => a + f.pendingAmount, 0);
    const overdueCount = fees.filter((f) => f.status === "overdue").length;
    return { totalAgreed, totalCollected, totalPending, overdueCount };
  }, [fees]);

  const feesByStatus = useMemo(() => ({
    all: fees,
    overdue: fees.filter((f) => f.status === "overdue"),
    partially_paid: fees.filter((f) => f.status === "partially_paid"),
    paid: fees.filter((f) => f.status === "paid"),
    not_started: fees.filter((f) => f.status === "not_started"),
  }), [fees]);

  const handleLogPayment = (fee: FeeEntry) => {
    setSelectedFee(fee);
    setLogPaymentOpen(true);
  };

  const renderFees = (list: FeeEntry[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <IndianRupee className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No fee entries in this category</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map((fee) => (
          <FeeCard
            key={fee.id}
            fee={fee}
            matterTitle={matterMap[fee.matterId] || "Unknown Matter"}
            clientName={clientMap[fee.clientId] || "Unknown Client"}
            onLogPayment={handleLogPayment}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Fee Management"
        description="Track professional fees, payments, and outstanding amounts."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLogPaymentOpen(true)} className="gap-2">
              <IndianRupee className="h-4 w-4" />
              Log Payment
            </Button>
            <Button onClick={() => setAddFeeOpen(true)} className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
              <Plus className="h-4 w-4" />
              Add Fee Entry
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Total Agreed</p>
            <p className="text-xl font-bold text-slate-800">{fmt(stats.totalAgreed)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-emerald-50">
            <p className="text-xs text-emerald-600 mb-1">Total Collected</p>
            <p className="text-xl font-bold text-emerald-800">{fmt(stats.totalCollected)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-amber-50">
            <p className="text-xs text-amber-600 mb-1">Total Pending</p>
            <p className="text-xl font-bold text-amber-800">{fmt(stats.totalPending)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-red-50">
            <p className="text-xs text-red-600 mb-1">Overdue Entries</p>
            <p className="text-xl font-bold text-red-800">{stats.overdueCount}</p>
          </div>
        </div>
      )}

      {/* Recovery Bar */}
      {!loading && stats.totalAgreed > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Overall Payment Recovery</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {((stats.totalCollected / stats.totalAgreed) * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={(stats.totalCollected / stats.totalAgreed) * 100} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Collected: {fmt(stats.totalCollected)}</span>
              <span>Pending: {fmt(stats.totalPending)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{feesByStatus.all.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue
              {feesByStatus.overdue.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1 text-[10px] bg-red-100 text-red-700">{feesByStatus.overdue.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="partially_paid">Partially Paid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="not_started">Not Started</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{renderFees(feesByStatus.all)}</TabsContent>
          <TabsContent value="overdue">{renderFees(feesByStatus.overdue)}</TabsContent>
          <TabsContent value="partially_paid">{renderFees(feesByStatus.partially_paid)}</TabsContent>
          <TabsContent value="paid">{renderFees(feesByStatus.paid)}</TabsContent>
          <TabsContent value="not_started">{renderFees(feesByStatus.not_started)}</TabsContent>
        </Tabs>
      )}

      <AddFeeDialog
        open={addFeeOpen}
        onOpenChange={setAddFeeOpen}
        matters={matters}
        onSuccess={(fee) => setFees((prev) => [fee, ...prev])}
      />

      <LogPaymentDialog
        open={logPaymentOpen}
        onOpenChange={setLogPaymentOpen}
        fees={fees}
        selectedFee={selectedFee}
        onSuccess={loadFees}
      />
    </div>
  );
}
