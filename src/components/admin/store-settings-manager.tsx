"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  LoaderCircle,
  Mail,
  Megaphone,
  Phone,
  Save,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  defaultStoreSettings,
  formatWhatsAppUrl,
  type StoreSettings,
} from "@/data/settings";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/social-icons";

export function StoreSettingsManager() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/store-settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const json = await res.json();
        if (json.value) {
          setSettings(json.value);
        }
      } catch {
        setMessage({
          type: "error",
          text: "Could not load current settings. Using defaults.",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings");

      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred while saving.",
      });
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const waPreviewUrl = formatWhatsAppUrl(settings.whatsapp);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle size={20} className="animate-spin text-orange" />
          <span>Loading store settings...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange">
            <SlidersHorizontal size={14} />
            <span>Storefront Configuration</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Store Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage corporate contact channels and social media presence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Eye size={14} />
            <span>View Storefront</span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#d95108] disabled:opacity-60 transition"
          >
            {saving ? (
              <>
                <LoaderCircle size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert status message */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Section 2: Contact Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange">
            <Phone size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Contact Information</h2>
            <p className="text-xs text-slate-500">
              Corporate email and phone numbers displayed in the top bar and footer.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Primary Phone Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={settings.phone_1}
                onChange={(e) => update("phone_1", e.target.value)}
                placeholder="+966 11 000 0000"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Automatically creates a <code className="text-orange">tel:</code> link.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Secondary Phone Number <span className="font-normal text-slate-400 lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={settings.phone_2}
                onChange={(e) => update("phone_2", e.target.value)}
                placeholder="+966 50 000 0000"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Additional line (mobile or support desk).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Company Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="info@meridianlogistics.sa"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Automatically creates a <code className="text-orange">mailto:</code> link.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Social Media & Messaging */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Social Media & Channels</h2>
              <p className="text-xs text-slate-500">
                Only channels with a value entered here will display an icon on the storefront. Leave blank to hide.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hidden sm:inline-block">
            Auto-hidden if blank
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* WhatsApp (Special: Phone input => wa.me link) */}
          <div className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon size={14} />
              </span>
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                WhatsApp Chat Number
              </label>
            </div>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="e.g. +966500000000 or 966500000000"
              className="w-full rounded-lg border border-emerald-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-800">
              <p>
                Enter the phone number with country code. The storefront converts this into a direct click-to-chat link.
              </p>
              {waPreviewUrl && (
                <span className="font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  Storefront target: {waPreviewUrl}
                </span>
              )}
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#E4405F] text-white">
                <InstagramIcon size={12} />
              </span>
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={settings.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="https://instagram.com/meridianlogistics"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0A66C2] text-white">
                <LinkedInIcon size={12} />
              </span>
              LinkedIn Company URL
            </label>
            <input
              type="url"
              value={settings.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/meridian-logistics"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
            />
          </div>

          {/* X / Twitter */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-white">
                <XIcon size={11} />
              </span>
              X (formerly Twitter) URL
            </label>
            <input
              type="url"
              value={settings.x}
              onChange={(e) => update("x", e.target.value)}
              placeholder="https://x.com/meridian_log"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
            />
          </div>

          {/* Facebook */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1877F2] text-white">
                <FacebookIcon size={12} />
              </span>
              Facebook Page URL <span className="font-normal text-slate-400 lowercase">(optional)</span>
            </label>
            <input
              type="url"
              value={settings.facebook}
              onChange={(e) => update("facebook", e.target.value)}
              placeholder="https://facebook.com/meridianlogistics"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-orange focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 z-30 flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <span className="text-xs text-slate-500">
          Make sure to save changes so they reflect immediately on the storefront.
        </span>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#d95108] disabled:opacity-60 transition"
        >
          {saving ? (
            <>
              <LoaderCircle size={15} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
