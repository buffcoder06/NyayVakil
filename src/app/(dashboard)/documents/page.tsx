"use client";

import { useEffect, useState, useMemo } from "react";
import type { Document, Matter } from "@/types";
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
  FileText,
  Image,
  File,
  Plus,
  Search,
  Upload,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const docCategoryLabel: Record<string, string> = {
  vakalatnama: "Vakalatnama",
  affidavit: "Affidavit",
  notice: "Notice",
  petition: "Petition",
  written_statement: "Written Statement",
  evidence: "Evidence",
  receipt: "Receipt",
  invoice: "Invoice",
  id_proof: "ID Proof",
  court_order: "Court Order",
  miscellaneous: "Miscellaneous",
};

const docCategoryColor: Record<string, string> = {
  vakalatnama: "bg-blue-100 text-blue-700",
  affidavit: "bg-indigo-100 text-indigo-700",
  notice: "bg-amber-100 text-amber-700",
  petition: "bg-violet-100 text-violet-700",
  written_statement: "bg-slate-100 text-slate-700",
  evidence: "bg-orange-100 text-orange-700",
  receipt: "bg-green-100 text-green-700",
  invoice: "bg-emerald-100 text-emerald-700",
  id_proof: "bg-cyan-100 text-cyan-700",
  court_order: "bg-red-100 text-red-700",
  miscellaneous: "bg-gray-100 text-gray-600",
};

function fileIcon(fileType: string) {
  const t = fileType.toLowerCase();
  if (t.includes("pdf") || t.includes("doc") || t.includes("word")) return FileText;
  if (t.includes("jpg") || t.includes("jpeg") || t.includes("png") || t.includes("image")) return Image;
  return File;
}

function DocumentCard({ doc, matterTitle }: { doc: Document; matterTitle: string }) {
  const Icon = fileIcon(doc.fileType);
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300 group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#1e3a5f]/10 transition-colors">
            <Icon className="h-5 w-5 text-slate-500 group-hover:text-[#1e3a5f] transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{doc.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={cn("text-xs", docCategoryColor[doc.category])}>
                {docCategoryLabel[doc.category] || doc.category}
              </Badge>
              <span className="text-xs text-slate-400">{doc.fileType}</span>
              <span className="text-xs text-slate-400">{doc.fileSize}</span>
            </div>
            {matterTitle !== "—" && (
              <p className="text-xs text-slate-500 mt-1 truncate">{matterTitle}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">
                {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })} · {doc.uploadedBy}
              </p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => { e.stopPropagation(); toast.info("Document viewer — coming soon."); }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => { e.stopPropagation(); toast.info("Download feature — coming soon."); }}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadDocumentDialog({
  open,
  onOpenChange,
  matters,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  matters: Matter[];
  onSuccess: (doc: Document) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("miscellaneous");
  const [matterId, setMatterId] = useState("none");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !category) {
      toast.error("Please fill in required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          matterId: matterId !== "none" ? matterId : undefined,
          clientId: matters.find((m) => m.id === matterId)?.clientId,
          description: description || undefined,
          fileType: "PDF",
          fileSize: "—",
          uploadedBy: "default-user",
        }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.message);
      onSuccess(res.data);
      toast.success("Document record added.");
      onOpenChange(false);
      setName(""); setCategory("miscellaneous"); setMatterId("none"); setDescription("");
    } catch {
      toast.error("Failed to add document.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Upload placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
            <p className="text-xs text-amber-600 mt-2 font-medium">
              (File upload coming in next release — enter document details below)
            </p>
          </div>
          <div>
            <Label>Document Name *</Label>
            <Input className="mt-1" placeholder="e.g. Vakalatnama - Agarwal Matter" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={(v) => v !== null && setCategory(v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(docCategoryLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
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
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1 resize-none" rows={2} placeholder="Optional description…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-[#1e3a5f] hover:bg-[#162d4a] gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [matterFilter, setMatterFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, mRes] = await Promise.all([
          fetch("/api/documents").then((r) => r.json()),
          fetch("/api/matters?pageSize=200").then((r) => r.json()),
        ]);
        setDocuments(dRes.data ?? []);
        setMatters(mRes.data?.data ?? []);
      } catch {
        toast.error("Failed to load documents.");
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
    return documents.filter((d) => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || d.category === categoryFilter;
      const matchMatter = matterFilter === "all" || d.matterId === matterFilter;
      return matchSearch && matchCategory && matchMatter;
    });
  }, [documents, search, categoryFilter, matterFilter]);

  const stats = useMemo(() => ({
    total: documents.length,
    vakalatnama: documents.filter((d) => d.category === "vakalatnama").length,
    court_order: documents.filter((d) => d.category === "court_order").length,
    other: documents.filter((d) => !["vakalatnama", "court_order"].includes(d.category)).length,
  }), [documents]);

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Organize and manage all legal documents securely."
        actions={
          <Button onClick={() => setUploadOpen(true)} className="gap-2 bg-[#1e3a5f] hover:bg-[#162d4a]">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-slate-50">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total Documents</p>
          </div>
          <div className="rounded-xl border p-4 bg-blue-50">
            <p className="text-2xl font-bold text-blue-800">{stats.vakalatnama}</p>
            <p className="text-xs text-blue-600 mt-1">Vakalatnamas</p>
          </div>
          <div className="rounded-xl border p-4 bg-red-50">
            <p className="text-2xl font-bold text-red-800">{stats.court_order}</p>
            <p className="text-xs text-red-600 mt-1">Court Orders</p>
          </div>
          <div className="rounded-xl border p-4 bg-violet-50">
            <p className="text-2xl font-bold text-violet-800">{stats.other}</p>
            <p className="text-xs text-violet-600 mt-1">Other Documents</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => v !== null && setCategoryFilter(v)}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(docCategoryLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <FileText className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-base font-medium">No documents found</p>
          <p className="text-sm mt-1">Upload your first document to get started.</p>
          <Button size="sm" className="mt-4 bg-[#1e3a5f] hover:bg-[#162d4a] gap-2" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">Showing {filtered.length} documents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                matterTitle={doc.matterId ? matterMap[doc.matterId] || "—" : "—"}
              />
            ))}
          </div>
        </>
      )}

      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        matters={matters}
        onSuccess={(doc) => setDocuments((prev) => [doc, ...prev])}
      />
    </div>
  );
}
