import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { defaultStoreSettings, type StoreSettings } from "@/data/settings";

const storeSettingsSchema = z.object({
  email: z.string().max(254).default(""),
  phone_1: z.string().max(50).default(""),
  phone_2: z.string().max(50).default(""),
  whatsapp: z.string().max(50).default(""),
  instagram: z.string().max(500).default(""),
  linkedin: z.string().max(500).default(""),
  x: z.string().max(500).default(""),
  facebook: z.string().max(500).default(""),
});

export async function GET() {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public.store_settings")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Could not load store settings." },
      { status: 500 }
    );
  }

  const value = (data?.value as Partial<StoreSettings> | undefined) ?? {};
  const merged: StoreSettings = {
    ...defaultStoreSettings,
    ...value,
  };

  return NextResponse.json({ value: merged });
}

export async function PUT(request: NextRequest) {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = storeSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid store settings input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { error } = await auth.supabase.from("site_settings").upsert({
    key: "public.store_settings",
    value: parsed.data,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save store settings to database." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data: parsed.data });
}
