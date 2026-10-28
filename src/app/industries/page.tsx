import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, Reveal, SectionTitle } from "@/components/site";
import { ContentEmptyState } from "@/components/content-empty-state";
import { getIndustries, getSiteMedia } from "@/lib/server/content";
export const metadata={title:"Industries",description:"Logistics planning for construction, manufacturing, energy, project cargo, and consumer goods.",alternates:{canonical:"/industries"}};
export const dynamic = "force-dynamic";
export default async function IndustriesPage(){const [industries,media]=await Promise.all([getIndustries(),getSiteMedia()]);return <><PageHero eyebrow="Industries" title="Logistics shaped around your sector." description="Every industry has distinct cargo, timing, and delivery needs. Explore how shipment planning can account for them." image={media["page.industries.hero"]?.secure_url}/><section className="section-pad"><div className="container"><SectionTitle eyebrow="Industries we serve" title="Sector context makes a difference." text="Explore logistics considerations for these sectors and find relevant service capabilities."/>{industries.length ? <div className="industry-listing">{industries.map((x,i)=><Reveal key={x.slug}><Link href={`/industries/${x.slug}`} className="industry-row"><span className="row-number">0{i+1}</span><div><h3>{x.title}</h3><p>{x.intro}</p></div><div className="row-image">{x.image && <Image src={x.image} alt={x.title} fill sizes="(max-width: 760px) 40vw, 20vw"/>}</div><ArrowUpRight/></Link></Reveal>)}</div> : <ContentEmptyState title="Industry information is temporarily unavailable" message="Please check back soon or contact our team to discuss your sector's logistics needs."/>}</div></section></>;}
