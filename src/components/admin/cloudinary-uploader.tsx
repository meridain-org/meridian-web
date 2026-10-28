"use client";
import { useRef, useState } from "react";
import { CloudUpload, LoaderCircle } from "lucide-react";

export type UploadedAsset = { id: string; public_id: string; secure_url: string; resource_type: "image" | "video"; alt_text: string; format?: string; bytes: number; width?: number; height?: number; duration?: number; created_at: string };

export function CloudinaryUploader({ onUploaded, compact = false }: { onUploaded: (asset: UploadedAsset) => void; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    setBusy(true); setMessage("Preparing…");
    try {
      const signatureResponse = await fetch("/api/admin/cloudinary-signature", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resourceType, fileName: file.name, mimeType: file.type, bytes: file.size }) });
      const signature = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signature.error || "Could not start the upload.");
      const form = new FormData();
      Object.entries({ api_key: signature.apiKey, timestamp: String(signature.timestamp), signature: signature.signature, folder: signature.folder, public_id: signature.publicId, overwrite: "false" }).forEach(([key, value]) => form.set(key, value));
      form.set("file", file);
      setMessage(file.name);
      const uploadResponse = await fetch(signature.uploadUrl, { method: "POST", body: form });
      const cloud = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(cloud.error?.message || "Cloudinary upload failed.");
      const recordResponse = await fetch("/api/admin/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ public_id: cloud.public_id, secure_url: cloud.secure_url, resource_type: cloud.resource_type, format: cloud.format, bytes: cloud.bytes, width: cloud.width, height: cloud.height, duration: cloud.duration, alt_text: "" }) });
      const record = await recordResponse.json();
      if (!recordResponse.ok) throw new Error(record.error || "Upload succeeded but the media record could not be saved.");
      onUploaded(record.asset); setMessage("Uploaded.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  return <div>
    <input ref={input} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" disabled={busy} onChange={event => void upload(event.target.files?.[0])}/>
    <button type="button" disabled={busy} onClick={() => input.current?.click()} className={`group flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 text-left transition hover:border-orange hover:bg-orange/[.04] disabled:opacity-70 ${compact ? "px-3.5 py-3" : "flex-col justify-center px-6 py-10 text-center"}`}>
      <span className={`grid shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition group-hover:text-orange ${compact ? "h-9 w-9" : "h-12 w-12"}`}>{busy ? <LoaderCircle size={compact ? 16 : 20} className="animate-spin"/> : <CloudUpload size={compact ? 16 : 20}/>}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-800">{busy ? "Uploading…" : "Upload image or video"}</span>
        <span aria-live="polite" className="block truncate text-xs text-slate-400">{message || "Images 10 MB · Videos 100 MB"}</span>
      </span>
    </button>
  </div>;
}
