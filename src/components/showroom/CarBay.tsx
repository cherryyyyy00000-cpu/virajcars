"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Gauge, Fuel, Cog, ArrowRight, Star, ShoppingBag } from "lucide-react";
import type { Car } from "@/lib/cars";
import { formatINR } from "@/lib/utils";
import ShowroomCar from "./ShowroomCar";

/**
 * One display bay inside the showroom.
 *
 * A spotlight hangs over a turntable. As you scroll through the bay the
 * platform turns the car (real CSS 3D rotation on Y), the car rises into the
 * light, and its price and specs slide in — like walking up to a car and
 * circling it.
 */
export default function CarBay({ car, index }: { car: Car; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [38, 0, -38]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 0.9]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, 26]);
  const ringSpin = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const infoX = useTransform(scrollYProgress, [0.15, 0.5], [index % 2 ? 36 : -36, 0]);
  const infoOpacity = useTransform(scrollYProgress, [0.12, 0.42, 0.82, 0.96], [0, 1, 1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["16%", "-16%"]);

  const reverse = index % 2 === 1;

  return (
    <section ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Spotlight over this bay */}
        <div
          className="pointer-events-none absolute top-0 h-[70%] w-[30%] opacity-40"
          style={{
            left: reverse ? "72%" : "28%",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, rgba(255,252,244,0.26), rgba(255,252,244,0.04) 58%, transparent 80%)",
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            filter: "blur(7px)",
          }}
        />

        {/* Bay number on the back wall */}
        <motion.span
          style={{ y: ghostY }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[32vw] font-bold leading-none text-white/[0.028]"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <div
          className={`container-x relative grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-10 ${
            reverse ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* ---------- Car on its turntable ---------- */}
          <div className="relative order-1 [direction:ltr] [perspective:1500px]">
            <motion.div
              style={{ rotateY, scale, y: lift }}
              className="relative will-change-transform [transform-style:preserve-3d]"
            >
              <ShowroomCar
                src={car.cutout}
                alt={`${car.brand} ${car.name} for rent in Jaipur`}
                accent={car.accent}
                priority={index === 0}
              />
            </motion.div>

            {/* Turntable ring */}
            <motion.div
              style={{ rotate: ringSpin }}
              className="pointer-events-none relative mx-auto -mt-6 h-8 w-[72%] rounded-[100%] border border-brand/25 will-change-transform"
            >
              <div className="absolute inset-0 rounded-[100%] bg-gradient-to-r from-transparent via-brand/25 to-transparent blur-sm" />
            </motion.div>
          </div>

          {/* ---------- Details ---------- */}
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

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-4xl font-bold brand-text sm:text-5xl">
                {formatINR(car.pricePerDay)}
              </span>
              <span className="pb-1 text-sm text-foreground/40">/ day</span>
            </div>
            <p className="mt-1 text-xs text-foreground/35">
              or {formatINR(car.pricePerHour)}/hour · self-drive
            </p>

            <div className="mt-6 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={<Users size={15} />} value={`${car.seats}`} label="Seats" />
              <Spec
                icon={<Cog size={15} />}
                value={car.transmission === "Automatic" ? "Auto" : "Manual"}
                label="Gearbox"
              />
              <Spec icon={<Fuel size={15} />} value={car.fuel} label="Fuel" />
              <Spec icon={<Gauge size={15} />} value={`${car.mileage}`} label="km/l" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/cars/${car.slug}`} className="btn-brand">
                <ShoppingBag size={16} /> Book This Car
              </Link>
              <Link href={`/cars/${car.slug}`} className="btn-outline">
                View Details <ArrowRight size={15} />
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
    <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 backdrop-blur">
      <span className="text-brand">{icon}</span>
      <p className="mt-1 text-sm font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/35">{label}</p>
    </div>
  );
}
