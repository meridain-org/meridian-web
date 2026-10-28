import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const email = z.string().trim().email().max(254);
const shared = { name: z.string().trim().min(2).max(100), company_name: z.string().trim().max(150).optional().default(""), email, phone: z.string().trim().min(7).max(35), message: z.string().trim().min(10).max(4000), website: z.string().max(0).optional() };
const optionalMeasure = z.string().max(30).optional().default("").refine(value => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0));
const optionalDate = z.iso.date().optional().or(z.literal("")).default("");
export const quoteInput = z.object({ ...shared, company_name: z.string().trim().min(1).max(150), origin_country: z.string().trim().min(2).max(100), origin_city: z.string().trim().min(2).max(100), destination_country: z.string().trim().min(2).max(100), destination_city: z.string().trim().min(2).max(100), service_type: z.enum(["Sea Freight", "Air Freight", "Land Transportation", "Customs Clearance", "Warehousing & 3PL", "Project Logistics", "Heavy-Lift Cargo", "Door-to-Door Logistics"]), cargo_type: z.string().trim().min(2).max(200), cargo_weight: optionalMeasure, cargo_volume: optionalMeasure, preferred_shipping_date: optionalDate, }).strict();
export const contactInput = z.object({ ...shared, phone: z.string().trim().max(35).optional().default(""), subject: z.string().trim().min(3).max(150) }).strict();

type Outcome = { ok: true } | { ok: false; status: 400 | 429 | 503 };
const recent = new Map<string, number[]>();
function allowRequest(key: string) {
  const now = Date.now(); const remaining = (recent.get(key) ?? []).filter(t => now - t < 60_000);
  if (remaining.length >= 5) { recent.set(key, remaining); return false; }
  remaining.push(now); recent.set(key, remaining);
  if (recent.size > 5000) for (const [k, timestamps] of recent) if (!timestamps.length || now - timestamps[timestamps.length - 1] > 60_000) recent.delete(k);
  return true;
}

export async function saveSubmission(table: "quote_requests" | "contact_messages", payload: unknown, ip: string): Promise<Outcome> {
  const parsed = (table === "quote_requests" ? quoteInput : contactInput).safeParse(payload);
  if (!parsed.success) return { ok: false, status: 400 };
  if ("website" in parsed.data && parsed.data.website) return { ok: true };
  if (!allowRequest(`${table}:${ip}`)) return { ok: false, status: 429 };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { ok: false, status: 503 };
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const data = { ...parsed.data };
    delete data.website;
    const row: Record<string, unknown> = { ...data };
    if (table === "quote_requests" && row.preferred_shipping_date === "") row.preferred_shipping_date = null;
    const { error } = await db.from(table).insert(row);
    if (error) { console.error(`Submission storage failed for ${table}: ${error.code ?? "unknown"}`); return { ok: false, status: 503 }; }
    return { ok: true };
  } catch { return { ok: false, status: 503 }; }
}
