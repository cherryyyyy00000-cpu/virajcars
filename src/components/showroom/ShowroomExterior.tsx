"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronsDown, MapPin, Star } from "lucide-react";
import { SITE } from "@/lib/site";
import { CARS } from "@/lib/cars";
import { VRMark } from "@/components/Logo";

/**
 * Arriving at the showroom.
 *
 * You pull up outside the building at night: glass facade lit from within, a
 * glowing rooftop sign, a slowly rotating VR emblem over a grand archway, and
 * a driveway leading in. As you scroll, the camera dollies forward — every
 * layer scales at its own rate for real depth — until the archway's light
 * swallows the frame and you're inside.
 *
 * Built entirely from GPU transforms, so it's cinematic without the weight of
 * a 3D engine.
 */
export default function ShowroomExterior() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // --- Camera dolly: layers scale at different rates = parallax depth ---
  const skyScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const buildingScale = useTransform(scrollYProgress, [0, 1], [1, 3.4]);
  const buildingY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const groundScale = useTransform(scrollYProgress, [0, 1], [1, 5.5]);
  const bollardScale = useTransform(scrollYProgress, [0, 1], [1, 7]);
  const bollardOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // --- The archway light grows until it fills the screen ---
  const portalScale = useTransform(scrollYProgress, [0.25, 1], [1, 22]);
  const portalOpacity = useTransform(scrollYProgress, [0.55, 0.97], [0.55, 1]);

  // --- Copy fades out early ---
  const copyOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"]);

  // --- Night sky dims as we push into the warm interior ---
  const skyOpacity = useTransform(scrollYProgress, [0.4, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#05060a]">
        {/* ================= NIGHT SKY ================= */}
        <motion.div style={{ scale: skyScale, opacity: skyOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a14] via-[#0b1020] to-[#05060a]" />
          {/* stars */}
          <div className="absolute inset-0 opacity-60">
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.r,
                  height: s.r,
                  opacity: s.o,
                }}
              />
            ))}
          </div>
          {/* city haze on the horizon */}
          <div className="absolute inset-x-0 bottom-[36%] h-40 bg-gradient-to-t from-brand/[0.10] to-transparent blur-2xl" />
        </motion.div>

        {/* ================= DRIVEWAY ================= */}
        <motion.div
          style={{ scale: groundScale }}
          className="absolute inset-x-0 bottom-0 h-[38%] origin-top"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d11] to-[#05060a]" />
          {/* wet-asphalt reflection of the entrance */}
          <div className="absolute inset-x-[32%] top-0 h-full bg-gradient-to-b from-brand/25 to-transparent blur-xl" />
          {/* lane markers receding toward the door */}
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0 8%, rgba(255,255,255,0.5) 8% 8.4%, transparent 8.4% 16%)",
              maskImage: "linear-gradient(to top, black, transparent 70%)",
              WebkitMaskImage: "linear-gradient(to top, black, transparent 70%)",
            }}
          />
        </motion.div>

        {/* ================= THE BUILDING ================= */}
        <motion.div
          style={{ scale: buildingScale, y: buildingY }}
          className="absolute inset-0 origin-[50%_62%]"
        >
          <div className="absolute inset-x-0 bottom-[34%] top-[12%] mx-auto w-[76%] max-w-5xl">
            {/* ---- roofline ---- */}
            <div className="absolute -top-6 inset-x-[-3%] h-6 rounded-t-lg bg-gradient-to-b from-[#1a1c22] to-[#0e1014] shadow-[0_-8px_30px_rgba(200,113,55,0.15)]" />

            {/* ---- rooftop sign ---- */}
            <div className="absolute -top-[74px] left-1/2 flex -translate-x-1/2 items-center gap-3">
              <VRMark size={34} />
              <span className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
                <span className="brand-text">{SITE.brandLead}</span>{" "}
                <span className="text-white/85">{SITE.brandTail}</span>
              </span>
            </div>
            <div className="absolute -top-[30px] left-1/2 h-8 w-[46%] -translate-x-1/2 rounded-full bg-brand/25 blur-2xl" />

            {/* ---- glass facade ---- */}
            <div className="absolute inset-0 overflow-hidden rounded-t-xl border-x border-t border-white/10 bg-gradient-to-b from-[#0d1017] via-[#0a0c12] to-[#080a0f]">
              {/* lit window grid */}
              <div className="grid h-full grid-cols-8 grid-rows-5">
                {PANELS.map((lit, i) => (
                  <div
                    key={i}
                    className="border border-white/[0.06]"
                    style={{
                      background: lit
                        ? "linear-gradient(160deg, rgba(232,168,96,0.16), rgba(200,113,55,0.05))"
                        : "rgba(255,255,255,0.012)",
                    }}
                  />
                ))}
              </div>
              {/* vertical mullion highlights */}
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_12.5%,rgba(255,255,255,0.05)_12.5%_12.6%)]" />
            </div>

            {/* ---- grand archway ---- */}
            <div className="absolute bottom-0 left-1/2 h-[52%] w-[30%] -translate-x-1/2">
              {/* arch frame */}
              <div className="absolute inset-0 rounded-t-[999px] border-2 border-brand/45 bg-gradient-to-b from-[#120e0a] to-[#0a0806] shadow-[0_0_60px_-8px_rgba(200,113,55,0.55)]" />
              {/* warm light pouring out */}
              <motion.div
                style={{ scale: portalScale, opacity: portalOpacity }}
                className="absolute inset-[10%] origin-center rounded-t-[999px] bg-[radial-gradient(ellipse_at_50%_75%,#F6D9AE_0%,#E8A860_28%,#C87137_52%,rgba(200,113,55,0.18)_78%,transparent_100%)] blur-[2px] will-change-transform"
              />
              {/* door split line */}
              <div className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 bg-black/40" />
            </div>

            {/* ---- columns flanking the entrance ---- */}
            {[16, 84].map((x) => (
              <div
                key={x}
                className="absolute bottom-0 h-[46%] w-[5%] rounded-t-md bg-gradient-to-b from-[#191b21] to-[#0c0e12] shadow-[0_0_24px_rgba(0,0,0,0.6)]"
                style={{ left: `${x}%`, transform: "translateX(-50%)" }}
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-brand/30" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================= BOLLARD LIGHTS (nearest layer) ================= */}
        <motion.div
          style={{ scale: bollardScale, opacity: bollardOpacity }}
          className="absolute inset-x-0 bottom-[8%] origin-bottom"
        >
          <div className="mx-auto flex w-[86%] max-w-5xl justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-light shadow-[0_0_14px_4px_rgba(232,168,96,0.6)]" />
                <span className="mt-0.5 h-7 w-[3px] rounded-b bg-gradient-to-b from-[#2a2c33] to-transparent" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================= COPY ================= */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="absolute inset-x-0 top-[15%] z-30 px-6 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-black/40 px-4 py-1.5 text-[11px] font-medium text-brand-light backdrop-blur">
            <MapPin size={12} /> {SITE.city}, {SITE.state}
          </div>

          <h1 className="font-display text-[13vw] font-bold leading-[0.92] sm:text-6xl lg:text-7xl">
            <span className="brand-text">{SITE.brandLead}</span>{" "}
            <span className="text-white">{SITE.brandTail}</span>
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.4em] text-brand-light/80">
            {SITE.tagline}
          </p>

          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
            {CARS.length} cars. One roof. Affordable prices, reliable service and
            comfortable rides across {SITE.city}.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/45">
            <span className="flex items-center gap-1.5">
              <Star size={12} className="fill-brand text-brand" /> 4.8 average rating
            </span>
            <span>·</span>
            <span>1000+ happy journeys</span>
            <span>·</span>
            <span>Doorstep delivery</span>
          </div>

          <div className="mt-9 inline-flex flex-col items-center gap-2">
            <span className="rounded-full border border-brand/40 bg-brand/10 px-6 py-3 text-sm font-semibold text-brand-light backdrop-blur">
              Scroll to walk in
            </span>
            <ChevronsDown size={18} className="animate-bounce text-brand" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Deterministic star field — fixed values so server and client markup match. */
const STARS = [
  { x: 6, y: 8, r: 2, o: 0.5 }, { x: 14, y: 20, r: 1, o: 0.35 },
  { x: 22, y: 6, r: 1.5, o: 0.45 }, { x: 31, y: 15, r: 1, o: 0.3 },
  { x: 39, y: 4, r: 2, o: 0.55 }, { x: 47, y: 12, r: 1, o: 0.3 },
  { x: 55, y: 7, r: 1.5, o: 0.4 }, { x: 63, y: 18, r: 1, o: 0.3 },
  { x: 71, y: 5, r: 2, o: 0.5 }, { x: 79, y: 14, r: 1, o: 0.35 },
  { x: 87, y: 9, r: 1.5, o: 0.45 }, { x: 94, y: 19, r: 1, o: 0.3 },
  { x: 10, y: 30, r: 1, o: 0.25 }, { x: 35, y: 26, r: 1, o: 0.28 },
  { x: 60, y: 29, r: 1, o: 0.25 }, { x: 84, y: 27, r: 1, o: 0.28 },
];

/* Which facade panels are lit — a fixed pattern keeps SSR deterministic. */
const PANELS = [
  true, false, true, true, false, true, false, true,
  false, true, true, false, true, false, true, false,
  true, true, false, true, false, true, true, false,
  false, true, false, true, true, false, true, true,
  true, false, true, false, true, true, false, true,
];
