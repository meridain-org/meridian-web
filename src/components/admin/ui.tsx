import type { ReactNode } from "react";

/* Shared design tokens for the Meridian CMS — matches the storefront navy / orange palette. */
export const ui = {
  card: "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(6,27,49,.04),0_8px_24px_-12px_rgba(6,27,49,.12)]",
  input: "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange focus:bg-white focus:ring-4 focus:ring-orange/10",
  label: "block text-[13px] font-semibold text-slate-700",
  btnPrimary: "inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(244,106,22,.6)] transition hover:-translate-y-px hover:bg-[#d95108] disabled:pointer-events-none disabled:opacity-60",
  btnDark: "inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-navy-3 disabled:pointer-events-none disabled:opacity-60",
  btnGhost: "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60",
  iconBtn: "grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50",
};

export function PageHeader({ title, count, action }: { title: string; count?: number; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-navy">
      {title}
      {count !== undefined && <span className="rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-bold text-orange">{count}</span>}
    </h1>
    {action}
  </div>;
}

export function StatusBadge({ published }: { published: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-slate-400"}`}/>{published ? "Live" : "Draft"}
  </span>;
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <p aria-live="polite" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">{message}</p>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="grid place-items-center rounded-xl border border-dashed border-slate-200 py-12 text-sm text-slate-400">{children}</div>;
}
