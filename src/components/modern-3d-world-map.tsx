"use client";

import { useId, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WORLD_MAP_DOTS, WORLD_CONTINENT_PATHS } from "@/data/world-map-data";

export interface ContinentInfo {
  id: string;
  name: string;
  hub: [number, number]; // [x, y] on 1000x500 map
  callout: {
    elbow: [number, number];
    end: [number, number];
    labelLeftPercent: number;
    labelTopPercent: number;
  };
  details: string;
}

export const CONTINENTS: ContinentInfo[] = [
  {
    id: "north-america",
    name: "North America",
    hub: [245, 175],
    callout: {
      elbow: [155, 205],
      end: [105, 205],
      labelLeftPercent: 2,
      labelTopPercent: 33,
    },
    details: "United States · Canada · Mexico",
  },
  {
    id: "europe",
    name: "Europe",
    hub: [525, 135],
    callout: {
      elbow: [465, 55],
      end: [410, 55],
      labelLeftPercent: 26,
      labelTopPercent: 4.5,
    },
    details:
      "United Kingdom · Germany · France · Italy · Netherlands · Spain · Belgium · Poland and across Europe",
  },
  {
    id: "asia",
    name: "Asia",
    hub: [780, 205],
    callout: {
      elbow: [865, 185],
      end: [910, 185],
      labelLeftPercent: 79,
      labelTopPercent: 26,
    },
    details:
      "Saudi Arabia · UAE · China · India · Japan · South Korea · Singapore · Malaysia · Thailand · Vietnam and across Asia",
  },
  {
    id: "south-america",
    name: "South America",
    hub: [365, 375],
    callout: {
      elbow: [230, 395],
      end: [175, 395],
      labelLeftPercent: 3,
      labelTopPercent: 71,
    },
    details: "Brazil · Argentina · Chile · Peru · Colombia",
  },
  {
    id: "africa",
    name: "Africa",
    hub: [565, 335],
    callout: {
      elbow: [465, 440],
      end: [405, 440],
      labelLeftPercent: 27,
      labelTopPercent: 82,
    },
    details: "Egypt · South Africa · Kenya · Morocco · Nigeria and other key African markets",
  },
  {
    id: "australia",
    name: "Australia (Oceania)",
    hub: [895, 415],
    callout: {
      elbow: [930, 420],
      end: [960, 420],
      labelLeftPercent: 79,
      labelTopPercent: 74,
    },
    details: "Australia · New Zealand · Papua New Guinea and Pacific destinations",
  },
  {
    id: "antarctica",
    name: "Antarctica",
    hub: [500, 485],
    callout: {
      elbow: [500, 498],
      end: [530, 498],
      labelLeftPercent: 53,
      labelTopPercent: 90,
    },
    details:
      "Specialized logistics support through international research and scientific supply networks, where operationally required.",
  },
];

// ONLY Middle East (Saudi Arabia) HQ Links radiating out to all continents
export interface TradeRoute {
  id: string;
  name: string;
  p1: [number, number]; // Saudi Arabia HQ
  p2: [number, number]; // Destination continent hub
  control: [number, number];
  duration: number;
  delay: number;
}

export const MIDDLE_EAST_HQ_ROUTES: TradeRoute[] = [
  // Saudi Arabia HQ (630, 245) -> Europe (525, 135)
  {
    id: "me-eu",
    name: "Middle East — Europe Corridor",
    p1: [630, 245],
    p2: [525, 135],
    control: [565, 155],
    duration: 3.2,
    delay: 0,
  },
  // Saudi Arabia HQ (630, 245) -> Asia (780, 205)
  {
    id: "me-asia",
    name: "Middle East — East Asia Corridor",
    p1: [630, 245],
    p2: [780, 205],
    control: [705, 195],
    duration: 3.0,
    delay: 0.7,
  },
  // Saudi Arabia HQ (630, 245) -> North America (245, 175)
  {
    id: "me-na",
    name: "Middle East — North America Corridor",
    p1: [630, 245],
    p2: [245, 175],
    control: [420, 60],
    duration: 5.0,
    delay: 1.4,
  },
  // Saudi Arabia HQ (630, 245) -> Africa (565, 335)
  {
    id: "me-af",
    name: "Middle East — Africa Corridor",
    p1: [630, 245],
    p2: [565, 335],
    control: [610, 310],
    duration: 2.8,
    delay: 0.3,
  },
  // Saudi Arabia HQ (630, 245) -> South America (365, 375)
  {
    id: "me-sa",
    name: "Middle East — South America Corridor",
    p1: [630, 245],
    p2: [365, 375],
    control: [480, 330],
    duration: 4.8,
    delay: 1.8,
  },
  // Saudi Arabia HQ (630, 245) -> Australia / Oceania (895, 415)
  {
    id: "me-au",
    name: "Middle East — Oceania Corridor",
    p1: [630, 245],
    p2: [895, 415],
    control: [790, 350],
    duration: 4.2,
    delay: 1.1,
  },
];

export function Modern3DWorldMap() {
  const filterId = useId();
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 3D perspective tilt on mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: nx * 8, y: -ny * 6 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full overflow-visible select-none bg-transparent">
      {/* 3D Perspective Map Shell */}
      <div
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1000/500] min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] select-none"
        style={{
          perspective: 1200,
        }}
      >
        <motion.div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: reduceMotion
              ? undefined
              : `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* SVG Canvas for Map Dots, Land outlines, Routes, and Callout lines */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full overflow-visible"
            aria-label="Modern Dot-Wise World Logistics Map"
          >
            <defs>
              {/* Radial glow filter for glowing orange hubs */}
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient for Trade Arcs */}
              <linearGradient id="routeGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f46a16" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ff8533" stopOpacity="1" />
                <stop offset="100%" stopColor="#f46a16" stopOpacity="0.85" />
              </linearGradient>

              {/* Subtle grid pattern */}
              <pattern id="lightGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.6"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
              </pattern>
            </defs>

            {/* Background coordinate grid */}
            <rect width="1000" height="500" fill="url(#lightGrid)" />

            {/* Continent Landmass Silhouettes (Accurate deep navy continents on white) */}
            <g className="transition-opacity duration-500">
              {WORLD_CONTINENT_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="#061e36"
                  stroke="#0b2e50"
                  strokeWidth="0.8"
                  opacity="0.96"
                />
              ))}
            </g>

            {/* ========================================================
                DOT-MATRIX CONTINENT PARTICLES (1,487 accurate land dots)
                ======================================================== */}
            <g className="map-dot-matrix">
              {WORLD_MAP_DOTS.map(([x, y], idx) => {
                // Highlight dots near active continent or Middle East HQ
                const isNearME = Math.hypot(x - 630, y - 245) < 70;

                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isNearME ? 1.6 : 1.25}
                    fill={isNearME ? "#ffa35c" : "#1d5380"}
                    opacity={isNearME ? 0.95 : 0.65}
                    className="transition-colors duration-300"
                  />
                );
              })}
            </g>

            {/* ========================================================
                ONLY ANIMATED MIDDLE EAST HQ CORRIDORS (Radiating Outward)
                ======================================================== */}
            <g className="trade-routes">
              {MIDDLE_EAST_HQ_ROUTES.map((route) => {
                const pathData = `M ${route.p1[0]} ${route.p1[1]} Q ${route.control[0]} ${route.control[1]} ${route.p2[0]} ${route.p2[1]}`;

                return (
                  <g key={route.id}>
                    {/* Shadow/Glow Path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#f46a16"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeDasharray="4 6"
                      opacity={0.35}
                      filter={`url(#${filterId})`}
                    />

                    {/* Main Arched Line with flowing Dash Offset */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="url(#routeGradientLight)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeDasharray="6 5"
                      className="animate-dash-flow"
                    />

                    {/* Animated Light Packet / Photon Comets */}
                    {!reduceMotion && (
                      <circle r="3.2" fill="#ffffff" filter={`url(#${filterId})`}>
                        <animateMotion
                          path={pathData}
                          dur={`${route.duration}s`}
                          begin={`${route.delay}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {!reduceMotion && (
                      <circle r="2" fill="#f46a16">
                        <animateMotion
                          path={pathData}
                          dur={`${route.duration}s`}
                          begin={`${route.delay}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ========================================================
                CALLOUT INDICATOR LINES (Orange Dashed Lines with Elbows)
                ======================================================== */}
            <g className="callout-lines">
              {CONTINENTS.map((c) => {
                const [hx, hy] = c.hub;
                const [ex, ey] = c.callout.elbow;
                const [endX, endY] = c.callout.end;
                const polylinePts = `${hx},${hy} ${ex},${ey} ${endX},${endY}`;

                return (
                  <g key={`callout-line-${c.id}`}>
                    {/* Dashed orange indicator line with elbow */}
                    <polyline
                      points={polylinePts}
                      fill="none"
                      stroke="#f46a16"
                      strokeWidth={1.8}
                      strokeDasharray="4 3"
                      opacity={0.85}
                    />
                    {/* Elbow dot */}
                    <circle cx={ex} cy={ey} r={2.5} fill="#f46a16" />
                    {/* End terminal dot */}
                    <circle cx={endX} cy={endY} r={3} fill="#f46a16" />
                  </g>
                );
              })}
            </g>

            {/* ========================================================
                CONTINENT HUBS & RADAR BEACONS
                ======================================================== */}
            <g className="continent-hubs">
              {CONTINENTS.map((c) => {
                const [x, y] = c.hub;
                const isSaudiHub = c.id === "asia";

                return (
                  <g
                    key={c.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveContinent(activeContinent === c.id ? null : c.id)}
                  >
                    {/* Glowing halo */}
                    <circle
                      cx={x}
                      cy={y}
                      r={20}
                      fill="#f46a16"
                      opacity={0.2}
                      filter={`url(#${filterId})`}
                    />

                    {/* Expanding sonar radar wave animation */}
                    {!reduceMotion && (
                      <circle
                        cx={x}
                        cy={y}
                        r={14}
                        fill="none"
                        stroke="#f46a16"
                        strokeWidth="1.4"
                        opacity="0.85"
                      >
                        <animate
                          attributeName="r"
                          from="4"
                          to="24"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.9"
                          to="0"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Center Core Hub Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={5}
                      fill="#ffa866"
                      stroke="#f46a16"
                      strokeWidth={2.5}
                      filter={`url(#${filterId})`}
                    />

                    {/* Prominent Saudi Arabia Gateway Beacon (HQ) */}
                    {isSaudiHub && (
                      <g>
                        <circle
                          cx={630}
                          cy={245}
                          r={7.5}
                          fill="#ffffff"
                          stroke="#f46a16"
                          strokeWidth="3.2"
                          filter={`url(#${filterId})`}
                        />
                        <circle
                          cx={630}
                          cy={245}
                          r={20}
                          fill="none"
                          stroke="#ffa057"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* ========================================================
              CONTINENT LABELS (Compact badges on mobile, full on desktop)
              ======================================================== */}
          {CONTINENTS.map((c) => {
            const isActive = activeContinent === c.id;

            return (
              <div
                key={`label-${c.id}`}
                className="absolute pointer-events-auto select-text z-30"
                style={{
                  left: `${c.callout.labelLeftPercent}%`,
                  top: `${c.callout.labelTopPercent}%`,
                  maxWidth: isActive ? "min(270px, 75vw)" : "min(270px, 26vw)",
                }}
              >
                <button
                  type="button"
                  title={c.details}
                  onClick={() => setActiveContinent(isActive ? null : c.id)}
                  className={`group text-left rounded-lg md:rounded-xl backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 border shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-white border-[#f46a16]/40 shadow-md ring-2 ring-[#f46a16]/20 z-40"
                      : "bg-white/90 md:bg-white/85 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                    <span
                      className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full flex-shrink-0 transition-transform ${
                        isActive ? "bg-[#f46a16] scale-125" : "bg-[#f46a16]"
                      }`}
                    />
                    <h4 className="text-[9px] sm:text-[11px] md:text-sm font-bold md:font-extrabold text-slate-900 tracking-tight">
                      {c.name}
                    </h4>
                  </div>

                  {/* Details visible on desktop, or on mobile when tapped */}
                  <p
                    className={`mt-0.5 text-[9px] sm:text-[10px] md:text-[11px] leading-snug text-slate-600 font-medium ${
                      isActive ? "block whitespace-normal" : "hidden md:block"
                    }`}
                  >
                    {c.details}
                  </p>
                </button>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
