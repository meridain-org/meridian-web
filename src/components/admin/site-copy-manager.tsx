"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Image as ImageIcon,
  Info,
  Layout,
  LoaderCircle,
  Megaphone,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Video,
  X,
  ZoomIn,
} from "lucide-react";
import { DEFAULT_ABOUT_IMAGES } from "@/components/about-collage-interactive";

type TabKey = "hero" | "about" | "network" | "why" | "cta";

const defaultCopy: Record<string, string> = {
  // Hero
  heroEyebrow: "Global logistics · Saudi Arabia",
  heroTitleLine1: "Connecting Trade Lanes with",
  heroTitleLine2: "Reliability & Global Scale",
  heroDescription:
    "Integrated ocean, air, and overland transportation connecting the Kingdom of Saudi Arabia with global industrial and commercial markets.",
  heroBtnQuote: "Request a Quote",
  heroBtnServices: "Explore Our Services",
  heroVideoUrl: "",
  heroBackgroundImage: "",

  // About
  aboutEyebrow: "About Meridian · 01",
  aboutTitle: "Strategic Logistics Management Built on Operational Precision",
  aboutDescription:
    "Headquartered in Saudi Arabia, Meridian provides multi-modal freight forwarding, contract logistics, and project cargo coordination tailored to high-value industrial and commercial supply chains.",
  aboutBtn: "More About Us",
  aboutHighlight1Title: "Reliable services",
  aboutHighlight1Subtitle: "Built around your needs",
  aboutHighlight2Title: "Global network",
  aboutHighlight2Subtitle: "Local expertise",
  aboutHighlight3Title: "Tailored solutions",
  aboutHighlight3Subtitle: "For your business",
  aboutBadgeLine1: "SAUDI ARABIA",
  aboutBadgeLine2: "TO THE WORLD",
  aboutPersonCaption: "Moving business\nforward together",
  aboutImage1: "",
  aboutImage2: "",
  aboutImage3: "",

  // Network
  networkEyebrow: "Our global network · 03",
  networkTitle: "Connecting Key Markets Worldwide",
  networkDescription:
    "Discuss your origin, destination, and service requirements with our team to confirm the options available for your shipment across Europe, Middle East, and Asia trade corridors.",
  networkFact: "Route and partner availability is confirmed for each shipment.",
  networkBtn: "Explore Our Network",

  // Why Meridian
  whyEyebrow: "Why choose Meridian · 05",
  whyTitle: "Your Trusted Partner in Global Logistics",
  whyDescription:
    "We combine thoughtful coordination and customer focus to support effective freight and logistics planning for your business.",
  whyBtn: "Why Meridian",

  // Closing CTA
  ctaEyebrow: "Ready to move forward?",
  ctaTitleLine1: "Move your freight with confidence",
  ctaTitleLine2: "across global trade lanes",
  ctaDescription:
    "Connect with our logistics team to discuss routes, schedules, customs documentation, and quotation details tailored to your cargo profile.",
  ctaBtnQuote: "Request a Quote",
  ctaBtnContact: "Contact Our Team",
};

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
      {/* Circle container with solid white background and soft shadow for high contrast on dark video/images */}
      <div
        className="relative inline-flex items-center justify-center rounded-full bg-white shadow-lg p-1"
        style={{ width: size, height: size }}
      >
        <svg className="-rotate-90 transform" width={size} height={size}>
          {/* Inner solid white disc filling the transparent center */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="#ffffff"
          />
          {/* Track background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#fed7aa"
            strokeWidth={strokeWidth}
            className="opacity-60"
            fill="transparent"
          />
          {/* Active progress arc */}
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
        {/* Center Percentage Number - High contrast bold dark text */}
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

export function SiteCopyManager() {
  const [values, setValues] = useState<Record<string, string>>(defaultCopy);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [busy, setBusy] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Media upload state & limits
  const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15 MB
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoDeleting, setVideoDeleting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploadMsg, setVideoUploadMsg] = useState("");
  const [videoUploadError, setVideoUploadError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageUploadMsg, setImageUploadMsg] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");

  // About 3-image collage upload state
  const aboutImage1InputRef = useRef<HTMLInputElement>(null);
  const aboutImage2InputRef = useRef<HTMLInputElement>(null);
  const aboutImage3InputRef = useRef<HTMLInputElement>(null);
  const [aboutUploadingSlot, setAboutUploadingSlot] = useState<"aboutImage1" | "aboutImage2" | "aboutImage3" | null>(null);
  const [aboutDeletingSlot, setAboutDeletingSlot] = useState<string | null>(null);
  const [aboutUploadProgress, setAboutUploadProgress] = useState(0);

  // Toast notifications state
  type ToastItem = {
    id: string;
    type: "error" | "success" | "info" | "warning";
    title: string;
    message: string;
  };
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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

  const handleRemoveMedia = async (type: "video" | "image") => {
    const currentUrl = type === "video" ? values.heroVideoUrl : values.heroBackgroundImage;
    if (!currentUrl) return;

    if (type === "video") setVideoDeleting(true);
    else setImageDeleting(true);

    try {
      const res = await fetch("/api/admin/cloudinary-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: currentUrl, resourceType: type }),
      });
      const data = await res.json();
      if (type === "video") {
        handleChange("heroVideoUrl", "");
        if (videoInputRef.current) videoInputRef.current.value = "";
        showToast({
          type: "success",
          title: "Video Removed",
          message: data.skipped
            ? "Hero video reference was cleared."
            : "Video was removed from settings and permanently deleted from Cloudinary.",
        });
      } else {
        handleChange("heroBackgroundImage", "");
        if (imageInputRef.current) imageInputRef.current.value = "";
        showToast({
          type: "success",
          title: "Fallback Image Removed",
          message: data.skipped
            ? "Fallback image reference was cleared."
            : "Fallback image was removed from settings and permanently deleted from Cloudinary.",
        });
      }
    } catch {
      if (type === "video") handleChange("heroVideoUrl", "");
      else handleChange("heroBackgroundImage", "");
      showToast({
        type: "warning",
        title: `${type === "video" ? "Video" : "Image"} Reference Cleared`,
        message: "Reference was removed from the form.",
      });
    } finally {
      if (type === "video") setVideoDeleting(false);
      else setImageDeleting(false);
    }
  };

  const handleFileUpload = async (file: File | undefined, type: "video" | "image") => {
    if (!file) return;

    // Strict Size Validation: Video <= 15MB, Image <= 5MB
    if (type === "video" && file.size > MAX_VIDEO_BYTES) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(1);
      showToast({
        type: "error",
        title: "Video Size Limit Exceeded",
        message: `Selected video "${file.name}" is ${currentMB} MB. Maximum allowed size is 15 MB. Please choose or compress a video under 15 MB.`,
      });
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    if (type === "image" && file.size > MAX_IMAGE_BYTES) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(1);
      showToast({
        type: "error",
        title: "Image Size Limit Exceeded",
        message: `Selected image "${file.name}" is ${currentMB} MB. Maximum allowed size is 5 MB. Please choose an image under 5 MB.`,
      });
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    const previousUrl = type === "video" ? values.heroVideoUrl : values.heroBackgroundImage;

    if (type === "video") {
      setVideoUploading(true);
      setVideoProgress(5);
      setVideoUploadError("");
      setVideoUploadMsg(`Uploading ${file.name}…`);
    } else {
      setImageUploading(true);
      setImageProgress(5);
      setImageUploadError("");
      setImageUploadMsg(`Uploading ${file.name}…`);
    }

    try {
      const sigRes = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resourceType: type,
          fileName: file.name,
          mimeType: file.type,
          bytes: file.size,
        }),
      });
      const sig = await sigRes.json();
      if (!sigRes.ok) {
        throw new Error(sig.error || "Upload signature failed. You can paste a direct URL below.");
      }

      if (type === "video") setVideoProgress(15);
      else setImageProgress(15);

      const form = new FormData();
      Object.entries({
        api_key: sig.apiKey,
        timestamp: String(sig.timestamp),
        signature: sig.signature,
        folder: sig.folder,
        public_id: sig.publicId,
        overwrite: "false",
      }).forEach(([key, value]) => form.set(key, value));
      form.set("file", file);

      // Perform upload with real-time percentage progress
      const cloud = await uploadWithProgress<{
        secure_url: string;
        public_id: string;
        resource_type?: string;
        format?: string;
        bytes?: number;
        width?: number;
        height?: number;
        duration?: number;
      }>(sig.uploadUrl, form, (percent) => {
        // Map 0-100 to 15-98 range during transfer
        const mapped = Math.round(15 + percent * 0.83);
        if (type === "video") setVideoProgress(mapped);
        else setImageProgress(mapped);
      });

      if (type === "video") setVideoProgress(100);
      else setImageProgress(100);

      const secureUrl = cloud.secure_url;
      if (type === "video") {
        handleChange("heroVideoUrl", secureUrl);
        setVideoUploadMsg("Hero video uploaded successfully!");
        showToast({
          type: "success",
          title: previousUrl ? "Video Replaced" : "Video Uploaded",
          message: previousUrl
            ? "New video uploaded. Previous video was deleted from Cloudinary."
            : "Hero background video has been updated and previewed.",
        });
        if (previousUrl && previousUrl !== secureUrl) {
          void fetch("/api/admin/cloudinary-delete", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ url: previousUrl, resourceType: "video" }),
          }).catch((e) => console.warn("Failed to delete previous video from Cloudinary:", e));
        }
        setTimeout(() => {
          setVideoUploadMsg("");
          setVideoProgress(0);
        }, 3500);
      } else {
        handleChange("heroBackgroundImage", secureUrl);
        setImageUploadMsg("Fallback image uploaded successfully!");
        showToast({
          type: "success",
          title: previousUrl ? "Image Replaced" : "Image Uploaded",
          message: previousUrl
            ? "New fallback image uploaded. Previous image was deleted from Cloudinary."
            : "Fallback background image has been updated and previewed.",
        });
        if (previousUrl && previousUrl !== secureUrl) {
          void fetch("/api/admin/cloudinary-delete", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ url: previousUrl, resourceType: "image" }),
          }).catch((e) => console.warn("Failed to delete previous image from Cloudinary:", e));
        }
        setTimeout(() => {
          setImageUploadMsg("");
          setImageProgress(0);
        }, 3500);
      }

      // Record in media table in background
      void fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          public_id: cloud.public_id,
          secure_url: secureUrl,
          resource_type: cloud.resource_type || type,
          format: cloud.format,
          bytes: cloud.bytes,
          width: cloud.width,
          height: cloud.height,
          duration: cloud.duration,
          alt_text: file.name,
        }),
      }).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      if (type === "video") {
        setVideoUploadError(msg);
        setVideoProgress(0);
      } else {
        setImageUploadError(msg);
        setImageProgress(0);
      }
      showToast({
        type: "error",
        title: type === "video" ? "Video Upload Failed" : "Image Upload Failed",
        message: msg,
      });
    } finally {
      if (type === "video") {
        setVideoUploading(false);
        if (videoInputRef.current) videoInputRef.current.value = "";
      } else {
        setImageUploading(false);
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    }
  };

  const handleAboutImageUpload = async (
    file: File | undefined,
    slotKey: "aboutImage1" | "aboutImage2" | "aboutImage3",
    slotLabel: string
  ) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(1);
      showToast({
        type: "error",
        title: "Image Size Limit Exceeded",
        message: `Selected image "${file.name}" is ${currentMB} MB. Maximum allowed size is 5 MB.`,
      });
      return;
    }

    const previousUrl = values[slotKey];
    setAboutUploadingSlot(slotKey);
    setAboutUploadProgress(10);

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

      setAboutUploadProgress(20);

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
          setAboutUploadProgress(Math.round(20 + percent * 0.78));
        }
      );

      setAboutUploadProgress(100);
      handleChange(slotKey, cloud.secure_url);

      showToast({
        type: "success",
        title: `${slotLabel} Uploaded`,
        message: "New image uploaded and saved in About section.",
      });

      if (previousUrl && previousUrl !== cloud.secure_url) {
        void fetch("/api/admin/cloudinary-delete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: previousUrl, resourceType: "image" }),
        }).catch(() => {});
      }

      void fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          public_id: cloud.public_id,
          secure_url: cloud.secure_url,
          resource_type: "image",
          alt_text: `${slotLabel} - Meridian About Section`,
        }),
      }).catch(() => {});
    } catch (err) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: err instanceof Error ? err.message : "Failed to upload image.",
      });
    } finally {
      setTimeout(() => {
        setAboutUploadingSlot(null);
        setAboutUploadProgress(0);
      }, 500);
    }
  };

  const handleRemoveAboutImage = async (
    slotKey: "aboutImage1" | "aboutImage2" | "aboutImage3",
    slotLabel: string
  ) => {
    const currentUrl = values[slotKey];
    if (!currentUrl) return;

    setAboutDeletingSlot(slotKey);
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
        message: "Custom image removed. Section will use the default placeholder.",
      });
    } catch {
      handleChange(slotKey, "");
      showToast({
        type: "warning",
        title: `${slotLabel} Cleared`,
        message: "Image reference was cleared.",
      });
    } finally {
      setAboutDeletingSlot(null);
    }
  };

  useEffect(() => {
    void fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && body.value) {
          setValues((prev) => ({ ...prev, ...body.value }));
        }
      })
      .catch(() => {
        // Fallback to default copy
      });
  }, []);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSavedSuccess(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBusy(true);
    setErrorMessage("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to save settings");
      setSavedSuccess(true);
      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Homepage content and hero media settings have been saved.",
      });
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save homepage copy.";
      setErrorMessage(msg);
      showToast({
        type: "error",
        title: "Save Failed",
        message: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: "hero", label: "Hero Banner", icon: Layout },
    { key: "about", label: "About Section", icon: Building2 },
    { key: "network", label: "Global Network", icon: Globe2 },
    { key: "why", label: "Why Choose Us", icon: ShieldCheck },
    { key: "cta", label: "Closing Banner", icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      {/* Floating Toast Notification Stack */}
      <aside aria-label="Notifications" className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toast.type === "error"
                ? "border-rose-200/90 bg-white/95 text-slate-900 shadow-rose-500/15"
                : "border-emerald-200/90 bg-white/95 text-slate-900 shadow-emerald-500/15"
            }`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                toast.type === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
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

      {/* Top Header Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#03172a] p-6 text-white sm:p-8 shadow-sm">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(244,106,22,.25),transparent_55%),radial-gradient(ellipse_at_0%_100%,#0d3454,transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f46a16]">HOMEPAGE CMS</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">Section Manager</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">Homepage Content</h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Manage headlines, text copy, call-to-actions, and messaging across homepage sections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-900/90"
            >
              <ExternalLink size={15} />
              View Live Page
            </Link>

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
                  <Check size={16} className="text-white" />
                  Saved!
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

      {/* Success / Error Notification */}
      {savedSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          <Check size={16} className="text-emerald-600" />
          Homepage changes saved successfully and live on the storefront!
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-2xs">
          {errorMessage}
        </div>
      )}

      {/* Tab Navigation Pill Bar */}
      <div className="flex overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-2xs [scrollbar-width:none]">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? "bg-[#03172a] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={15} className={active ? "text-[#f46a16]" : "text-slate-400"} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Column (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 01</span>
                <h2 className="text-base font-bold text-slate-900">Hero Section</h2>
                <p className="text-xs text-slate-500">
                  The primary landing view with video/image backdrop and the main company value proposition.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Eyebrow Tagline</label>
                  <input
                    type="text"
                    value={values.heroEyebrow || ""}
                    onChange={(e) => handleChange("heroEyebrow", e.target.value)}
                    placeholder="e.g. Global logistics · Saudi Arabia"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Headline (Line 1 - White)</label>
                    <input
                      type="text"
                      value={values.heroTitleLine1 || ""}
                      onChange={(e) => handleChange("heroTitleLine1", e.target.value)}
                      placeholder="e.g. Connecting Trade Lanes with"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Headline (Line 2 - Orange Accent)</label>
                    <input
                      type="text"
                      value={values.heroTitleLine2 || ""}
                      onChange={(e) => handleChange("heroTitleLine2", e.target.value)}
                      placeholder="e.g. Reliability & Global Scale"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Summary / Subtitle</label>
                  <textarea
                    rows={3}
                    value={values.heroDescription || ""}
                    onChange={(e) => handleChange("heroDescription", e.target.value)}
                    placeholder="Enter hero paragraph..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Primary Button Label</label>
                    <input
                      type="text"
                      value={values.heroBtnQuote || ""}
                      onChange={(e) => handleChange("heroBtnQuote", e.target.value)}
                      placeholder="Request a Quote"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Secondary Button Label</label>
                    <input
                      type="text"
                      value={values.heroBtnServices || ""}
                      onChange={(e) => handleChange("heroBtnServices", e.target.value)}
                      placeholder="Explore Our Services"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>
                </div>

                {/* Hero Media Backdrop Settings (Video & Fallback Image) */}
                <div className="mt-6 border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Hero Background Media
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Upload background video and fallback cover image, or provide direct URLs.
                      </p>
                    </div>
                  </div>

                  {/* 2-Column Media Upload Grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Card 1: Background Video */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Video size={15} className="text-[#f46a16]" />
                          <span className="text-xs font-bold text-slate-800">Background Video</span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                            values.heroVideoUrl
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                              : "bg-slate-200/60 text-slate-500"
                          }`}
                        >
                          {values.heroVideoUrl ? "Video Active" : "No Video"}
                        </span>
                      </div>

                      {/* Video Player Preview if URL is set */}
                      {values.heroVideoUrl ? (
                        <div className="space-y-2">
                          <div className="relative overflow-hidden rounded-lg bg-black aspect-video max-h-36 flex items-center justify-center">
                            <video
                              key={values.heroVideoUrl}
                              src={values.heroVideoUrl}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className={`h-full w-full object-cover transition duration-300 ${videoUploading ? "opacity-25" : "opacity-100"}`}
                            />
                            {videoUploading ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                                <CircularProgress
                                  percent={videoProgress}
                                  size={56}
                                  strokeWidth={4.5}
                                  label={videoProgress >= 100 ? "Processing…" : "Uploading video…"}
                                />
                              </div>
                            ) : (
                              <div className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white backdrop-blur">
                                Loop Preview
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => videoInputRef.current?.click()}
                              disabled={videoUploading}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                            >
                              <UploadCloud size={12} /> Replace Video
                            </button>
                            <a
                              href={values.heroVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                            >
                              <ExternalLink size={11} /> Open
                            </a>
                            <button
                              type="button"
                              onClick={() => void handleRemoveMedia("video")}
                              disabled={videoUploading || videoDeleting}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                            >
                              {videoDeleting ? <LoaderCircle size={12} className="animate-spin" /> : <Trash2 size={12} />}
                              {videoDeleting ? "Deleting…" : "Remove"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Upload Dropzone / Circular Progress */
                        <div>
                          {videoUploading ? (
                            <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#f46a16]/50 bg-orange/[0.04] py-6 px-3 text-center">
                              <CircularProgress
                                percent={videoProgress}
                                size={60}
                                strokeWidth={4.5}
                                label={videoProgress >= 100 ? "Finalizing media…" : "Uploading video…"}
                              />
                              <span className="mt-2 text-[11px] font-medium text-slate-500 truncate max-w-[240px]">
                                {videoUploadMsg || "Please wait while video is uploading..."}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => videoInputRef.current?.click()}
                              className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-5 px-3 text-center transition hover:border-[#f46a16] hover:bg-orange/5"
                            >
                              <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-[#f46a16] group-hover:text-white">
                                <UploadCloud size={18} />
                              </span>
                              <span className="mt-2 text-xs font-semibold text-slate-800">
                                Upload Video File
                              </span>
                              <span className="text-[10px] text-slate-400">MP4, WebM, MOV · Max limit 15 MB</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="sr-only"
                        onChange={(e) => void handleFileUpload(e.target.files?.[0], "video")}
                      />

                      {/* Direct URL Input */}
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600">Or Video URL (Cloudinary / CDN / MP4)</label>
                        <input
                          type="url"
                          value={values.heroVideoUrl || ""}
                          onChange={(e) => handleChange("heroVideoUrl", e.target.value)}
                          placeholder="https://.../hero-video.mp4"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-[#f46a16] focus:outline-none focus:ring-2 focus:ring-orange/15"
                        />
                      </div>

                      {/* Upload feedback */}
                      {videoUploadMsg && (
                        <p className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 size={13} /> {videoUploadMsg}
                        </p>
                      )}
                      {videoUploadError && (
                        <p className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
                          <AlertCircle size={13} /> {videoUploadError}
                        </p>
                      )}
                    </div>

                    {/* Card 2: Fallback Background Image */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ImageIcon size={15} className="text-[#f46a16]" />
                          <span className="text-xs font-bold text-slate-800">Fallback Background Image</span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                            values.heroBackgroundImage
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                              : "bg-slate-200/60 text-slate-500"
                          }`}
                        >
                          {values.heroBackgroundImage ? "Custom Image" : "Default Used"}
                        </span>
                      </div>

                      {/* Image Thumbnail Preview if URL is set */}
                      {values.heroBackgroundImage ? (
                        <div className="space-y-2">
                          <div className="relative overflow-hidden rounded-lg bg-slate-900 aspect-video max-h-36 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={values.heroBackgroundImage}
                              alt="Hero backdrop"
                              className={`h-full w-full object-cover transition duration-300 ${imageUploading ? "opacity-25" : "opacity-100"}`}
                            />
                            {imageUploading ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                                <CircularProgress
                                  percent={imageProgress}
                                  size={56}
                                  strokeWidth={4.5}
                                  label={imageProgress >= 100 ? "Processing…" : "Uploading image…"}
                                />
                              </div>
                            ) : (
                              <div className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white backdrop-blur">
                                Fallback Cover
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              disabled={imageUploading}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                            >
                              <UploadCloud size={12} /> Replace Image
                            </button>
                            <a
                              href={values.heroBackgroundImage}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                            >
                              <ExternalLink size={11} /> Open
                            </a>
                            <button
                              type="button"
                              onClick={() => void handleRemoveMedia("image")}
                              disabled={imageUploading || imageDeleting}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                            >
                              {imageDeleting ? <LoaderCircle size={12} className="animate-spin" /> : <Trash2 size={12} />}
                              {imageDeleting ? "Deleting…" : "Remove"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Upload Dropzone / Circular Progress */
                        <div>
                          {imageUploading ? (
                            <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#f46a16]/50 bg-orange/[0.04] py-6 px-3 text-center">
                              <CircularProgress
                                percent={imageProgress}
                                size={60}
                                strokeWidth={4.5}
                                label={imageProgress >= 100 ? "Finalizing media…" : "Uploading image…"}
                              />
                              <span className="mt-2 text-[11px] font-medium text-slate-500 truncate max-w-[240px]">
                                {imageUploadMsg || "Please wait while image is uploading..."}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-5 px-3 text-center transition hover:border-[#f46a16] hover:bg-orange/5"
                            >
                              <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-[#f46a16] group-hover:text-white">
                                <UploadCloud size={18} />
                              </span>
                              <span className="mt-2 text-xs font-semibold text-slate-800">
                                Upload Fallback Image
                              </span>
                              <span className="text-[10px] text-slate-400">JPEG, PNG, WebP, AVIF · Max limit 5 MB</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="sr-only"
                        onChange={(e) => void handleFileUpload(e.target.files?.[0], "image")}
                      />

                      {/* Direct URL Input */}
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600">Or Image URL (Cloudinary / Unsplash / Web)</label>
                        <input
                          type="url"
                          value={values.heroBackgroundImage || ""}
                          onChange={(e) => handleChange("heroBackgroundImage", e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-[#f46a16] focus:outline-none focus:ring-2 focus:ring-orange/15"
                        />
                      </div>

                      {/* Upload feedback */}
                      {imageUploadMsg && (
                        <p className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 size={13} /> {imageUploadMsg}
                        </p>
                      )}
                      {imageUploadError && (
                        <p className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
                          <AlertCircle size={13} /> {imageUploadError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === "about" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 02</span>
                <h2 className="text-base font-bold text-slate-900">About Meridian</h2>
                <p className="text-xs text-slate-500">
                  Company introduction, key capability pillars, and collage badges.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Section Eyebrow</label>
                  <input
                    type="text"
                    value={values.aboutEyebrow || ""}
                    onChange={(e) => handleChange("aboutEyebrow", e.target.value)}
                    placeholder="About Meridian · 01"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Main Headline</label>
                  <input
                    type="text"
                    value={values.aboutTitle || ""}
                    onChange={(e) => handleChange("aboutTitle", e.target.value)}
                    placeholder="e.g. Strategic Logistics Management..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Description Body</label>
                  <textarea
                    rows={4}
                    value={values.aboutDescription || ""}
                    onChange={(e) => handleChange("aboutDescription", e.target.value)}
                    placeholder="Enter about description..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-xs font-bold text-slate-800">Three Pillar Highlights</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200/70 p-3 bg-slate-50/50">
                      <label className="block text-[11px] font-semibold text-slate-700">Pillar 1</label>
                      <input
                        type="text"
                        value={values.aboutHighlight1Title || ""}
                        onChange={(e) => handleChange("aboutHighlight1Title", e.target.value)}
                        placeholder="Reliable services"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={values.aboutHighlight1Subtitle || ""}
                        onChange={(e) => handleChange("aboutHighlight1Subtitle", e.target.value)}
                        placeholder="Built around your needs"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-500"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200/70 p-3 bg-slate-50/50">
                      <label className="block text-[11px] font-semibold text-slate-700">Pillar 2</label>
                      <input
                        type="text"
                        value={values.aboutHighlight2Title || ""}
                        onChange={(e) => handleChange("aboutHighlight2Title", e.target.value)}
                        placeholder="Global network"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={values.aboutHighlight2Subtitle || ""}
                        onChange={(e) => handleChange("aboutHighlight2Subtitle", e.target.value)}
                        placeholder="Local expertise"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-500"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200/70 p-3 bg-slate-50/50">
                      <label className="block text-[11px] font-semibold text-slate-700">Pillar 3</label>
                      <input
                        type="text"
                        value={values.aboutHighlight3Title || ""}
                        onChange={(e) => handleChange("aboutHighlight3Title", e.target.value)}
                        placeholder="Tailored solutions"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={values.aboutHighlight3Subtitle || ""}
                        onChange={(e) => handleChange("aboutHighlight3Subtitle", e.target.value)}
                        placeholder="For your business"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Badges and Caption */}
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-2 text-xs font-bold text-slate-800">Floating Badge & Image Caption</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Badge Line 1</label>
                      <input
                        type="text"
                        value={values.aboutBadgeLine1 || ""}
                        onChange={(e) => handleChange("aboutBadgeLine1", e.target.value)}
                        placeholder="SAUDI ARABIA"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Badge Line 2</label>
                      <input
                        type="text"
                        value={values.aboutBadgeLine2 || ""}
                        onChange={(e) => handleChange("aboutBadgeLine2", e.target.value)}
                        placeholder="TO THE WORLD"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Image 3 Caption</label>
                      <input
                        type="text"
                        value={values.aboutPersonCaption || ""}
                        onChange={(e) => handleChange("aboutPersonCaption", e.target.value)}
                        placeholder="Moving business forward together"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3-Image Collage Uploads */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ImageIcon size={15} className="text-[#f46a16]" />
                        <h3 className="text-sm font-bold text-slate-900">
                          About Section Images (3-Image Scroll-Animated Collage)
                        </h3>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Upload or link 3 images for the right-side interactive collage. Image 1 zooms in on scroll,
                        Image 2 moves to the top right, and Image 3 moves to the bottom right.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-bold text-[#f46a16]">
                      <Sparkles size={11} /> 3-Image Layout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* IMAGE 1: MAIN LANDSCAPE */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded bg-[#03182c] text-[10px] font-bold text-white">
                            1
                          </span>
                          <span className="text-xs font-bold text-slate-800">Main Landscape</span>
                        </div>
                        <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-semibold text-sky-800">
                          Zooms In
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-200 group">
                        <img
                          src={values.aboutImage1 || DEFAULT_ABOUT_IMAGES.image1}
                          alt="Main Landscape"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {aboutUploadingSlot === "aboutImage1" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                            <CircularProgress percent={aboutUploadProgress} size={48} label={`${aboutUploadProgress}%`} />
                            <span className="mt-1.5 text-[10px] font-medium">Uploading…</span>
                          </div>
                        )}
                        <div className="absolute bottom-1.5 left-1.5">
                          {values.aboutImage1 ? (
                            <span className="rounded bg-emerald-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Custom Image
                            </span>
                          ) : (
                            <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Default Placeholder
                            </span>
                          )}
                        </div>
                        {values.aboutImage1 && (
                          <button
                            type="button"
                            title="Delete custom image"
                            disabled={aboutDeletingSlot === "aboutImage1"}
                            onClick={() => handleRemoveAboutImage("aboutImage1", "Main Landscape Image")}
                            className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <input
                        ref={aboutImage1InputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          void handleAboutImageUpload(file, "aboutImage1", "Main Landscape Image");
                          e.target.value = "";
                        }}
                      />

                      <button
                        type="button"
                        disabled={aboutUploadingSlot === "aboutImage1"}
                        onClick={() => aboutImage1InputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                      >
                        <UploadCloud size={13} className="text-[#f46a16]" />
                        <span>{values.aboutImage1 ? "Change Image" : "Upload Image"}</span>
                      </button>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">Or Paste Image URL</label>
                        <input
                          type="url"
                          value={values.aboutImage1 || ""}
                          onChange={(e) => handleChange("aboutImage1", e.target.value)}
                          placeholder="https://..."
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                        />
                      </div>
                    </div>

                    {/* IMAGE 2: TOP RIGHT ACCENT */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded bg-[#03182c] text-[10px] font-bold text-white">
                            2
                          </span>
                          <span className="text-xs font-bold text-slate-800">Top Right Accent</span>
                        </div>
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                          Floats Top Right
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-200 group">
                        <img
                          src={values.aboutImage2 || DEFAULT_ABOUT_IMAGES.image2}
                          alt="Top Right Accent"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {aboutUploadingSlot === "aboutImage2" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                            <CircularProgress percent={aboutUploadProgress} size={48} label={`${aboutUploadProgress}%`} />
                            <span className="mt-1.5 text-[10px] font-medium">Uploading…</span>
                          </div>
                        )}
                        <div className="absolute bottom-1.5 left-1.5">
                          {values.aboutImage2 ? (
                            <span className="rounded bg-emerald-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Custom Image
                            </span>
                          ) : (
                            <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Default Placeholder
                            </span>
                          )}
                        </div>
                        {values.aboutImage2 && (
                          <button
                            type="button"
                            title="Delete custom image"
                            disabled={aboutDeletingSlot === "aboutImage2"}
                            onClick={() => handleRemoveAboutImage("aboutImage2", "Top Right Accent Image")}
                            className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <input
                        ref={aboutImage2InputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          void handleAboutImageUpload(file, "aboutImage2", "Top Right Accent Image");
                          e.target.value = "";
                        }}
                      />

                      <button
                        type="button"
                        disabled={aboutUploadingSlot === "aboutImage2"}
                        onClick={() => aboutImage2InputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                      >
                        <UploadCloud size={13} className="text-[#f46a16]" />
                        <span>{values.aboutImage2 ? "Change Image" : "Upload Image"}</span>
                      </button>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">Or Paste Image URL</label>
                        <input
                          type="url"
                          value={values.aboutImage2 || ""}
                          onChange={(e) => handleChange("aboutImage2", e.target.value)}
                          placeholder="https://..."
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                        />
                      </div>
                    </div>

                    {/* IMAGE 3: BOTTOM RIGHT ACCENT */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded bg-[#03182c] text-[10px] font-bold text-white">
                            3
                          </span>
                          <span className="text-xs font-bold text-slate-800">Bottom Right Accent</span>
                        </div>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800">
                          Moves to Bottom
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-200 group">
                        <img
                          src={values.aboutImage3 || DEFAULT_ABOUT_IMAGES.image3}
                          alt="Bottom Right Accent"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {aboutUploadingSlot === "aboutImage3" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                            <CircularProgress percent={aboutUploadProgress} size={48} label={`${aboutUploadProgress}%`} />
                            <span className="mt-1.5 text-[10px] font-medium">Uploading…</span>
                          </div>
                        )}
                        <div className="absolute bottom-1.5 left-1.5">
                          {values.aboutImage3 ? (
                            <span className="rounded bg-emerald-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Custom Image
                            </span>
                          ) : (
                            <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                              Default Placeholder
                            </span>
                          )}
                        </div>
                        {values.aboutImage3 && (
                          <button
                            type="button"
                            title="Delete custom image"
                            disabled={aboutDeletingSlot === "aboutImage3"}
                            onClick={() => handleRemoveAboutImage("aboutImage3", "Bottom Right Accent Image")}
                            className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-md bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <input
                        ref={aboutImage3InputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          void handleAboutImageUpload(file, "aboutImage3", "Bottom Right Accent Image");
                          e.target.value = "";
                        }}
                      />

                      <button
                        type="button"
                        disabled={aboutUploadingSlot === "aboutImage3"}
                        onClick={() => aboutImage3InputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                      >
                        <UploadCloud size={13} className="text-[#f46a16]" />
                        <span>{values.aboutImage3 ? "Change Image" : "Upload Image"}</span>
                      </button>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-500">Or Paste Image URL</label>
                        <input
                          type="url"
                          value={values.aboutImage3 || ""}
                          onChange={(e) => handleChange("aboutImage3", e.target.value)}
                          placeholder="https://..."
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL NETWORK */}
          {activeTab === "network" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 03</span>
                <h2 className="text-base font-bold text-slate-900">Global Network</h2>
                <p className="text-xs text-slate-500">
                  Global trade lanes, illustrative shipping routes map, and connection hubs.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Section Eyebrow</label>
                  <input
                    type="text"
                    value={values.networkEyebrow || ""}
                    onChange={(e) => handleChange("networkEyebrow", e.target.value)}
                    placeholder="Our global network · 03"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Section Headline</label>
                  <input
                    type="text"
                    value={values.networkTitle || ""}
                    onChange={(e) => handleChange("networkTitle", e.target.value)}
                    placeholder="Connecting Key Markets Worldwide"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={values.networkDescription || ""}
                    onChange={(e) => handleChange("networkDescription", e.target.value)}
                    placeholder="Discuss your origin, destination, and service requirements..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Route Note / Disclaimer</label>
                    <input
                      type="text"
                      value={values.networkFact || ""}
                      onChange={(e) => handleChange("networkFact", e.target.value)}
                      placeholder="Route and partner availability is confirmed for each shipment."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={values.networkBtn || ""}
                      onChange={(e) => handleChange("networkBtn", e.target.value)}
                      placeholder="Explore Our Network"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WHY CHOOSE US */}
          {activeTab === "why" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 04</span>
                <h2 className="text-base font-bold text-slate-900">Why Choose Meridian</h2>
                <p className="text-xs text-slate-500">
                  Value proposition header, company credibility factors, and strengths.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Section Eyebrow</label>
                  <input
                    type="text"
                    value={values.whyEyebrow || ""}
                    onChange={(e) => handleChange("whyEyebrow", e.target.value)}
                    placeholder="Why choose Meridian · 05"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Section Headline</label>
                  <input
                    type="text"
                    value={values.whyTitle || ""}
                    onChange={(e) => handleChange("whyTitle", e.target.value)}
                    placeholder="Your Trusted Partner in Global Logistics"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={values.whyDescription || ""}
                    onChange={(e) => handleChange("whyDescription", e.target.value)}
                    placeholder="We combine thoughtful coordination and customer focus..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Button Label</label>
                  <input
                    type="text"
                    value={values.whyBtn || ""}
                    onChange={(e) => handleChange("whyBtn", e.target.value)}
                    placeholder="Why Meridian"
                    className="mt-1.5 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLOSING CTA */}
          {activeTab === "cta" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">Section 05</span>
                <h2 className="text-base font-bold text-slate-900">Closing Call To Action</h2>
                <p className="text-xs text-slate-500">
                  The bottom high-conversion banner directing visitors to request a quote or contact staff.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Eyebrow</label>
                  <input
                    type="text"
                    value={values.ctaEyebrow || ""}
                    onChange={(e) => handleChange("ctaEyebrow", e.target.value)}
                    placeholder="Ready to move forward?"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Headline (Line 1)</label>
                    <input
                      type="text"
                      value={values.ctaTitleLine1 || ""}
                      onChange={(e) => handleChange("ctaTitleLine1", e.target.value)}
                      placeholder="Move your freight with confidence"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Headline (Line 2)</label>
                    <input
                      type="text"
                      value={values.ctaTitleLine2 || ""}
                      onChange={(e) => handleChange("ctaTitleLine2", e.target.value)}
                      placeholder="across global trade lanes"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={values.ctaDescription || ""}
                    onChange={(e) => handleChange("ctaDescription", e.target.value)}
                    placeholder="Connect with our logistics team..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Primary Button</label>
                    <input
                      type="text"
                      value={values.ctaBtnQuote || ""}
                      onChange={(e) => handleChange("ctaBtnQuote", e.target.value)}
                      placeholder="Request a Quote"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Secondary Button</label>
                    <input
                      type="text"
                      value={values.ctaBtnContact || ""}
                      onChange={(e) => handleChange("ctaBtnContact", e.target.value)}
                      placeholder="Contact Our Team"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#f46a16] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <span className="text-xs text-slate-500">Unsaved changes will be lost if you leave this page.</span>
            <button
              onClick={() => void handleSave()}
              disabled={busy}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f46a16] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#d95108] disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Right Live Preview Column (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#f46a16]" />
                <h3 className="text-xs font-bold text-slate-900">Live Visual Preview</h3>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                {activeTab}
              </span>
            </div>

            {/* Simulated Live Section Preview */}
            {activeTab === "hero" && (
              <div className="relative overflow-hidden rounded-xl bg-[#03172a] p-4 text-white shadow-inner min-h-[260px] flex flex-col justify-between">
                {/* Background Video or Image backdrop */}
                {values.heroVideoUrl ? (
                  <video
                    key={values.heroVideoUrl}
                    src={values.heroVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-35 pointer-events-none"
                  />
                ) : values.heroBackgroundImage ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-35 pointer-events-none"
                    style={{ backgroundImage: `url(${values.heroBackgroundImage})` }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
                    style={{
                      backgroundImage:
                        'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80")',
                    }}
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#03172a]/95 via-[#03172a]/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#f46a16]">
                    {values.heroEyebrow || "Global logistics · Saudi Arabia"}
                  </span>
                  <span className="rounded bg-black/50 px-2 py-0.5 text-[8px] font-semibold text-slate-300 backdrop-blur">
                    {values.heroVideoUrl ? "🎥 Video Playing" : values.heroBackgroundImage ? "🖼️ Image Backdrop" : "Default Port Image"}
                  </span>
                </div>

                <div className="relative z-10 my-2">
                  <h4 className="text-base font-bold leading-tight text-white">
                    {values.heroTitleLine1 || "Connecting Trade Lanes with"}{" "}
                    <span className="text-[#f46a16]">{values.heroTitleLine2 || "Reliability & Scale"}</span>
                  </h4>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-slate-300 line-clamp-3">
                    {values.heroDescription || "Integrated ocean, air, and overland transportation..."}
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2">
                  <span className="rounded bg-[#f46a16] px-2.5 py-1 text-[9px] font-bold text-white shadow-xs">
                    {values.heroBtnQuote || "Request a Quote"}
                  </span>
                  <span className="rounded border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">
                    {values.heroBtnServices || "Explore Our Services"}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="rounded-xl border border-slate-100 bg-[#f7f8f9] p-4 text-slate-900">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#f46a16]">
                  {values.aboutEyebrow || "About Meridian · 01"}
                </span>
                <h4 className="mt-1 text-sm font-bold text-slate-900 leading-tight">
                  {values.aboutTitle || "Strategic Logistics Management"}
                </h4>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-600 line-clamp-3">
                  {values.aboutDescription || "Headquartered in Saudi Arabia..."}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-200/60 pt-2 text-[9px]">
                  <div>
                    <strong className="block text-slate-800 font-semibold truncate">
                      {values.aboutHighlight1Title || "Reliable"}
                    </strong>
                    <span className="text-[8px] text-slate-500 truncate block">
                      {values.aboutHighlight1Subtitle || "Your needs"}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold truncate">
                      {values.aboutHighlight2Title || "Global"}
                    </strong>
                    <span className="text-[8px] text-slate-500 truncate block">
                      {values.aboutHighlight2Subtitle || "Expertise"}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold truncate">
                      {values.aboutHighlight3Title || "Tailored"}
                    </strong>
                    <span className="text-[8px] text-slate-500 truncate block">
                      {values.aboutHighlight3Subtitle || "Solutions"}
                    </span>
                  </div>
                </div>

                {/* 3-Image Interactive Composition Live Preview */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                      Right-Side 3-Image Display
                    </span>
                    <span className="text-[8px] font-bold text-[#f46a16] bg-orange/10 px-1.5 py-0.5 rounded">
                      Scroll Zoom & Parallax
                    </span>
                  </div>
                  <div className="relative h-32 rounded-xl bg-slate-200/70 p-2 overflow-hidden border border-slate-200/90 shadow-inner">
                    {/* Image 1: Main Landscape Left */}
                    <div className="absolute left-1.5 top-2.5 w-[64%] h-24 rounded-lg overflow-hidden border-2 border-white shadow-md bg-slate-300">
                      <img
                        src={values.aboutImage1 || DEFAULT_ABOUT_IMAGES.image1}
                        alt="Preview 1"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 rounded bg-[#03182c]/80 text-[7px] font-bold text-white px-1">
                        1: Zoom In
                      </span>
                    </div>

                    {/* Image 2: Top Right */}
                    <div className="absolute right-1.5 top-1 w-[40%] h-14 rounded-lg overflow-hidden border-2 border-white shadow-md bg-slate-300">
                      <img
                        src={values.aboutImage2 || DEFAULT_ABOUT_IMAGES.image2}
                        alt="Preview 2"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0.5 right-0.5 rounded bg-[#f46a16]/90 text-[7px] font-bold text-white px-1">
                        2: Top
                      </span>
                    </div>

                    {/* Image 3: Bottom Right */}
                    <div className="absolute right-1.5 bottom-1 w-[38%] h-14 rounded-lg overflow-hidden border-2 border-white shadow-md bg-slate-300">
                      <img
                        src={values.aboutImage3 || DEFAULT_ABOUT_IMAGES.image3}
                        alt="Preview 3"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-emerald-700/90 text-[7px] font-bold text-white px-1">
                        3: Bottom
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "network" && (
              <div className="rounded-xl bg-[#07203a] p-4 text-white">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#f46a16]">
                  {values.networkEyebrow || "Our global network · 03"}
                </span>
                <h4 className="mt-1 text-sm font-bold text-white">
                  {values.networkTitle || "Connecting Key Markets Worldwide"}
                </h4>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-300">
                  {values.networkDescription || "Discuss your origin, destination..."}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-slate-400">
                  <span className="truncate max-w-[170px]">{values.networkFact || "Route confirmed..."}</span>
                  <span className="text-[#f46a16] font-bold flex items-center gap-1">
                    {values.networkBtn || "Network"} <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            )}

            {activeTab === "why" && (
              <div className="rounded-xl border border-slate-100 bg-[#f5f7f8] p-4 text-slate-900">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#f46a16]">
                  {values.whyEyebrow || "Why choose Meridian · 05"}
                </span>
                <h4 className="mt-1 text-sm font-bold text-slate-900">
                  {values.whyTitle || "Your Trusted Partner in Global Logistics"}
                </h4>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
                  {values.whyDescription || "We combine thoughtful coordination..."}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#f46a16]">
                    {values.whyBtn || "Why Meridian"} <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            )}

            {activeTab === "cta" && (
              <div className="rounded-xl bg-gradient-to-r from-[#03182c] to-[#0a2f52] p-4 text-white">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff9b54]">
                  {values.ctaEyebrow || "Ready to move forward?"}
                </span>
                <h4 className="mt-1 text-sm font-bold leading-tight text-white">
                  {values.ctaTitleLine1 || "Move your freight with confidence"}{" "}
                  <span className="block text-slate-200 font-normal">
                    {values.ctaTitleLine2 || "across global trade lanes"}
                  </span>
                </h4>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-300">
                  {values.ctaDescription || "Connect with our logistics team..."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded bg-[#f46a16] px-2 py-0.5 text-[9px] font-bold text-white">
                    {values.ctaBtnQuote || "Request a Quote"}
                  </span>
                  <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white">
                    {values.ctaBtnContact || "Contact Us"}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600 leading-relaxed">
              <strong className="block text-slate-800 font-semibold mb-0.5">Tip:</strong>
              Services and Industries have their own dedicated managers in the sidebar. This tab manages your storefront narrative and conversion messaging.
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border p-3.5 shadow-lg backdrop-blur transition-all duration-300 ${
              toast.type === "error"
                ? "border-rose-200 bg-rose-50/95 text-rose-900"
                : toast.type === "info"
                ? "border-sky-200 bg-sky-50/95 text-sky-900"
                : toast.type === "warning"
                ? "border-amber-200 bg-amber-50/95 text-amber-900"
                : "border-emerald-200 bg-emerald-50/95 text-emerald-900"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "error" && <AlertCircle size={16} className="text-rose-600" />}
              {toast.type === "info" && <Info size={16} className="text-sky-600" />}
              {toast.type === "warning" && <AlertTriangle size={16} className="text-amber-600" />}
              {toast.type === "success" && <CheckCircle2 size={16} className="text-emerald-600" />}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold leading-none">{toast.title}</h5>
              <p className="mt-1 text-[11px] leading-relaxed opacity-90">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
