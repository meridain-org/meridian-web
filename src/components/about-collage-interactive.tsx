"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Globe2 } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export const DEFAULT_ABOUT_IMAGES = {
  image1: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85", // Container terminal / shipping logistics
  image2: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=85", // Modern logistics hub / warehouse operations
  image3: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=85", // Overland commercial transport / freight fleet
};

export interface AboutCollageInteractiveProps {
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  alt1?: string;
  alt2?: string;
  alt3?: string;
  badgeLine1?: string;
  badgeLine2?: string;
  caption?: string;
}

export function AboutCollageInteractive({
  image1,
  image2,
  image3,
  alt1 = "Meridian Strategic Logistics Hub",
  alt2 = "Meridian Global Freight Operations",
  alt3 = "Meridian Multi-modal Transportation",
  badgeLine1 = "SAUDI ARABIA",
  badgeLine2 = "TO THE WORLD",
  caption = "Moving business\nforward together",
}: AboutCollageInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Track fallbacks if image fails to load
  const [img1Src, setImg1Src] = useState(image1?.trim() || DEFAULT_ABOUT_IMAGES.image1);
  const [img2Src, setImg2Src] = useState(image2?.trim() || DEFAULT_ABOUT_IMAGES.image2);
  const [img3Src, setImg3Src] = useState(image3?.trim() || DEFAULT_ABOUT_IMAGES.image3);

  // Parallax scroll link
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Main landscape image zoom-in on scroll
  const mainScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.05, 1.1]);
  const mainInnerScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.0, 1.08, 1.15]);

  // Top-right image drifts slightly upward
  const topRightY = useTransform(scrollYProgress, [0, 0.5, 1], [20, -14, -28]);

  // Bottom-right image drifts slightly downward
  const bottomRightY = useTransform(scrollYProgress, [0, 0.5, 1], [-18, 12, 26]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[470px] select-none"
    >
      {/* Decorative backdrop glow and subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#03182c]/5 via-orange/5 to-transparent blur-2xl opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-orange/10 blur-3xl"
      />

      {/* ========================================================
          IMAGE 1: MAIN LANDSCAPE (LEFT)
          - Landscape aspect ratio with little height
          - Zooms in smoothly when scrolled into view & on scroll
          ======================================================== */}
      <motion.div
        className="absolute left-0 top-[30px] sm:top-[38px] w-[70%] sm:w-[68%] lg:w-[66%] h-[240px] sm:h-[280px] lg:h-[310px] rounded-2xl overflow-hidden shadow-2xl shadow-[#041c32]/25 border-4 sm:border-[6px] border-white z-10 bg-slate-100 group"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={reduceMotion ? undefined : { scale: mainScale }}
      >
        <motion.div
          className="relative w-full h-full"
          style={reduceMotion ? undefined : { scale: mainInnerScale }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={img1Src}
            alt={alt1}
            fill
            sizes="(max-width: 900px) 90vw, 45vw"
            priority
            onError={() => setImg1Src(DEFAULT_ABOUT_IMAGES.image1)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>

        {/* Ambient subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03182c]/60 via-transparent to-black/10" />

        {/* Subtle status tag */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 shadow-sm border border-white/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f46a16] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f46a16]" />
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-800">
            Strategic Hub
          </span>
        </div>
      </motion.div>

      {/* ========================================================
          IMAGE 2: TOP RIGHT ACCENT
          - Moves from right side and elevates higher ("little hight top")
          ======================================================== */}
      <motion.div
        className="absolute right-0 top-0 sm:-top-2 w-[44%] sm:w-[42%] lg:w-[40%] h-[180px] sm:h-[210px] lg:h-[230px] rounded-2xl overflow-hidden shadow-2xl shadow-[#041c32]/30 border-4 sm:border-[6px] border-white z-20 bg-slate-200 group"
        initial={reduceMotion ? false : { opacity: 0, x: 70, y: 30 }}
        whileInView={{ opacity: 1, x: 0, y: -14 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={reduceMotion ? undefined : { y: topRightY }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={img2Src}
            alt={alt2}
            fill
            sizes="(max-width: 900px) 45vw, 25vw"
            onError={() => setImg2Src(DEFAULT_ABOUT_IMAGES.image2)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </div>

        {/* Subtle glass shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#03182c]/40 via-transparent to-white/10" />

        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-white/90 text-[10px] font-semibold bg-[#03182c]/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
          <span>Global Network</span>
          <Globe2 size={12} className="text-orange" />
        </div>
      </motion.div>

      {/* ========================================================
          IMAGE 3: BOTTOM RIGHT ACCENT
          - Moves from right side and shifts to bottom ("move to bottom")
          ======================================================== */}
      <motion.div
        className="absolute right-2 sm:right-4 bottom-2 sm:bottom-0 w-[42%] sm:w-[40%] lg:w-[38%] h-[180px] sm:h-[210px] lg:h-[225px] rounded-2xl overflow-hidden shadow-2xl shadow-[#041c32]/35 border-4 sm:border-[6px] border-white z-30 bg-slate-200 group"
        initial={reduceMotion ? false : { opacity: 0, x: 65, y: -25 }}
        whileInView={{ opacity: 1, x: 0, y: 16 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={reduceMotion ? undefined : { y: bottomRightY }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={img3Src}
            alt={alt3}
            fill
            sizes="(max-width: 900px) 45vw, 25vw"
            onError={() => setImg3Src(DEFAULT_ABOUT_IMAGES.image3)}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </div>

        {/* Gradient caption overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041c32] via-[#041c32]/80 to-transparent pt-10 pb-3 px-3.5 text-white z-10">
          <p className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-sm whitespace-pre-line text-white">
            {caption}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
