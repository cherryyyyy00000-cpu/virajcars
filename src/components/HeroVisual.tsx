"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CARS } from "@/lib/cars";

const HERO_CAR = CARS.find((c) => c.slug === "toyota-fortuner") ?? CARS[0];

/**
 * Hero visual — the showcase car floats on a lit platform and tilts in 3D
 * toward the cursor. Pure CSS 3D transforms, so it's instant to load.
 */
export default function HeroVisual() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [14, -14]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 18,
  });

  return (
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
      className="relative flex h-full w-full items-center justify-center [perspective:1200px]"
    >
      <div className="pointer-events-none absolute h-[62%] w-[86%] rounded-full bg-radial-brand blur-3xl" />

      <motion.div
        style={{ rotateY, rotateX }}
        className="relative z-10 w-full will-change-transform [transform-style:preserve-3d]"
      >
        <div className="animate-float">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 shadow-card">
            <Image
              src={HERO_CAR.image}
              alt="Car rental in Jaipur — ViRaj Rides"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 620px"
              quality={74}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent" />
          </div>
          <div className="mx-auto mt-3 h-2.5 w-[74%] rounded-[100%] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        </div>
      </motion.div>

      <div className="absolute bottom-[6%] h-6 w-[58%] rounded-[100%] bg-black/70 blur-xl" />
    </div>
  );
}
