import { NextResponse, type NextRequest } from "next/server";
import { saveSubmission } from "@/lib/server/submission";
export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > 16_384) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const result = await saveSubmission("contact_messages", body, forwarded);
  return result.ok ? NextResponse.json({ ok: true }, { status: 201 }) : NextResponse.json({ error: result.status === 400 ? "Please check the submitted fields." : result.status === 429 ? "Too many submissions. Please try again later." : "Submission service is not available." }, { status: result.status });
}
