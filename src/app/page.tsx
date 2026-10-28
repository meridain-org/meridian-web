import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Globe2, PackageCheck, ShieldCheck, Ship, UsersRound, Warehouse, Workflow, Truck, Plane, Target, Sparkles } from "lucide-react";
import { ButtonLink, CardArrow, Eyebrow, Reveal, SectionTitle } from "@/components/site";
import { ContentEmptyState } from "@/components/content-empty-state";
import { IndustryScroller } from "@/components/industry-scroller";
import { SeamlessHeroVideo } from "@/components/seamless-hero-video";
import { AboutCollageInteractive } from "@/components/about-collage-interactive";
import { Modern3DWorldMap } from "@/components/modern-3d-world-map";
import { TrustedClients } from "@/components/trusted-clients";
import { ServiceCardInteractive } from "@/components/service-card-interactive";
import { getHomepageCopy, getIndustries, getServices, getSiteMedia, getClientLogos } from "@/lib/server/content";

export const dynamic = "force-dynamic";

const icons = [Ship, Plane, Truck, PackageCheck, Warehouse];
const features = [["Industry Expertise", "Logistics insight shaped around your cargo and sector."], ["Global Network", "Partner connections that help link international shipments."], ["Customer-Centric", "Clear communication around your shipment priorities."], ["Operational Excellence", "Considered planning across every handover."], ["Advanced Technology", "Useful visibility and information at each milestone."], ["Sustainable Growth", "Supporting more thoughtful supply chain decisions."]];
const cleanEyebrow = (text: string) => text.replace(/\s*·\s*\d+\s*$/, "").trim();

export default async function HomePage() {
  const [services, industries, media, copy, clientLogos] = await Promise.all([
    getServices(),
    getIndustries(),
    getSiteMedia(),
    getHomepageCopy(),
    getClientLogos(),
  ]);
  const siteImage = (slot: string) => media[slot]?.resource_type === "image" ? media[slot].secure_url : "";
  const heroVideo = copy.heroVideoUrl?.trim() || (media["home.hero"]?.resource_type === "video" ? media["home.hero"].secure_url : null);
  const heroBackground = copy.heroBackgroundImage?.trim() || siteImage("home.hero");
  const heroPoster = copy.heroBackgroundImage?.trim() || siteImage("home.hero-poster") || siteImage("home.hero") || undefined;
  const hasHeroCopy = Boolean(copy.heroTitleLine1?.trim() && copy.heroTitleLine2?.trim() && copy.heroDescription?.trim());
  const ctaBackground = siteImage("home.cta");
  const ctaImage = ctaBackground || "/images/cta-logistics.webp";
  return <>
    <section className="home-hero" style={{ backgroundImage: `${heroBackground ? "linear-gradient(90deg,rgba(3,24,44,.88) 0%,rgba(3,24,44,.64) 42%,rgba(3,24,44,.12) 100%),linear-gradient(0deg,rgba(3,24,44,.22),transparent 40%)," : "linear-gradient(90deg,rgba(3,24,44,.96),rgba(3,24,44,.82)),"}${heroBackground ? `url(${heroBackground})` : "none"}` }}>
      {heroVideo && <SeamlessHeroVideo src={heroVideo} poster={heroPoster} crossfadeDurationMs={450}/>}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#03182c]/70 via-transparent to-transparent"/>
      <div className="container hero-inner">
        <div className="hero-copy">
          <Reveal>
            <Eyebrow>{copy.heroEyebrow || "Global logistics · Saudi Arabia"}</Eyebrow>
            {hasHeroCopy ? (
              <>
                <h1>{copy.heroTitleLine1}<br/><span>{copy.heroTitleLine2}</span></h1>
                <p>{copy.heroDescription}</p>
              </>
            ) : (
              <>
                <h1>Connecting Trade Lanes with<br/><span>Reliability & Global Scale</span></h1>
                <p>Integrated ocean, air, and overland transportation connecting the Kingdom of Saudi Arabia with global industrial and commercial markets.</p>
              </>
            )}
            <div className="hero-buttons">
              <ButtonLink href="/request-a-quote">{copy.heroBtnQuote || "Request a Quote"}</ButtonLink>
              <ButtonLink href="/services" kind="outline">{copy.heroBtnServices || "Explore Our Services"}</ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="about-home section-pad relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-white border-b border-slate-100">
      {/* Decorative subtle ambient lights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#041c32]/[0.03] blur-3xl"
      />

      <div className="container about-grid relative z-10">
        <Reveal className="about-copy">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1 mb-4 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#f46a16]">
              {cleanEyebrow(copy.aboutEyebrow || "About Meridian")}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#061b31] leading-[1.16]">
            {copy.aboutTitle || "Strategic Logistics Management Built on Operational Precision"}
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
            {copy.aboutDescription || "Headquartered in Saudi Arabia, Meridian provides multi-modal freight forwarding, contract logistics, and project cargo coordination tailored to high-value industrial and commercial supply chains."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href="/about">{copy.aboutBtn || "More About Us"}</ButtonLink>
          </div>

          {/* Elevated Modern Capability Pillars */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-200/80">
            <div className="group flex flex-col justify-between rounded-xl bg-white p-3.5 border border-slate-200/70 shadow-2xs transition-all duration-300 hover:border-orange/40 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange/10 text-[#f46a16] transition group-hover:bg-[#f46a16] group-hover:text-white">
                  <ShieldCheck size={16} />
                </span>
                <b className="text-xs font-bold text-[#061b31]">{copy.aboutHighlight1Title || "Reliable services"}</b>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 leading-relaxed">{copy.aboutHighlight1Subtitle || "Built around your needs"}</span>
            </div>

            <div className="group flex flex-col justify-between rounded-xl bg-white p-3.5 border border-slate-200/70 shadow-2xs transition-all duration-300 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                  <Globe2 size={16} />
                </span>
                <b className="text-xs font-bold text-[#061b31]">{copy.aboutHighlight2Title || "Global network"}</b>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 leading-relaxed">{copy.aboutHighlight2Subtitle || "Local expertise"}</span>
            </div>

            <div className="group flex flex-col justify-between rounded-xl bg-white p-3.5 border border-slate-200/70 shadow-2xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Workflow size={16} />
                </span>
                <b className="text-xs font-bold text-[#061b31]">{copy.aboutHighlight3Title || "Tailored solutions"}</b>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 leading-relaxed">{copy.aboutHighlight3Subtitle || "For your business"}</span>
            </div>
          </div>
        </Reveal>

        <AboutCollageInteractive
          image1={copy.aboutImage1 || siteImage("home.about-main")}
          image2={copy.aboutImage2 || siteImage("home.about-side")}
          image3={copy.aboutImage3 || siteImage("home.about-person")}
          alt1={media["home.about-main"]?.alt_text || "Meridian Strategic Logistics"}
          alt2={media["home.about-side"]?.alt_text || "Meridian Global Network"}
          alt3={media["home.about-person"]?.alt_text || "Meridian Operations"}
          caption={copy.aboutPersonCaption || "Moving business\nforward together"}
        />
      </div>
    </section>

    <section className="services-home section-pad relative overflow-hidden bg-[#03172a] text-white">
      {/* Ambient gradient backdrops */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#f46a16]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-sky-900/15 blur-3xl"
      />

      <div className="container relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 pb-4 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff8a40]">
                OUR CAPABILITIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight">
              Integrated Global Freight & Logistics Solutions
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Multi-modal transportation connecting the Kingdom of Saudi Arabia with major international trade gateways.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-[#f46a16] hover:border-[#f46a16]"
          >
            <span>View All Services</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {services.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.slice(0, 5).map((item, i) => (
              <ServiceCardInteractive
                key={item.slug}
                service={item}
                index={i}
                variant="dark"
              />
            ))}
          </div>
        ) : (
          <ContentEmptyState
            title="Service information is temporarily unavailable"
            message="Please check back soon or contact our team for help with your shipment."
          />
        )}
      </div>
    </section>

    <section className="network-home section-pad">
      <div className="container">
        <Reveal className="network-copy max-w-2xl mb-8 sm:mb-10">
          <Eyebrow>{cleanEyebrow(copy.networkEyebrow || "Our global network")}</Eyebrow>
          <h2>{copy.networkTitle || "Connecting Key Markets Worldwide"}</h2>
          <p>{copy.networkDescription || "Discuss your origin, destination, and service requirements with our team to confirm the options available for your shipment across Europe, Middle East, and Asia trade corridors."}</p>
        </Reveal>

        <Reveal className="network-map-wrapper mt-4 sm:mt-6" delay={0.1}>
          <Modern3DWorldMap />
        </Reveal>
      </div>
    </section>

    <section className="industries-home section-pad dark-section">
      <div className="container industry-grid-home">
        <Reveal className="industry-intro">
          <Eyebrow>{cleanEyebrow(copy.industryEyebrow || "Industries we serve")}</Eyebrow>
          <h2>{copy.industryTitle || "Industries we serve"}</h2>
          <ButtonLink href="/industries">{copy.industryBtn || "View All Industries"}</ButtonLink>
        </Reveal>
        {industries.length ? (
          <IndustryScroller industries={industries}/>
        ) : (
          <ContentEmptyState title="Industry information is temporarily unavailable" message="Please check back soon or contact our team to discuss your sector's logistics needs."/>
        )}
      </div>
    </section>

    <section className="why-home section-pad">
      <div className="container why-grid">
        <Reveal className="why-intro">
          <Eyebrow>{cleanEyebrow(copy.whyEyebrow || "Why choose Meridian")}</Eyebrow>
          <h2>{copy.whyTitle || "Your Trusted Partner in Global Logistics"}</h2>
          <p>{copy.whyDescription || "We combine thoughtful coordination and customer focus to support effective freight and logistics planning for your business."}</p>
          <ButtonLink href="/about">{copy.whyBtn || "Why Meridian"}</ButtonLink>
        </Reveal>
        <div className="feature-grid">{features.map(([title, text], i) => { const Icon = [Sparkles, Globe2, UsersRound, Target, Workflow, Compass][i]; return <Reveal key={title} delay={i * .04}><div className="feature-card"><Icon/><h3>{title}</h3><p>{text}</p></div></Reveal>; })}</div>
      </div>
    </section>

    <TrustedClients
      logos={clientLogos}
      eyebrow={copy.clientsEyebrow || "TRUSTED PARTNERS"}
      titleLine1={copy.clientsTitleLine1 || "Trusted by Leading"}
      titleHighlight={copy.clientsTitleHighlight || "Businesses Across the World"}
      description={copy.clientsDescription || "We are proud to collaborate with top industrial, commercial, and energy organizations to deliver secure, reliable, and connected global logistics solutions."}
    />

    <section className="cta-home relative overflow-hidden bg-[#03182c] border-t-4 border-[#f97316] text-white">
      {/* Desktop / Laptop Right Side Image with multi-direction gradient blending */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[50%] xl:w-[52%] pointer-events-none select-none z-0">
        <div className="relative w-full h-full">
          <Image
            src={ctaImage}
            alt="Move your freight with confidence across global trade lanes"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-center"
            priority
          />
          {/* Left horizontal blend: Seamless fade from solid navy background #03182c into the image */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#03182c] via-[#03182c]/85 to-transparent"
          />
          {/* Top subtle blend */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#03182c]/70 to-transparent"
          />
          {/* Bottom subtle blend */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#03182c]/70 to-transparent"
          />
        </div>
      </div>

      <div className="container relative z-10 cta-inner w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Content Column (left side on desktop, top on mobile) */}
          <div className="lg:col-span-7 xl:col-span-6">
            <Reveal>
              <Eyebrow>{copy.ctaEyebrow || "Ready to move forward?"}</Eyebrow>
              <h2>{copy.ctaTitleLine1 || "Move your freight with confidence"}<br/>{copy.ctaTitleLine2 || "across global trade lanes"}</h2>
              <p>{copy.ctaDescription || "Connect with our logistics team to discuss routes, schedules, and quotation details."}</p>
              <div className="hero-buttons">
                <ButtonLink href="/request-a-quote">{copy.ctaBtnQuote || "Request a Quote"}</ButtonLink>
                <ButtonLink href="/contact" kind="outline">{copy.ctaBtnContact || "Contact Our Team"}</ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* Mobile Screen: Image placed underneath content with proper top blending */}
          <div className="block lg:hidden mt-6 relative w-full overflow-hidden rounded-xl">
            <div className="relative w-full h-[220px] sm:h-[270px] overflow-hidden rounded-xl">
              <Image
                src={ctaImage}
                alt="Move your freight with confidence across global trade lanes"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Top blending: Seamless vertical fade from solid #03182c content down into image */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#03182c] via-[#03182c]/80 to-transparent"
              />
              {/* Bottom edge blending */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#03182c] to-transparent"
              />
              {/* Subtle side fades */}
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#03182c] to-transparent"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#03182c] to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </>;
}
