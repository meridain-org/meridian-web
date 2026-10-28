import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { deleteCloudinaryAsset } from "@/lib/server/cloudinary";

const deleteSchema = z.object({
  url: z.string().trim().optional(),
  publicId: z.string().trim().optional(),
  resourceType: z.enum(["image", "video", "raw"]).optional(),
}).refine((data) => Boolean(data.url || data.publicId), {
  message: "Either url or publicId must be provided.",
});

export async function POST(request: NextRequest) {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const target = parsed.data.publicId || parsed.data.url || "";
  const resType = parsed.data.resourceType || "image";

  const result = await deleteCloudinaryAsset(target, resType === "raw" ? "image" : resType, auth.supabase);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Could not delete asset from Cloudinary." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    result: result.result,
    publicId: result.publicId,
    skipped: result.skipped,
  });
}
