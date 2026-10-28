import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  Factory,
  FileText,
  Home,
  Images,
  Inbox,
  Info,
  Lightbulb,
  Mail,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Truck,
  Zap,
} from "lucide-react";
import { requireAdmin } from "@/lib/supabase/server";
import { imageUrl } from "@/data/content";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();

  // 1. Calculate this month start
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 2. Fetch counts and recent records dynamically
  let sCount = 0, sMonth = 0;
  let iCount = 0, iMonth = 0;
  let qCount = 0;
  let msgCount = 0;

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

  const dynamicContent: ContentItem[] = [];
  const dynamicEnquiries: EnquiryItem[] = [];

  if (supabase) {
    try {
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

        supabase.from("services").select("id, slug, title, cover_image, is_published, updated_at, created_at").order("updated_at", { ascending: false }).limit(4),
        supabase.from("industries").select("id, slug, title, cover_image, is_published, updated_at, created_at").order("updated_at", { ascending: false }).limit(4),
        supabase.from("quote_requests").select("id, name, email, service_type, cargo_type, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contact_messages").select("id, name, email, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      sCount = servicesTotal.count ?? 0;
      sMonth = servicesThisMonth.count ?? 0;
      iCount = industriesTotal.count ?? 0;
      iMonth = industriesThisMonth.count ?? 0;
      qCount = quotesTotal.count ?? 0;
      msgCount = messagesTotal.count ?? 0;

      // Extract Recent Services
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

      // Extract Recent Industries
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



      // Map enquiry statuses
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

      // Extract Quotes
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

      // Extract Contact Messages
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
    } catch {
      // Graceful fallback to default numbers
    }
  }

  // Always include Homepage entry in content list
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

  // Sort and take top 5 content items
  dynamicContent.sort((a, b) => b.timestamp - a.timestamp);
  const recentContent = dynamicContent.slice(0, 5);

  dynamicEnquiries.sort((a, b) => b.timestamp - a.timestamp);
  const recentEnquiries = dynamicEnquiries.slice(0, 5);

  // 5 Metric Summary Cards (Media removed per request)
  const metricCards = [
    {
      label: "Services",
      count: sCount,
      href: "/admin/content/services",
      icon: Truck,
      bgIcon: "bg-sky-50 text-sky-500",
      changeText: sMonth > 0 ? `+${sMonth} this month` : "No new services",
      isPositive: sMonth > 0,
    },
    {
      label: "Industries",
      count: iCount,
      href: "/admin/content/industries",
      icon: Factory,
      bgIcon: "bg-purple-50 text-purple-500",
      changeText: iMonth > 0 ? `+${iMonth} this month` : "No new industries",
      isPositive: iMonth > 0,
    },
    {
      label: "Quotes",
      count: qCount,
      href: "/admin/inquiries",
      icon: Inbox,
      bgIcon: "bg-orange-50 text-orange-500",
      changeText: qCount > 0 ? `+${qCount} new` : "No new quotes",
      isPositive: qCount > 0,
    },
    {
      label: "Messages",
      count: msgCount,
      href: "/admin/inquiries",
      icon: Mail,
      bgIcon: "bg-amber-50 text-amber-500",
      changeText: msgCount > 0 ? `+${msgCount} new` : "No new messages",
      isPositive: msgCount > 0,
    },
  ];

  // Quick Action Buttons
  const quickActions = [
    { label: "Add New Service", href: "/admin/content/services", icon: Truck, iconBg: "bg-sky-50 text-sky-600" },
    { label: "Add New Industry", href: "/admin/content/industries", icon: Factory, iconBg: "bg-purple-50 text-purple-600" },
    { label: "Manage About Us", href: "/admin/about", icon: Info, iconBg: "bg-emerald-50 text-emerald-600" },
    { label: "Manage Homepage", href: "/admin/site-copy", icon: Home, iconBg: "bg-orange-50 text-orange-600" },
    { label: "View Enquiries", href: "/admin/inquiries", icon: Mail, iconBg: "bg-amber-50 text-amber-600" },
  ];

  // Dynamically calculate chart bar heights
  const maxScale = Math.max(10, sCount, iCount, qCount, msgCount);
  const chartHeight = (val: number) => `${Math.max(12, Math.min(100, Math.round((val / maxScale) * 100)))}%`;

  return (
    <div className="space-y-6">
      {/* 1. Hero / Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#03172a] p-7 text-white sm:p-9 shadow-sm">
        {/* Container port photo background with fading gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-right opacity-35"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#03172a] via-[#03172a]/90 to-transparent"
        />
        {/* Subtle grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f46a16]">DASHBOARD</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back, Admin!</h1>
            <p className="mt-1.5 text-xs text-slate-300 sm:text-sm">
              Manage Meridian&apos;s content, services, industries, and enquiries from here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/content/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f46a16] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#d95108]"
            >
              <Plus size={16} />
              New Service
            </Link>
            <Link
              href="/admin/site-copy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-900/90"
            >
              <Home size={16} />
              Manage Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 4 Metric Cards Row */}
      <section className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        {metricCards.map(({ label, count, href, icon: Icon, bgIcon, changeText, isPositive }) => (
          <Link
            key={label}
            href={href}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${bgIcon}`}>
                <Icon size={18} />
              </span>
              <ArrowUpRight
                size={16}
                className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-600"
              />
            </div>
            <strong className="mt-4 block text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {count}
            </strong>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isPositive ? "bg-emerald-50 text-emerald-600" : "border border-slate-100 bg-slate-50 text-slate-400"
                }`}
              >
                {changeText}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Main Dashboard Grid (Left ~65%, Right ~35%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols on lg) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card A: Recently Updated Content */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Recently Updated Content</h2>
              </div>
              <Link
                href="/admin/content/services"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">TITLE</th>
                    <th className="pb-3 font-semibold">TYPE</th>
                    <th className="pb-3 font-semibold">UPDATED ON</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 text-right font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {recentContent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                          <FileText size={22} className="text-slate-300" />
                          <p className="text-xs font-semibold text-slate-600">No content items found</p>
                          <p className="text-[11px] text-slate-400">Published and draft content items will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentContent.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/60">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="h-8 w-11 shrink-0 rounded-md object-cover border border-slate-200/70"
                            />
                            <Link href={item.href} className="font-semibold text-slate-900 hover:text-orange">
                              {item.title}
                            </Link>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${item.typeColor}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{item.updatedOn}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              item.status === "Published"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "Published" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            aria-label="Actions"
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card B: Recent Enquiries */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Recent Enquiries</h2>
              </div>
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">NAME</th>
                    <th className="pb-3 font-semibold">EMAIL</th>
                    <th className="pb-3 font-semibold">SUBJECT</th>
                    <th className="pb-3 font-semibold">DATE</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 text-right font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {recentEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                          <Mail size={22} className="text-slate-300" />
                          <p className="text-xs font-semibold text-slate-600">No enquiries received yet</p>
                          <p className="text-[11px] text-slate-400">
                            Quote requests and contact messages submitted on the website will appear here in real time.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentEnquiries.map((enq) => (
                      <tr key={enq.id} className="transition hover:bg-slate-50/60">
                        <td className="py-3 font-semibold text-slate-900">{enq.name}</td>
                        <td className="py-3 text-slate-500">{enq.email}</td>
                        <td className="py-3 text-slate-700 font-medium">{enq.subject}</td>
                        <td className="py-3 text-slate-500">{enq.date}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${enq.statusStyle}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${enq.dotColor}`} />
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            aria-label="More"
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on lg) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card C: Quick Actions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={18} className="text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map(({ label, href, icon: Icon, iconBg }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50/70"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${iconBg}`}>
                      <Icon size={14} />
                    </span>
                    <span className="truncate text-[11px] font-semibold text-slate-800">{label}</span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Card D: Content Overview Bar Chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Content Overview</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Last 30 days <ChevronDown size={12} className="text-slate-400" />
              </button>
            </div>

            {/* Custom Responsive Bar Chart matching screenshot */}
            <div className="relative pt-2">
              {/* Y Axis Grid lines */}
              <div className="space-y-6 text-[10px] text-slate-400">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                  <span className="w-4 text-right">20</span>
                  <div className="w-full border-t border-dashed border-slate-100" />
                </div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                  <span className="w-4 text-right">15</span>
                  <div className="w-full border-t border-dashed border-slate-100" />
                </div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                  <span className="w-4 text-right">10</span>
                  <div className="w-full border-t border-dashed border-slate-100" />
                </div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                  <span className="w-4 text-right">5</span>
                  <div className="w-full border-t border-dashed border-slate-100" />
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <span className="w-4 text-right">0</span>
                  <div className="w-full border-t border-slate-200" />
                </div>
              </div>

              {/* Bars container overlaid directly above horizontal zero line */}
              <div className="absolute inset-x-8 bottom-7 top-2 flex items-end justify-between px-2">
                {/* Services */}
                <div className="group flex flex-col items-center">
                  <div
                    className="w-8 rounded-t-md bg-[#38bdf8] transition-all duration-300 hover:brightness-105"
                    style={{ height: chartHeight(sCount) }}
                    title={`Services: ${sCount}`}
                  />
                </div>
                {/* Industries */}
                <div className="group flex flex-col items-center">
                  <div
                    className="w-10 rounded-t-md bg-[#c084fc] transition-all duration-300 hover:brightness-105"
                    style={{ height: chartHeight(iCount) }}
                    title={`Industries: ${iCount}`}
                  />
                </div>
                {/* Quotes */}
                <div className="group flex flex-col items-center">
                  <div
                    className="w-10 rounded-t-md bg-[#fbbf24] transition-all duration-300 hover:brightness-105"
                    style={{ height: chartHeight(qCount) }}
                    title={`Quotes: ${qCount}`}
                  />
                </div>
                {/* Messages */}
                <div className="group flex flex-col items-center">
                  <div
                    className="w-10 rounded-t-md bg-[#fb923c] transition-all duration-300 hover:brightness-105"
                    style={{ height: chartHeight(msgCount) }}
                    title={`Messages: ${msgCount}`}
                  />
                </div>
              </div>

              {/* X Axis Category Labels */}
              <div className="flex justify-between pl-6 pr-2 pt-2 text-[10px] text-slate-500">
                <span className="w-12 text-center">Services</span>
                <span className="w-12 text-center">Industries</span>
                <span className="w-12 text-center">Quotes</span>
                <span className="w-12 text-center">Messages</span>
              </div>
            </div>

            {/* Tip Callout Banner */}
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3 text-[11px] leading-relaxed text-slate-700">
              <span className="mt-0.5 text-amber-500">
                <Lightbulb size={15} />
              </span>
              <p>
                <strong>Tip:</strong> Keep your content updated regularly to improve your website&apos;s visibility and
                engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
