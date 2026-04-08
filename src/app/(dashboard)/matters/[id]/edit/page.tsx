"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Matter, Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CASE_TYPES = ["Civil", "Criminal", "Family", "Consumer", "Property", "Recovery", "Labour", "Cheque Bounce", "Arbitration", "Corporate"];
const COURTS = ["District Court", "Bombay High Court", "Delhi High Court", "Madras High Court", "Calcutta High Court", "Supreme Court of India", "Family Court", "Consumer Court", "Sessions Court", "Magistrate Court", "Labour Court", "Tribunal", "Other"];

const schema = z.object({
  matterTitle: z.string().min(3, "Required"),
  clientId: z.string().min(1, "Required"),
  caseType: z.string().min(1, "Required"),
  courtName: z.string().min(1, "Required"),
  courtLevel: z.string().min(1),
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
  totalFeeAgreed: z.number().min(0),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function EditMatterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const clientId = watch("clientId");
  const caseType = watch("caseType");
  const courtName = watch("courtName");
  const courtLevel = watch("courtLevel");
  const status = watch("status");
  const priority = watch("priority");

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          fetch(`/api/matters/${id}`).then((r) => r.json()),
          fetch("/api/clients?pageSize=200").then((r) => r.json()),
        ]);
        if (!mRes.success) throw new Error(mRes.message);
        const m = mRes.data;
        setClients(cRes.data?.data ?? []);
        reset({
          matterTitle: m.matterTitle,
          clientId: m.clientId,
          caseType: m.caseType,
          courtName: m.courtName,
          courtLevel: m.courtLevel,
          status: m.status,
          priority: m.priority,
          caseNumber: m.caseNumber || "",
          cnrNumber: m.cnrNumber || "",
          caseStage: m.caseStage || "",
          filingDate: m.filingDate || "",
          nextHearingDate: m.nextHearingDate || "",
          judgeName: m.judgeName || "",
          oppositeParty: m.oppositeParty || "",
          oppositeAdvocate: m.oppositeAdvocate || "",
          advocateOnRecord: m.advocateOnRecord || "",
          actSection: m.actSection || "",
          policeStation: m.policeStation || "",
          totalFeeAgreed: m.totalFeeAgreed,
          notes: m.notes || "",
        });
      } catch {
        toast.error("Failed to load matter.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/matters/${id}`, {
        method: "PUT",
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
          totalFeeAgreed: data.totalFeeAgreed,
          notes: data.notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      toast.success("Matter updated successfully.");
      router.push(`/matters/${id}`);
    } catch {
      toast.error("Failed to update matter.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="space-y-4 max-w-4xl"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <div>
      <div className="mb-4">
        <Link href={`/matters/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Matter
        </Link>
      </div>

      <PageHeader title="Edit Matter" description="Update case details." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Matter Title *</Label>
              <Input className="mt-1" {...register("matterTitle")} />
              <FieldError message={errors.matterTitle?.message} />
            </div>
            <div>
              <Label>Client *</Label>
              <Select value={clientId} onValueChange={(v) => v !== null && setValue("clientId", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <FieldError message={errors.clientId?.message} />
            </div>
            <div>
              <Label>Case Type *</Label>
              <Select value={caseType} onValueChange={(v) => v !== null && setValue("caseType", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{CASE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v !== null && setValue("status", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => v !== null && setValue("priority", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Case Number</Label><Input className="mt-1" {...register("caseNumber")} /></div>
            <div><Label>CNR Number</Label><Input className="mt-1" {...register("cnrNumber")} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Court Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Court Name *</Label>
              <Select value={courtName} onValueChange={(v) => v !== null && setValue("courtName", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{COURTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Court Level *</Label>
              <Select value={courtLevel} onValueChange={(v) => v !== null && setValue("courtLevel", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="district_court">District Court</SelectItem>
                  <SelectItem value="high_court">High Court</SelectItem>
                  <SelectItem value="supreme_court">Supreme Court</SelectItem>
                  <SelectItem value="sessions_court">Sessions Court</SelectItem>
                  <SelectItem value="magistrate_court">Magistrate Court</SelectItem>
                  <SelectItem value="family_court">Family Court</SelectItem>
                  <SelectItem value="consumer_court">Consumer Court</SelectItem>
                  <SelectItem value="tribunal">Tribunal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Case Stage</Label><Input className="mt-1" {...register("caseStage")} /></div>
            <div><Label>Judge Name</Label><Input className="mt-1" {...register("judgeName")} /></div>
            <div><Label>Filing Date</Label><Input type="date" className="mt-1" {...register("filingDate")} /></div>
            <div><Label>Next Hearing Date</Label><Input type="date" className="mt-1" {...register("nextHearingDate")} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Parties & Legal</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Opposite Party</Label><Input className="mt-1" {...register("oppositeParty")} /></div>
            <div><Label>Opposite Advocate</Label><Input className="mt-1" {...register("oppositeAdvocate")} /></div>
            <div><Label>Advocate on Record</Label><Input className="mt-1" {...register("advocateOnRecord")} /></div>
            <div><Label>Act / Section</Label><Input className="mt-1" {...register("actSection")} /></div>
            <div><Label>Police Station</Label><Input className="mt-1" {...register("policeStation")} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Financial</CardTitle></CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label>Total Fee Agreed (₹)</Label>
              <Input type="number" min={0} className="mt-1" {...register("totalFeeAgreed", { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Notes</CardTitle></CardHeader>
          <CardContent>
            <Textarea className="resize-none" rows={4} {...register("notes")} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving…" : "Save Changes"}
          </Button>
          <Link href={`/matters/${id}`}><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
