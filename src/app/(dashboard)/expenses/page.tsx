"use client";

import { useEffect, useState, useMemo } from "react";
import type { Expense, Matter } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Receipt,
  Search,
  CheckCircle2,
  Circle,
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

const expenseTypeColor: Record<string, string> = {
  court_fee: "bg-blue-50 text-blue-700",
  clerk_expense: "bg-teal-50 text-teal-700",
  photocopy: "bg-slate-50 text-slate-600",
  typing: "bg-gray-50 text-gray-600",
  travel: "bg-purple-50 text-purple-700",
  affidavit: "bg-indigo-50 text-indigo-700",
  filing: "bg-cyan-50 text-cyan-700",
  stamp: "bg-violet-50 text-violet-700",
  miscellaneous: "bg-gray-50 text-gray-600",
};

function AddExpenseDialog({
  open,
  onOpenChange,
  matters,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  matters: Matter[];
  onSuccess: (expense: Expense) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseType, setExpenseType] = useState("court_fee");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [matterId, setMatterId] = useState("none");
  const [paidBy, setPaidBy] = useState("Office");
  const [isRecoverable, setIsRecoverable] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !expenseType || !description || !amount) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          expenseType,
          description,
          amount: Number(amount),
          matterId: matterId !== "none" ? matterId : undefined,
          clientId: matters.find((m) => m.id === matterId)?.clientId,
          paidBy,
          isRecoverable,
          isRecovered: false,
          notes: notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      onSuccess(res.data);
      toast.success("Expense added.");
      onOpenChange(false);
      setDescription(""); setAmount(""); setMatterId("none"); setNotes(""); setIsRecoverable(false);
    } catch {
      toast.error("Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date *</Label>
              <Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Expense Type *</Label>
              <Select value={expenseType} onValueChange={(v) => v !== null && setExpenseType(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(expenseTypeLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description *</Label>
            <Input className="mt-1" placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount (₹) *</Label>
              <Input type="number" min={0} className="mt-1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label>Paid By</Label>
              <Input className="mt-1" placeholder="Office / Advocate" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Linked Matter</Label>
            <Select value={matterId} onValueChange={(v) => v !== null && setMatterId(v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select matter (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {matters.map((m) => <SelectItem key={m.id} value={m.id}>{m.matterTitle}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recoverable"
              checked={isRecoverable}
              onChange={(e) => setIsRecoverable(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="recoverable" className="cursor-pointer">Recoverable from Client</Label>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea className="mt-1 resize-none" rows={2} placeholder="Optional notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExpenseRowMobile({ expense, matterTitle, onToggleRecovered }: {
  expense: Expense;
  matterTitle: string;
  onToggleRecovered: (expense: Expense) => void;
}) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-medium text-sm text-slate-900">{expense.description}</span>
              <Badge className={cn("text-xs", expenseTypeColor[expense.expenseType])}>
                {expenseTypeLabel[expense.expenseType]}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {matterTitle !== "—" && ` · ${matterTitle}`}
              {` · ${expense.paidBy}`}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {expense.isRecoverable && (
                <button
                  className={cn(
                    "flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-colors",
                    expense.isRecovered
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  )}
                  onClick={() => onToggleRecovered(expense)}
                >
                  {expense.isRecovered ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                  {expense.isRecovered ? "Recovered" : "Recoverable"}
                </button>
              )}
            </div>
          </div>
          <span className="font-bold text-slate-900 shrink-0">{fmt(expense.amount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [matterFilter, setMatterFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [eRes, mRes] = await Promise.all([
          fetch("/api/expenses").then((r) => r.json()),
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
        ]);
        setExpenses(eRes.data ?? []);
        setMatters(mRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load expenses.");
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

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        !search ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.notes?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || e.expenseType === typeFilter;
      const matchMatter = matterFilter === "all" || e.matterId === matterFilter;
      return matchSearch && matchType && matchMatter;
    });
  }, [expenses, search, typeFilter, matterFilter]);

  const stats = useMemo(() => {
    const total = expenses.reduce((a, e) => a + e.amount, 0);
    const recoverable = expenses.filter((e) => e.isRecoverable).reduce((a, e) => a + e.amount, 0);
    const recovered = expenses.filter((e) => e.isRecovered).reduce((a, e) => a + e.amount, 0);
    const outstandingRecoverable = expenses
      .filter((e) => e.isRecoverable && !e.isRecovered)
      .reduce((a, e) => a + e.amount, 0);
    return { total, recoverable, recovered, outstandingRecoverable };
  }, [expenses]);

  const handleToggleRecovered = async (expense: Expense) => {
    try {
      await fetch(`/api/expenses?id=${expense.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRecovered: !expense.isRecovered }) });
      setExpenses((prev) =>
        prev.map((e) => (e.id === expense.id ? { ...e, isRecovered: !e.isRecovered } : e))
      );
      toast.success("Expense updated.");
    } catch {
      toast.error("Failed to update expense.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track office and matter-related expenses."
        actions={
          <Button onClick={() => setAddOpen(true)} className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
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
            <p className="text-xs text-slate-500 mb-1">Total Expenses</p>
            <p className="text-xl font-bold text-slate-800">{fmt(stats.total)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-blue-50">
            <p className="text-xs text-blue-600 mb-1">Recoverable</p>
            <p className="text-xl font-bold text-blue-800">{fmt(stats.recoverable)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-emerald-50">
            <p className="text-xs text-emerald-600 mb-1">Recovered</p>
            <p className="text-xl font-bold text-emerald-800">{fmt(stats.recovered)}</p>
          </div>
          <div className="rounded-xl border p-4 bg-amber-50">
            <p className="text-xs text-amber-600 mb-1">Outstanding Recoverable</p>
            <p className="text-xl font-bold text-amber-800">{fmt(stats.outstandingRecoverable)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search expenses…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={(v) => v !== null && setTypeFilter(v)}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Expense Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(expenseTypeLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={matterFilter} onValueChange={(v) => v !== null && setMatterFilter(v)}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Matters" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matters</SelectItem>
            {matters.map((m) => <SelectItem key={m.id} value={m.id}>{m.matterTitle}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-400 mb-3">
          Showing {filtered.length} expenses · Total: {fmt(filtered.reduce((a, e) => a + e.amount, 0))}
        </p>
      )}

      {/* Desktop Table */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <Receipt className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-base font-medium">No expenses found</p>
          <p className="text-sm mt-1">Add your first expense to get started.</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="space-y-2 sm:hidden">
            {filtered.map((expense) => (
              <ExpenseRowMobile
                key={expense.id}
                expense={expense}
                matterTitle={expense.matterId ? matterMap[expense.matterId] || "—" : "—"}
                onToggleRecovered={handleToggleRecovered}
              />
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Matter</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                      {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 max-w-xs">
                      <div className="truncate">{expense.description}</div>
                      {expense.notes && <p className="text-xs text-slate-400 truncate">{expense.notes}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", expenseTypeColor[expense.expenseType])}>
                        {expenseTypeLabel[expense.expenseType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-36">
                      <div className="truncate">
                        {expense.matterId ? matterMap[expense.matterId] || "—" : "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{expense.paidBy}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900 whitespace-nowrap">
                      {fmt(expense.amount)}
                    </TableCell>
                    <TableCell>
                      {expense.isRecoverable ? (
                        <button
                          className={cn(
                            "flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-colors",
                            expense.isRecovered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          )}
                          onClick={() => handleToggleRecovered(expense)}
                        >
                          {expense.isRecovered ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          {expense.isRecovered ? "Recovered" : "Recoverable"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Internal</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AddExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        matters={matters}
        onSuccess={(expense) => setExpenses((prev) => [expense, ...prev])}
      />
    </div>
  );
}
