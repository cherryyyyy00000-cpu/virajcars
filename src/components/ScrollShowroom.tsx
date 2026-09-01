"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Gauge, Users, Fuel, Cog, ArrowRight } from "lucide-react";
import { Car } from "@/lib/cars";
import { formatINR } from "@/lib/utils";

/**
 * Cinematic, scroll-driven car showroom.
 * As the user scrolls through a tall pinned section, the car rotates in 3D,
 * scales up, and its spec callouts fly in one-by-one — an Apple-style
 * "product reveal" experience that makes the customer feel inside a showroom.
 */
export default function ScrollShowroom({ car }: { car: Car }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Car transforms driven by scroll
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-35, 0, 30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1.05, 0.95]);
  const carX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.6, 0.35]);
  const bgText = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink">
      {/* Pinned stage */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Giant background brand text (parallax) */}
        <motion.div
          style={{ x: bgText }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center font-display text-[26vw] font-bold leading-none text-white/[0.03]"
        >
          {car.brand}
        </motion.div>

        {/* Radial glow behind the car */}
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute h-[70vh] w-[70vh] rounded-full"
        >
          <div
            className="h-full w-full rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${car.bodyColor}, transparent 70%)` }}
          />
        </motion.div>

        {/* Section heading */}
        <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 text-center">
          <p className="section-label">Signature Drive</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Step Into the <span className="gold-text">Showroom</span>
          </h2>
          <p className="mt-2 text-sm text-foreground/40">Scroll to explore ↓</p>
        </div>

        {/* The car — rotates & scales with scroll */}
        <motion.div
          style={{ rotateY, scale, x: carX, transformPerspective: 1200 }}
          className="relative z-10 w-[86vw] max-w-4xl [transform-style:preserve-3d]"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={car.image}
              alt={`${car.brand} ${car.name}`}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 900px"
              className="object-contain drop-shadow-2xl"
            />
          </div>
          {/* Reflection */}
          <div className="mx-auto h-10 w-3/5 rounded-[100%] bg-black/60 blur-xl" />
        </motion.div>

        {/* Floating spec callouts */}
        <Callout progress={scrollYProgress} range={[0.1, 0.25]} className="left-[6%] top-[30%]" icon={<Gauge size={16} />} label="Top Speed" value={`${car.topSpeed} km/h`} />
        <Callout progress={scrollYProgress} range={[0.25, 0.4]} className="right-[6%] top-[34%]" icon={<Users size={16} />} label="Seating" value={`${car.seats} Seats`} />
        <Callout progress={scrollYProgress} range={[0.4, 0.55]} className="left-[8%] bottom-[26%]" icon={<Fuel size={16} />} label="Fuel" value={car.fuel} />
        <Callout progress={scrollYProgress} range={[0.55, 0.7]} className="right-[8%] bottom-[24%]" icon={<Cog size={16} />} label="Gearbox" value={car.transmission} />

        {/* Final CTA reveal */}
        <FinalCta progress={scrollYProgress} car={car} />
      </div>
    </section>
  );
}

function Callout({
  progress,
  range,
  className,
  icon,
  label,
  value,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const opacity = useTransform(progress, [range[0], range[1], 0.85, 0.95], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [30, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute z-20 hidden items-center gap-3 rounded-2xl border border-gold/25 bg-ink/70 px-4 py-3 backdrop-blur-xl sm:flex ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
        {icon}
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-foreground/40">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}

function FinalCta({ progress, car }: { progress: MotionValue<number>; car: Car }) {
  const opacity = useTransform(progress, [0.82, 0.95], [0, 1]);
  const y = useTransform(progress, [0.82, 0.95], [40, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-[10vh] left-1/2 z-30 -translate-x-1/2 text-center"
    >
      <p className="font-display text-3xl font-bold">
        {car.brand} <span className="gold-text">{car.name}</span>
      </p>
      <p className="mt-1 text-sm text-foreground/50">
        From {formatINR(car.pricePerDay)}/day
      </p>
      <Link href={`/cars/${car.slug}`} className="btn-gold mt-4">
        Book This Car <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
