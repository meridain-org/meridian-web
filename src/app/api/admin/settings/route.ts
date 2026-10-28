import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { deleteCloudinaryAsset } from "@/lib/server/cloudinary";

const homepageSchema = z.record(z.string(), z.string().max(5000));

export async function GET() {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase.from("site_settings").select("value").eq("key", "public.homepage").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load site copy." }, { status: 500 });
  return NextResponse.json({ value: data?.value ?? {} });
}

export async function PUT(request: NextRequest) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = homepageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Check the homepage copy fields." }, { status: 400 });

  // Check previous copy for replaced or removed Cloudinary media
  const { data: previousRecord } = await auth.supabase.from("site_settings").select("value").eq("key", "public.homepage").maybeSingle();
  const prev = (previousRecord?.value as Record<string, string> | undefined) ?? {};

  if (prev.heroVideoUrl && prev.heroVideoUrl !== parsed.data.heroVideoUrl) {
    await deleteCloudinaryAsset(prev.heroVideoUrl, "video", auth.supabase).catch(() => {});
  }
  if (prev.heroBackgroundImage && prev.heroBackgroundImage !== parsed.data.heroBackgroundImage) {
    await deleteCloudinaryAsset(prev.heroBackgroundImage, "image", auth.supabase).catch(() => {});
  }
  if (prev.aboutImage1 && prev.aboutImage1 !== parsed.data.aboutImage1) {
    await deleteCloudinaryAsset(prev.aboutImage1, "image", auth.supabase).catch(() => {});
  }
  if (prev.aboutImage2 && prev.aboutImage2 !== parsed.data.aboutImage2) {
    await deleteCloudinaryAsset(prev.aboutImage2, "image", auth.supabase).catch(() => {});
  }
  if (prev.aboutImage3 && prev.aboutImage3 !== parsed.data.aboutImage3) {
    await deleteCloudinaryAsset(prev.aboutImage3, "image", auth.supabase).catch(() => {});
  }

  const { error } = await auth.supabase.from("site_settings").upsert({ key: "public.homepage", value: parsed.data });
  return error ? NextResponse.json({ error: "Could not save homepage copy." }, { status: 400 }) : NextResponse.json({ ok: true });
}
