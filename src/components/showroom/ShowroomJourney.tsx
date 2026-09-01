"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CARS } from "@/lib/cars";
import { SITE } from "@/lib/site";
import CarBay from "./CarBay";

/**
 * The showroom journey.
 *
 * Entrance → walk in → each car on its own lit turntable bay → exit.
 * One continuous space so it feels like strolling through a real showroom.
 */
export default function ShowroomJourney() {
  const entrance = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: entrance,
    offset: ["start start", "end start"],
  });

  // Showroom doors part as you scroll in
  const leftDoor = useTransform(scrollYProgress, [0, 0.85], ["0%", "-104%"]);
  const rightDoor = useTransform(scrollYProgress, [0, 0.85], ["0%", "104%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.85], [1, 1.25]);

  return (
    <div className="relative bg-ink">
      {/* Showroom shell — walls, floor and ceiling light run through the whole journey */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Ceiling light strip */}
        <div className="absolute inset-x-[12%] top-0 h-24 rounded-b-[50%] bg-gradient-to-b from-white/[0.07] to-transparent blur-2xl" />
        {/* Floor */}
        <div className="showroom-floor absolute inset-x-0 bottom-0 h-[42vh] [mask-image:linear-gradient(to_top,black,transparent)]" />
        {/* Side walls */}
        <div className="absolute inset-y-0 left-0 w-[14vw] bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[14vw] bg-gradient-to-l from-black/70 to-transparent" />
      </div>

      {/* ---------------- ENTRANCE ---------------- */}
      <section ref={entrance} className="relative z-10 h-[190vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* Warm glow spilling from inside the showroom */}
          <div className="pointer-events-none absolute h-[70vh] w-[70vh] rounded-full bg-radial-brand blur-3xl" />

          {/* Title */}
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="relative z-20 px-6 text-center will-change-transform"
          >
            <p className="section-label">Welcome to</p>
            <h2 className="mt-3 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
              The <span className="brand-text">{SITE.name}</span>
              <br />
              Showroom
            </h2>
            <p className="mx-auto mt-4 max-w-md text-foreground/50">
              Ten cars, one roof. Scroll to walk in and meet each one.
            </p>
            <div className="mt-8 flex justify-center">
              <ChevronDown className="animate-bounce text-brand" />
            </div>
          </motion.div>

          {/* Sliding doors */}
          <motion.div
            style={{ x: leftDoor }}
            className="absolute inset-y-0 left-0 z-10 w-1/2 border-r border-brand/20 bg-gradient-to-r from-ink via-ink-soft to-ink-card will-change-transform"
          >
            <div className="absolute right-0 top-1/2 h-28 w-px -translate-y-1/2 bg-brand/40" />
          </motion.div>
          <motion.div
            style={{ x: rightDoor }}
            className="absolute inset-y-0 right-0 z-10 w-1/2 border-l border-brand/20 bg-gradient-to-l from-ink via-ink-soft to-ink-card will-change-transform"
          >
            <div className="absolute left-0 top-1/2 h-28 w-px -translate-y-1/2 bg-brand/40" />
          </motion.div>
        </div>
      </section>

      {/* ---------------- CAR BAYS ---------------- */}
      <div className="relative z-10">
        {CARS.map((car, i) => (
          <CarBay key={car.id} car={car} index={i} />
        ))}
      </div>
    </div>
  );
}
