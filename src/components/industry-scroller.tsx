"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/data/content";

export function IndustryScroller({industries}:{industries:Industry[]}) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction:number) => rail.current?.scrollBy({left:direction * 260, behavior:"smooth"});
  return <div className="industry-scroller">{industries.length > 1 && <div className="carousel-arrows"><button aria-label="Previous industries" onClick={()=>move(-1)}>←</button><button aria-label="Next industries" onClick={()=>move(1)}>→</button></div>}<div className="industry-cards" id="industry-cards" ref={rail}>{industries.map(item=><Link href={`/industries/${item.slug}`} className="industry-card" key={item.slug}>{item.image && <Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 82vw, 15vw"/>}<span className="industry-card-icon"><ArrowUpRight size={16}/></span><strong>{item.title}</strong></Link>)}</div></div>;
}
