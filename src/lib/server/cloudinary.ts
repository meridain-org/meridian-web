import "server-only";
import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CloudinaryAssetInfo = {
  publicId: string;
  resourceType: "image" | "video" | "raw";
};

/**
 * Extracts public_id and resource_type from a Cloudinary URL or public_id string.
 * Returns null if not a valid Cloudinary asset or belongs to a different cloud account.
 */
export function parseCloudinaryAsset(
  input: string,
  fallbackResourceType: "image" | "video" = "image"
): CloudinaryAssetInfo | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Case 1: Full URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (!url.hostname.endsWith("cloudinary.com")) return null;

      const parts = url.pathname.split("/").filter(Boolean);
      // Expected structure: [cloud_name, resource_type, "upload", ...(transformations), (v<version>), public_id.ext]
      if (parts.length < 4) return null;

      const [urlCloud, resType, action, ...rest] = parts;
      if (cloudName && urlCloud !== cloudName) return null;
      if (action !== "upload") return null;

      const resourceType = (
        resType === "video" ? "video" : resType === "raw" ? "raw" : "image"
      ) as "image" | "video" | "raw";

      let fileSegments = rest;
      const versionIdx = fileSegments.findIndex((s) => /^v\d+$/.test(s));
      if (versionIdx !== -1) {
        fileSegments = fileSegments.slice(versionIdx + 1);
      } else {
        while (
          fileSegments.length > 1 &&
          (fileSegments[0].includes(",") || /^[a-z]_[a-zA-Z0-9]+/.test(fileSegments[0]))
        ) {
          fileSegments.shift();
        }
      }

      if (fileSegments.length === 0) return null;

      const fullPath = fileSegments.join("/");
      // Strip extension (e.g. .mp4, .jpg, .webp)
      const publicId = fullPath.replace(/\.[a-zA-Z0-9]+$/, "");
      return { publicId, resourceType };
    } catch {
      return null;
    }
  }

  // Case 2: Plain public ID string (e.g. "meridian/20261027-fa8ba40b-3e5c...")
  if (/^[a-zA-Z0-9_/-]+(\.[a-zA-Z0-9]+)?$/.test(trimmed)) {
    const publicId = trimmed.replace(/\.[a-zA-Z0-9]+$/, "");
    return { publicId, resourceType: fallbackResourceType };
  }

  return null;
}

/**
 * Deletes an asset directly from Cloudinary using Cloudinary's Destroy API.
 * Also cleans up any matching record in Supabase media_assets.
 */
export async function deleteCloudinaryAsset(
  input: string,
  fallbackResourceType: "image" | "video" = "image",
  supabase?: SupabaseClient
): Promise<{ ok: boolean; result?: string; publicId?: string; error?: string; skipped?: boolean }> {
  const parsed = parseCloudinaryAsset(input, fallbackResourceType);
  if (!parsed) {
    return { ok: true, skipped: true };
  }

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !key || !secret) {
    return { ok: false, error: "Cloudinary credentials are not configured on the server." };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Sort parameters alphabetically: invalidate=true & public_id=... & timestamp=...
  const signatureBase = `invalidate=true&public_id=${parsed.publicId}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(signatureBase + secret).digest("hex");

  const form = new FormData();
  form.set("public_id", parsed.publicId);
  form.set("timestamp", String(timestamp));
  form.set("api_key", key);
  form.set("signature", signature);
  form.set("invalidate", "true");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/${parsed.resourceType}/destroy`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
        },
        body: form,
        cache: "no-store",
      }
    );

    const result = (await response.json()) as { result?: string; error?: { message?: string } };

    if (!response.ok || !["ok", "not found"].includes(result.result ?? "")) {
      return {
        ok: false,
        publicId: parsed.publicId,
        error: result.error?.message || "Cloudinary destroy request failed.",
      };
    }

    // Clean up Supabase media_assets table if client provided
    if (supabase) {
      await supabase.from("media_assets").delete().eq("public_id", parsed.publicId);
    }

    return {
      ok: true,
      result: result.result,
      publicId: parsed.publicId,
    };
  } catch (err) {
    return {
      ok: false,
      publicId: parsed.publicId,
      error: err instanceof Error ? err.message : "Cloudinary connection error.",
    };
  }
}
