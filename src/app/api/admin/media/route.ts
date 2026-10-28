import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";

const assetSchema = z.object({ public_id: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_/-]+$/), secure_url: z.string().url().max(2048), resource_type: z.enum(["image", "video"]), format: z.string().max(30).optional(), bytes: z.number().int().min(0).max(100 * 1024 * 1024), width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), duration: z.number().min(0).optional(), alt_text: z.string().max(500).optional().default("") }).strict();
const slotSchema = z.object({ slot: z.string().trim().min(2).max(101).regex(/^[a-z0-9][a-z0-9._-]+$/), asset_id: z.string().uuid(), alt_text: z.string().max(500).optional().default("") }).strict();

export async function GET() {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  const [{ data: assets, error: assetError }, { data: slots, error: slotError }] = await Promise.all([
    auth.supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
    auth.supabase.from("site_media").select("slot,asset_id,alt_text"),
  ]);
  if (assetError || slotError) return NextResponse.json({ error: "Could not load the media library. Apply the CMS migration first." }, { status: 500 });
  return NextResponse.json({ assets, slots });
}

export async function POST(request: NextRequest) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = assetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "The uploaded asset metadata is invalid." }, { status: 400 });
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const expected = `https://res.cloudinary.com/${cloud}/${parsed.data.resource_type}/upload/`;
  if (!cloud || !parsed.data.secure_url.startsWith(expected)) return NextResponse.json({ error: "The asset must belong to the configured Cloudinary account." }, { status: 400 });
  const { data, error } = await auth.supabase.from("media_assets").insert({ ...parsed.data, created_by: auth.user.id }).select().single();
  if (error) return NextResponse.json({ error: "Could not add the upload to the media library." }, { status: 400 });
  return NextResponse.json({ asset: data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = slotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Provide a valid media slot and asset." }, { status: 400 });
  const { data: asset } = await auth.supabase.from("media_assets").select("resource_type").eq("id", parsed.data.asset_id).maybeSingle();
  if (!asset) return NextResponse.json({ error: "Media asset was not found." }, { status: 404 });
  if (asset.resource_type === "video" && parsed.data.slot !== "home.hero") return NextResponse.json({ error: "Video assets can currently be assigned only to the homepage hero slot." }, { status: 400 });
  const { data, error } = await auth.supabase.from("site_media").upsert({ ...parsed.data, updated_by: auth.user.id }).select().single();
  if (error) return NextResponse.json({ error: "Could not update the site media slot." }, { status: 400 });
  return NextResponse.json({ slot: data });
}
