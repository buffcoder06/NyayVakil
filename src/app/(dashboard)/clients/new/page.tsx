"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  alternateMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  clientType: z.enum(["individual", "company", "family", "organization"]),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function NewClientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientType: "individual" },
  });

  const clientType = watch("clientType");
  const state = watch("state");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
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
          isActive: true,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success("Client added successfully.");
      router.push("/clients");
    } catch {
      toast.error("Failed to add client. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>

      <PageHeader
        title="Add New Client"
        description="Enter client details to create a new client record."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {/* Personal / Basic Info */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-700">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Ramesh Kumar Agarwal"
                className="mt-1"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="clientType">Client Type *</Label>
              <Select
                value={clientType}
                onValueChange={(v) =>
                  v !== null && setValue("clientType", v as FormData["clientType"])
                }
              >
                <SelectTrigger id="clientType" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
              <FieldError message={errors.clientType?.message} />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md">
                  +91
                </span>
                <Input
                  id="mobile"
                  placeholder="98XXXXXXXX"
                  className="rounded-l-none"
                  maxLength={10}
                  {...register("mobile")}
                />
              </div>
              <FieldError message={errors.mobile?.message} />
            </div>

            <div>
              <Label htmlFor="alternateMobile">Alternate Mobile</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md">
                  +91
                </span>
                <Input
                  id="alternateMobile"
                  placeholder="98XXXXXXXX"
                  className="rounded-l-none"
                  maxLength={10}
                  {...register("alternateMobile")}
                />
              </div>
              <FieldError message={errors.alternateMobile?.message} />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                className="mt-1"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-700">Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                placeholder="House/Flat No., Street, Area"
                className="mt-1 resize-none"
                rows={2}
                {...register("address")}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g. Mumbai"
                className="mt-1"
                {...register("city")}
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select
                value={state || ""}
                onValueChange={(v) => v !== null && setValue("state", v)}
              >
                <SelectTrigger id="state" className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="400001"
                maxLength={6}
                className="mt-1"
                {...register("pincode")}
              />
              <FieldError message={errors.pincode?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-700">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any important notes about this client (not visible to client)…"
              className="mt-1 resize-none"
              rows={3}
              {...register("notes")}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Adding Client…" : "Add Client"}
          </Button>
          <Link href="/clients">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
