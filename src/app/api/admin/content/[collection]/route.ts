import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { deleteCloudinaryAsset } from "@/lib/server/cloudinary";

const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const common = {
  slug,
  title: z.string().trim().min(2).max(180),
  cover_image: z.string().trim().max(2048).nullable().optional(),
  is_published: z.boolean().default(false),
  display_order: z.number().int().min(0).max(10000).default(0),
  content: z.record(z.string(), z.unknown()).default({}),
};
const schemas = {
  services: z.object({ ...common, short_description: z.string().trim().min(2).max(500), icon: z.string().max(80).nullable().optional() }).strict(),
  industries: z.object({ ...common, short_description: z.string().trim().min(2).max(500) }).strict(),
};
type Collection = keyof typeof schemas;
function collection(value: string): value is Collection {
  return Object.hasOwn(schemas, value);
}
function validate(table: Collection, input: unknown) {
  return schemas[table].safeParse(input);
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection: name } = await params;
  if (!collection(name)) return NextResponse.json({ error: "Unknown content collection." }, { status: 404 });
  const auth = await adminContext();
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase.from(name).select("*").order("display_order", { ascending: true });
  if (error) return NextResponse.json({ error: "Could not load content." }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection: name } = await params;
  if (!collection(name)) return NextResponse.json({ error: "Unknown content collection." }, { status: 404 });
  const auth = await adminContext();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = validate(name, body);
  if (!parsed.success) return NextResponse.json({ error: "Check the fields and try again.", details: parsed.error.flatten() }, { status: 400 });
  const values: Record<string, unknown> = { ...parsed.data };
  const { data, error } = await auth.supabase.from(name).insert(values as never).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug already exists." : "Could not save content." }, { status: 400 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection: name } = await params;
  if (!collection(name)) return NextResponse.json({ error: "Unknown content collection." }, { status: 404 });
  const auth = await adminContext();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const input = z.object({ id: z.string().uuid() }).passthrough().safeParse(body);
  if (!input.success) return NextResponse.json({ error: "A valid record id is required." }, { status: 400 });
  const { id, ...fields } = input.data;
  const parsed = validate(name, fields);
  if (!parsed.success) return NextResponse.json({ error: "Check the fields and try again.", details: parsed.error.flatten() }, { status: 400 });
  const values: Record<string, unknown> = { ...parsed.data };

  // If cover_image changed or was cleared, delete previous Cloudinary asset
  const { data: existing } = await auth.supabase.from(name).select("cover_image").eq("id", id).maybeSingle();
  if (existing?.cover_image && existing.cover_image !== values.cover_image) {
    await deleteCloudinaryAsset(existing.cover_image, "image", auth.supabase).catch(() => {});
  }

  const { data, error } = await auth.supabase.from(name).update(values as never).eq("id", id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug already exists." : "Could not update content." }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Content item was not found." }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const { collection: name } = await params;
  if (!collection(name)) return NextResponse.json({ error: "Unknown content collection." }, { status: 404 });
  const auth = await adminContext();
  if ("response" in auth) return auth.response;
  const id = request.nextUrl.searchParams.get("id");
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "A valid record id is required." }, { status: 400 });

  // Clean up cover_image from Cloudinary if present
  const { data: existing } = await auth.supabase.from(name).select("cover_image").eq("id", id).maybeSingle();
  if (existing?.cover_image) {
    await deleteCloudinaryAsset(existing.cover_image, "image", auth.supabase).catch(() => {});
  }

  const { error } = await auth.supabase.from(name).delete().eq("id", id);
  return error ? NextResponse.json({ error: "Could not delete content." }, { status: 400 }) : NextResponse.json({ ok: true });
}
