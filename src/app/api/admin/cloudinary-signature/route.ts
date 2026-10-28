import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";

const requestSchema = z.object({ resourceType: z.enum(["image", "video"]), fileName: z.string().min(1).max(255), mimeType: z.string().max(100), bytes: z.number().int().positive() }).strict();
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(request: NextRequest) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  let input: unknown; try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload details." }, { status: 400 });
  const { resourceType, fileName, mimeType, bytes } = parsed.data;
  const maxBytes = resourceType === "image" ? 5 * 1024 * 1024 : 15 * 1024 * 1024;
  const valid = resourceType === "image" ? imageTypes.has(mimeType) && bytes <= maxBytes : videoTypes.has(mimeType) && bytes <= maxBytes;
  if (!valid || /[\x00-\x1f]/.test(fileName)) return NextResponse.json({ error: resourceType === "image" ? "Image size exceeds the 5 MB limit. Use a JPEG, PNG, WebP, or AVIF image up to 5 MB." : "Video size exceeds the 15 MB limit. Use an MP4, WebM, or MOV video up to 15 MB." }, { status: 400 });
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) return NextResponse.json({ error: "Cloudinary signed uploads are not configured." }, { status: 503 });
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim().replace(/^\/+|\/+$/g, "") || "meridian";
  if (!/^[a-zA-Z0-9_/-]+$/.test(folder)) return NextResponse.json({ error: "Cloudinary upload folder configuration is invalid." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${folder}/${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID()}`;
  const params = { folder, overwrite: "false", public_id: publicId, timestamp: String(timestamp) };
  const signatureBase = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
  const signature = createHash("sha1").update(signatureBase + apiSecret).digest("hex");
  return NextResponse.json({ cloudName: cloud, apiKey, timestamp, signature, folder, publicId, uploadUrl: `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload` });
}
