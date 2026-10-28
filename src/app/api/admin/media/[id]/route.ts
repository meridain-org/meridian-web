import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid media id." }, { status: 400 });
  const { data: asset, error: lookupError } = await auth.supabase.from("media_assets").select("id,public_id,resource_type").eq("id", id).maybeSingle();
  if (lookupError || !asset) return NextResponse.json({ error: "Media asset was not found." }, { status: 404 });
  const [siteUse, serviceUse, industryUse] = await Promise.all([
    auth.supabase.from("site_media").select("slot").eq("asset_id", id).limit(1),
    auth.supabase.from("services").select("id").eq("cover_image", asset.public_id).limit(1),
    auth.supabase.from("industries").select("id").eq("cover_image", asset.public_id).limit(1),
  ]);
  if ([siteUse, serviceUse, industryUse].some(result => result.data?.length)) return NextResponse.json({ error: "This asset is still in use. Unassign it from the site or content item first." }, { status: 409 });
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; const key = process.env.CLOUDINARY_API_KEY; const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return NextResponse.json({ error: "Cloudinary deletion is not configured." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters = `public_id=${asset.public_id}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(parameters + secret).digest("hex");
  const form = new FormData(); form.set("public_id", asset.public_id); form.set("timestamp", String(timestamp)); form.set("api_key", key); form.set("signature", signature);
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${asset.resource_type}/destroy`, { method: "POST", headers: { authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }, body: form, cache: "no-store" });
    const result = await response.json() as { result?: string };
    if (!response.ok || !["ok", "not found"].includes(result.result ?? "")) return NextResponse.json({ error: "Cloudinary could not delete the asset." }, { status: 502 });
    const { error } = await auth.supabase.from("media_assets").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Cloudinary deleted the file, but the CMS record could not be removed." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Cloudinary is temporarily unavailable." }, { status: 502 }); }
}
