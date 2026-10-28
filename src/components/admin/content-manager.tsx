"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, LoaderCircle, Pencil, Plus, Trash, X } from "lucide-react";
import { CloudinaryUploader, type UploadedAsset } from "@/components/admin/cloudinary-uploader";
import { Empty, PageHeader, StatusBadge, Toast, ui } from "@/components/admin/ui";

type Collection = "services" | "industries";
type Entry = Record<string, unknown> & { id: string; slug: string; title: string; content: Record<string, unknown> };
const initial: Entry = { id: "", slug: "", title: "", short_description: "", cover_image: "", content: {}, is_published: false, display_order: 0 };

export function ContentManager({ collection }: { collection: Collection }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [form, setForm] = useState<Entry>(initial);
  const [contentText, setContentText] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/content/${collection}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setItems(body.items ?? []);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load content.");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    void load();
  }, [load]);

  const textField = (name: string, label: string, required = true, large = false) => (
    <label className={ui.label} key={name}>
      {label}
      {large ? (
        <textarea
          className={`${ui.input} min-h-24 resize-y`}
          required={required}
          value={String(form[name] ?? "")}
          onChange={event => setForm({ ...form, [name]: event.target.value })}
        />
      ) : (
        <input
          className={ui.input}
          required={required}
          value={String(form[name] ?? "")}
          onChange={event => {
            const value = event.target.value;
            if (name === "title" && !form.id && !form.slug) {
              setForm({
                ...form,
                title: value,
                slug: value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
              });
            } else {
              setForm({ ...form, [name]: value });
            }
          }}
        />
      )}
    </label>
  );

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(contentText) as Record<string, unknown>;
      if (!content || Array.isArray(content) || typeof content !== "object") throw new Error();
    } catch {
      setSaving(false);
      setNotice("Advanced details must be valid JSON.");
      return;
    }
    const data: Record<string, unknown> = {
      slug: form.slug,
      title: form.title,
      short_description: form.short_description,
      cover_image: String(form.cover_image || "").trim() || null,
      is_published: Boolean(form.is_published),
      display_order: Number(form.display_order || 0),
      content,
    };
    try {
      const response = await fetch(`/api/admin/content/${collection}`, {
        method: form.id ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form.id ? { id: form.id, ...data } : data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setForm(initial);
      setContentText("{}");
      setNotice("Saved.");
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save content.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Entry) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const response = await fetch(`/api/admin/content/${collection}?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const body = await response.json();
    if (!response.ok) setNotice(body.error);
    else {
      setNotice("Deleted.");
      if (form.id === item.id) setForm(initial);
      await load();
    }
  }

  function edit(item: Entry) {
    setForm({ ...initial, ...item, cover_image: String(item.cover_image ?? "") });
    setContentText(JSON.stringify(item.content ?? {}, null, 2));
    setNotice("");
  }

  function reset() {
    setForm(initial);
    setContentText("{}");
  }

  const title = useMemo(() => ({ services: "Services", industries: "Industries" }[collection]), [collection]);
  const base = collection;

  return (
    <>
      <PageHeader title={title} count={items.length} action={<button onClick={reset} className={ui.btnPrimary}><Plus size={16}/>New</button>}/>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <section className={`${ui.card} self-start p-2`}>
          {loading ? (
            <div className="grid place-items-center py-16 text-slate-400"><LoaderCircle className="animate-spin"/></div>
          ) : items.length ? (
            <ul className="divide-y divide-slate-100">
              {items.map(item => {
                const active = form.id === item.id;
                return (
                  <li key={item.id} className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${active ? "bg-orange/[.06]" : "hover:bg-slate-50"}`}>
                    <button onClick={() => edit(item)} className="min-w-0 flex-1 text-left">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-navy">{item.title}</span>
                        <StatusBadge published={Boolean(item.is_published)}/>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-400">/{base}/{item.slug}</span>
                    </button>
                    <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <button aria-label="Edit" onClick={() => edit(item)} className={ui.iconBtn}><Pencil size={15}/></button>
                      <button aria-label="Delete" onClick={() => void remove(item)} className={`${ui.iconBtn} hover:!bg-red-50 hover:!text-red-600`}><Trash size={15}/></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty>No items yet</Empty>
          )}
        </section>

        <form onSubmit={save} className={`${ui.card} grid content-start gap-4 self-start p-5 sm:p-6 xl:sticky xl:top-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="truncate text-lg font-bold text-navy">{form.id ? "Edit" : `New ${title.slice(0, -1).toLowerCase()}`}</h2>
            {form.id && <button type="button" aria-label="Cancel edit" onClick={reset} className={ui.iconBtn}><X size={16}/></button>}
          </div>
          <Toast message={notice}/>
          {textField("title", "Title")}
          {textField("slug", "Slug")}
          {textField("short_description", "Description", true, true)}
          <label className={ui.label}>
            Cover image
            <input className={ui.input} value={String(form.cover_image ?? "")} onChange={event => setForm({ ...form, cover_image: event.target.value })} placeholder="Public ID or URL"/>
          </label>
          {Boolean(form.cover_image) && (
            <button
              type="button"
              onClick={async () => {
                const prev = String(form.cover_image || "");
                setForm(c => ({ ...c, cover_image: "" }));
                if (prev) {
                  await fetch("/api/admin/cloudinary-delete", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ url: prev, resourceType: "image" }),
                  }).catch(() => {});
                  setNotice("Cover image was removed and deleted from Cloudinary.");
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 self-start"
            >
              <Trash size={12} /> Remove & delete image from Cloudinary
            </button>
          )}
          <CloudinaryUploader compact onUploaded={(asset: UploadedAsset) => {
            const prev = form.cover_image;
            if (prev && prev !== asset.public_id) {
              void fetch("/api/admin/cloudinary-delete", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ url: prev, resourceType: "image" }),
              }).catch(() => {});
            }
            setForm(current => ({ ...current, cover_image: asset.public_id }));
          }}/>
          <details className="group rounded-xl border border-slate-200 open:bg-slate-50/50">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-[13px] font-semibold text-slate-700">
              Advanced<ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180"/>
            </summary>
            <div className="grid gap-4 px-3.5 pb-3.5">
              <textarea aria-label="Content JSON" className={`${ui.input} mt-0 min-h-44 font-mono text-xs`} value={contentText} onChange={event => setContentText(event.target.value)} spellCheck={false}/>
              <label className={ui.label}>Display order<input className={ui.input} type="number" min="0" max="10000" value={String(form.display_order ?? 0)} onChange={event => setForm({ ...form, display_order: Number(event.target.value) })}/></label>
            </div>
          </details>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-semibold text-slate-700">
            Published
            <span className="relative inline-flex">
              <input type="checkbox" className="peer sr-only" checked={Boolean(form.is_published)} onChange={event => setForm({ ...form, is_published: event.target.checked })}/>
              <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-orange peer-focus-visible:ring-4 peer-focus-visible:ring-orange/20"/>
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"/>
            </span>
          </label>
          <button disabled={saving} className={`${ui.btnDark} w-full`}>{saving ? <><LoaderCircle size={16} className="animate-spin"/>Saving…</> : "Save"}</button>
        </form>
      </div>
    </>
  );
}
