import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Globe2,
  Headphones,
  Layers3,
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
  Warehouse,
} from "lucide-react";
import { ButtonLink, Reveal } from "@/components/site";
import { ContentEmptyState } from "@/components/content-empty-state";
import { ServiceCardInteractive } from "@/components/service-card-interactive";
import { getServices, getSiteMedia } from "@/lib/server/content";

export const metadata = {
  title: "Logistics Services | Meridian Freight & Supply Chain Solutions",
  description:
    "Explore Meridian Logistics' full suite of freight services: ocean freight, air cargo, overland transportation, customs clearance, and warehousing across Saudi Arabia and global markets.",
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, media] = await Promise.all([getServices(), getSiteMedia()]);

  const heroImage =
    media["page.services.hero"]?.secure_url ||
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85";

  return (
    <div className="overflow-hidden">
      {/* ========================================================
          1. HERO BANNER: HIGH-IMPACT CORPORATE LUXURY
          ======================================================== */}
      <section className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex items-center justify-center overflow-hidden bg-[#03172a] text-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
        {/* Background Image with Ambient Blending */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Meridian Logistics Services Fleet"
              fill
              priority
              className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
          </div>
        )}

        {/* Ambient Dark Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-gradient-to-t from-[#03172a] via-[#03172a]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/25 via-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#f46a16]/15 blur-3xl z-1 pointer-events-none"
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-white/5 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f46a16]">
                COMPREHENSIVE LOGISTICS
              </span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Precision Freight Solutions for Global Supply Chains
            </h1>

            <p className="mt-5 mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              Connecting Saudi Arabia with international industrial trade corridors through multi-modal ocean, air, overland transport, and licensed customs clearance.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/request-a-quote">
                Request a Freight Quote
              </ButtonLink>
              <ButtonLink href="/contact" kind="outline">
                Speak to a Specialist
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          2. CORE SERVICE COMMITMENTS STRIP (4 METRICS)
          ======================================================== */}
      <section className="relative z-20 -mt-10 sm:-mt-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-slate-200/80">
          <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange/10 text-[#f46a16]">
              <Ship size={20} />
            </span>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-[#061b31]">Multi-Modal Transit</strong>
              <span className="block text-[11px] text-slate-500">Ocean, Air, Road & Rail</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <ShieldCheck size={20} />
            </span>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-[#061b31]">Saudi Customs Brokerage</strong>
              <span className="block text-[11px] text-slate-500">Fast Regulatory Clearance</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock size={20} />
            </span>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-[#061b31]">Real-Time Visibility</strong>
              <span className="block text-[11px] text-slate-500">Proactive Milestone Tracking</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Headphones size={20} />
            </span>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-[#061b31]">Dedicated Support</strong>
              <span className="block text-[11px] text-slate-500">Personal Account Managers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. MAIN SERVICES CATALOGUE (INTERACTIVE MOTION CARDS)
          ======================================================== */}
      <section className="section-pad relative overflow-hidden bg-[#f8fafc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                    Service Portfolio
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight">
                  Tailored Logistics for Every Sector
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl">
                  Choose a capability below to explore specific trade lanes, technical documentation, handling procedures, and transit schedules.
                </p>
              </Reveal>
            </div>

            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{services.length} Active Logistics Capabilities</span>
              </div>
            </Reveal>
          </div>

          {services.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ServiceCardInteractive
                  key={service.slug}
                  service={service}
                  index={index}
                  variant="light"
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <ContentEmptyState
              title="Service information is temporarily unavailable"
              message="Please check back soon or contact our team for assistance with your shipment."
            />
          )}
        </div>
      </section>

      {/* ========================================================
          4. HOW WE WORK: STEP-BY-STEP ADVISORY WORKFLOW
          ======================================================== */}
      <section className="section-pad bg-white border-t border-slate-200/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                  Operational Protocol
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight">
                How We Deliver Operational Precision
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600">
                A structured execution framework designed to eliminate friction across international transit borders.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Route & Mode Strategy",
                desc: "We analyze your cargo volume, target delivery timeline, and trade corridor to recommend optimal ocean, air, or overland routing.",
              },
              {
                step: "02",
                title: "Customs & Documentation",
                desc: "Our licensed Saudi customs team prepares bill of lading, certificate of origin, and SASO clearance documents to prevent port delays.",
              },
              {
                step: "03",
                title: "Transit & Live Monitoring",
                desc: "Shipments are tracked through verified digital checkpoints with continuous status notifications and automated exceptions handling.",
              },
              {
                step: "04",
                title: "Secure Final Mile Delivery",
                desc: "Direct delivery to your factory, warehouse, or job site with coordinated offloading, digital proof-of-delivery, and closing audits.",
              },
            ].map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-lg hover:border-orange/40 group">
                  <span className="block text-2xl font-black text-slate-300 group-hover:text-[#f46a16] transition-colors">
                    {step}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-[#061b31]">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CLOSING CALL TO ACTION
          ======================================================== */}
      <section className="relative overflow-hidden bg-[#03172a] text-white py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(244,106,22,.25),transparent_55%),radial-gradient(ellipse_at_0%_100%,#0d3454,transparent_60%)] pointer-events-none"
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-4">
              <Sparkles size={13} className="text-[#f46a16]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                Consult Our Team
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Need a Custom Solution for an Upcoming Shipment?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with our logistics engineers to review route feasibility, container allocations, and structured freight rate proposals.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/request-a-quote">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/contact" kind="outline">
                Contact Our Team
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
