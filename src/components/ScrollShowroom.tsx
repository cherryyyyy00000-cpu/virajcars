"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Gauge, Users, Fuel, Cog, ArrowRight } from "lucide-react";
import { Car } from "@/lib/cars";
import { formatINR } from "@/lib/utils";
import ShowroomStage from "@/components/three/ShowroomStage";

/**
 * A real 3D showroom experience.
 *
 * The section is tall and the stage is pinned, so as the visitor scrolls the
 * car rotates a full 360° on a reflective turntable — exactly like walking
 * around a car in a physical showroom — while spec callouts fade in.
 */
export default function ScrollShowroom({ car }: { car: Car }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll so the turntable never feels jerky
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient showroom glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-gold blur-3xl" />

        {/* Giant brand wordmark drifting behind the car */}
        <motion.div
          style={{ x: bgTextX }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center font-display text-[22vw] font-bold leading-none text-white/[0.035]"
        >
          {car.brand}
        </motion.div>

        {/* Section heading — fades as you enter the showroom */}
        <motion.div
          style={{ opacity: headingOpacity }}
          className="absolute inset-x-0 top-[11vh] z-20 text-center"
        >
          <p className="section-label">The Experience</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Step Inside the <span className="gold-text">Showroom</span>
          </h2>
          <p className="mt-3 text-sm text-foreground/40">
            Scroll to walk around the car · drag to spin it yourself
          </p>
        </motion.div>

        {/* ---- The live 3D showroom ---- */}
        <div className="absolute inset-0">
          <ShowroomStage progress={smooth} autoRotate={false} interactive floor />
        </div>

        {/* Floating spec callouts */}
        <Callout progress={scrollYProgress} at={[0.16, 0.28]} className="left-[5%] top-[32%]" icon={<Gauge size={16} />} label="Top Speed" value={`${car.topSpeed} km/h`} />
        <Callout progress={scrollYProgress} at={[0.3, 0.42]} className="right-[5%] top-[36%]" icon={<Users size={16} />} label="Seating" value={`${car.seats} Seats`} />
        <Callout progress={scrollYProgress} at={[0.44, 0.56]} className="left-[7%] bottom-[28%]" icon={<Fuel size={16} />} label="Fuel" value={car.fuel} />
        <Callout progress={scrollYProgress} at={[0.58, 0.7]} className="right-[7%] bottom-[26%]" icon={<Cog size={16} />} label="Gearbox" value={car.transmission} />

        <FinalCta progress={scrollYProgress} car={car} />
      </div>
    </section>
  );
}

function Callout({
  progress,
  at,
  className,
  icon,
  label,
  value,
}: {
  progress: MotionValue<number>;
  at: [number, number];
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const opacity = useTransform(progress, [at[0], at[1], 0.8, 0.9], [0, 1, 1, 0]);
  const y = useTransform(progress, [at[0], at[1]], [24, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute z-20 hidden items-center gap-3 rounded-2xl border border-gold/25 bg-ink/70 px-4 py-3 backdrop-blur-xl sm:flex ${className}`}
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
  const opacity = useTransform(progress, [0.78, 0.92], [0, 1]);
  const y = useTransform(progress, [0.78, 0.92], [32, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-[9vh] z-30 text-center"
    >
      <p className="font-display text-3xl font-bold">
        {car.brand} <span className="gold-text">{car.name}</span>
      </p>
      <p className="mt-1 text-sm text-foreground/50">From {formatINR(car.pricePerDay)}/day</p>
      <Link href={`/cars/${car.slug}`} className="btn-gold mt-4">
        Book This Car <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
