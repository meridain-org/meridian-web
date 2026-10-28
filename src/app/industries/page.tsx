import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Factory,
  HardHat,
  Layers3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { ButtonLink, Reveal } from "@/components/site";
import { ContentEmptyState } from "@/components/content-empty-state";
import { getIndustries, getSiteMedia } from "@/lib/server/content";

export const metadata = {
  title: "Industry Logistics | Meridian Specialized Supply Chain Solutions",
  description:
    "Logistics planning and multi-modal freight tailored to construction, manufacturing, energy, project cargo, and consumer goods across Saudi Arabia and global trade corridors.",
  alternates: { canonical: "/industries" },
};

export const dynamic = "force-dynamic";

function getSectorIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("construct") || t.includes("infra")) return HardHat;
  if (t.includes("manufact") || t.includes("industr")) return Factory;
  if (t.includes("energy") || t.includes("oil") || t.includes("gas")) return Zap;
  if (t.includes("project") || t.includes("heavy")) return PackageCheck;
  if (t.includes("retail") || t.includes("consumer") || t.includes("goods")) return Boxes;
  return Layers3;
}

export default async function IndustriesPage() {
  const [industries, media] = await Promise.all([getIndustries(), getSiteMedia()]);

  const heroImage =
    media["page.industries.hero"]?.secure_url ||
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=85";

  return (
    <div className="overflow-hidden">
      {/* ========================================================
          1. HERO BANNER: HIGH-IMPACT CORPORATE LUXURY
          ======================================================== */}
      <section className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] flex items-center justify-center overflow-hidden bg-[#03172a] text-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Meridian Industry Logistics Operations"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-white/5 backdrop-blur-md px-3.5 py-1.5 shadow-sm mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f46a16]">
                SECTORS WE SERVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Logistics Shaped Around Your Industry Sector
            </h1>

            <p className="mt-5 mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              Every industry operates under distinct cargo profiles, regulatory standards, and delivery schedules. Explore how our specialized shipment planning accounts for every operational nuance.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/request-a-quote">
                Request an Industry Quote
              </ButtonLink>
              <ButtonLink href="/contact" kind="outline">
                Speak to a Sector Lead
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          2. SECTORS SHOWCASE: ALTERNATING ZIGZAG HALF-WIDTH LAYOUT
          ======================================================== */}
      <section className="section-pad relative overflow-hidden bg-[#f8fafc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
                  Industry Portfolio
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061b31] tracking-tight">
                Sector Context Makes the Difference
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Explore tailored supply chain considerations, route strategies, and verified solutions designed for each market sector.
              </p>
            </Reveal>
          </div>

          {industries.length ? (
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {industries.map((sector, index) => {
                const isEven = index % 2 === 0;
                // isEven = true (0, 2, 4): Image LEFT, Content RIGHT
                // isEven = false (1, 3, 5): Content LEFT, Image RIGHT
                const Icon = getSectorIcon(sector.title);
                const formattedNumber = String(index + 1).padStart(2, "0");

                return (
                  <Reveal key={sector.slug} delay={index * 0.05}>
                    <article className="group relative rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange/30">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* ==========================================
                            IMAGE COLUMN: HALF-WIDTH SIZED IMAGE
                            ========================================== */}
                        <div
                          className={`lg:col-span-6 w-full ${
                            isEven ? "lg:order-1" : "lg:order-2"
                          }`}
                        >
                          <Link
                            href={`/industries/${sector.slug}`}
                            className="block relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group/img"
                          >
                            {sector.image ? (
                              <Image
                                src={sector.image}
                                alt={`${sector.title} logistics`}
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-106"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-tr from-[#03182c] to-[#0a355c] flex items-center justify-center">
                                <Icon size={44} className="text-white/30" />
                              </div>
                            )}

                            {/* Vignette Overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                            {/* Top Left Badge */}
                            <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md px-3 py-1 border border-white/20 text-white shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
                              <span className="text-[10px] font-bold tracking-wider uppercase text-white">
                                SECTOR {formattedNumber}
                              </span>
                            </div>

                            {/* Icon Badge Overlay */}
                            <div className="absolute bottom-3.5 left-3.5 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white text-[#061b31] shadow-lg border border-white/60 transition-colors group-hover/img:bg-[#f46a16] group-hover/img:text-white">
                              <Icon size={20} />
                            </div>
                          </Link>
                        </div>

                        {/* ==========================================
                            CONTENT COLUMN: HALF-WIDTH DETAILS
                            ========================================== */}
                        <div
                          className={`lg:col-span-6 w-full space-y-4 ${
                            isEven ? "lg:order-2" : "lg:order-1"
                          }`}
                        >
                          {/* Sector Tag & Step Number */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#f46a16]">
                              {formattedNumber} / INDUSTRY SECTOR
                            </span>
                            <span className="text-xs font-black text-slate-300">
                              MERIDIAN LOGISTICS
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#061b31] tracking-tight group-hover:text-[#f46a16] transition-colors">
                            <Link href={`/industries/${sector.slug}`}>
                              {sector.title}
                            </Link>
                          </h3>

                          {/* Introductory narrative */}
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                            {sector.intro}
                          </p>

                          {/* Key Sector Considerations / Solutions Highlights */}
                          {sector.solutions && sector.solutions.length > 0 && (
                            <div className="pt-2 space-y-2">
                              {sector.solutions.slice(0, 3).map((solution) => (
                                <div key={solution} className="flex items-start gap-2.5">
                                  <CheckCircle2
                                    size={16}
                                    className="text-[#f46a16] shrink-0 mt-0.5"
                                  />
                                  <span className="text-xs sm:text-[13px] font-medium text-slate-700 leading-snug">
                                    {solution}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Connected Services Pills */}
                          {sector.services && sector.services.length > 0 && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {sector.services.map((svc) => (
                                <span
                                  key={svc}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200/80"
                                >
                                  <Layers3 size={11} className="text-[#f46a16]" />
                                  <span>{svc}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Direct Clean Navigation Link (No heavy CTA) */}
                          <div className="pt-4">
                            <Link
                              href={`/industries/${sector.slug}`}
                              className="group/link inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#f46a16] hover:text-[#d95108] transition-colors"
                            >
                              <span>Explore {sector.title} Logistics</span>
                              <ArrowRight
                                size={15}
                                className="transition-transform group-hover/link:translate-x-1.5"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <ContentEmptyState
              title="Industry information is temporarily unavailable"
              message="Please check back soon or contact our team to discuss your sector's logistics needs."
            />
          )}
        </div>
      </section>

      {/* ========================================================
          3. CLOSING CONSULTATION BANNER
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
                Industry Consultation
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Have Specific Sector Requirements?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with our industry logistics specialists to discuss cargo handling protocols, customs compliance, and dedicated transport solutions.
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
