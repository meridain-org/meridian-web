"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, Mail, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { TopBar, SocialLinksRow } from "@/components/top-bar";
import { hasSocialLinks, type StoreSettings } from "@/data/settings";

const links = [
  ["Home", "/"], ["About Us", "/about"], ["Services", "/services"],
  ["Industries", "/industries"], ["Contact", "/contact"],
] as const;

export function Header({ settings }: { settings?: StoreSettings | null }) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  if (path.startsWith("/admin")) return null;
  return (
    <header className={`site-header ${open ? "menu-open" : ""} ${isScrolled ? "is-scrolled shadow-md" : ""}`}>
      {/* Announcement TopBar: Smoothly collapses/hides when scrolling down */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-16 opacity-100"
        }`}
      >
        <TopBar settings={settings} />
      </div>
      <div className={`nav-shell transition-all duration-200 ${isScrolled ? "h-[68px] sm:h-[74px]" : "h-[76px] sm:h-[84px]"}`}>
        <Link href="/" className="inline-flex items-center transition hover:opacity-90 py-1" aria-label="Meridian Logistics home">
          <Image
            src="/meridian-logo-web.webp"
            alt="Meridian Logistics"
            width={240}
            height={44}
            priority
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/request-a-quote" className="button button-orange nav-quote">
            Request a Quote <ArrowRight size={15} />
          </Link>
          <button
            className="icon-button mobile-toggle text-slate-800"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="mobile-nav-links">
            {links.map(([label, href], i) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="text-white hover:text-orange">
                <span>0{i + 1}</span>
                <strong className="font-semibold">{label}</strong>
                <ArrowUpRight size={16} className="text-slate-400" />
              </Link>
            ))}
          </div>
          <div className="mobile-nav-bottom">
            {settings && hasSocialLinks(settings) && (
              <div className="flex justify-center pb-2">
                <SocialLinksRow settings={settings} iconSize={19} className="justify-center" />
              </div>
            )}
            <Link className="button button-orange mobile-nav-cta" href="/request-a-quote" onClick={() => setOpen(false)}>
              Request a Quote <ArrowRight size={15} />
            </Link>
            <div className="mobile-locale">Global logistics · Saudi Arabia</div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer({ settings }: { settings?: StoreSettings | null }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-brand">
          <Link href="/" className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 shadow-2xs transition hover:opacity-95 w-fit" aria-label="Meridian Logistics home">
            <Image
              src="/meridian-logo-web.webp"
              alt="Meridian Logistics"
              width={160}
              height={29}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <p>Connecting businesses to global markets through considered freight forwarding and logistics coordination.</p>
          {settings && hasSocialLinks(settings) && (
            <div className="pt-2 pb-1">
              <SocialLinksRow settings={settings} iconSize={17} />
            </div>
          )}
        </div>
        <div className="footer-col">
          <h3>Explore</h3>
          <Link href="/about">About Meridian</Link>
          <Link href="/industries">Industries</Link>
        </div>
        <div className="footer-col">
          <h3>Our Services</h3>
          <Link href="/services">View current services</Link>
        </div>
        <div className="footer-col">
          <h3>Get in touch</h3>
          {settings?.phone_1 || settings?.email ? (
            <div className="space-y-2 mb-2.5 text-sm text-[#aab9c5]">
              {settings.phone_1?.trim() && (
                <p>
                  <a href={`tel:${settings.phone_1.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-white transition">
                    <Phone size={14} className="text-orange shrink-0" />
                    <span>{settings.phone_1.trim()}</span>
                  </a>
                </p>
              )}
              {settings.phone_2?.trim() && (
                <p>
                  <a href={`tel:${settings.phone_2.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-white transition">
                    <Phone size={14} className="text-orange shrink-0" />
                    <span>{settings.phone_2.trim()}</span>
                  </a>
                </p>
              )}
              {settings.email?.trim() && (
                <p>
                  <a href={`mailto:${settings.email.trim()}`} className="inline-flex items-center gap-2 hover:text-white transition">
                    <Mail size={14} className="text-orange shrink-0" />
                    <span>{settings.email.trim()}</span>
                  </a>
                </p>
              )}
            </div>
          ) : (
            <p className="muted">Saudi Arabia<br/>Serving international markets</p>
          )}
          <Link className="footer-cta" href="/contact">Contact our team <ArrowRight size={15}/></Link>
          <Link href="/request-a-quote">Request a Quote</Link>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} Meridian Logistics. All rights reserved.</span>
        <div>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function ButtonLink({ href, children, kind = "orange", icon = true, className = "" }: { href: string; children: ReactNode; kind?: "orange" | "outline" | "light"; icon?: boolean; className?: string }) {
  return <Link href={href} className={`button button-${kind} ${className}`.trim()}>{children}{icon && <ArrowRight size={16}/>}</Link>;
}

export function Eyebrow({ children, index }: { children: ReactNode; index?: string }) {
  return <div className="eyebrow">{children}<span/>{index && <small>{index}</small>}</div>;
}

export function PageHero({ eyebrow, title, description, image, compact = false }: { eyebrow: string; title: string; description: string; image?: string | null; compact?: boolean }) {
  const backgroundImage = image ? `linear-gradient(90deg,rgba(4,25,45,.92),rgba(4,25,45,.65) 44%,rgba(4,25,45,.12)),url(${image})` : "linear-gradient(90deg,rgba(4,25,45,.96),rgba(4,25,45,.84))";
  return <section className={`page-hero ${compact ? "compact" : ""}`} style={{ backgroundImage }}><div className="container page-hero-content"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p><div className="crumbs"><Link href="/">Home</Link><span>/</span><span>{eyebrow}</span></div></div><div className="hero-index">01 <span>—</span> MERIDIAN LOGISTICS</div></section>;
}

export function SectionTitle({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return <div className={`section-title ${light ? "light" : ""}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function CardArrow() { return <span className="card-arrow"><ArrowDownRight size={17}/></span>; }
