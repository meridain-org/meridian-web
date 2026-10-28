"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Film, Trash } from "lucide-react";
import { CloudinaryUploader, type UploadedAsset } from "@/components/admin/cloudinary-uploader";
import { Empty, PageHeader, Toast, ui } from "@/components/admin/ui";

type Asset = UploadedAsset;
type Slot = { slot: string; asset_id: string; alt_text: string };
const slots = ["home.hero", "home.hero-poster", "home.about-main", "home.about-side", "home.about-person", "home.cta", "page.about.hero", "page.about.editorial", "page.contact.hero", "page.industries.hero", "page.services.hero", "page.quote.hero", "page.privacy.hero", "page.terms.hero"];

export function MediaManager() {
  const [assets, setAssets] = useState<Asset[]>([]); const [assigned, setAssigned] = useState<Slot[]>([]); const [selected, setSelected] = useState(""); const [slot, setSlot] = useState(slots[0]); const [altText, setAltText] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const load = useCallback(async () => { try { const response = await fetch("/api/admin/media", { cache: "no-store" }); const body = await response.json(); if (!response.ok) throw new Error(body.error); setAssets(body.assets ?? []); setAssigned(body.slots ?? []); setSelected(current => current || body.assets?.[0]?.id || ""); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load media."); } }, []);
  // Load the current server-backed library after the protected page opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  async function assign() { if (!selected) return; setBusy(true); try { const response = await fetch("/api/admin/media", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ slot, asset_id: selected, alt_text: altText }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error); setMessage(`Saved ${slot}.`); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update this slot."); } finally { setBusy(false); } }
  async function remove(asset: Asset) { if (!window.confirm(`Delete ${asset.public_id}?`)) return; setBusy(true); try { const response = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" }); const body = await response.json(); if (!response.ok) throw new Error(body.error); setMessage("Deleted."); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not delete asset."); } finally { setBusy(false); } }
  function uploaded(asset: UploadedAsset) { setAssets(current => [asset, ...current]); setSelected(asset.id); setAltText(asset.alt_text); setMessage("Uploaded."); }
  function pick(id: string) { setSelected(id); setAltText(assets.find(asset => asset.id === id)?.alt_text ?? ""); }

  return <>
    <PageHeader title="Media" count={assets.length}/>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${ui.card} p-5 sm:p-6`}><CloudinaryUploader onUploaded={uploaded}/></section>
      <section className={`${ui.card} grid content-start gap-4 p-5 sm:p-6`}>
        <h2 className="text-base font-bold text-navy">Assign to site</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={ui.label}>Slot<select className={ui.input} value={slot} onChange={event => setSlot(event.target.value)}>{slots.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className={ui.label}>Asset<select className={ui.input} value={selected} onChange={event => pick(event.target.value)}><option value="">Choose…</option>{assets.map(asset => <option key={asset.id} value={asset.id}>{asset.public_id.split("/").pop()}</option>)}</select></label>
        </div>
        <label className={ui.label}>Alt text<input className={ui.input} value={altText} onChange={event => setAltText(event.target.value)} maxLength={500}/></label>
        <button disabled={busy || !selected} onClick={() => void assign()} className={`${ui.btnDark} w-fit`}>Save slot</button>
      </section>
    </div>
    {message && <div className="mt-4"><Toast message={message}/></div>}

    <section className="mt-6">
      {assets.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{assets.map(asset => {
        const tags = assigned.filter(item => item.asset_id === asset.id);
        return <article key={asset.id} onClick={() => pick(asset.id)} className={`${ui.card} group cursor-pointer overflow-hidden transition hover:-translate-y-0.5 ${selected === asset.id ? "ring-2 ring-orange" : ""}`}>
          <div className="relative aspect-[4/3] bg-slate-100">
            {asset.resource_type === "image" ? <Image src={asset.secure_url} alt={asset.alt_text || asset.public_id} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105"/> : <video src={asset.secure_url} muted preload="metadata" className="h-full w-full object-cover"/>}
            {asset.resource_type === "video" && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur"><Film size={11}/>Video</span>}
            <button aria-label="Delete asset" disabled={busy} onClick={event => { event.stopPropagation(); void remove(asset); }} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 opacity-0 shadow-sm backdrop-blur transition hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"><Trash size={14}/></button>
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-semibold text-navy" title={asset.public_id}>{asset.public_id.split("/").pop()}</p>
            <p className="text-xs text-slate-400">{(asset.bytes / 1024 / 1024).toFixed(1)} MB</p>
            {tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{tags.map(item => <span key={item.slot} className="rounded-md bg-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange">{item.slot}</span>)}</div>}
          </div>
        </article>;
      })}</div> : <Empty>No media yet</Empty>}
    </section>
  </>;
}
