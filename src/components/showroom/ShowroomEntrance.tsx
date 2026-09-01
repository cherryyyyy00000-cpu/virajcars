"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronsDown,
  Heart,
  Users,
  Fuel,
  Cog,
  Gauge,
  ShoppingBag,
  Phone,
} from "lucide-react";
import { CARS } from "@/lib/cars";
import { SITE } from "@/lib/site";
import { formatINR, cn } from "@/lib/utils";
import { VRMark } from "@/components/Logo";
import ShowroomCar from "./ShowroomCar";

/**
 * The front door of the showroom.
 *
 * You arrive at closed showroom doors. Scroll and they part: you step inside a
 * lit hall where the car stands under ceiling spotlights on a polished floor,
 * its reflection beneath it. A configurator panel wraps the car so you can
 * switch models, read the price and book — then keep scrolling deeper in.
 */
export default function ShowroomEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The doors part early — the hero has already made the pitch, so the job here
  // is to get you onto the showroom floor quickly.
  const leftDoor = useTransform(scrollYProgress, [0.02, 0.28], ["0%", "-102%"]);
  const rightDoor = useTransform(scrollYProgress, [0.02, 0.28], ["0%", "102%"]);
  const doorFade = useTransform(scrollYProgress, [0.22, 0.32], [1, 0]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.13], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-16%"]);

  const uiOpacity = useTransform(scrollYProgress, [0.16, 0.32], [0, 1]);
  const carScale = useTransform(scrollYProgress, [0.16, 0.4], [0.84, 1]);
  const watermarkX = useTransform(scrollYProgress, [0.3, 1], ["3%", "-5%"]);

  // Cursor tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [11, -11]), {
    stiffness: 140,
    damping: 18,
  });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), {
    stiffness: 140,
    damping: 18,
  });

  // The Audi R8 greets you first — it's the showpiece of the floor.
  const [active, setActive] = useState(
    Math.max(0, CARS.findIndex((c) => c.slug === "audi-r8"))
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const car = CARS[active];

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* ================= SHOWROOM HALL ================= */}
        <motion.div style={{ opacity: uiOpacity }} className="absolute inset-0">
          {/* Back wall wash */}
          <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />

          {/* Ceiling light rail */}
          <div className="absolute inset-x-[18%] top-0 h-1.5 rounded-b-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Three spotlights aimed at the car */}
          {[22, 50, 78].map((x) => (
            <div
              key={x}
              className="pointer-events-none absolute top-0 h-[74%] w-[26%] opacity-45"
              style={{
                left: `${x}%`,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(to bottom, rgba(255,252,244,0.26), rgba(255,252,244,0.04) 58%, transparent 80%)",
                clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
                maskImage:
                  "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
              }}
            />
          ))}

          {/* Glossy floor */}
          <div className="absolute inset-x-0 bottom-0 h-[40%]">
            <div className="showroom-floor absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)]" />
            <div
              className="absolute inset-x-[10%] top-0 h-full opacity-60"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${car.accent}33, transparent 62%)`,
              }}
            />
          </div>

          {/* Side walls */}
          <div className="absolute inset-y-0 left-0 w-[13vw] bg-gradient-to-r from-black/80 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[13vw] bg-gradient-to-l from-black/80 to-transparent" />
        </motion.div>

        {/* Brand watermark on the back wall */}
        <motion.span
          style={{ x: watermarkX, opacity: uiOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[38%] -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[23vw] font-bold leading-none text-white/[0.04]"
        >
          {car.brand}
        </motion.span>

        {/* ================= CONFIGURATOR ================= */}
        <motion.div
          style={{ opacity: uiOpacity }}
          className="relative z-20 flex h-full flex-col pb-5 pt-24 sm:pt-28"
        >
          {/* Top: model name + quick actions */}
          <div className="container-x flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                {car.brand}
              </p>
              {/* h2, not h1 — the arrival hero above owns the page's h1 */}
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                {car.name}
              </h2>
              <p className="mt-0.5 text-xs text-foreground/45">{car.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiked((l) => ({ ...l, [car.slug]: !l[car.slug] }))}
                aria-label="Save this car"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition-colors hover:border-brand/50"
              >
                <Heart
                  size={17}
                  className={cn(
                    "transition-colors",
                    liked[car.slug] ? "fill-brand text-brand" : "text-foreground/60"
                  )}
                />
              </button>
              <a
                href={`tel:${SITE.phonePrimary}`}
                aria-label="Call us"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-foreground/60 transition-colors hover:border-brand/50 hover:text-brand"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Middle: the car, flanked by selectors */}
          <div className="relative flex flex-1 items-center">
            {/* Left rail — model pills */}
            <div className="absolute left-3 top-1/2 z-30 -translate-y-1/2 sm:left-6">
              <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                Our Cars
              </p>
              <div className="flex max-h-[54vh] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CARS.map((c, i) => (
                  <button
                    key={c.slug}
                    onClick={() => setActive(i)}
                    className={cn(
                      "flex h-11 w-[74px] items-center justify-center rounded-2xl text-[11px] font-bold leading-tight transition-all",
                      i === active
                        ? "scale-[1.06] bg-brand-gradient text-ink shadow-brand"
                        : "bg-white/[0.07] text-white/60 hover:bg-white/[0.12] hover:text-brand-light"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right rail — colour swatches */}
            <div className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-right sm:right-6">
              <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                Colour
              </p>
              <div className="flex flex-col items-end gap-2">
                {CARS.slice(0, 6).map((c, i) => (
                  <button
                    key={c.slug}
                    onClick={() => setActive(i)}
                    aria-label={`Show ${c.name}`}
                    className={cn(
                      "h-8 w-8 rounded-xl border-2 transition-transform",
                      i === active
                        ? "scale-110 border-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-ink"
                        : "border-white/20 hover:scale-105"
                    )}
                    style={{ background: c.bodyColor }}
                  />
                ))}
              </div>
            </div>

            {/* The car on the showroom floor */}
            <div
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left) / r.width - 0.5);
                my.set((e.clientY - r.top) / r.height - 0.5);
              }}
              onMouseLeave={() => {
                mx.set(0);
                my.set(0);
              }}
              className="mx-auto w-[78%] max-w-3xl [perspective:1400px] sm:w-[66%]"
            >
              <motion.div
                style={{ rotateY: tiltY, rotateX: tiltX, scale: carScale }}
                className="will-change-transform [transform-style:preserve-3d]"
              >
                <div className="animate-float">
                  <ShowroomCar
                    key={car.slug}
                    src={car.cutout}
                    alt={`${car.brand} ${car.name} on rent in ${SITE.city}`}
                    accent={car.accent}
                    priority
                  />
                </div>
              </motion.div>

              {/* Carousel dots */}
              <div className="mt-1 flex justify-center gap-1.5">
                {CARS.map((c, i) => (
                  <button
                    key={c.slug}
                    onClick={() => setActive(i)}
                    aria-label={`Go to ${c.name}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === active ? "w-5 bg-brand" : "w-1.5 bg-foreground/20"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: price · CTA · specs */}
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                  Price
                </p>
                <p className="font-display text-3xl font-bold brand-text sm:text-4xl">
                  {formatINR(car.pricePerDay)}
                </p>
                <p className="text-[10px] text-foreground/40">per day · self-drive</p>
              </div>

              {/* Vertical capsule: book on top, scroll hint below */}
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                  Swipe down
                </p>
                <div className="flex flex-col items-center gap-1 rounded-full bg-white/[0.08] p-1.5">
                  <Link
                    href={`/cars/${car.slug}`}
                    aria-label={`Book the ${car.name}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-ink shadow-brand transition-transform hover:scale-105"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                  <ChevronsDown size={17} className="animate-bounce text-brand" />
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                  Specs
                </p>
                <div className="flex gap-2">
                  <Chip icon={<Users size={13} />} value={`${car.seats}`} />
                  <Chip
                    icon={<Cog size={13} />}
                    value={car.transmission === "Automatic" ? "Auto" : "Man"}
                  />
                  <Chip icon={<Fuel size={13} />} value={car.fuel} />
                  <Chip icon={<Gauge size={13} />} value={`${car.mileage}`} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= DOORS ================= */}
        <motion.div
          style={{ opacity: doorFade }}
          className="pointer-events-none absolute inset-0 z-40"
        >
          <motion.div
            style={{ x: leftDoor }}
            className="absolute inset-y-0 left-0 w-1/2 border-r border-brand/25 bg-gradient-to-r from-ink via-ink-soft to-ink-card will-change-transform"
          >
            <div className="absolute right-0 top-1/2 h-32 w-px -translate-y-1/2 bg-brand/45" />
          </motion.div>
          <motion.div
            style={{ x: rightDoor }}
            className="absolute inset-y-0 right-0 w-1/2 border-l border-brand/25 bg-gradient-to-l from-ink via-ink-soft to-ink-card will-change-transform"
          >
            <div className="absolute left-0 top-1/2 h-32 w-px -translate-y-1/2 bg-brand/45" />
          </motion.div>
        </motion.div>

        {/* ========== THRESHOLD MARK (etched on the closed glass doors) ==========
            Deliberately just the monogram: the hero above has already made the
            pitch, so repeating it here is what made the opening drag. */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="pointer-events-none absolute h-[46vh] w-[46vh] rounded-full bg-radial-brand" />
          <VRMark size={62} className="relative" />
          <p className="relative mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="brand-text">{SITE.brandLead}</span>{" "}
            <span className="text-white/85">{SITE.brandTail}</span>
          </p>
          <p className="relative mt-1.5 text-[10px] uppercase tracking-[0.4em] text-brand/70">
            Showroom
          </p>
          <div className="relative mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/40">
            Scroll to enter
            <ChevronsDown size={14} className="animate-bounce text-brand" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Chip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[11px] font-medium text-foreground/70">
      <span className="text-brand">{icon}</span>
      {value}
    </span>
  );
}
