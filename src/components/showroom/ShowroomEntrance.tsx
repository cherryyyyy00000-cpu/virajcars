"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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

/**
 * The hero — and the front door of the showroom.
 *
 * You arrive at closed showroom doors. As you scroll, they part and you step
 * inside, where the featured car waits on a lit pedestal with a
 * product-configurator panel: pick a car, see its price, specs and colour,
 * then book it or keep scrolling deeper into the showroom.
 */
export default function ShowroomEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // --- Doors open as you scroll in ---
  const leftDoor = useTransform(scrollYProgress, [0.04, 0.42], ["0%", "-102%"]);
  const rightDoor = useTransform(scrollYProgress, [0.04, 0.42], ["0%", "102%"]);
  const doorFade = useTransform(scrollYProgress, [0.34, 0.46], [1, 0]);

  // --- Welcome title fades as the doors part ---
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-18%"]);

  // --- Interior + configurator fade in once you're inside ---
  const uiOpacity = useTransform(scrollYProgress, [0.26, 0.48], [0, 1]);
  const carScale = useTransform(scrollYProgress, [0.26, 0.55], [0.82, 1]);
  const watermarkX = useTransform(scrollYProgress, [0.3, 1], ["4%", "-6%"]);

  // --- Cursor tilt on the car ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [13, -13]), {
    stiffness: 140,
    damping: 18,
  });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), {
    stiffness: 140,
    damping: 18,
  });

  const [active, setActive] = useState(
    Math.max(0, CARS.findIndex((c) => c.slug === "toyota-fortuner"))
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const car = CARS[active];

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ============ SHOWROOM INTERIOR ============ */}
        <motion.div style={{ opacity: uiOpacity }} className="absolute inset-0">
          {/* ceiling light */}
          <div className="pointer-events-none absolute inset-x-[16%] top-0 h-28 rounded-b-[50%] bg-gradient-to-b from-white/[0.09] to-transparent blur-2xl" />
          {/* warm pool of light around the pedestal */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[64vh] w-[64vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background: `radial-gradient(circle, ${car.accent}3d 0%, transparent 68%)`,
            }}
          />
          {/* floor */}
          <div className="showroom-floor pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] [mask-image:linear-gradient(to_top,black,transparent)]" />
          {/* side walls */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-black/70 to-transparent" />
        </motion.div>

        {/* Giant brand watermark behind the car */}
        <motion.span
          style={{ x: watermarkX, opacity: uiOpacity }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[24vw] font-bold leading-none text-white/[0.035]"
        >
          {car.brand}
        </motion.span>

        {/* ============ CONFIGURATOR UI ============ */}
        <motion.div
          style={{ opacity: uiOpacity }}
          className="relative z-20 flex h-full flex-col pt-24 pb-6 sm:pt-28"
        >
          {/* --- top row: title + quick actions --- */}
          <div className="container-x flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                {car.brand}
              </p>
              <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                {car.name}
              </h1>
              <p className="mt-0.5 text-xs text-foreground/45">{car.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setLiked((l) => ({ ...l, [car.slug]: !l[car.slug] }))
                }
                aria-label="Save this car"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-ink-card/80 transition-colors hover:border-brand/50"
              >
                <Heart
                  size={17}
                  className={cn(
                    "transition-colors",
                    liked[car.slug] ? "fill-brand text-brand" : "text-foreground/50"
                  )}
                />
              </button>
              <a
                href={`tel:${SITE.phonePrimary}`}
                aria-label="Call us"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-ink-card/80 text-foreground/50 transition-colors hover:border-brand/50 hover:text-brand"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* --- middle: car on pedestal, flanked by selectors --- */}
          <div className="relative flex flex-1 items-center">
            {/* left rail — pick your car (like size pills) */}
            <div className="absolute left-4 top-1/2 z-30 -translate-y-1/2 sm:left-6">
              <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                Our Cars
              </p>
              <div className="flex max-h-[52vh] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CARS.map((c, i) => (
                  <button
                    key={c.slug}
                    onClick={() => setActive(i)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all",
                      i === active
                        ? "bg-brand-gradient text-ink shadow-brand"
                        : "border border-ink-line bg-ink-card/70 text-foreground/55 hover:border-brand/40 hover:text-brand-light"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* right rail — category swatches */}
            <div className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-right sm:right-6">
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
                      "h-6 w-6 rounded-md border transition-transform",
                      i === active
                        ? "scale-110 border-brand"
                        : "border-white/15 hover:scale-105"
                    )}
                    style={{ background: c.bodyColor }}
                  />
                ))}
              </div>
            </div>

            {/* the car */}
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
              className="mx-auto w-[74%] max-w-2xl [perspective:1300px] sm:w-[64%]"
            >
              <motion.div
                style={{ rotateY: tiltY, rotateX: tiltX, scale: carScale }}
                className="will-change-transform [transform-style:preserve-3d]"
              >
                <div className="animate-float">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 shadow-card">
                    <Image
                      key={car.slug}
                      src={car.image}
                      alt={`${car.brand} ${car.name} on rent in ${SITE.city}`}
                      fill
                      priority
                      sizes="(max-width: 640px) 78vw, 640px"
                      quality={74}
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent" />
                  </div>
                </div>
              </motion.div>

              {/* pedestal */}
              <div className="relative mx-auto mt-4 w-[86%] [perspective:600px]">
                <div
                  className="h-9 rounded-[10px] border-t border-white/20 shadow-brand-lg [transform:rotateX(58deg)]"
                  style={{
                    background: `linear-gradient(180deg, ${car.accent} 0%, #8E4A20 100%)`,
                  }}
                />
                <div className="mx-auto -mt-1 h-6 w-[70%] rounded-[100%] bg-black/70 blur-lg" />
              </div>

              {/* carousel dots */}
              <div className="mt-3 flex justify-center gap-1.5">
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

          {/* --- bottom bar: price · CTA · specs --- */}
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              {/* price */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                  Price
                </p>
                <p className="font-display text-3xl font-bold brand-text sm:text-4xl">
                  {formatINR(car.pricePerDay)}
                </p>
                <p className="text-[10px] text-foreground/40">per day · self-drive</p>
              </div>

              {/* centre CTA — book + scroll deeper */}
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">
                  Scroll down
                </p>
                <div className="flex items-center gap-2 rounded-full border border-brand/30 bg-ink-card/80 p-1.5">
                  <Link
                    href={`/cars/${car.slug}`}
                    aria-label={`Book the ${car.name}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-ink transition-transform hover:scale-105"
                  >
                    <ShoppingBag size={17} />
                  </Link>
                  <ChevronsDown size={18} className="mr-1.5 animate-bounce text-brand" />
                </div>
              </div>

              {/* specs */}
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

        {/* ============ THE DOORS ============ */}
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

        {/* ============ WELCOME TITLE (over the closed doors) ============ */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="pointer-events-none absolute h-[52vh] w-[52vh] rounded-full bg-radial-brand blur-3xl" />
          <p className="relative section-label">{SITE.tagline}</p>
          <h2 className="relative mt-4 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Welcome to the
            <br />
            <span className="brand-text">{SITE.name}</span> Showroom
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-foreground/55">
            {CARS.length} cars under one roof, at affordable prices in {SITE.city}.
          </p>
          <div className="relative mt-9 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-6 py-3 text-sm font-semibold text-brand-light">
            Scroll to enter <ChevronsDown size={16} className="animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Chip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 rounded-lg border border-ink-line bg-ink-card/70 px-2 py-1.5 text-[11px] font-medium text-foreground/70">
      <span className="text-brand">{icon}</span>
      {value}
    </span>
  );
}
