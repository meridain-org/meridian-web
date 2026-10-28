import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { requireAdmin } from "@/lib/supabase/server";

export const metadata = { title: "CMS sign in", robots: { index: false } };

/* Port nodes + shipping-route arcs, echoing the storefront network map. */
const ports = [[140, 620], [420, 300], [760, 470], [1080, 250], [1330, 560], [980, 760]];
const routes = ["M140 620 Q280 380 420 300", "M420 300 Q600 300 760 470", "M760 470 Q900 260 1080 250", "M1080 250 Q1260 330 1330 560", "M760 470 Q860 680 980 760", "M980 760 Q1180 720 1330 560"];

export default async function AdminLoginPage() {
  const { isAdmin } = await requireAdmin();
  if (isAdmin) redirect("/admin");
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#03172a] px-5 py-12">
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#0d3454_0%,#061b31_45%,#03172a_80%)]"/>
    <div aria-hidden className="absolute inset-0 opacity-[.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"/>
    <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <g fill="none" stroke="#f46a16" strokeWidth="1.5" strokeDasharray="5 6" opacity=".35">{routes.map(d => <path key={d} d={d}/>)}</g>
      <g>{ports.map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="14" fill="#f46a16" opacity=".12"/><circle cx={x} cy={y} r="4" fill="#ff9b54"/></g>)}</g>
    </svg>

    <div className="relative w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <Link href="/" className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 shadow-lg transition hover:opacity-95">
          <Image
            src="/meridian-logo-web.webp"
            alt="Meridian Logistics"
            width={180}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>
      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,.55)]">
        <div className="h-1 bg-gradient-to-r from-orange to-[#ff9b54]"/>
        <div className="p-8">
          <h1 className="text-xl font-bold text-navy">CMS sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Admin access only</p>
          <LoginForm/>
        </div>
      </section>
      <Link className="mt-6 block text-center text-xs text-slate-400 transition hover:text-white" href="/">← Back to website</Link>
    </div>
  </main>;
}
