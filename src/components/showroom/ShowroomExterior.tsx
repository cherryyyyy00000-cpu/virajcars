"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ChevronsDown,
  MapPin,
  Star,
  ArrowRight,
  MessageCircle,
  BadgeIndianRupee,
} from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { CARS } from "@/lib/cars";
import { formatINR, cn } from "@/lib/utils";
import { VRMark } from "@/components/Logo";
import ShowroomCar from "./ShowroomCar";

/**
 * Arriving at the showroom — the hero.
 *
 * The lit glass showroom stands behind you as set dressing; the star of the
 * frame is a car, parked out front under a spotlight with its reflection on the
 * forecourt. The showpieces rotate on their own, so the very first screen sells
 * the fleet without asking anyone to scroll first.
 *
 * Scroll then dollies past the car into the facade, and the entrance light
 * expands to hand you over to the interior.
 *
 * Performance: transform + opacity only. No blur, no backdrop-filter, no
 * always-running sweeps — the only continuous motion is the car's slow float.
 * The backdrop photos sit at low opacity behind a vignette, which also keeps
 * the original dealership's signage out of our brand's frame.
 */

/** The cars that greet you, in order — supercar, wedding, premium SUV, fun. */
const HERO_SLUGS = ["audi-r8", "mercedes-e-class", "toyota-fortuner", "mahindra-thar"];

const HERO_CARS = HERO_SLUGS.map((s) => CARS.find((c) => c.slug === s)!).filter(Boolean);

const ROTATE_MS = 4200;

export default function ShowroomExterior() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const inView = useInView(ref, { amount: 0.15 });
  const reduceMotion = useReducedMotion();

  // Cheapest car in the fleet — the hook that makes people keep reading.
  const fromPrice = Math.min(...CARS.map((c) => c.pricePerDay));

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the first car is in the initial paint; the rest mount afterwards so
  // they never compete with the hero image for LCP.
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (reduceMotion || paused || !inView || !ready) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % HERO_CARS.length),
      ROTATE_MS
    );
    return () => clearInterval(t);
  }, [reduceMotion, paused, inView, ready]);

  const car = HERO_CARS[active];

  // ---- Scroll choreography ----
  // Far shot: the driveway, pushing in
  const arrivalScale = useTransform(scrollYProgress, [0, 0.5], [1.06, 1.24]);
  const arrivalOpacity = useTransform(scrollYProgress, [0.3, 0.48], [1, 0]);

  // Near shot: the facade fills the view
  const facadeScale = useTransform(scrollYProgress, [0.3, 1], [1.05, 1.45]);
  const facadeOpacity = useTransform(scrollYProgress, [0.3, 0.48], [0, 1]);

  // The camera walks past the car
  const carScale = useTransform(scrollYProgress, [0, 0.42], [1, 1.32]);
  const carY = useTransform(scrollYProgress, [0, 0.42], ["0%", "16%"]);
  const carOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);

  // Copy leaves first
  const copyOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.34], ["0%", "-20%"]);

  // Entrance light grows until it takes over
  const portalScale = useTransform(scrollYProgress, [0.5, 1], [0.6, 14]);
  const portalOpacity = useTransform(scrollYProgress, [0.5, 0.74, 1], [0, 0.85, 1]);

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#05060a]">
        {/* ================= BACKDROP: THE BUILDING ================= */}
        {/* Kept dark and low-opacity: it's the room the car stands in, not the
            subject — and it keeps another dealership's signage unreadable. */}
        <motion.div
          style={{ scale: arrivalScale, opacity: arrivalOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/showroom/arrival.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover object-[60%_38%] opacity-[0.45]"
          />
        </motion.div>

        <motion.div
          style={{ scale: facadeScale, opacity: facadeOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/showroom/facade.webp"
            alt=""
            fill
            sizes="100vw"
            quality={70}
            className="object-cover object-[50%_18%] opacity-40"
          />
        </motion.div>

        {/* Vignette + brand warmth — plain gradients, cheap to composite */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.72)_62%,rgba(5,6,10,0.96)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#05060a] via-[#05060a]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#05060a] via-[#05060a]/85 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(200,113,55,0.12),transparent_40%)]" />

        {/* ================= THE FORECOURT ================= */}
        {/* Spotlight cone from above, aimed at the car */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[72%] w-[46%] -translate-x-1/2 opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,247,232,0.22), rgba(255,247,232,0.05) 55%, transparent 82%)",
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            maskImage:
              "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
          }}
        />

        {/* Polished forecourt + a pool of the car's own colour */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]">
          <div className="showroom-floor absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)]" />
          <div
            className="absolute inset-x-[8%] top-0 h-full opacity-70 transition-[background] duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${car.accent}38, transparent 60%)`,
            }}
          />
        </div>

        {/* Faded brand watermark behind the car (Nike-reference detail) */}
        <span
          key={car.brand}
          className="pointer-events-none absolute inset-x-0 top-[46%] -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[19vw] font-bold leading-none text-white/[0.045]"
        >
          {car.brand}
        </span>

        {/* ================= CONTENT ================= */}
        <div className="relative z-20 flex h-full flex-col">
          {/* ---------- Copy ---------- */}
          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
            className="container-x pt-24 text-center will-change-transform sm:pt-28"
          >
            {/* The entrance stagger is CSS, not JS: these must be painted and
                readable on the very first frame, before hydration. */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/35 bg-black/50 px-3.5 py-1.5 text-[11px] font-medium text-brand-light">
              <MapPin size={12} /> {SITE.city}, {SITE.state}
              <span className="text-white/25">·</span>
              <VRMark size={13} />
              <span className="text-white/60">{SITE.tagline}</span>
            </div>

            <h1
              className="animate-fade-up mt-4 font-display text-[2.6rem] font-bold leading-[1.03] sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: "80ms" }}
            >
              All Types of Cars
              <br />
              on Rent in <span className="brand-text">{SITE.city}</span>
            </h1>

            <p
              className="animate-fade-up mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base"
              style={{ animationDelay: "180ms" }}
            >
              From the humble Swift to the mighty Fortuner — {CARS.length} cars,
              affordable prices, delivered to your doorstep.
            </p>
          </motion.div>

          {/* ---------- The car on the forecourt ---------- */}
          <motion.div
            style={{ scale: carScale, y: carY, opacity: carOpacity }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative flex flex-1 items-center justify-center will-change-transform"
          >
            <div className="relative mx-auto w-[92%] max-w-[44rem] sm:w-[76%]">
              {HERO_CARS.map((c, i) => {
                if (i > 0 && !ready) return null;
                const isActive = i === active;
                return (
                  <div
                    key={c.slug}
                    aria-hidden={!isActive}
                    className={cn(
                      "transition-opacity duration-700 ease-out",
                      isActive
                        ? "relative opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0"
                    )}
                  >
                    <div className={reduceMotion ? undefined : "animate-float"}>
                      <ShowroomCar
                        src={c.cutout}
                        alt={`${c.brand} ${c.name} on rent in ${SITE.city}`}
                        accent={c.accent}
                        priority={i === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ---------- Price · CTAs · trust ---------- */}
          <motion.div
            style={{ opacity: copyOpacity }}
            className="container-x pb-7 will-change-transform sm:pb-9"
          >
            <div
              className="animate-fade-up flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between"
              style={{ animationDelay: "260ms" }}
            >
              {/* Big price, bottom-left */}
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-[0.24em] text-brand">
                  {car.brand} {car.name}
                </p>
                <p className="font-display text-4xl font-bold leading-none brand-text sm:text-5xl">
                  {formatINR(car.pricePerDay)}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  per day · self-drive
                </p>

                {/* Which showpiece is on stage */}
                <div className="mt-3 flex justify-center gap-1.5 sm:justify-start">
                  {HERO_CARS.map((c, i) => (
                    <button
                      key={c.slug}
                      onClick={() => setActive(i)}
                      aria-label={`Show the ${c.brand} ${c.name}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === active ? "w-6 bg-brand" : "w-1.5 bg-white/25"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Real calls to action — the old hero had none */}
              <div className="flex flex-col items-center gap-3 sm:items-end">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-black/45 px-3.5 py-1.5 text-[11px] text-brand-light">
                  <BadgeIndianRupee size={13} />
                  Fleet starts at{" "}
                  <span className="font-semibold">{formatINR(fromPrice)}</span>/day
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Link href={`/cars/${car.slug}`} className="btn-brand !px-6 !py-2.5">
                    Book this {car.name} <ArrowRight size={16} />
                  </Link>
                  <a
                    href={waLink(
                      `Hi ${SITE.name}! I'd like to rent a car in ${SITE.city}.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline !px-6 !py-2.5"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-white/45">
                  <span className="flex items-center gap-1.5">
                    <Star size={11} className="fill-brand text-brand" /> 4.8 rating
                  </span>
                  <span>·</span>
                  <span>1000+ journeys</span>
                  <span>·</span>
                  <span>Doorstep delivery</span>
                </div>
              </div>
            </div>

            {/* Scroll cue */}
            <div
              className="animate-fade-up mt-5 flex flex-col items-center gap-1"
              style={{ animationDelay: "420ms" }}
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                Scroll to walk in
              </span>
              <ChevronsDown size={16} className="animate-bounce text-brand" />
            </div>
          </motion.div>
        </div>

        {/* ================= ENTRANCE LIGHT HANDOFF ================= */}
        <motion.div
          style={{ scale: portalScale, opacity: portalOpacity }}
          className="pointer-events-none absolute left-1/2 top-[62%] z-30 h-[38vh] w-[38vh] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#FBEAD0_0%,#F0C489_22%,#C87137_46%,rgba(200,113,55,0.35)_68%,transparent_100%)]" />
        </motion.div>

        {/* Photo credit — CC BY-SA requires attribution */}
        <p className="absolute bottom-1.5 right-3 z-30 text-[9px] text-white/20">
          Showroom photos: Diego Delso, CC BY-SA 3.0
        </p>
      </div>
    </section>
  );
}
