import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminContext } from "@/lib/server/admin-api";
import { defaultAboutSettings, type AboutSettings } from "@/data/about";
import { deleteCloudinaryAsset } from "@/lib/server/cloudinary";

const aboutSettingsSchema = z.object({
  heroEyebrow: z.string().max(200).default(defaultAboutSettings.heroEyebrow),
  heroTitle: z.string().max(300).default(defaultAboutSettings.heroTitle),
  heroDescription: z.string().max(3000).default(defaultAboutSettings.heroDescription),
  heroImage: z.string().max(1000).default(""),

  storyEyebrow: z.string().max(200).default(defaultAboutSettings.storyEyebrow),
  storyTitle: z.string().max(300).default(defaultAboutSettings.storyTitle),
  storyParagraph1: z.string().max(4000).default(defaultAboutSettings.storyParagraph1),
  storyParagraph2: z.string().max(4000).default(defaultAboutSettings.storyParagraph2),
  storyImage: z.string().max(1000).default(""),
  storyBadgeNumber: z.string().max(50).default(defaultAboutSettings.storyBadgeNumber),
  storyBadgeLabel: z.string().max(150).default(defaultAboutSettings.storyBadgeLabel),

  stat1Value: z.string().max(50).default(defaultAboutSettings.stat1Value),
  stat1Label: z.string().max(150).default(defaultAboutSettings.stat1Label),
  stat2Value: z.string().max(50).default(defaultAboutSettings.stat2Value),
  stat2Label: z.string().max(150).default(defaultAboutSettings.stat2Label),
  stat3Value: z.string().max(50).default(defaultAboutSettings.stat3Value),
  stat3Label: z.string().max(150).default(defaultAboutSettings.stat3Label),
  stat4Value: z.string().max(50).default(defaultAboutSettings.stat4Value),
  stat4Label: z.string().max(150).default(defaultAboutSettings.stat4Label),

  missionTitle: z.string().max(200).default(defaultAboutSettings.missionTitle),
  missionDescription: z.string().max(2000).default(defaultAboutSettings.missionDescription),
  visionTitle: z.string().max(200).default(defaultAboutSettings.visionTitle),
  visionDescription: z.string().max(2000).default(defaultAboutSettings.visionDescription),
  valuesTitle: z.string().max(200).default(defaultAboutSettings.valuesTitle),
  valuesDescription: z.string().max(2000).default(defaultAboutSettings.valuesDescription),

  strengths: z.array(z.string().max(200)).default(defaultAboutSettings.strengths),

  ctaTitle: z.string().max(300).default(defaultAboutSettings.ctaTitle),
  ctaDescription: z.string().max(2000).default(defaultAboutSettings.ctaDescription),
  ctaBtnText: z.string().max(100).default(defaultAboutSettings.ctaBtnText),
  ctaBtnHref: z.string().max(300).default(defaultAboutSettings.ctaBtnHref),
});

export async function GET() {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public.about_page")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Could not load about page settings." },
      { status: 500 }
    );
  }

  const value = (data?.value as Partial<AboutSettings> | undefined) ?? {};
  const merged: AboutSettings = {
    ...defaultAboutSettings,
    ...value,
    strengths: Array.isArray(value.strengths) && value.strengths.length > 0 ? value.strengths : defaultAboutSettings.strengths,
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

  const parsed = aboutSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid about settings input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Delete previous Cloudinary images if replaced
  const { data: previousRecord } = await auth.supabase
    .from("site_settings")
    .select("value")
    .eq("key", "public.about_page")
    .maybeSingle();

  const prev = (previousRecord?.value as Partial<AboutSettings> | undefined) ?? {};

  if (prev.heroImage && prev.heroImage !== parsed.data.heroImage) {
    await deleteCloudinaryAsset(prev.heroImage, "image", auth.supabase).catch(() => {});
  }
  if (prev.storyImage && prev.storyImage !== parsed.data.storyImage) {
    await deleteCloudinaryAsset(prev.storyImage, "image", auth.supabase).catch(() => {});
  }

  const { error } = await auth.supabase
    .from("site_settings")
    .upsert({
      key: "public.about_page",
      value: parsed.data,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json(
      { error: "Could not save about settings to database." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, value: parsed.data });
}
