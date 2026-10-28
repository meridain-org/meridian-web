import "server-only";
import { createClient } from "@supabase/supabase-js";
import { imageUrl, type Industry, type Service } from "@/data/content";
import { cloudinaryDeliveryUrl, cloudinaryImageUrl } from "@/lib/cloudinary";

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}
type Row = Record<string, unknown>;
async function published(table: "services" | "industries"): Promise<Row[]> {
  const db = database();
  if (!db) return [];
  try {
    const { data, error } = await db.from(table).select("*").eq("is_published", true).order("display_order", { ascending: true });
    if (error) {
      console.error(`Could not load published ${table}: ${error.code ?? "unknown"}`);
      return [];
    }
    return (data ?? []) as Row[];
  } catch (error) {
    console.error(`Could not load published ${table}:`, error);
    return [];
  }
}
function text(value: unknown) { return typeof value === "string" ? value : ""; }
function dataObject(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function stringList(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function imageSource(value: unknown) {
  const source = text(value);
  if (!source) return "";
  if (source.startsWith("https://")) return cloudinaryDeliveryUrl(source);
  if (source.startsWith("photo-")) return imageUrl(source);
  return cloudinaryImageUrl(source) ?? "";
}

export async function getServices(): Promise<Service[]> {
  const rows = await published("services");
  return rows.flatMap(row => {
    const slug = text(row.slug);
    if (!slug) return [];
    const content = dataObject(row.content);
    return [{
      slug,
      title: text(row.title),
      short: text(row.short_description),
      image: imageSource(row.cover_image),
      description: text(content.description) || text(row.short_description),
      benefits: stringList(content.benefits),
      process: stringList(content.process),
      industries: stringList(content.industries),
    }];
  });
}

export async function getIndustries(): Promise<Industry[]> {
  const rows = await published("industries");
  return rows.flatMap(row => {
    const slug = text(row.slug);
    if (!slug) return [];
    const content = dataObject(row.content);
    return [{
      slug,
      title: text(row.title),
      image: imageSource(row.cover_image),
      intro: text(content.intro) || text(row.short_description),
      challenges: stringList(content.challenges),
      solutions: stringList(content.solutions),
      services: stringList(content.services),
    }];
  });
}

export type SiteMedia = { secure_url: string; public_id: string; resource_type: "image" | "video"; alt_text: string };
export async function getSiteMedia(): Promise<Record<string, SiteMedia>> {
  const db = database(); if (!db) return {};
  try {
    const { data: slots, error } = await db.from("site_media").select("slot,alt_text,asset_id");
    if (error || !slots?.length) return {};
    const { data: assets, error: assetError } = await db.from("media_assets").select("id,secure_url,public_id,resource_type").in("id", slots.map(slot => slot.asset_id));
    if (assetError || !assets) return {};
    const byId = new Map(assets.map(asset => [asset.id, asset]));
    return Object.fromEntries(slots.flatMap(slot => { const asset = byId.get(slot.asset_id); if (!asset) return []; const resourceType = asset.resource_type === "video" ? "video" : "image"; return [[slot.slot, { secure_url: cloudinaryDeliveryUrl(asset.secure_url, resourceType), public_id: asset.public_id, resource_type: resourceType, alt_text: slot.alt_text || "" } satisfies SiteMedia]]; }));
  } catch { return {}; }
}

export async function getSiteMediaImage(slot: string): Promise<string | null> {
  const media = (await getSiteMedia())[slot];
  return media?.resource_type === "image" ? media.secure_url : null;
}

export async function getHomepageCopy(): Promise<Record<string, string>> {
  const db = database(); if (!db) return {};
  try {
    const { data, error } = await db.from("site_settings").select("value").eq("key", "public.homepage").maybeSingle();
    if (error || !data?.value || typeof data.value !== "object" || Array.isArray(data.value)) return {};
    return Object.fromEntries(Object.entries(data.value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch { return {}; }
}

export async function getStoreSettings(): Promise<import("@/data/settings").StoreSettings> {
  const { defaultStoreSettings } = await import("@/data/settings");
  const db = database();
  if (!db) return defaultStoreSettings;
  try {
    const { data, error } = await db.from("site_settings").select("value").eq("key", "public.store_settings").maybeSingle();
    if (error || !data?.value || typeof data.value !== "object" || Array.isArray(data.value)) {
      return defaultStoreSettings;
    }
    const val = data.value as Record<string, unknown>;
    return {
      email: typeof val.email === "string" ? val.email : defaultStoreSettings.email,
      phone_1: typeof val.phone_1 === "string" ? val.phone_1 : defaultStoreSettings.phone_1,
      phone_2: typeof val.phone_2 === "string" ? val.phone_2 : defaultStoreSettings.phone_2,
      whatsapp: typeof val.whatsapp === "string" ? val.whatsapp : defaultStoreSettings.whatsapp,
      instagram: typeof val.instagram === "string" ? val.instagram : defaultStoreSettings.instagram,
      linkedin: typeof val.linkedin === "string" ? val.linkedin : defaultStoreSettings.linkedin,
      x: typeof val.x === "string" ? val.x : defaultStoreSettings.x,
      facebook: typeof val.facebook === "string" ? val.facebook : defaultStoreSettings.facebook,
    };
  } catch {
    return defaultStoreSettings;
  }
}

export async function getClientLogos(): Promise<import("@/data/clients").ClientLogo[]> {
  const { defaultClientLogos } = await import("@/data/clients");
  const db = database();
  if (!db) return defaultClientLogos;
  try {
    const { data, error } = await db
      .from("client_logos")
      .select("id, logo_url, created_at")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultClientLogos;
    }

    return data.map(item => ({
      id: String(item.id),
      logo_url: imageSource(item.logo_url) || text(item.logo_url),
      created_at: text(item.created_at),
    }));
  } catch {
    return defaultClientLogos;
  }
}
