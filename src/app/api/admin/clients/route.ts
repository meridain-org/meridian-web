import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { defaultClientLogos } from "@/data/clients";

const clientLogoSchema = z.object({
  logo_url: z.string().trim().min(1, "Logo URL is required").max(2048),
});

export async function GET() {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  try {
    const { data, error } = await auth.supabase
      .from("client_logos")
      .select("id, logo_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Could not query client_logos table:", error.message);
      return NextResponse.json({ items: defaultClientLogos });
    }

    return NextResponse.json({ items: data ?? defaultClientLogos });
  } catch (err) {
    console.error("GET /api/admin/clients error:", err);
    return NextResponse.json({ items: defaultClientLogos });
  }
}

export async function POST(request: NextRequest) {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = clientLogoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Logo URL is required.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { logo_url } = parsed.data;

  try {
    const { data, error } = await auth.supabase
      .from("client_logos")
      .insert({ logo_url } as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not save client logo." },
        { status: 400 }
      );
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing client logo id." }, { status: 400 });
  }

  try {
    const { error } = await auth.supabase
      .from("client_logos")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not delete client logo." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error." },
      { status: 500 }
    );
  }
}
