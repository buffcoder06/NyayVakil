"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  User,
  Gavel,
  Users,
  Scale,
  UserCheck,
  IndianRupee,
  FileText,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CASE_TYPES = [
  "Civil Suit", "Criminal", "Family / Matrimonial", "Consumer", "Property",
  "Recovery / Money", "Labour / Industrial", "Cheque Bounce (NI Act)",
  "Arbitration", "Corporate / Company", "Writ Petition", "Appeal",
  "Execution", "Insolvency", "Motor Accident", "Service Matter",
  "Taxation", "Intellectual Property", "Other",
];

const COURTS = [
  "District Court", "Bombay High Court", "Delhi High Court",
  "Madras High Court", "Calcutta High Court", "Allahabad High Court",
  "Karnataka High Court", "Supreme Court of India", "Family Court",
  "Consumer Court", "Sessions Court", "Chief Judicial Magistrate",
  "Judicial Magistrate First Class", "Civil Judge (Senior Division)",
  "Civil Judge (Junior Division)", "Labour Court", "Debt Recovery Tribunal",
  "National Company Law Tribunal", "Income Tax Appellate Tribunal", "Other",
];

const TEAM_MEMBERS = [
  { id: "usr_002", name: "Adv. Rahul Mehta", role: "junior" },
  { id: "usr_003", name: "Suresh Patil", role: "clerk" },
  { id: "usr_004", name: "Kavitha Nair", role: "clerk" },
];

const schema = z.object({
  matterTitle: z.string().min(3, "Matter title must be at least 3 characters"),
  clientId: z.string().min(1, "Please select a client"),
  caseType: z.string().min(1, "Please select a case type"),
  courtName: z.string().min(1, "Please select a court"),
  courtLevel: z.string().min(1, "Please select court level"),
  status: z.string().min(1),
  priority: z.string().min(1),
  caseNumber: z.string().optional(),
  cnrNumber: z.string().optional(),
  caseStage: z.string().optional(),
  filingDate: z.string().optional(),
  nextHearingDate: z.string().optional(),
  judgeName: z.string().optional(),
  oppositeParty: z.string().optional(),
  oppositeAdvocate: z.string().optional(),
  advocateOnRecord: z.string().optional(),
  actSection: z.string().optional(),
  policeStation: z.string().optional(),
  assignedJuniorId: z.string().optional(),
  assignedClerkId: z.string().optional(),
  totalFeeAgreed: z.number().min(0, "Fee must be 0 or more"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
    {message}
  </p>;
}

function SectionHeader({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-8 w-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-[#1e3a5f]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </Label>
  );
}

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "bg-red-50 text-red-700 border-red-200 data-[active=true]:bg-red-600 data-[active=true]:text-white data-[active=true]:border-red-600" },
  { value: "medium", label: "Medium", color: "bg-amber-50 text-amber-700 border-amber-200 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500" },
  { value: "low", label: "Low", color: "bg-emerald-50 text-emerald-700 border-emerald-200 data-[active=true]:bg-emerald-600 data-[active=true]:text-white data-[active=true]:border-emerald-600" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "on_hold", label: "On Hold" },
];

export default function NewMatterPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);

  type Matter = import("@/types").Matter;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      status: "active",
      priority: "medium",
      courtLevel: "district_court",
      totalFeeAgreed: 0,
    },
  });

  const clientId = watch("clientId");
  const caseType = watch("caseType");
  const courtLevel = watch("courtLevel");
  const courtName = watch("courtName");
  const status = watch("status");
  const priority = watch("priority");
  const assignedJuniorId = watch("assignedJuniorId");
  const assignedClerkId = watch("assignedClerkId");

  useEffect(() => {
    fetch("/api/clients?pageSize=200").then((r) => r.json()).then((j) => setClients(j.data?.data ?? []));
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matterTitle: data.matterTitle,
          clientId: data.clientId,
          caseType: data.caseType,
          courtName: data.courtName,
          courtLevel: data.courtLevel,
          status: data.status,
          priority: data.priority,
          caseNumber: data.caseNumber || undefined,
          cnrNumber: data.cnrNumber || undefined,
          caseStage: data.caseStage || undefined,
          filingDate: data.filingDate || undefined,
          nextHearingDate: data.nextHearingDate || undefined,
          judgeName: data.judgeName || undefined,
          oppositeParty: data.oppositeParty || undefined,
          oppositeAdvocate: data.oppositeAdvocate || undefined,
          advocateOnRecord: data.advocateOnRecord || undefined,
          actSection: data.actSection || undefined,
          policeStation: data.policeStation || undefined,
          assignedJuniorId: data.assignedJuniorId || undefined,
          assignedClerkId: data.assignedClerkId || undefined,
          totalFeeAgreed: data.totalFeeAgreed || 0,
          notes: data.notes || undefined,
          createdBy: "default-user",
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      toast.success("Matter created successfully!");
      router.push(`/matters/${res.data.id}`);
    } catch {
      toast.error("Failed to create matter. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/matters"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Matters
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-800">New Matter</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/matters">
              <Button type="button" variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button
              type="submit"
              form="matter-form"
              disabled={submitting}
              size="sm"
              className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-1.5"
            >
              {submitting ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
              ) : (
                <><FileText className="h-3.5 w-3.5" /> Create Matter</>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Add New Matter</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the case details below. Fields marked with <span className="text-red-400">*</span> are required.</p>
        </div>

        <form id="matter-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={FileText}
              title="Basic Information"
              description="Core details about the case"
            />
            <div className="grid grid-cols-1 gap-5">
              <div>
                <FieldLabel required>Matter Title</FieldLabel>
                <Input
                  placeholder="e.g. Agarwal vs Sharma – Property Dispute"
                  className={cn("mt-1.5 h-10", errors.matterTitle && "border-red-300 focus-visible:ring-red-300")}
                  {...register("matterTitle")}
                />
                <FieldError message={errors.matterTitle?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Client</FieldLabel>
                  <Select value={clientId ?? ""} onValueChange={(v) => { if (v !== null) setValue("clientId", v, { shouldValidate: false }); }}>
                    <SelectTrigger className={cn("mt-1.5 h-10", errors.clientId && "border-red-300")}>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.clientId?.message} />
                </div>
                <div>
                  <FieldLabel required>Case Type</FieldLabel>
                  <Select value={caseType ?? ""} onValueChange={(v) => { if (v !== null) setValue("caseType", v, { shouldValidate: false }); }}>
                    <SelectTrigger className={cn("mt-1.5 h-10", errors.caseType && "border-red-300")}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CASE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.caseType?.message} />
                </div>
              </div>

              {/* Priority */}
              <div>
                <FieldLabel>Priority</FieldLabel>
                <div className="flex gap-2 mt-1.5">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      data-active={priority === opt.value}
                      onClick={() => setValue("priority", opt.value)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                        opt.color
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <FieldLabel>Status</FieldLabel>
                <div className="flex gap-2 mt-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("status", opt.value)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                        status === opt.value
                          ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Case Number</FieldLabel>
                  <Input placeholder="e.g. CS/1234/2024" className="mt-1.5 h-10" {...register("caseNumber")} />
                </div>
                <div>
                  <FieldLabel>CNR Number</FieldLabel>
                  <Input placeholder="eCourts CNR number" className="mt-1.5 h-10" {...register("cnrNumber")} />
                </div>
              </div>
            </div>
          </div>

          {/* Court Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={Gavel}
              title="Court Details"
              description="Court and hearing information"
            />
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Court Name</FieldLabel>
                  <Select value={courtName ?? ""} onValueChange={(v) => { if (v !== null) setValue("courtName", v, { shouldValidate: false }); }}>
                    <SelectTrigger className={cn("mt-1.5 h-10", errors.courtName && "border-red-300")}>
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURTS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.courtName?.message} />
                </div>
                <div>
                  <FieldLabel required>Court Level</FieldLabel>
                  <Select value={courtLevel ?? ""} onValueChange={(v) => { if (v !== null) setValue("courtLevel", v); }}>
                    <SelectTrigger className="mt-1.5 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="district_court">District Court</SelectItem>
                      <SelectItem value="sessions_court">Sessions Court</SelectItem>
                      <SelectItem value="magistrate_court">Magistrate Court</SelectItem>
                      <SelectItem value="family_court">Family Court</SelectItem>
                      <SelectItem value="consumer_court">Consumer Court</SelectItem>
                      <SelectItem value="high_court">High Court</SelectItem>
                      <SelectItem value="supreme_court">Supreme Court</SelectItem>
                      <SelectItem value="tribunal">Tribunal / Authority</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Case Stage</FieldLabel>
                  <Input placeholder="e.g. Arguments, Evidence, Trial" className="mt-1.5 h-10" {...register("caseStage")} />
                </div>
                <div>
                  <FieldLabel>Judge Name</FieldLabel>
                  <Input placeholder="Hon. Judge's name" className="mt-1.5 h-10" {...register("judgeName")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Filing Date</FieldLabel>
                  <Input type="date" className="mt-1.5 h-10" {...register("filingDate")} />
                </div>
                <div>
                  <FieldLabel>Next Hearing Date</FieldLabel>
                  <Input type="date" className="mt-1.5 h-10" {...register("nextHearingDate")} />
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={Users}
              title="Parties"
              description="Opposite party and counsel details"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Opposite Party</FieldLabel>
                <Input placeholder="Name of opposite party" className="mt-1.5 h-10" {...register("oppositeParty")} />
              </div>
              <div>
                <FieldLabel>Opposite Advocate</FieldLabel>
                <Input placeholder="Opposing counsel's name" className="mt-1.5 h-10" {...register("oppositeAdvocate")} />
              </div>
              <div>
                <FieldLabel>Advocate on Record</FieldLabel>
                <Input placeholder="AOR name (if different)" className="mt-1.5 h-10" {...register("advocateOnRecord")} />
              </div>
            </div>
          </div>

          {/* Legal Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={Scale}
              title="Legal Details"
              description="Applicable laws, sections and FIR details"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <FieldLabel>Act / Section</FieldLabel>
                <Input placeholder="e.g. IPC 420, CPC Order 39, NI Act 138" className="mt-1.5 h-10" {...register("actSection")} />
              </div>
              <div>
                <FieldLabel>Police Station</FieldLabel>
                <Input placeholder="For criminal matters only" className="mt-1.5 h-10" {...register("policeStation")} />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={UserCheck}
              title="Team Assignment"
              description="Assign this matter to team members"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Assigned Junior Advocate</FieldLabel>
                <Select value={assignedJuniorId || ""} onValueChange={(v) => setValue("assignedJuniorId", v || undefined)}>
                  <SelectTrigger className="mt-1.5 h-10">
                    <SelectValue placeholder="Not assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not assigned</SelectItem>
                    {TEAM_MEMBERS.filter((m) => m.role === "junior").map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Assigned Clerk</FieldLabel>
                <Select value={assignedClerkId || ""} onValueChange={(v) => setValue("assignedClerkId", v || undefined)}>
                  <SelectTrigger className="mt-1.5 h-10">
                    <SelectValue placeholder="Not assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not assigned</SelectItem>
                    {TEAM_MEMBERS.filter((m) => m.role === "clerk").map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={IndianRupee}
              title="Financial"
              description="Fee agreement for this matter"
            />
            <div className="max-w-xs">
              <FieldLabel>Total Fee Agreed (₹)</FieldLabel>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="pl-7 h-10"
                  {...register("totalFeeAgreed", { valueAsNumber: true })}
                />
              </div>
              <FieldError message={errors.totalFeeAgreed?.message} />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <SectionHeader
              icon={User}
              title="Notes"
              description="Additional context or instructions"
            />
            <Textarea
              placeholder="Add any case notes, client instructions, background information, or reminders…"
              className="resize-none min-h-[100px]"
              rows={4}
              {...register("notes")}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400">
              Fields marked <span className="text-red-400 font-medium">*</span> are required
            </p>
            <div className="flex items-center gap-3">
              <Link href="/matters">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2 min-w-[130px]"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <><FileText className="h-4 w-4" /> Create Matter</>
                )}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
