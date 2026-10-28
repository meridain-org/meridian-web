import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";

export async function adminContext() {
  const context = await requireAdmin();
  if (!context.supabase) return { response: NextResponse.json({ error: "Supabase is not configured." }, { status: 503 }) } as const;
  if (!context.user) return { response: NextResponse.json({ error: "Sign in is required." }, { status: 401 }) } as const;
  if (!context.isAdmin) return { response: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }) } as const;
  return { ...context } as const;
}
