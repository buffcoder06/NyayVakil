"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/http";
import type { OfficeSettings, TeamMember } from "@/types";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  Gavel,
  Bell,
  Save,
  Upload,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const MOCK_COURTS = [
  "District Court, Mumbai", "Bombay High Court", "Family Court, Mumbai",
  "Consumer Court, Mumbai", "Sessions Court, Mumbai", "Magistrate Court (32nd), Mumbai",
  "Labour Court, Mumbai",
];

const MOCK_CASE_TYPES = [
  "Civil", "Criminal", "Family", "Consumer", "Property",
  "Recovery", "Labour", "Cheque Bounce", "Arbitration", "Corporate",
];

const MOCK_TEMPLATES = [
  { id: "t1", name: "Hearing Reminder", type: "hearing", template: "Dear [Client], your next hearing in case [Matter] is scheduled on [Date] at [Court]." },
  { id: "t2", name: "Payment Reminder", type: "payment", template: "Dear [Client], your professional fee of ₹[Amount] is pending. Kindly make the payment at your earliest." },
  { id: "t3", name: "Document Request", type: "document", template: "Dear [Client], please share the following documents: [Documents] for your case [Matter]." },
  { id: "t4", name: "Follow-up", type: "follow_up", template: "Dear [Client], following up on case [Matter]. Please contact us to discuss the current status." },
  { id: "t5", name: "Case Update", type: "general", template: "Dear [Client], we would like to update you on the status of your case [Matter]." },
];

const roleColor: Record<string, string> = {
  advocate: "bg-[#14213D] text-white",
  junior: "bg-blue-100 text-blue-800",
  clerk: "bg-teal-100 text-teal-800",
  admin: "bg-slate-100 text-slate-700",
};

const roleLabel: Record<string, string> = {
  advocate: "Advocate",
  junior: "Junior Advocate",
  clerk: "Clerk",
  admin: "Admin",
};

const EMPTY_OFFICE: OfficeSettings = {
  officeName: "", advocateName: "", barCouncilNumber: "", address: "", city: "", state: "",
  phone: "", email: "", website: "", gstin: "", panNumber: "",
};

function OfficeProfileTab() {
  const [office, setOffice] = useState<OfficeSettings>(EMPTY_OFFICE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<OfficeSettings>("/api/settings/office")
      .then((data) => setOffice({ ...EMPTY_OFFICE, ...data }))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load office profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await apiFetch<OfficeSettings>("/api/settings/office", { method: "PUT", body: office });
      setOffice({ ...EMPTY_OFFICE, ...saved });
      toast.success("Office profile saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save office profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Logo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-600">Office Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-[#14213D]/10 flex items-center justify-center border-2 border-dashed border-[#14213D]/30">
              <Building2 className="h-8 w-8 text-[#14213D]/50" />
            </div>
            <div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Logo upload — coming soon.")}>
                <Upload className="h-4 w-4" /> Upload Logo
              </Button>
              <p className="text-xs text-slate-400 mt-1.5">PNG, JPG up to 2MB. Appears on invoices.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-600">Office / Chamber Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Office / Chamber Name</Label>
              <Input className="mt-1" value={office.officeName} onChange={(e) => setOffice({ ...office, officeName: e.target.value })} />
            </div>
            <div>
              <Label>Advocate Name</Label>
              <Input className="mt-1" value={office.advocateName} onChange={(e) => setOffice({ ...office, advocateName: e.target.value })} />
            </div>
            <div>
              <Label>Bar Council Number</Label>
              <Input className="mt-1" value={office.barCouncilNumber} onChange={(e) => setOffice({ ...office, barCouncilNumber: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1" value={office.phone} onChange={(e) => setOffice({ ...office, phone: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" className="mt-1" value={office.email} onChange={(e) => setOffice({ ...office, email: e.target.value })} />
            </div>
            <div>
              <Label>Website</Label>
              <Input className="mt-1" value={office.website} onChange={(e) => setOffice({ ...office, website: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <Textarea className="mt-1 resize-none" rows={2} value={office.address} onChange={(e) => setOffice({ ...office, address: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-1" value={office.city} onChange={(e) => setOffice({ ...office, city: e.target.value })} />
            </div>
            <div>
              <Label>State</Label>
              <Input className="mt-1" value={office.state} onChange={(e) => setOffice({ ...office, state: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-600">Tax & Legal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>GSTIN</Label>
            <Input className="mt-1" value={office.gstin} onChange={(e) => setOffice({ ...office, gstin: e.target.value })} />
          </div>
          <div>
            <Label>PAN Number</Label>
            <Input className="mt-1" value={office.panNumber} onChange={(e) => setOffice({ ...office, panNumber: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#14213D] hover:bg-[#0E182E] gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving…" : "Save Changes"}
      </Button>
    </div>
  );
}

function TeamTab() {
  const [team, setTeam] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    apiFetch<TeamMember[]>("/api/team")
      .then(setTeam)
      .catch(() => setTeam([]));
  }, []);

  if (!team) return <PageSkeleton />;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{team.length} team member{team.length === 1 ? "" : "s"}</p>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info("Invite member — coming soon.")}>
          <Plus className="h-4 w-4" /> Invite Member
        </Button>
      </div>
      {team.map((member) => {
        const initials = member.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
        return (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className={roleColor[member.role] + " text-sm font-semibold"}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{member.name}</span>
                    <Badge className={roleColor[member.role] + " text-xs px-1.5 py-0"}>
                      {roleLabel[member.role]}
                    </Badge>
                    {!member.isActive && (
                      <Badge variant="outline" className="text-xs text-slate-400">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{member.email} · +91 {member.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CourtsAndCasesTab() {
  const [courts, setCourts] = useState(MOCK_COURTS);
  const [caseTypes, setCaseTypes] = useState(MOCK_CASE_TYPES);
  const [newCourt, setNewCourt] = useState("");
  const [newCaseType, setNewCaseType] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      {/* Courts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Courts</h3>
        </div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {courts.map((court, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{court}</span>
                <button
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  onClick={() => setCourts((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <Input
                placeholder="Add court name…"
                className="text-sm"
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCourt.trim()) {
                    setCourts((prev) => [...prev, newCourt.trim()]);
                    setNewCourt("");
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newCourt.trim()) {
                    setCourts((prev) => [...prev, newCourt.trim()]);
                    setNewCourt("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Case Types</h3>
        </div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {caseTypes.map((type, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{type}</span>
                <button
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  onClick={() => setCaseTypes((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <Input
                placeholder="Add case type…"
                className="text-sm"
                value={newCaseType}
                onChange={(e) => setNewCaseType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCaseType.trim()) {
                    setCaseTypes((prev) => [...prev, newCaseType.trim()]);
                    setNewCaseType("");
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newCaseType.trim()) {
                    setCaseTypes((prev) => [...prev, newCaseType.trim()]);
                    setNewCaseType("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RemindersTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{MOCK_TEMPLATES.length} templates</p>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info("Add template — coming soon.")}>
          <Plus className="h-4 w-4" /> Add Template
        </Button>
      </div>
      {MOCK_TEMPLATES.map((t) => (
        <Card key={t.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-slate-900">{t.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">{t.type.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{t.template}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-xs text-slate-500 shrink-0" onClick={() => toast.info("Edit template — coming soon.")}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Office Settings"
        description="Configure your practice preferences and workspace."
      />

      <Tabs defaultValue="office">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="office" className="gap-1.5">
            <Building2 className="h-4 w-4" /> Office Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="courts" className="gap-1.5">
            <Gavel className="h-4 w-4" /> Courts & Cases
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-1.5">
            <Bell className="h-4 w-4" /> Reminders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="office"><OfficeProfileTab /></TabsContent>
        <TabsContent value="team"><TeamTab /></TabsContent>
        <TabsContent value="courts"><CourtsAndCasesTab /></TabsContent>
        <TabsContent value="reminders"><RemindersTab /></TabsContent>
      </Tabs>
    </div>
  );
}
