"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Factory,
  Inbox,
  LayoutDashboard,
  LogOut,
  Search,
  Building2,
  Info,
  SlidersHorizontal,
  Truck,
  Type,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage", href: "/admin/site-copy", icon: Type },
  { label: "About Us", href: "/admin/about", icon: Info },
  { label: "Client Logos", href: "/admin/clients", icon: Building2 },
  { label: "Store Settings", href: "/admin/settings", icon: SlidersHorizontal },
  { label: "Services", href: "/admin/content/services", icon: Truck },
  { label: "Industries", href: "/admin/content/industries", icon: Factory },
  { label: "Enquiries", href: "/admin/inquiries", icon: Inbox },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const isActive = (href: string) => path === href || (href !== "/admin" && path.startsWith(href));
  const initial = email ? email.charAt(0).toUpperCase() : "A";
  const username = email ? email.split("@")[0] : "admin";

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#03172a] text-slate-300 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,#0d3454_0%,transparent_55%),radial-gradient(ellipse_at_100%_100%,rgba(244,106,22,.12)_0%,transparent_50%)]"
        />

        {/* Logo */}
        <div className="relative mx-5 mt-6 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-xs transition hover:opacity-95">
            <Image
              src="/meridian-logo-web.webp"
              alt="Meridian Logistics"
              width={160}
              height={29}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation list */}
        <nav aria-label="CMS navigation" className="relative mt-8 grid gap-1 px-3">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  active ? "bg-white/[.08] text-white" : "hover:bg-white/[.04] hover:text-white text-slate-400"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-orange" />}
                <Icon
                  size={18}
                  className={active ? "text-orange" : "text-slate-400 transition group-hover:text-slate-200"}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom user info & logout */}
        <div className="relative mt-auto border-t border-white/[.08] p-4 pb-6 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/[.04] p-2.5 transition hover:bg-white/[.07]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 border border-white/20 text-xs font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0 flex-1 truncate">
              <p className="truncate text-xs font-semibold text-white leading-tight" title={email}>
                {email}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">Administrator</p>
            </div>
            <ChevronRight size={14} className="text-slate-400 shrink-0" />
          </div>

          <form action="/api/admin/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[.06] hover:text-white"
            >
              <LogOut size={15} />
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 bg-[#03172a] text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.08]">
          <Link href="/admin" className="inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-xs transition hover:opacity-95">
            <Image
              src="/meridian-logo-web.webp"
              alt="Meridian Logistics"
              width={130}
              height={23}
              className="h-6 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-slate-200"
            >
              <ExternalLink size={12} /> Live site
            </Link>
            <form action="/api/admin/signout" method="post">
              <button aria-label="Sign out" className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="CMS navigation" className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
                isActive(href) ? "bg-orange text-white" : "bg-white/[.06] text-slate-300"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Container */}
      <div className="lg:pl-64">
        {/* Desktop Top Header Bar matching screenshot */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-8 backdrop-blur lg:flex">
          {/* Search bar */}
          <div className="relative flex w-96 items-center">
            <Search size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages, services, enquiries..."
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/60 py-2 pl-9 pr-14 text-xs font-normal text-slate-800 placeholder:text-slate-400 transition hover:border-slate-300 focus:border-orange focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/10"
            />
            <kbd className="pointer-events-none absolute right-2.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
              Ctrl K
            </kbd>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-navy"
            >
              <ExternalLink size={13} />
              View site
            </Link>

            {/* Notification bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User profile dropdown trigger */}
            <div className="flex items-center gap-2.5 pl-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs">
                {initial}
              </span>
              <div className="text-left">
                <span className="block text-xs font-bold leading-tight text-slate-900">{username}</span>
                <span className="block text-[10px] leading-tight text-slate-500">Administrator</span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="mx-auto max-w-[1400px] min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
