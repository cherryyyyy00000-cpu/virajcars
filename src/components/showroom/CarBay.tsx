"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Gauge, Fuel, Cog, ArrowRight, Star } from "lucide-react";
import type { Car } from "@/lib/cars";
import { formatINR } from "@/lib/utils";

/**
 * One display bay inside the showroom.
 *
 * The bay is a tall scroll track with a pinned stage. As the visitor scrolls
 * through it, the car turns on its platform (real CSS 3D rotation on the Y
 * axis), rises into the spotlight, and its price + specs slide in — the
 * feeling of walking up to a car in a showroom and circling it.
 *
 * Everything animates via GPU transforms only, so it stays buttery smooth.
 */
export default function CarBay({ car, index }: { car: Car; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Turn the car as the bay passes through the viewport
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [42, 0, -42]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1, 0.9]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, 30]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.75]);

  // Text column drifts in from the side
  const infoX = useTransform(scrollYProgress, [0.15, 0.5], [index % 2 ? 40 : -40, 0]);
  const infoOpacity = useTransform(scrollYProgress, [0.12, 0.42, 0.82, 0.96], [0, 1, 1, 0]);

  // Bay number ghost text
  const ghostY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  const reverse = index % 2 === 1;

  return (
    <section ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Bay ambience — a warm pool of light matching the car */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${car.accent}44 0%, transparent 68%)`,
          }}
        />

        {/* Ghost bay number */}
        <motion.span
          style={{ y: ghostY }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[34vw] font-bold leading-none text-white/[0.025]"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <div
          className={`container-x relative grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-10 ${
            reverse ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* ---------- The car on its turntable ---------- */}
          <div className="relative order-1 [direction:ltr] [perspective:1400px]">
            <motion.div
              style={{ rotateY, scale, y: lift }}
              className="relative will-change-transform [transform-style:preserve-3d]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5">
                <Image
                  src={car.image}
                  alt={`${car.brand} ${car.name} for rent in Jaipur`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 1024px) 92vw, 620px"
                  quality={72}
                  className="object-cover"
                />
                {/* Glass sheen so it reads as a lit showroom exhibit */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent" />
              </div>

              {/* Turntable platform */}
              <div className="relative mx-auto mt-3 h-3 w-[78%] rounded-[100%] bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
            </motion.div>

            {/* Ground shadow that breathes with the car */}
            <motion.div
              style={{ scaleX: shadowScale }}
              className="mx-auto mt-1 h-7 w-[62%] rounded-[100%] bg-black/70 blur-xl"
            />
          </div>

          {/* ---------- Car details ---------- */}
          <motion.div
            style={{ x: infoX, opacity: infoOpacity }}
            className="order-2 [direction:ltr] will-change-transform"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
                {car.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-foreground/60">
                <Star size={12} className="fill-brand text-brand" /> {car.rating} ({car.reviews})
              </span>
            </div>

            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-brand">{car.brand}</p>
            <h3 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              {car.name}
            </h3>
            <p className="mt-2 text-foreground/50">{car.tagline}</p>

            {/* Price — the headline number */}
            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-4xl font-bold brand-text sm:text-5xl">
                {formatINR(car.pricePerDay)}
              </span>
              <span className="pb-1 text-sm text-foreground/40">/ day</span>
            </div>
            <p className="mt-1 text-xs text-foreground/35">
              or {formatINR(car.pricePerHour)}/hour · self-drive
            </p>

            {/* Quick specs */}
            <div className="mt-6 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={<Users size={15} />} value={`${car.seats}`} label="Seats" />
              <Spec icon={<Cog size={15} />} value={car.transmission === "Automatic" ? "Auto" : "Manual"} label="Gearbox" />
              <Spec icon={<Fuel size={15} />} value={car.fuel} label="Fuel" />
              <Spec icon={<Gauge size={15} />} value={`${car.mileage}`} label="km/l" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/cars/${car.slug}`} className="btn-brand">
                Book This Car <ArrowRight size={16} />
              </Link>
              <Link href={`/cars/${car.slug}`} className="btn-outline">
                View Details
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Spec({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-ink-card/70 px-3 py-2.5">
      <span className="text-brand">{icon}</span>
      <p className="mt-1 text-sm font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/35">{label}</p>
    </div>
  );
}
