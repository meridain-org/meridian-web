import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";

export async function GET() {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  const [quotes, contacts] = await Promise.all([
    auth.supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200),
    auth.supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  if (quotes.error || contacts.error) return NextResponse.json({ error: "Could not load enquiries. Apply the CMS migration first." }, { status: 500 });
  return NextResponse.json({ quotes: quotes.data, contacts: contacts.data });
}

export async function PATCH(request: NextRequest) {
  const auth = await adminContext(); if ("response" in auth) return auth.response;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = z.object({ kind: z.enum(["quote_requests", "contact_messages"]), id: z.string().uuid(), status: z.enum(["new", "in_progress", "responded", "closed", "spam"]) }).strict().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid enquiry update." }, { status: 400 });
  const { error } = await auth.supabase.from(parsed.data.kind).update({ status: parsed.data.status }).eq("id", parsed.data.id);
  return error ? NextResponse.json({ error: "Could not update enquiry." }, { status: 400 }) : NextResponse.json({ ok: true });
}
