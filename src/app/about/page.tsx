import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ButtonLink, Reveal } from "@/components/site";
import { getAboutSettings } from "@/lib/server/content";

export const metadata = {
  title: "About Meridian Logistics | Precision Global Supply Chains",
  description:
    "Learn about Meridian Logistics — a premier Saudi Arabia logistics partner providing multi-modal freight forwarding, contract logistics, and project cargo solutions worldwide.",
  alternates: { canonical: "/about" },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAboutSettings();

  const valuesList = [
    {
      icon: Compass,
      step: "01",
      title: about.missionTitle || "Our Mission",
      text:
        about.missionDescription ||
        "To deliver reliable, tech-driven, and client-centric supply chain solutions that empower businesses to scale across domestic and international markets with complete peace of mind.",
      badge: "Purpose",
      color: "text-[#f46a16] bg-orange/10 border-orange/20",
    },
    {
      icon: Globe2,
      step: "02",
      title: about.visionTitle || "Our Vision",
      text:
        about.visionDescription ||
        "To become the premier multi-modal logistics gateway in the Middle East, setting benchmark standards for operational precision, sustainability, and customer trust.",
      badge: "Ambition",
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      icon: ShieldCheck,
      step: "03",
      title: about.valuesTitle || "Our Core Values",
      text:
        about.valuesDescription ||
        "Integrity, relentless precision, proactive communication, and an uncompromising commitment to cargo safety and regulatory compliance.",
      badge: "Commitment",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ========================================================
          1. HERO BANNER: HIGH-IMPACT CORPORATE LUXURY
          ======================================================== */}
      <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center justify-center overflow-hidden bg-[#03172a] text-white pt-36 sm:pt-40 lg:pt-44 pb-20 sm:pb-24">
        {/* Background Image with Blending */}
        {about.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={about.heroImage}
              alt="Meridian Logistics Strategic Operations"
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
          className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent"
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
                {about.heroEyebrow || "About Meridian Logistics"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {about.heroTitle || "Precision Logistics That Moves Global Trade Forward"}
            </h1>

            <p className="mt-5 mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              {about.heroDescription ||
                "Headquartered in Saudi Arabia, Meridian connects industrial and commercial enterprises with seamless multi-modal freight forwarding, warehousing, and project cargo expertise across international trade corridors."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/request-a-quote">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/services" kind="outline">
                Explore Our Services
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          2. PERFORMANCE METRICS STRIP (4 METRICS)
          ======================================================== */}
      <section className="relative z-20 -mt-10 sm:-mt-12 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-slate-200/80">
          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-2xl sm:text-4xl font-black tracking-tight text-[#061b31]">
              {about.stat1Value || "20+"}
            </span>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-600">
              {about.stat1Label || "Years of Industry Expertise"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-2xl sm:text-4xl font-black tracking-tight text-[#f46a16]">
              {about.stat2Value || "45+"}
            </span>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-600">
              {about.stat2Label || "Global Trade Corridors"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-2xl sm:text-4xl font-black tracking-tight text-[#061b31]">
              {about.stat3Value || "120K+"}
            </span>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-600">
              {about.stat3Label || "TEUs Handled Annually"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-2xl sm:text-4xl font-black tracking-tight text-[#f46a16]">
              {about.stat4Value || "99.4%"}
            </span>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-600">
              {about.stat4Label || "On-Time Fulfillment Rate"}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. COMPANY STORY & EDITORIAL SPLIT
          ======================================================== */}
      <section className="section-pad relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                    {about.storyEyebrow || "Our Company Story"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight leading-tight">
                  {about.storyTitle || "Purposeful Connections Built Across Every Shipment"}
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {about.storyParagraph1 ||
                    "Meridian Logistics was founded to address the growing demand for agile, compliant, and transparent supply chain operations connecting the Kingdom of Saudi Arabia with major international trade gateways across Asia, Europe, and the Americas."}
                </p>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {about.storyParagraph2 ||
                    "From specialized project logistics and oversized heavy-lift consignments to temperature-sensitive pharmaceutical freight and rapid customs brokerage, our experienced team ensures operational excellence with end-to-end tracking and clear communication at every milestone."}
                </p>

                {/* Key Commitments Checklist */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#f46a16] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">Licensed Saudi Customs Brokerage</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#f46a16] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">End-to-End Real-Time Visibility</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#f46a16] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">Strict Safety & Compliance Protocols</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#f46a16] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">Dedicated Account Management</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Editorial Image & Floating Stat Card */}
            <div className="lg:col-span-5 relative">
              <Reveal>
                <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  {about.storyImage ? (
                    <Image
                      src={about.storyImage}
                      alt="Meridian Logistics operations and freight fleet"
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200 grid place-items-center text-slate-400">
                      Meridian Operations
                    </div>
                  )}

                  {/* Gradient bottom overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03182c]/60 via-transparent to-transparent" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 z-20 flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-xl border border-slate-200/80">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange/10 text-[#f46a16]">
                    <Award size={24} />
                  </span>
                  <div>
                    <span className="block text-xl font-extrabold text-[#061b31]">
                      {about.storyBadgeNumber || "15+"}
                    </span>
                    <span className="block text-[11px] font-semibold text-slate-600">
                      {about.storyBadgeLabel || "Years of Logistics Excellence"}
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MISSION, VISION & CORE VALUES
          ======================================================== */}
      <section className="section-pad relative overflow-hidden bg-[#f8fafc] border-y border-slate-200/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                  What Guides Us
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight">
                Built on Uncompromising Principles
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our mission, vision, and core values govern every cargo handover, partner collaboration, and client relationship.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valuesList.map(({ icon: Icon, step, title, text, badge, color }, index) => (
              <Reveal key={title} delay={index * 0.1}>
                <article className="h-full flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className={`grid h-12 w-12 place-items-center rounded-xl border ${color} transition group-hover:scale-105`}>
                        <Icon size={22} />
                      </span>
                      <span className="text-xs font-black tracking-widest text-slate-300">
                        {step}
                      </span>
                    </div>

                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#f46a16] mb-1">
                      {badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#061b31] group-hover:text-[#f46a16] transition-colors">
                      {title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. STRATEGIC STRENGTHS / CORE CAPABILITIES
          ======================================================== */}
      <section className="section-pad bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                  Our Capabilities
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight">
                Strategic Strengths That Define Us
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600">
                End-to-end expertise engineered to support diverse freight profiles with operational certainty.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(about.strengths.length > 0 ? about.strengths : [
                "Multi-Modal Freight Coordination",
                "Licensed Saudi Customs Brokerage",
                "Temperature-Controlled Cold Chain",
                "Heavy-Lift & Project Logistics",
                "Strategic Bonded Warehousing",
                "Real-Time Milestone Visibility",
              ]).map((strength, i) => (
                <div
                  key={`${strength}-${i}`}
                  className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-orange/40 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white border border-slate-200/60 text-[#f46a16] shadow-2xs group-hover:bg-[#f46a16] group-hover:text-white transition">
                    <Layers3 size={18} />
                  </span>
                  <span className="mt-3 text-xs font-bold text-[#061b31] leading-tight">
                    {strength}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          6. CLOSING CALL TO ACTION
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
                Get Started
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {about.ctaTitle || "Ready to Optimize Your Global Supply Chain?"}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {about.ctaDescription ||
                "Connect with our logistics specialists today to discuss customized freight forwarding, route feasibility, and competitive quotation structures."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href={about.ctaBtnHref || "/request-a-quote"}>
                {about.ctaBtnText || "Request a Quote"}
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
