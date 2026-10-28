import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  Headphones,
  Layers3,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink, Reveal } from "@/components/site";
import { ServiceCardInteractive } from "@/components/service-card-interactive";
import { getServices } from "@/lib/server/content";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getServices()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  return {
    title: service ? `${service.title} | Meridian Logistics Services` : "Service Not Found",
    description: service?.short,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allServices = await getServices();
  const service = allServices.find((item) => item.slug === slug);

  if (!service) notFound();

  const related = allServices.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* ========================================================
          1. SERVICE DETAIL HERO
          ======================================================== */}
      <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center overflow-hidden bg-[#03172a] text-white pt-36 sm:pt-40 lg:pt-44 pb-16">
        {service.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
          </div>
        )}

        {/* Ambient Dark Overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-gradient-to-t from-[#03172a] via-[#03172a]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#f46a16]/15 blur-3xl z-1 pointer-events-none"
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <Reveal>
            {/* Breadcrumb Links */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition">Services</Link>
              <span>/</span>
              <span className="text-[#f46a16]">{service.title}</span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-white/5 backdrop-blur-md px-3.5 py-1 shadow-sm mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f46a16]">
                SERVICE SPECIFICATION
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {service.title}
            </h1>

            <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              {service.short}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/request-a-quote">
                Request a Quote for this Service
              </ButtonLink>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition"
              >
                <ArrowLeft size={15} /> All Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          2. SERVICE CONTENT SPLIT LAYOUT
          ======================================================== */}
      <section className="section-pad bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* LEFT COLUMN: MAIN OVERVIEW & WORKFLOW */}
            <div className="lg:col-span-8 space-y-10">
              <Reveal>
                {/* Hero Showcase Photo */}
                {service.image && (
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 mb-8 bg-slate-900">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 65vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                      Operational Scope
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061b31] tracking-tight">
                    Comprehensive Freight Management for {service.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.description || service.short}
                  </p>
                </div>
              </Reveal>

              {/* Step-by-Step Workflow Milestones */}
              {service.process && service.process.length > 0 && (
                <Reveal>
                  <div className="pt-6 border-t border-slate-100">
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">
                        Execution Framework
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#061b31]">
                        How the Process Works
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {service.process.map((step, index) => (
                        <div
                          key={step}
                          className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-orange/30 hover:shadow-sm transition"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange/10 text-xs font-black text-[#f46a16]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 pt-1">
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Industries Served Tags */}
              {service.industries && service.industries.length > 0 && (
                <Reveal>
                  <div className="pt-6 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">
                      Market Applications
                    </span>
                    <h3 className="text-xl font-bold text-[#061b31] mb-4">
                      Key Industries Served
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {service.industries.map((ind) => (
                        <span
                          key={ind}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-orange/40 hover:bg-white transition"
                        >
                          <Layers3 size={13} className="text-[#f46a16]" />
                          <span>{ind}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY CAPABILITIES & QUOTATION ASIDE */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Capabilities Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">
                    At a Glance
                  </span>
                  <h3 className="text-base font-bold text-[#061b31] mt-1 mb-4">
                    Key Capabilities & Benefits
                  </h3>

                  {service.benefits && service.benefits.length > 0 ? (
                    <div className="space-y-3">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-[#f46a16] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-[13px] font-medium text-slate-700 leading-snug">
                            {b}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Standard freight scheduling, tracking, and compliance included.
                    </p>
                  )}
                </div>

                {/* Direct Quote Request Aside Card */}
                <div className="rounded-2xl bg-[#03172a] text-white p-6 shadow-xl border border-white/10 relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#f46a16]/20 blur-2xl pointer-events-none"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff8a40]">
                    Fast Turnaround
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    Discuss Your Cargo Requirements
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    Share your container specifications, volume, and target routing for an itemized freight rate proposal.
                  </p>
                  <ButtonLink href="/request-a-quote">
                    Request a Quote
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. RELATED SERVICES SECTION
          ======================================================== */}
      {related.length > 0 && (
        <section className="section-pad bg-[#f8fafc] border-t border-slate-200/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f46a16]">
                  Related Capabilities
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061b31]">
                  Complementary Logistics Services
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f46a16] hover:underline"
              >
                View all capabilities <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item, i) => (
                <ServiceCardInteractive
                  key={item.slug}
                  service={item}
                  index={i}
                  variant="light"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
