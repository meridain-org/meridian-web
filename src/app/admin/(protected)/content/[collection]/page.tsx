import { notFound } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";

export default async function ContentPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!["services", "industries"].includes(collection)) notFound();
  return <ContentManager collection={collection as "services" | "industries"} />;
}
