"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronsDown, MapPin, Star } from "lucide-react";
import { SITE } from "@/lib/site";
import { CARS } from "@/lib/cars";
import { VRMark } from "@/components/Logo";

/**
 * Arriving at the showroom.
 *
 * Two real photographs of a lit glass car showroom at night carry the scene:
 * you approach from the driveway, the camera pushes in to the facade, then the
 * warm entrance light expands and swallows the frame — and you're inside.
 *
 * Performance: transform + opacity only. No blur filters, no backdrop-filter,
 * no stacked gradient "buildings" — those were what made this slow.
 */
export default function ShowroomExterior() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Far shot: approach down the driveway
  const arrivalScale = useTransform(scrollYProgress, [0, 0.55], [1.04, 1.3]);
  const arrivalOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);

  // Near shot: the facade fills the view
  const facadeScale = useTransform(scrollYProgress, [0.3, 1], [1.05, 1.55]);
  const facadeOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  // Entrance light grows until it takes over
  const portalScale = useTransform(scrollYProgress, [0.55, 1], [0.6, 14]);
  const portalOpacity = useTransform(scrollYProgress, [0.55, 0.78, 1], [0, 0.85, 1]);

  // Copy leaves early
  const copyOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-26%"]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#05060a]">
        {/* ---------- Far: arriving down the driveway ---------- */}
        <motion.div
          style={{ scale: arrivalScale, opacity: arrivalOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/showroom/arrival.webp"
            alt="ViRaj Rides showroom at night"
            fill
            priority
            sizes="100vw"
            quality={72}
            className="object-cover"
          />
        </motion.div>

        {/* ---------- Near: the lit facade ---------- */}
        <motion.div
          style={{ scale: facadeScale, opacity: facadeOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/showroom/facade.webp"
            alt="Cars on every floor of the ViRaj Rides showroom"
            fill
            sizes="100vw"
            quality={72}
            className="object-cover"
          />
        </motion.div>

        {/* Readability + brand warmth (plain gradients — cheap to composite) */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060a] to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(200,113,55,0.10),transparent_45%)]" />

        {/* ---------- Entrance light that pulls you in ---------- */}
        <motion.div
          style={{ scale: portalScale, opacity: portalOpacity }}
          className="pointer-events-none absolute left-1/2 top-[62%] h-[38vh] w-[38vh] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#FBEAD0_0%,#F0C489_22%,#C87137_46%,rgba(200,113,55,0.35)_68%,transparent_100%)]" />
        </motion.div>

        {/* ---------- Copy ---------- */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="absolute inset-x-0 top-[16%] z-30 px-6 text-center will-change-transform"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-black/55 px-4 py-1.5 text-[11px] font-medium text-brand-light">
            <MapPin size={12} /> {SITE.city}, {SITE.state}
          </div>

          <div className="flex items-center justify-center gap-3">
            <VRMark size={44} />
            <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
              <span className="brand-text">{SITE.brandLead}</span>{" "}
              <span className="text-white">{SITE.brandTail}</span>
            </h1>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.42em] text-brand-light/85 sm:text-sm">
            {SITE.tagline}
          </p>

          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            {CARS.length} cars under one roof. Affordable prices, reliable service
            and comfortable rides across {SITE.city}.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/55">
            <span className="flex items-center gap-1.5">
              <Star size={12} className="fill-brand text-brand" /> 4.8 rating
            </span>
            <span>·</span>
            <span>1000+ journeys</span>
            <span>·</span>
            <span>Doorstep delivery</span>
          </div>

          <div className="mt-9 inline-flex flex-col items-center gap-2">
            <span className="rounded-full border border-brand/45 bg-black/50 px-6 py-3 text-sm font-semibold text-brand-light">
              Scroll to walk in
            </span>
            <ChevronsDown size={18} className="animate-bounce text-brand" />
          </div>
        </motion.div>

        {/* Photo credit — CC BY-SA requires attribution */}
        <p className="absolute bottom-2 right-3 z-30 text-[9px] text-white/25">
          Showroom photos: Diego Delso, CC BY-SA 3.0
        </p>
      </div>
    </section>
  );
}
