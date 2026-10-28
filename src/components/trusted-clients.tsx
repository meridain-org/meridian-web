"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import type { ClientLogo } from "@/data/clients";
import { WORLD_MAP_DOTS, WORLD_CONTINENT_PATHS } from "@/data/world-map-data";

// Subtle, spread-out global hubs (delicate glowing dots across the world, not cluttering the center)
const GLOBAL_HUBS = [
  { id: "middle-east", name: "Middle East", x: 635, y: 245 },
  { id: "europe-central", name: "Europe", x: 520, y: 135 },
  { id: "uk", name: "London", x: 495, y: 125 },
  { id: "east-asia", name: "East Asia", x: 805, y: 205 },
  { id: "south-asia", name: "South Asia", x: 695, y: 250 },
  { id: "se-asia", name: "Singapore", x: 775, y: 295 },
  { id: "north-america-east", name: "New York", x: 275, y: 165 },
  { id: "north-america-west", name: "Los Angeles", x: 200, y: 180 },
  { id: "south-america", name: "São Paulo", x: 350, y: 360 },
  { id: "africa", name: "Johannesburg", x: 570, y: 365 },
];

// Faint, elegant global trade arcs
const NETWORK_ROUTES = [
  { from: [635, 245], to: [520, 135], cx: 575, cy: 160 },
  { from: [635, 245], to: [495, 125], cx: 550, cy: 145 },
  { from: [635, 245], to: [695, 250], cx: 665, cy: 240 },
  { from: [695, 250], to: [775, 295], cx: 735, cy: 265 },
  { from: [775, 295], to: [805, 205], cx: 795, cy: 250 },
  { from: [635, 245], to: [805, 205], cx: 720, cy: 185 },
  { from: [635, 245], to: [275, 165], cx: 430, cy: 75 },
  { from: [520, 135], to: [275, 165], cx: 380, cy: 105 },
  { from: [275, 165], to: [200, 180], cx: 235, cy: 160 },
  { from: [275, 165], to: [350, 360], cx: 320, cy: 265 },
  { from: [635, 245], to: [570, 365], cx: 615, cy: 310 },
];

export function TrustedClients({
  logos = [],
  eyebrow = "TRUSTED PARTNERS",
  titleLine1 = "Trusted by Leading",
  titleHighlight = "Businesses Across the World",
  description = "We are proud to collaborate with top industrial, commercial, and energy organizations to deliver secure, reliable, and connected global logistics solutions.",
}: {
  logos?: ClientLogo[];
  eyebrow?: string;
  titleLine1?: string;
  titleHighlight?: string;
  description?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const glowFilterId = useId();

  // If no logos provided yet, use default sample logo URLs
  const displayList = logos.length > 0 ? logos : [
    { id: "1", logo_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=320&auto=format&fit=crop&q=80" },
    { id: "2", logo_url: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=320&auto=format&fit=crop&q=80" },
    { id: "3", logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=320&auto=format&fit=crop&q=80" },
    { id: "4", logo_url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=320&auto=format&fit=crop&q=80" },
    { id: "5", logo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=320&auto=format&fit=crop&q=80" },
    { id: "6", logo_url: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=320&auto=format&fit=crop&q=80" },
  ];

  // Quadruple items to make the infinite auto-scroll seamless and gap-free
  const seamlessItems = [...displayList, ...displayList, ...displayList, ...displayList];

  const handleManualScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 260;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-[#030712] py-20 sm:py-24 text-white">
      {/* ========================================================
          BACKGROUND: SOFT, LIGHT, BLURRED MAP & SUBTLE NETWORK
          Clean and non-distracting so text & logos are 100% visible
          ======================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        {/* Soft, deep ambient background gradient */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(249,115,22,0.08)_0%,rgba(3,7,18,0.7)_55%,#030712_100%)]"
        />

        {/* World Map SVG: Crisp, visible, balanced backdrop */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full min-h-[500px] max-w-[1500px] object-cover opacity-60 sm:opacity-70"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="softRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#fb923c" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* 1. Subtle continent outlines */}
          <g className="continent-silhouettes" opacity="0.22">
            {WORLD_CONTINENT_PATHS.map((pathData, idx) => (
              <path
                key={idx}
                d={pathData}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.6"
              />
            ))}
          </g>

          {/* 2. Crisp, clearly visible world dots */}
          <g className="world-dots">
            {WORLD_MAP_DOTS.map(([x, y], idx) => {
              const isMiddleEast = Math.hypot(x - 635, y - 245) < 75;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={isMiddleEast ? 1.6 : 1.4}
                  fill={isMiddleEast ? "#fb923c" : "#cbd5e1"}
                  opacity={isMiddleEast ? 0.75 : 0.38}
                />
              );
            })}
          </g>

          {/* 3. Delicate, elegant curved route lines */}
          <g className="network-routes" opacity="0.55">
            {NETWORK_ROUTES.map((route, i) => {
              const pathData = `M ${route.from[0]} ${route.from[1]} Q ${route.cx} ${route.cy} ${route.to[0]} ${route.to[1]}`;
              return (
                <path
                  key={i}
                  d={pathData}
                  fill="none"
                  stroke="url(#softRouteGrad)"
                  strokeWidth="1.1"
                  strokeDasharray="4 6"
                />
              );
            })}
          </g>

          {/* 4. Subtle, crisp glowing hubs */}
          <g className="network-hubs">
            {GLOBAL_HUBS.map((hub) => (
              <g key={hub.id}>
                {/* Soft outer glow */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={10}
                  fill="#f97316"
                  opacity={0.3}
                />
                {/* Center dot */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={2.5}
                  fill="#ffffff"
                  stroke="#f97316"
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Soft central dark mask ensuring text legibility without blocking dots */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(3,7,18,0.55)_0%,rgba(3,7,18,0.2)_45%,transparent_75%)] pointer-events-none"
        />

        {/* Top & bottom gradient fade into page */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#030712_0%,transparent_18%,transparent_82%,#030712_100%)] pointer-events-none"
        />
      </div>

      {/* ========================================================
          CONTENT: CLEAN, SHARP, 100% LEGIBLE
          ======================================================== */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Header section matching reference design */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Top Shield Badge */}
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f97316]/40 bg-[#f97316]/10 text-[#f97316] shadow-[0_0_16px_rgba(249,115,22,0.3)]">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
          </div>

          {/* Eyebrow: — TRUSTED PARTNERS — */}
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#f97316]">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>

          {/* Clean, bold title with NO distracting border box */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
            {titleLine1}{" "}
            <span className="block sm:inline text-white font-extrabold">
              {titleHighlight}
            </span>
          </h2>

          {/* Clean, readable description */}
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#94a3b8]">
              {description}
            </p>
          )}
        </div>

        {/* Carousel / Marquee Container */}
        <div className="mt-12 sm:mt-14 relative">
          <div className="relative rounded-2xl border border-white/10 bg-[#071322]/85 p-3 sm:p-5 shadow-2xl backdrop-blur-md">
            {/* Left & Right Gradient Shadows for seamless edge fading */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 bg-gradient-to-r from-[#071322] via-[#071322]/85 to-transparent rounded-l-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 bg-gradient-to-l from-[#071322] via-[#071322]/85 to-transparent rounded-r-2xl"
            />

            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={() => handleManualScroll("left")}
              aria-label="Previous logos"
              className="absolute left-2 sm:left-4 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-white/10 bg-[#030712]/85 text-white/70 shadow-lg backdrop-blur-sm transition-all hover:bg-[#f97316] hover:border-[#f97316] hover:text-white hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={() => handleManualScroll("right")}
              aria-label="Next logos"
              className="absolute right-2 sm:right-4 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-white/10 bg-[#030712]/85 text-white/70 shadow-lg backdrop-blur-sm transition-all hover:bg-[#f97316] hover:border-[#f97316] hover:text-white hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Auto-Scroll Ticker Track */}
            <div
              ref={scrollRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="overflow-x-auto scrollbar-none py-2 px-6 sm:px-12 flex items-center"
              style={{ scrollBehavior: "smooth" }}
            >
              <div
                className={`flex items-center gap-4 sm:gap-6 shrink-0 ${
                  isPaused ? "" : "animate-marquee"
                }`}
                style={{
                  animationDuration: `${Math.max(25, displayList.length * 6)}s`,
                }}
              >
                {seamlessItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="group relative flex h-20 sm:h-24 w-44 sm:w-52 shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_24px_rgba(0,0,0,0.38)] hover:ring-2 hover:ring-[#f97316]/50"
                  >
                    <div className="relative h-12 sm:h-14 w-full flex items-center justify-center">
                      <Image
                        src={item.logo_url}
                        alt="Client logo"
                        fill
                        sizes="200px"
                        className="object-contain p-1 filter drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                        unoptimized={item.logo_url.startsWith("http")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


