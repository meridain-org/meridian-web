import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink, PageHero, Reveal, SectionTitle } from "@/components/site";
import { ContentEmptyState } from "@/components/content-empty-state";
import { getIndustries, getServices } from "@/lib/server/content";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() { return (await getIndustries()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = (await getIndustries()).find(item => item.slug === slug);
  return { title: industry?.title ?? "Industry not found", description: industry?.intro, alternates: { canonical: `/industries/${slug}` } };
}

export default async function IndustryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = (await getIndustries()).find(item => item.slug === slug);
  if (!industry) notFound();
  const related = (await getServices()).filter(service => industry.services.includes(service.title));
  const hasDetail = industry.challenges.length > 0 || industry.solutions.length > 0;
  return <>
    <PageHero eyebrow={`Industries / ${industry.title}`} title={industry.title} description={industry.intro} image={industry.image || null}/>
    <section className="section-pad"><div className="container">
      {industry.image && <div className="editorial-split"><Reveal><SectionTitle eyebrow="Industry perspective" title={industry.title} text={industry.intro}/></Reveal><Reveal className="editorial-image"><Image src={industry.image} alt={industry.title} fill sizes="(max-width: 800px) 100vw, 50vw"/></Reveal></div>}
      {!industry.image && <div className="mb-10"><SectionTitle eyebrow="Industry perspective" title={industry.title} text={industry.intro}/></div>}
      {hasDetail ? <div className="industry-detail-grids">{industry.challenges.length > 0 && <div><h3>Common logistics considerations</h3>{industry.challenges.map(item => <p className="check-line" key={item}><span className="orange-dot"/>{item}</p>)}</div>}{industry.solutions.length > 0 && <div><h3>Planning opportunities</h3>{industry.solutions.map(item => <p className="check-line" key={item}><Check size={17}/>{item}</p>)}</div>}</div> : <ContentEmptyState title="Industry details are being updated" message="Contact our team to discuss current logistics requirements for this sector."/>}
    </div></section>
    <section className="section-pad soft-section"><div className="container"><SectionTitle eyebrow="Relevant services" title="Explore connected capabilities."/>{related.length > 0 ? <div className="related-grid">{related.map(service => <Link key={service.slug} href={`/services/${service.slug}`}><span>{service.title}</span><ArrowRight/></Link>)}</div> : <ContentEmptyState title="Related services are temporarily unavailable" message="Please contact our team to discuss available services."/>}<div className="center-cta"><p>Have a shipment to plan for this sector?</p><ButtonLink href="/request-a-quote">Talk to our team</ButtonLink></div></div></section>
  </>;
}
