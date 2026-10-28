"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Building2,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { CloudinaryUploader, type UploadedAsset } from "@/components/admin/cloudinary-uploader";
import { Empty, PageHeader, Toast, ui } from "@/components/admin/ui";
import type { ClientLogo } from "@/data/clients";

export function ClientLogosManager() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  const fetchLogos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/clients", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load client logos");
      setLogos(data.items || []);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Error fetching client logos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogos();
  }, [fetchLogos]);

  // When an image is uploaded to Cloudinary, directly save the secure_url to client_logos table!
  const handleUploaded = async (asset: UploadedAsset) => {
    try {
      setSaving(true);
      setNotice("Saving logo to database…");
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo_url: asset.secure_url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save logo");

      setNotice("Logo uploaded and added successfully!");
      await fetchLogos();
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to save uploaded logo");
    } finally {
      setSaving(false);
    }
  };

  // Alternative manual URL add
  const handleManualAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo_url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add logo");

      setNotice("Logo URL added successfully!");
      setUrlInput("");
      setShowUrlField(false);
      await fetchLogos();
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to add logo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this client logo?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/clients?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setNotice("Client logo deleted.");
      await fetchLogos();
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Logos"
        count={logos.length}
      />

      <Toast message={notice} />

      {/* Direct Logo Upload Section */}
      <div className={`${ui.card} p-6 sm:p-7 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-navy flex items-center gap-2">
              <Upload size={18} className="text-orange" />
              Upload Client Logo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an image to upload directly to Cloudinary. It will instantly appear in the homepage infinite auto-scroll carousel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            className="text-xs font-semibold text-slate-500 hover:text-orange transition-colors"
          >
            {showUrlField ? "Hide URL Input" : "Or paste image URL"}
          </button>
        </div>

        {/* Cloudinary Direct Uploader */}
        <div className="max-w-xl mx-auto">
          <CloudinaryUploader onUploaded={handleUploaded} />
        </div>

        {/* Optional Manual URL Input */}
        {showUrlField && (
          <form onSubmit={handleManualAddUrl} className="pt-3 max-w-xl mx-auto flex items-center gap-2">
            <input
              type="url"
              required
              placeholder="https://example.com/logo.png"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className={ui.input}
            />
            <button
              type="submit"
              disabled={saving || !urlInput.trim()}
              className={`${ui.btnPrimary} shrink-0 mt-1.5`}
            >
              Add
            </button>
          </form>
        )}
      </div>

      {/* Current Logos Grid */}
      <div className={ui.card}>
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-navy">
            Current Client Logos ({logos.length})
          </div>
          <div className="text-xs text-slate-400">
            Loops continuously in the homepage carousel
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
            <LoaderCircle size={24} className="animate-spin text-orange" />
            Loading client logos…
          </div>
        ) : logos.length === 0 ? (
          <div className="p-10">
            <Empty>
              <div className="text-center space-y-1">
                <p>No client logos uploaded yet.</p>
                <p className="text-xs text-slate-400">Upload your first client logo using the box above.</p>
              </div>
            </Empty>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {logos.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative rounded-xl border border-slate-200 bg-white p-3 flex flex-col items-center justify-center shadow-xs transition hover:border-orange hover:shadow-md"
              >
                {/* Delete button on hover / top-right */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  title="Delete logo"
                  className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                >
                  {deletingId === item.id ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>

                {/* Logo Image Preview on White Card */}
                <div className="h-20 w-full flex items-center justify-center p-2">
                  {item.logo_url ? (
                    <Image
                      src={item.logo_url}
                      alt="Client logo"
                      width={140}
                      height={50}
                      className="max-h-14 w-auto object-contain"
                      unoptimized={item.logo_url.startsWith("http")}
                    />
                  ) : (
                    <Building2 size={24} className="text-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
