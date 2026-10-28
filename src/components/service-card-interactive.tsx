"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Compass,
  FileCheck2,
  Globe2,
  Layers3,
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  Truck,
  Warehouse,
  Workflow,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Service } from "@/data/content";

function getServiceIcon(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes("sea") || t.includes("ocean") || t.includes("maritime")) return Ship;
  if (t.includes("air") || t.includes("aviation") || t.includes("flight")) return Plane;
  if (t.includes("land") || t.includes("road") || t.includes("truck")) return Truck;
  if (t.includes("custom") || t.includes("clearance") || t.includes("broker")) return ShieldCheck;
  if (t.includes("warehous") || t.includes("3pl") || t.includes("storage")) return Warehouse;
  if (t.includes("project")) return Layers3;
  if (t.includes("heavy") || t.includes("lift")) return Anchor;
  if (t.includes("door") || t.includes("express")) return Boxes;

  const fallbacks = [Ship, Plane, Truck, ShieldCheck, Warehouse, Layers3, PackageCheck, Workflow];
  return fallbacks[index % fallbacks.length];
}

function getServiceTag(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes("sea")) return "OCEAN FREIGHT";
  if (t.includes("air")) return "AIR CARGO";
  if (t.includes("land")) return "OVERLAND FLEET";
  if (t.includes("custom")) return "SAUDI CLEARANCE";
  if (t.includes("warehous")) return "BONDED STORAGE";
  if (t.includes("project")) return "PROJECT CARGO";
  if (t.includes("heavy")) return "HEAVY-LIFT";
  if (t.includes("door")) return "DOOR-TO-DOOR";
  return `SERVICE 0${index + 1}`;
}

export interface ServiceCardInteractiveProps {
  service: Service;
  index: number;
  variant?: "dark" | "light";
  priority?: boolean;
}

export function ServiceCardInteractive({
  service,
  index,
  variant = "dark",
  priority = false,
}: ServiceCardInteractiveProps) {
  const reduceMotion = useReducedMotion();
  const Icon = useMemo(() => getServiceIcon(service.title, index), [service.title, index]);
  const tag = useMemo(() => getServiceTag(service.title, index), [service.title, index]);
  const formattedIndex = String(index + 1).padStart(2, "0");

  const isDark = variant === "dark";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -7,
              transition: { duration: 0.28, ease: "easeOut" },
            }
      }
      className="group relative h-full flex flex-col"
    >
      <Link
        href={`/services/${service.slug}`}
        className={`relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? "bg-[#041c32]/90 border-slate-700/60 shadow-xl shadow-black/20 hover:border-[#f46a16]/60 hover:shadow-2xl hover:shadow-[#f46a16]/10"
            : "bg-white border-slate-200/80 shadow-md hover:border-[#f46a16]/60 hover:shadow-xl"
        }`}
      >
        {/* Ambient Top Glow Border Accent on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#f46a16] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-30"
        />

        {/* 1. MEDIA IMAGE CONTAINER WITH HOVER ZOOM */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
          {service.image ? (
            <motion.div
              className="relative h-full w-full"
              whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={service.image}
                alt={`${service.title} freight logistics`}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-opacity duration-300"
              />
            </motion.div>
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-[#03182c] to-[#0a355c] flex items-center justify-center">
              <Icon size={36} className="text-white/30" />
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041c32] via-[#041c32]/40 to-black/20" />

          {/* Floating Tag Pill (Top Left) */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 border border-white/15 text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f46a16]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/95">
              {tag}
            </span>
          </div>

          {/* Number Watermark (Top Right) */}
          <div className="absolute top-3 right-3 z-20 rounded-lg bg-white/10 backdrop-blur-md px-2 py-0.5 border border-white/15 text-[10px] font-black tracking-widest text-white/90">
            {formattedIndex}
          </div>

          {/* Floating Animated Icon Badge (Bottom Left of Image) */}
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.12, rotate: 4 }}
            className="absolute bottom-3 left-3 z-20 grid h-10 w-10 place-items-center rounded-xl bg-white shadow-lg text-[#061b31] border border-white/60 transition-colors group-hover:bg-[#f46a16] group-hover:text-white"
          >
            <Icon size={19} />
          </motion.div>
        </div>

        {/* 2. CARD BODY & CONTENT */}
        <div className="relative flex flex-col flex-1 p-5 pt-4">
          <h3
            className={`text-base sm:text-lg font-bold tracking-tight transition-colors duration-200 line-clamp-1 ${
              isDark
                ? "text-white group-hover:text-[#ff8a40]"
                : "text-[#061b31] group-hover:text-[#f46a16]"
            }`}
          >
            {service.title}
          </h3>

          <p
            className={`mt-2 text-xs sm:text-[13px] leading-relaxed line-clamp-2 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {service.short || service.description}
          </p>

          {/* Key capability pills if benefits are present */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5 pt-2">
              {service.benefits.slice(0, 2).map((benefit) => (
                <span
                  key={benefit}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-300"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <CheckCircle2 size={11} className="text-[#f46a16] shrink-0" />
                  <span className="truncate max-w-[130px]">{benefit}</span>
                </span>
              ))}
            </div>
          )}

          {/* 3. CARD FOOTER WITH ACTION BUTTON */}
          <div
            className={`mt-auto pt-4 flex items-center justify-between border-t ${
              isDark ? "border-slate-700/60 text-slate-300" : "border-slate-100 text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f46a16] group-hover:text-[#ff8a40] transition-colors">
              <span>Explore Service</span>
              <motion.span
                animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  duration: 0.9,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={14} />
              </motion.span>
            </span>

            {/* Glowing Corner Arrow Button */}
            <div
              className={`grid h-8 w-8 place-items-center rounded-lg border transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border-white/10 text-white group-hover:bg-[#f46a16] group-hover:border-[#f46a16] group-hover:shadow-md"
                  : "bg-slate-100 border-slate-200 text-[#061b31] group-hover:bg-[#f46a16] group-hover:border-[#f46a16] group-hover:text-white"
              }`}
            >
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
