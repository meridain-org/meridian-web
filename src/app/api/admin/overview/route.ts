import { NextResponse } from "next/server";
import { adminContext } from "@/lib/server/admin-api";
import { imageUrl } from "@/data/content";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function GET() {
  const auth = await adminContext();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  // 1. Calculate this month start
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 2. Fetch counts and monthly additions
  const [
    servicesTotal,
    servicesThisMonth,
    industriesTotal,
    industriesThisMonth,
    quotesTotal,
    messagesTotal,
    // Recent records
    recentServices,
    recentIndustries,
    recentQuotes,
    recentMessages,
  ] = await Promise.all([
    supabase.from("services").select("id", { head: true, count: "exact" }),
    supabase.from("services").select("id", { head: true, count: "exact" }).gte("created_at", startOfMonth),
    supabase.from("industries").select("id", { head: true, count: "exact" }),
    supabase.from("industries").select("id", { head: true, count: "exact" }).gte("created_at", startOfMonth),
    supabase.from("quote_requests").select("id", { head: true, count: "exact" }),
    supabase.from("contact_messages").select("id", { head: true, count: "exact" }),

    // Recent items
    supabase.from("services").select("id, slug, title, cover_image, is_published, updated_at, created_at").order("updated_at", { ascending: false }).limit(4),
    supabase.from("industries").select("id, slug, title, cover_image, is_published, updated_at, created_at").order("updated_at", { ascending: false }).limit(4),
    supabase.from("quote_requests").select("id, name, email, service_type, cargo_type, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_messages").select("id, name, email, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const sCount = servicesTotal.count ?? 0;
  const sMonth = servicesThisMonth.count ?? 0;
  const iCount = industriesTotal.count ?? 0;
  const iMonth = industriesThisMonth.count ?? 0;
  const qCount = quotesTotal.count ?? 0;
  const msgCount = messagesTotal.count ?? 0;

  // Metrics block
  const metrics = {
    services: {
      count: sCount,
      changeText: sMonth > 0 ? `+${sMonth} this month` : "No new services",
      isPositive: sMonth > 0,
    },
    industries: {
      count: iCount,
      changeText: iMonth > 0 ? `+${iMonth} this month` : "No new industries",
      isPositive: iMonth > 0,
    },
    quotes: {
      count: qCount,
      changeText: qCount > 0 ? `+${qCount} new` : "No new quotes",
      isPositive: qCount > 0,
    },
    messages: {
      count: msgCount,
      changeText: msgCount > 0 ? `+${msgCount} new` : "No new messages",
      isPositive: msgCount > 0,
    },
  };

  // Compile Recently Updated Content dynamically
  type ContentItem = {
    id: string;
    title: string;
    type: "Service" | "Industry" | "Homepage";
    typeColor: string;
    updatedOn: string;
    status: "Published" | "Draft";
    image: string;
    href: string;
    timestamp: number;
  };

  const dynamicContent: ContentItem[] = [];

  (recentServices.data ?? []).forEach((item) => {
    dynamicContent.push({
      id: `service-${item.id}`,
      title: item.title,
      type: "Service",
      typeColor: "bg-sky-50 text-sky-600 border-sky-100",
      updatedOn: formatDate(item.updated_at || item.created_at),
      status: item.is_published ? "Published" : "Draft",
      image: imageUrl(item.cover_image || "photo-1578575437130-527eed3abbec", 160),
      href: "/admin/content/services",
      timestamp: new Date(item.updated_at || item.created_at).getTime(),
    });
  });

  (recentIndustries.data ?? []).forEach((item) => {
    dynamicContent.push({
      id: `industry-${item.id}`,
      title: item.title,
      type: "Industry",
      typeColor: "bg-purple-50 text-purple-600 border-purple-100",
      updatedOn: formatDate(item.updated_at || item.created_at),
      status: item.is_published ? "Published" : "Draft",
      image: imageUrl(item.cover_image || "photo-1586528116311-ad8dd3c8310d", 160),
      href: "/admin/content/industries",
      timestamp: new Date(item.updated_at || item.created_at).getTime(),
    });
  });

  // Always have Homepage in list
  dynamicContent.push({
    id: "homepage-settings",
    title: "About Meridian",
    type: "Homepage",
    typeColor: "bg-blue-50 text-blue-600 border-blue-100",
    updatedOn: formatDate(new Date().toISOString()),
    status: "Published",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=120&h=80&q=80",
    href: "/admin/site-copy",
    timestamp: new Date().getTime() - 86400000 * 7,
  });

  // Sort by timestamp desc and take top 5
  dynamicContent.sort((a, b) => b.timestamp - a.timestamp);
  const recentContentList = dynamicContent.slice(0, 5);

  // Compile Recent Enquiries dynamically
  type EnquiryItem = {
    id: string;
    name: string;
    email: string;
    subject: string;
    date: string;
    status: "New" | "In Progress" | "Replied";
    statusStyle: string;
    dotColor: string;
    timestamp: number;
  };

  const dynamicEnquiries: EnquiryItem[] = [];

  const mapStatus = (statusStr: string): { label: "New" | "In Progress" | "Replied"; style: string; dot: string } => {
    const s = (statusStr || "").toLowerCase();
    if (s === "in_progress") {
      return { label: "In Progress", style: "bg-amber-50 text-amber-600 border-amber-100/60", dot: "bg-amber-500" };
    }
    if (s === "responded" || s === "replied" || s === "closed") {
      return { label: "Replied", style: "bg-emerald-50 text-emerald-600 border-emerald-100/60", dot: "bg-emerald-500" };
    }
    return { label: "New", style: "bg-blue-50 text-blue-600 border-blue-100/60", dot: "bg-blue-500" };
  };

  (recentQuotes.data ?? []).forEach((q) => {
    const s = mapStatus(q.status);
    dynamicEnquiries.push({
      id: `quote-${q.id}`,
      name: q.name,
      email: q.email,
      subject: q.service_type || q.cargo_type || "Quotation Request",
      date: formatDate(q.created_at),
      status: s.label,
      statusStyle: s.style,
      dotColor: s.dot,
      timestamp: new Date(q.created_at).getTime(),
    });
  });

  (recentMessages.data ?? []).forEach((m) => {
    const s = mapStatus(m.status);
    dynamicEnquiries.push({
      id: `msg-${m.id}`,
      name: m.name,
      email: m.email,
      subject: m.subject || "General Enquiry",
      date: formatDate(m.created_at),
      status: s.label,
      statusStyle: s.style,
      dotColor: s.dot,
      timestamp: new Date(m.created_at).getTime(),
    });
  });

  dynamicEnquiries.sort((a, b) => b.timestamp - a.timestamp);
  const recentEnquiriesList = dynamicEnquiries.slice(0, 5);

  // Content Overview Distribution
  const totalEnquiries = qCount + msgCount;
  const overviewData = {
    services: sCount,
    industries: iCount,
    quotes: qCount,
    messages: msgCount,
    enquiries: totalEnquiries,
  };

  return NextResponse.json({
    metrics,
    recentContent: recentContentList,
    recentEnquiries: recentEnquiriesList,
    overview: overviewData,
  });
}
