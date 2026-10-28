"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { CloudUpload, LoaderCircle, ClipboardCheck, Sparkles } from "lucide-react";

export type UploadedAsset = {
  id: string;
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  alt_text: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at: string;
};

interface CloudinaryUploaderProps {
  onUploaded: (asset: UploadedAsset) => void;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  enablePaste?: boolean;
  onPasteUrl?: (url: string) => void;
}

export function CloudinaryUploader({
  onUploaded,
  compact = false,
  title,
  subtitle,
  enablePaste = true,
  onPasteUrl,
}: CloudinaryUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [pastedFeedback, setPastedFeedback] = useState(false);

  // Single file upload worker
  const uploadSingle = async (file: File, prefix = ""): Promise<void> => {
    let mimeType = file.type;
    let fileName = file.name;

    if (!mimeType || mimeType === "application/octet-stream") {
      mimeType = "image/png";
    }

    if (!fileName || fileName === "blob" || fileName === "image") {
      const ext = mimeType.split("/")[1] || "png";
      fileName = `pasted-image-${Date.now()}.${ext}`;
    }

    // Ensure valid file with proper name
    const validFile = file.name === fileName ? file : new File([file], fileName, { type: mimeType });

    const resourceType = validFile.type.startsWith("video/") ? "video" : "image";
    setMessage(`${prefix}Preparing ${fileName}…`);

    const signatureResponse = await fetch("/api/admin/cloudinary-signature", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        resourceType,
        fileName: validFile.name,
        mimeType: validFile.type,
        bytes: validFile.size,
      }),
    });

    const signature = await signatureResponse.json();
    if (!signatureResponse.ok) {
      throw new Error(signature.error || "Could not prepare upload signature.");
    }

    const form = new FormData();
    Object.entries({
      api_key: signature.apiKey,
      timestamp: String(signature.timestamp),
      signature: signature.signature,
      folder: signature.folder,
      public_id: signature.publicId,
      overwrite: "false",
    }).forEach(([key, value]) => form.set(key, value));
    form.set("file", validFile);

    setMessage(`${prefix}Uploading ${validFile.name} to Cloudinary…`);
    const uploadResponse = await fetch(signature.uploadUrl, {
      method: "POST",
      body: form,
    });
    const cloud = await uploadResponse.json();
    if (!uploadResponse.ok) {
      throw new Error(cloud.error?.message || "Cloudinary upload failed.");
    }

    setMessage(`${prefix}Saving media record…`);
    const recordResponse = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        public_id: cloud.public_id,
        secure_url: cloud.secure_url,
        resource_type: cloud.resource_type,
        format: cloud.format,
        bytes: cloud.bytes,
        width: cloud.width,
        height: cloud.height,
        duration: cloud.duration,
        alt_text: "",
      }),
    });
    const record = await recordResponse.json();
    if (!recordResponse.ok) {
      throw new Error(record.error || "Upload succeeded but the media record could not be saved.");
    }

    onUploaded(record.asset);
    setMessage(`${prefix}Uploaded successfully!`);
  };

  // Upload multiple files sequentially if provided
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (validFiles.length === 0) {
        setMessage("Please select or drop a valid image or video.");
        return;
      }

      setBusy(true);
      try {
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const prefix = validFiles.length > 1 ? `[${i + 1}/${validFiles.length}] ` : "";
          await uploadSingle(file, prefix);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setBusy(false);
        if (input.current) input.current.value = "";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUploaded]
  );

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (busy) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void uploadFiles(files);
    }
  };

  // Clipboard paste handler
  const processClipboard = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent) => {
      if (busy) return;

      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      const clipboardData = "clipboardData" in e ? e.clipboardData : null;
      if (!clipboardData) return;

      const imageFiles: File[] = [];

      // 1. Check for files in clipboard
      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          const f = clipboardData.files[i];
          if (f.type.startsWith("image/") || f.type.startsWith("video/")) {
            imageFiles.push(f);
          }
        }
      }

      // 2. Check for clipboard items (e.g. screenshots from Snipping Tool / Ctrl+V from image copy)
      if (imageFiles.length === 0 && clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.type.startsWith("image/")) {
            const blob = item.getAsFile();
            if (blob) {
              const ext = blob.type.split("/")[1] || "png";
              const name =
                blob.name && blob.name !== "image.png" && blob.name !== "blob"
                  ? blob.name
                  : `pasted-logo-${Date.now()}.${ext}`;
              imageFiles.push(new File([blob], name, { type: blob.type }));
            }
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        setPastedFeedback(true);
        setTimeout(() => setPastedFeedback(false), 2500);
        void uploadFiles(imageFiles);
        return;
      }

      // 3. Check for image URL text if not currently focused in an input
      if (!isInput && onPasteUrl) {
        const text = clipboardData.getData("text/plain")?.trim();
        if (text && /^https?:\/\/.+\.(png|jpe?g|webp|svg|gif|avif)(\?.*)?$/i.test(text)) {
          e.preventDefault();
          onPasteUrl(text);
        }
      }
    },
    [busy, onPasteUrl, uploadFiles]
  );

  // Global window paste listener when enablePaste is true
  useEffect(() => {
    if (!enablePaste) return;
    const listener = (e: ClipboardEvent) => processClipboard(e);
    window.addEventListener("paste", listener);
    return () => window.removeEventListener("paste", listener);
  }, [enablePaste, processClipboard]);

  const defaultTitle = title || "Upload image or video";
  const defaultSubtitle =
    subtitle || "Drag & drop files here, paste from clipboard (Ctrl+V), or click to browse";

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={processClipboard}
      className="w-full"
    >
      <input
        ref={input}
        className="sr-only"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
        disabled={busy}
        onChange={(event) => void uploadFiles(event.target.files || [])}
      />

      <div
        role="button"
        tabIndex={0}
        aria-disabled={busy}
        onClick={() => {
          if (!busy) input.current?.click();
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            input.current?.click();
          }
        }}
        className={`group relative flex w-full items-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none text-left outline-none ${
          isDragging
            ? "border-orange bg-orange-50/70 ring-4 ring-orange-200/60 scale-[1.01]"
            : "border-slate-300/80 bg-slate-50/70 hover:border-orange hover:bg-orange/[.03] focus-visible:ring-2 focus-visible:ring-orange/40"
        } ${busy ? "opacity-75 pointer-events-none cursor-wait" : ""} ${
          compact ? "px-4 py-3" : "flex-col justify-center px-6 py-9 text-center"
        }`}
      >
        {/* Floating badge for Paste Feedback */}
        {pastedFeedback && (
          <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange text-white text-[11px] font-semibold shadow-md animate-bounce">
            <ClipboardCheck size={13} />
            Pasted from clipboard!
          </div>
        )}

        {/* Icon */}
        <span
          className={`grid shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 group-hover:scale-105 group-hover:ring-orange/30 group-hover:text-orange ${
            isDragging ? "scale-110 text-orange ring-orange" : "text-slate-600"
          } ${compact ? "h-10 w-10" : "h-14 w-14"}`}
        >
          {busy ? (
            <LoaderCircle size={compact ? 18 : 24} className="animate-spin text-orange" />
          ) : isDragging ? (
            <Sparkles size={compact ? 18 : 24} className="text-orange animate-pulse" />
          ) : (
            <CloudUpload size={compact ? 18 : 24} />
          )}
        </span>

        {/* Text Details */}
        <div className="min-w-0 space-y-1">
          <span className="block text-sm sm:text-base font-bold text-slate-800">
            {busy
              ? "Processing upload…"
              : isDragging
              ? "Drop files here to upload instantly"
              : defaultTitle}
          </span>

          <span
            aria-live="polite"
            className="block truncate text-xs sm:text-[13px] text-slate-500 max-w-md mx-auto"
          >
            {message || defaultSubtitle}
          </span>

          {/* Micro badges for Drag & Drop + Paste */}
          {!compact && !busy && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <span>Drag & drop files</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <kbd className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                  Ctrl
                </kbd>
                +
                <kbd className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                  V
                </kbd>
                <span>to paste image</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

