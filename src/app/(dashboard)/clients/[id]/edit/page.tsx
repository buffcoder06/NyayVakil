"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Other",
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  alternateMobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  clientType: z.enum(["individual", "company", "family", "organization"]),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "6 digits required").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const clientType = watch("clientType");
  const state = watch("state");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/clients/${id}`).then((r) => r.json());
        if (!res.success) throw new Error(res.message);
        const c = res.data;
        setClient(c);
        reset({
          name: c.name,
          mobile: c.mobile,
          alternateMobile: c.alternateMobile || "",
          email: c.email || "",
          clientType: c.clientType,
          address: c.address || "",
          city: c.city || "",
          state: c.state || "",
          pincode: c.pincode || "",
          notes: c.notes || "",
        });
      } catch {
        toast.error("Failed to load client.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          mobile: data.mobile,
          alternateMobile: data.alternateMobile || undefined,
          email: data.email || undefined,
          clientType: data.clientType,
          address: data.address || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          pincode: data.pincode || undefined,
          notes: data.notes || undefined,
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      toast.success("Client updated successfully.");
      router.push(`/clients/${id}`);
    } catch {
      toast.error("Failed to update client.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Client not found.</p>
        <Link href="/clients"><Button variant="outline" size="sm" className="mt-4">Back to Clients</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href={`/clients/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Client
        </Link>
      </div>

      <PageHeader title={`Edit: ${client.name}`} description="Update client information." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Full Name *</Label>
              <Input placeholder="Full name" className="mt-1" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label>Client Type *</Label>
              <Select value={clientType} onValueChange={(v) => v !== null && setValue("clientType", v as FormData["clientType"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mobile Number *</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md">+91</span>
                <Input placeholder="98XXXXXXXX" className="rounded-l-none" maxLength={10} {...register("mobile")} />
              </div>
              <FieldError message={errors.mobile?.message} />
            </div>
            <div>
              <Label>Alternate Mobile</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md">+91</span>
                <Input placeholder="98XXXXXXXX" className="rounded-l-none" maxLength={10} {...register("alternateMobile")} />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="client@example.com" className="mt-1" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Address</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Street Address</Label>
              <Textarea placeholder="House/Flat No., Street, Area" className="mt-1 resize-none" rows={2} {...register("address")} />
            </div>
            <div>
              <Label>City</Label>
              <Input placeholder="e.g. Mumbai" className="mt-1" {...register("city")} />
            </div>
            <div>
              <Label>State</Label>
              <Select value={state || ""} onValueChange={(v) => v !== null && setValue("state", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pincode</Label>
              <Input placeholder="400001" maxLength={6} className="mt-1" {...register("pincode")} />
              <FieldError message={errors.pincode?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="text-base text-slate-700">Notes</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Internal notes…" className="resize-none" rows={3} {...register("notes")} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving…" : "Save Changes"}
          </Button>
          <Link href={`/clients/${id}`}><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
