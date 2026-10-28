"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const field = "mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/15";
const label = "block text-[13px] font-medium text-slate-600";

export function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, "");
  return <form action={action} className="mt-5 grid gap-4">
    <label className={label}>Email<input className={field} type="email" name="email" autoComplete="username" required maxLength={254}/></label>
    <label className={label}>Password<input className={field} type="password" name="password" autoComplete="current-password" required maxLength={256}/></label>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <button disabled={pending} className="mt-1 rounded-lg bg-orange py-2.5 text-sm font-semibold text-white transition hover:bg-[#d95108] disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
