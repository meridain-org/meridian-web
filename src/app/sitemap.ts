import type { MetadataRoute } from "next";
import { getIndustries, getServices } from "@/lib/server/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [services, industries] = await Promise.all([getServices(), getIndustries()]);
  const pages = ["", "/about", "/services", "/industries", "/contact", "/request-a-quote", "/privacy-policy", "/terms"];
  return [...pages.map(path => ({ url: `${base}${path}`, lastModified: new Date() })), ...services.map(x => ({ url: `${base}/services/${x.slug}`, lastModified: new Date() })), ...industries.map(x => ({ url: `${base}/industries/${x.slug}`, lastModified: new Date() }))];
}
