"use client";
import { useCallback, useEffect, useState } from "react";
import { Calendar, Mail, MapPin, Package, Phone, Truck } from "lucide-react";
import { Empty, PageHeader, Toast, ui } from "@/components/admin/ui";

type Enquiry = Record<string, string | null> & { id: string; created_at: string; status: string };
type Data = { quotes: Enquiry[]; contacts: Enquiry[] };
const statuses = ["new", "in_progress", "responded", "closed", "spam"];
const statusTone: Record<string, string> = { new: "bg-orange/10 text-orange", in_progress: "bg-sky-50 text-sky-700", responded: "bg-emerald-50 text-emerald-700", closed: "bg-slate-100 text-slate-500", spam: "bg-red-50 text-red-600" };

export function InquiryManager() {
  const [data, setData] = useState<Data>({ quotes: [], contacts: [] }); const [tab, setTab] = useState<"quotes" | "contacts">("quotes"); const [message, setMessage] = useState("");
  const load = useCallback(async () => { const response = await fetch("/api/admin/inquiries", { cache: "no-store" }); const body = await response.json(); if (!response.ok) throw new Error(body.error); setData(body); }, []);
  // Load the server-backed inbox after the protected page opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch(error => setMessage(error instanceof Error ? error.message : "Could not load enquiries.")); }, [load]);
  async function update(kind: "quote_requests" | "contact_messages", item: Enquiry, status: string) { const response = await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, id: item.id, status }) }); const body = await response.json(); if (!response.ok) setMessage(body.error); else { setMessage("Status updated."); await load(); } }
  const items = tab === "quotes" ? data.quotes : data.contacts;
  const tabs = [["quotes", "Quotes", data.quotes.length], ["contacts", "Messages", data.contacts.length]] as const;

  return <>
    <PageHeader title="Enquiries" action={<div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">{tabs.map(([key, label, count]) => <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${tab === key ? "bg-navy text-white shadow" : "text-slate-500 hover:text-navy"}`}>{label}<span className={`rounded-full px-1.5 text-[11px] ${tab === key ? "bg-white/15" : "bg-slate-100"}`}>{count}</span></button>)}</div>}/>
    {message && <div className="mb-4"><Toast message={message}/></div>}
    <div className="grid gap-3">
      {items.map(item => <article key={item.id} className={`${ui.card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-sm font-bold text-white">{(item.name || "?").charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-navy">{item.name || "Unknown"}{item.company_name && <span className="font-normal text-slate-400"> · {item.company_name}</span>}</h2>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 hover:text-orange"><Mail size={12}/>{item.email}</a>
                {item.phone && <span className="inline-flex items-center gap-1"><Phone size={12}/>{item.phone}</span>}
                <span>{new Date(item.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
              </p>
            </div>
          </div>
          <select aria-label="Status" value={item.status} onChange={event => void update(tab === "quotes" ? "quote_requests" : "contact_messages", item, event.target.value)} className={`cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold capitalize outline-none ring-1 ring-inset ring-black/5 ${statusTone[item.status] ?? statusTone.closed}`}>{statuses.map(status => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select>
        </div>
        {tab === "quotes" ? <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Chip icon={<MapPin size={12}/>}>{item.origin_city}, {item.origin_country} → {item.destination_city}, {item.destination_country}</Chip>
          <Chip icon={<Truck size={12}/>}>{item.service_type}</Chip>
          <Chip icon={<Package size={12}/>}>{item.cargo_type} · {item.cargo_weight || "—"} kg · {item.cargo_volume || "—"} m³</Chip>
          {item.preferred_shipping_date && <Chip icon={<Calendar size={12}/>}>{item.preferred_shipping_date}</Chip>}
        </div> : item.subject && <p className="mt-4 text-sm font-semibold text-navy">{item.subject}</p>}
        {item.message && <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.message}</p>}
      </article>)}
      {items.length === 0 && <Empty>Nothing here yet</Empty>}
    </div>
  </>;
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-medium text-slate-600 ring-1 ring-inset ring-slate-200/70"><span className="text-orange">{icon}</span>{children}</span>;
}
