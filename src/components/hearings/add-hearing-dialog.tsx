"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/http";
import type { Hearing, Matter, TeamMember } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const HEARING_PURPOSES = [
  "Arguments",
  "Evidence",
  "Final Arguments",
  "Framing of Issues",
  "Judgment",
  "Mention",
  "Orders",
  "Return",
  "Service",
  "Written Statement",
  "Other",
];

interface AddHearingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matters: Matter[];
  prefillMatterId?: string;
  prefillDate?: string;
  onSuccess?: (hearing: Hearing) => void;
}

export function AddHearingDialog({
  open,
  onOpenChange,
  matters,
  prefillMatterId,
  prefillDate,
  onSuccess,
}: AddHearingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [matterId, setMatterId] = useState(prefillMatterId ?? "");
  const [courtName, setCourtName] = useState("");
  const [date, setDate] = useState(prefillDate ?? "");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!open) return;
    apiFetch<TeamMember[]>("/api/team")
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]));
  }, [open]);

  const selectedMatter = matters.find((m) => m.id === matterId);
  const filteredMatters = matters.filter(
    (m) =>
      m.matterTitle.toLowerCase().includes(search.toLowerCase()) ||
      m.caseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const reset = () => {
    setMatterId(prefillMatterId ?? "");
    setCourtName("");
    setDate(prefillDate ?? "");
    setTime("");
    setPurpose("");
    setAssignedTo("");
    setNotes("");
    setSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matterId || !date) {
      toast.error("Matter and date are required.");
      return;
    }
    const matter = matters.find((m) => m.id === matterId);
    if (!matter) {
      toast.error("Please select a valid matter.");
      return;
    }

    setLoading(true);
    try {
      const hearing = await apiFetch<Hearing>("/api/hearings", {
        method: "POST",
        body: {
          matterId,
          // Only store a court when it differs from the matter's own court
          courtName: courtName && courtName !== matter.courtName ? courtName : undefined,
          date,
          time,
          purpose,
          assignedToId: assignedTo || undefined,
          notes,
        },
      });
      toast.success("Hearing scheduled successfully.");
      onSuccess?.(hearing);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule hearing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Hearing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Matter select */}
          <div className="space-y-1.5">
            <Label htmlFor="matter-search">Matter *</Label>
            {!matterId ? (
              <div className="space-y-1.5">
                <Input
                  id="matter-search"
                  placeholder="Search matter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <div className="max-h-40 overflow-y-auto rounded-md border bg-white dark:bg-slate-800 shadow-sm">
                    {filteredMatters.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-slate-500">No matters found.</p>
                    ) : (
                      filteredMatters.slice(0, 8).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => {
                            setMatterId(m.id);
                            setCourtName(m.courtName);
                            setSearch("");
                          }}
                        >
                          <span className="font-medium">{m.matterTitle}</span>
                          {m.caseNumber && (
                            <span className="ml-2 text-xs text-slate-500">({m.caseNumber})</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-slate-50 dark:bg-slate-800">
                <span className="text-sm flex-1 font-medium">{selectedMatter?.matterTitle}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setMatterId("")}
                >
                  Change
                </Button>
              </div>
            )}
          </div>

          {/* Court name */}
          <div className="space-y-1.5">
            <Label htmlFor="court">Court Name</Label>
            <Input
              id="court"
              placeholder="e.g. Bombay High Court"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Select value={purpose} onValueChange={(v) => v !== null && setPurpose(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose..." />
              </SelectTrigger>
              <SelectContent>
                {HEARING_PURPOSES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned to */}
          <div className="space-y-1.5">
            <Label>Assigned Person</Label>
            <Select value={assignedTo} onValueChange={(v) => v !== null && setAssignedTo(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select person..." />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Hearing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
