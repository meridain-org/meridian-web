import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, PageHero, Reveal } from "@/components/site";
import { getServices } from "@/lib/server/content";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() { return (await getServices()).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = (await getServices()).find(item => item.slug === slug);
  return { title: service?.title ?? "Service not found", description: service?.short, alternates: { canonical: `/services/${slug}` } };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allServices = await getServices();
  const service = allServices.find(item => item.slug === slug);
  if (!service) notFound();
  const related = allServices.filter(item => item.slug !== slug).slice(0, 3);
  return <>
    <PageHero eyebrow={`Services / ${service.title}`} title={service.title} description={service.short} image={service.image || null}/>
    <section className="section-pad"><div className="container detail-layout">
      <Reveal className="detail-main"><Eyebrow>Service overview</Eyebrow><h2>{service.title}</h2>
        {service.description ? <p>{service.description}</p> : <p role="status">Service details are being updated. Contact our team for current information.</p>}
        {service.image && <div className="detail-image"><Image src={service.image} alt={service.title} fill sizes="(max-width: 800px) 100vw, 66vw"/></div>}
        {service.process.length > 0 && <><h3>How the process works</h3><div className="process-list">{service.process.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></>}
        {service.industries.length > 0 && <><h3>Industries we work with</h3><div className="tag-list">{service.industries.map(item => <span key={item}>{item}</span>)}</div></>}
      </Reveal>
      <aside className="detail-aside"><Eyebrow>At a glance</Eyebrow><h3>Service capabilities</h3>{service.benefits.length > 0 ? service.benefits.map(item => <p className="check-line" key={item}><Check size={17}/>{item}</p>) : <p>Capability details are being updated.</p>}<div className="aside-cta"><h3>Discuss your shipment</h3><p>Share your requirements with our team.</p><ButtonLink href="/request-a-quote">Request a Quote</ButtonLink></div></aside>
    </div></section>
    {related.length > 0 && <section className="section-pad soft-section"><div className="container"><Eyebrow>Explore more</Eyebrow><h2 className="subsection-heading">Related services</h2><div className="related-grid">{related.map(item => <Link key={item.slug} href={`/services/${item.slug}`}><span>{item.title}</span><ArrowRight/></Link>)}</div></div></section>}
  </>;
}
