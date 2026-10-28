"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  ExternalLink,
  Eye,
  Globe2,
  Image as ImageIcon,
  Layers3,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { defaultAboutSettings, type AboutSettings } from "@/data/about";

function CircularProgress({
  percent,
  size = 56,
  strokeWidth = 4.5,
  label,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.max(0, Math.min(100, percent)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative inline-flex items-center justify-center rounded-full bg-white shadow-lg p-1"
        style={{ width: size, height: size }}
      >
        <svg className="-rotate-90 transform" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="#ffffff" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#fed7aa"
            strokeWidth={strokeWidth}
            className="opacity-60"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f46a16"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-200 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-black tracking-tight text-slate-900 select-none">
            {percent}
            <span className="text-[10px] font-bold text-[#f46a16]">%</span>
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-md border border-slate-200/80 backdrop-blur-xs animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

function uploadWithProgress<T = unknown>(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          onProgress(100);
          resolve(data as T);
        } catch {
          reject(new Error("Invalid response from upload server."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || err.message || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network connection error during upload."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Please try again."));

    xhr.send(formData);
  });
}

type ToastItem = {
  id: string;
  type: "error" | "success" | "info" | "warning";
  title: string;
  message: string;
};

export function AboutPageManager() {
  const [values, setValues] = useState<AboutSettings>(defaultAboutSettings);
  const [busy, setBusy] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [newStrength, setNewStrength] = useState("");

  // Hero image upload state
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroDeleting, setHeroDeleting] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);

  // Story image upload state
  const storyImageInputRef = useRef<HTMLInputElement>(null);
  const [storyUploading, setStoryUploading] = useState(false);
  const [storyDeleting, setStoryDeleting] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    void fetch("/api/admin/about-settings", { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && body.value) {
          setValues((prev) => ({
            ...prev,
            ...body.value,
            strengths: Array.isArray(body.value.strengths) && body.value.strengths.length > 0
              ? body.value.strengths
              : prev.strengths,
          }));
        }
      })
      .catch(() => { });
  }, []);

  const handleChange = <K extends keyof AboutSettings>(key: K, val: AboutSettings[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSavedSuccess(false);
  };

  const handleImageUpload = async (
    file: File | undefined,
    slotKey: "heroImage" | "storyImage",
    slotLabel: string
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please choose a valid image file (JPEG, PNG, WebP, AVIF).",
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: `Image size is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed is 8 MB.`,
      });
      return;
    }

    const isHero = slotKey === "heroImage";
    if (isHero) {
      setHeroUploading(true);
      setHeroProgress(10);
    } else {
      setStoryUploading(true);
      setStoryProgress(10);
    }

    const previousUrl = values[slotKey];

    try {
      const sigRes = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resourceType: "image",
          fileName: file.name,
          mimeType: file.type,
          bytes: file.size,
        }),
      });
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig.error || "Upload signature failed.");

      if (isHero) setHeroProgress(25);
      else setStoryProgress(25);

      const form = new FormData();
      Object.entries({
        api_key: sig.apiKey,
        timestamp: String(sig.timestamp),
        signature: sig.signature,
        folder: sig.folder,
        public_id: sig.publicId,
        overwrite: "false",
      }).forEach(([k, v]) => form.set(k, v));
      form.set("file", file);

      const cloud = await uploadWithProgress<{ secure_url: string; public_id: string }>(
        sig.uploadUrl,
        form,
        (percent) => {
          const mapped = Math.round(25 + percent * 0.74);
          if (isHero) setHeroProgress(mapped);
          else setStoryProgress(mapped);
        }
      );

      if (isHero) setHeroProgress(100);
      else setStoryProgress(100);

      handleChange(slotKey, cloud.secure_url);

      showToast({
        type: "success",
        title: `${slotLabel} Uploaded`,
        message: "New image uploaded successfully to Cloudinary.",
      });

      if (previousUrl && previousUrl !== cloud.secure_url) {
        void fetch("/api/admin/cloudinary-delete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: previousUrl, resourceType: "image" }),
        }).catch(() => { });
      }

      void fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          public_id: cloud.public_id,
          secure_url: cloud.secure_url,
          resource_type: "image",
          alt_text: `${slotLabel} - Meridian About Us`,
        }),
      }).catch(() => { });
    } catch (err) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: err instanceof Error ? err.message : "Failed to upload image.",
      });
    } finally {
      setTimeout(() => {
        if (isHero) {
          setHeroUploading(false);
          setHeroProgress(0);
        } else {
          setStoryUploading(false);
          setStoryProgress(0);
        }
      }, 500);
    }
  };

  const handleRemoveImage = async (
    slotKey: "heroImage" | "storyImage",
    slotLabel: string
  ) => {
    const currentUrl = values[slotKey];
    if (!currentUrl) return;

    const isHero = slotKey === "heroImage";
    if (isHero) setHeroDeleting(true);
    else setStoryDeleting(true);

    try {
      await fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: currentUrl, resourceType: "image" }),
      });
      handleChange(slotKey, "");
      showToast({
        type: "success",
        title: `${slotLabel} Removed`,
        message: "Image removed from settings.",
      });
    } catch {
      handleChange(slotKey, "");
      showToast({
        type: "warning",
        title: `${slotLabel} Cleared`,
        message: "Image reference was cleared.",
      });
    } finally {
      if (isHero) setHeroDeleting(false);
      else setStoryDeleting(false);
    }
  };

  const handleAddStrength = () => {
    const trimmed = newStrength.trim();
    if (!trimmed) return;
    if (values.strengths.includes(trimmed)) {
      showToast({ type: "info", title: "Item Exists", message: "This strength is already listed." });
      return;
    }
    handleChange("strengths", [...values.strengths, trimmed]);
    setNewStrength("");
  };

  const handleRemoveStrength = (index: number) => {
    handleChange(
      "strengths",
      values.strengths.filter((_, i) => i !== index)
    );
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBusy(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/about-settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to save settings");
      setSavedSuccess(true);
      showToast({
        type: "success",
        title: "About Settings Saved",
        message: "Your changes to the About Us page have been published live.",
      });
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      showToast({
        type: "error",
        title: "Save Failed",
        message: err instanceof Error ? err.message : "Could not save about settings.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all About Us content back to default corporate values?")) {
      setValues(defaultAboutSettings);
      showToast({
        type: "info",
        title: "Defaults Restored",
        message: "Click Save Changes to commit these defaults.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Stack */}
      <aside aria-label="Notifications" className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${toast.type === "error"
                ? "border-rose-200/90 bg-white/95 text-slate-900 shadow-rose-500/15"
                : "border-emerald-200/90 bg-white/95 text-slate-900 shadow-emerald-500/15"
              }`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${toast.type === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                }`}
            >
              {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </span>
            <div className="flex-1 min-w-0 pr-1">
              <strong className="block text-xs font-bold text-slate-900">{toast.title}</strong>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </aside>

      {/* Top Banner Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#03172a] p-6 text-white sm:p-8 shadow-sm">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(244,106,22,.28),transparent_55%),radial-gradient(ellipse_at_0%_100%,#0d3454,transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f46a16]">ABOUT US CMS</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">Dedicated Page & Story</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">About Us Content & Media</h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Manage headlines, company story, performance statistics, mission & vision, and imagery for the About Us page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-900/90"
            >
              <ExternalLink size={15} />
              View Live About Page
            </Link>

            <button
              onClick={handleResetDefaults}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
              title="Reset to corporate defaults"
            >
              <RotateCcw size={14} />
              Defaults
            </button>

            <button
              onClick={() => void handleSave()}
              disabled={busy}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f46a16] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#d95108] disabled:opacity-60"
            >
              {busy ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Saving…
                </>
              ) : savedSuccess ? (
                <>
                  <Check size={16} />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange/10 text-[#f46a16]">
                <Building2 size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dedicated About Page</h3>
                <p className="text-[11px] text-slate-500">Live at /about</p>
              </div>
            </div>
            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f46a16] hover:underline"
            >
              Open Page <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <Sparkles size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Homepage About Section</h3>
                <p className="text-[11px] text-slate-500">Managed via Homepage CMS</p>
              </div>
            </div>
            <Link
              href="/admin/site-copy"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#f46a16]"
            >
              Manage in Homepage CMS <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* FORM SECTIONS */}
      <div className="space-y-6">

        {/* 1. PAGE HERO SECTION */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 01</span>
              <h2 className="text-base font-bold text-slate-900">About Page Hero Header</h2>
              <p className="text-xs text-slate-500">
                The high-impact headline, sub-headline, and backdrop banner at the top of /about.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              Hero Section
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Copy fields */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Hero Eyebrow Tag</label>
                <input
                  type="text"
                  value={values.heroEyebrow}
                  onChange={(e) => handleChange("heroEyebrow", e.target.value)}
                  placeholder="About Meridian Logistics"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Hero Main Title</label>
                <input
                  type="text"
                  value={values.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  placeholder="Precision Logistics That Moves Global Trade Forward"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Hero Description Paragraph</label>
                <textarea
                  rows={3}
                  value={values.heroDescription}
                  onChange={(e) => handleChange("heroDescription", e.target.value)}
                  placeholder="Enter a brief overview description..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>
            </div>

            {/* Hero Image Upload Card */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Background Image</label>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-900 border border-slate-200 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.heroImage || defaultAboutSettings.heroImage}
                    alt="Hero preview"
                    className={`h-full w-full object-cover transition duration-300 ${heroUploading ? "opacity-25" : "opacity-100"}`}
                  />
                  {heroUploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                      <CircularProgress
                        percent={heroProgress}
                        size={52}
                        strokeWidth={4.5}
                        label={heroProgress >= 100 ? "Processing…" : "Uploading…"}
                      />
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2">
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
                        {values.heroImage ? "Custom Hero Image" : "Default Image"}
                      </span>
                    </div>
                  )}

                  {values.heroImage && (
                    <button
                      type="button"
                      title="Remove custom image"
                      disabled={heroDeleting || heroUploading}
                      onClick={() => handleRemoveImage("heroImage", "Hero Image")}
                      className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50"
                    >
                      {heroDeleting ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  )}
                </div>

                <input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    void handleImageUpload(file, "heroImage", "Hero Image");
                    e.target.value = "";
                  }}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={heroUploading}
                    onClick={() => heroImageInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <UploadCloud size={14} className="text-[#f46a16]" />
                    <span>{values.heroImage ? "Replace Image" : "Upload Image"}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-500">Or Paste Image URL</label>
                  <input
                    type="url"
                    value={values.heroImage}
                    onChange={(e) => handleChange("heroImage", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMPANY STORY & NARRATIVE */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 02</span>
              <h2 className="text-base font-bold text-slate-900">Company Narrative & Editorial Story</h2>
              <p className="text-xs text-slate-500">
                Detailed editorial story, company milestones, and operating highlights.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              Story Split
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Story Eyebrow</label>
                <input
                  type="text"
                  value={values.storyEyebrow}
                  onChange={(e) => handleChange("storyEyebrow", e.target.value)}
                  placeholder="Our Company Story"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Story Headline</label>
                <input
                  type="text"
                  value={values.storyTitle}
                  onChange={(e) => handleChange("storyTitle", e.target.value)}
                  placeholder="Purposeful Connections Built Across Every Shipment"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Primary Story Paragraph</label>
                <textarea
                  rows={4}
                  value={values.storyParagraph1}
                  onChange={(e) => handleChange("storyParagraph1", e.target.value)}
                  placeholder="Describe company origins and market role..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Secondary Story Paragraph</label>
                <textarea
                  rows={4}
                  value={values.storyParagraph2}
                  onChange={(e) => handleChange("storyParagraph2", e.target.value)}
                  placeholder="Describe operational capabilities and compliance..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                />
              </div>

              {/* Floating Badge on Story */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Badge Metric</label>
                  <input
                    type="text"
                    value={values.storyBadgeNumber}
                    onChange={(e) => handleChange("storyBadgeNumber", e.target.value)}
                    placeholder="15+"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={values.storyBadgeLabel}
                    onChange={(e) => handleChange("storyBadgeLabel", e.target.value)}
                    placeholder="Years of Logistics Excellence"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Story Image Upload Card */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Editorial Story Image</label>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-900 border border-slate-200 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.storyImage || defaultAboutSettings.storyImage}
                    alt="Story preview"
                    className={`h-full w-full object-cover transition duration-300 ${storyUploading ? "opacity-25" : "opacity-100"}`}
                  />
                  {storyUploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                      <CircularProgress
                        percent={storyProgress}
                        size={52}
                        strokeWidth={4.5}
                        label={storyProgress >= 100 ? "Processing…" : "Uploading…"}
                      />
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2">
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
                        {values.storyImage ? "Custom Story Image" : "Default Story Image"}
                      </span>
                    </div>
                  )}

                  {values.storyImage && (
                    <button
                      type="button"
                      title="Remove custom image"
                      disabled={storyDeleting || storyUploading}
                      onClick={() => handleRemoveImage("storyImage", "Story Image")}
                      className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50"
                    >
                      {storyDeleting ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  )}
                </div>

                <input
                  ref={storyImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    void handleImageUpload(file, "storyImage", "Story Image");
                    e.target.value = "";
                  }}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={storyUploading}
                    onClick={() => storyImageInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <UploadCloud size={14} className="text-[#f46a16]" />
                    <span>{values.storyImage ? "Replace Image" : "Upload Image"}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-500">Or Paste Image URL</label>
                  <input
                    type="url"
                    value={values.storyImage}
                    onChange={(e) => handleChange("storyImage", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PERFORMANCE STATS & METRICS */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 03</span>
              <h2 className="text-base font-bold text-slate-900">Key Performance Statistics</h2>
              <p className="text-xs text-slate-500">
                Four verified scale metrics displayed prominently on the About Us page.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              4 Metric Cards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#f46a16] uppercase">Metric 01</span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Value / Number</label>
                <input
                  type="text"
                  value={values.stat1Value}
                  onChange={(e) => handleChange("stat1Value", e.target.value)}
                  placeholder="20+"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Metric Label</label>
                <input
                  type="text"
                  value={values.stat1Label}
                  onChange={(e) => handleChange("stat1Label", e.target.value)}
                  placeholder="Years of Industry Expertise"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#f46a16] uppercase">Metric 02</span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Value / Number</label>
                <input
                  type="text"
                  value={values.stat2Value}
                  onChange={(e) => handleChange("stat2Value", e.target.value)}
                  placeholder="45+"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Metric Label</label>
                <input
                  type="text"
                  value={values.stat2Label}
                  onChange={(e) => handleChange("stat2Label", e.target.value)}
                  placeholder="Global Trade Corridors"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#f46a16] uppercase">Metric 03</span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Value / Number</label>
                <input
                  type="text"
                  value={values.stat3Value}
                  onChange={(e) => handleChange("stat3Value", e.target.value)}
                  placeholder="120K+"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Metric Label</label>
                <input
                  type="text"
                  value={values.stat3Label}
                  onChange={(e) => handleChange("stat3Label", e.target.value)}
                  placeholder="TEUs Handled Annually"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Stat 4 */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#f46a16] uppercase">Metric 04</span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Value / Number</label>
                <input
                  type="text"
                  value={values.stat4Value}
                  onChange={(e) => handleChange("stat4Value", e.target.value)}
                  placeholder="99.4%"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Metric Label</label>
                <input
                  type="text"
                  value={values.stat4Label}
                  onChange={(e) => handleChange("stat4Label", e.target.value)}
                  placeholder="On-Time Fulfillment Rate"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. MISSION, VISION & CORE VALUES */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 04</span>
              <h2 className="text-base font-bold text-slate-900">Mission, Vision & Core Values</h2>
              <p className="text-xs text-slate-500">
                Core guiding statements that govern Meridian Logistics&apos; operations and customer commitments.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              3 Strategic Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mission */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange/10 text-[#f46a16]">
                  <Compass size={16} />
                </span>
                <span className="text-xs font-bold text-slate-900">Our Mission</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  value={values.missionTitle}
                  onChange={(e) => handleChange("missionTitle", e.target.value)}
                  placeholder="Our Mission"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Statement</label>
                <textarea
                  rows={4}
                  value={values.missionDescription}
                  onChange={(e) => handleChange("missionDescription", e.target.value)}
                  placeholder="Enter mission statement..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 leading-relaxed"
                />
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                  <Globe2 size={16} />
                </span>
                <span className="text-xs font-bold text-slate-900">Our Vision</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  value={values.visionTitle}
                  onChange={(e) => handleChange("visionTitle", e.target.value)}
                  placeholder="Our Vision"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Statement</label>
                <textarea
                  rows={4}
                  value={values.visionDescription}
                  onChange={(e) => handleChange("visionDescription", e.target.value)}
                  placeholder="Enter vision statement..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 leading-relaxed"
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={16} />
                </span>
                <span className="text-xs font-bold text-slate-900">Core Values</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  value={values.valuesTitle}
                  onChange={(e) => handleChange("valuesTitle", e.target.value)}
                  placeholder="Our Core Values"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Statement</label>
                <textarea
                  rows={4}
                  value={values.valuesDescription}
                  onChange={(e) => handleChange("valuesDescription", e.target.value)}
                  placeholder="Enter core values..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. STRATEGIC STRENGTHS / CAPABILITIES */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 05</span>
              <h2 className="text-base font-bold text-slate-900">Strategic Strengths & Capabilities</h2>
              <p className="text-xs text-slate-500">
                Key capability tags and badges highlighting your freight advantages.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              {values.strengths.length} Capabilities
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {values.strengths.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-xs font-medium text-slate-800 transition hover:bg-slate-200/60"
                >
                  <Layers3 size={13} className="text-[#f46a16]" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStrength(index)}
                    className="ml-1 rounded-full p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                    title="Remove capability"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStrength();
                  }
                }}
                placeholder="Add new capability (e.g. Hazardous Cargo Handling)..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
              />
              <button
                type="button"
                onClick={handleAddStrength}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CALL TO ACTION */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 06</span>
              <h2 className="text-base font-bold text-slate-900">Bottom Call-To-Action Banner</h2>
              <p className="text-xs text-slate-500">
                Final closing conversion banner that invites customers to submit quote requests.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              CTA Banner
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">CTA Headline</label>
              <input
                type="text"
                value={values.ctaTitle}
                onChange={(e) => handleChange("ctaTitle", e.target.value)}
                placeholder="Ready to Optimize Your Global Supply Chain?"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">CTA Button Text</label>
              <input
                type="text"
                value={values.ctaBtnText}
                onChange={(e) => handleChange("ctaBtnText", e.target.value)}
                placeholder="Request a Quote"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">CTA Description</label>
              <textarea
                rows={2}
                value={values.ctaDescription}
                onChange={(e) => handleChange("ctaDescription", e.target.value)}
                placeholder="Connect with our logistics specialists today..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SAVE ACTIONS BAR */}
        <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange/10 text-[#f46a16]">
              <Sparkles size={15} />
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Unsaved changes will apply immediately to /about once saved.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye size={14} /> Preview
            </Link>

            <button
              onClick={() => void handleSave()}
              disabled={busy}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f46a16] px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#d95108] disabled:opacity-60 transition"
            >
              {busy ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" /> Saving…
                </>
              ) : savedSuccess ? (
                <>
                  <Check size={15} /> Saved!
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
