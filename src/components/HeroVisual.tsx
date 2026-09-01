"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HERO_IMAGE } from "@/lib/cars";

/**
 * Cinematic hero visual — a real car photo that gently floats and tilts
 * toward the cursor for a premium, interactive 3D feel (no heavy WebGL).
 */
export default function HeroVisual() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 15 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative flex h-full w-full items-center justify-center [perspective:1200px]"
    >
      {/* Glow platform */}
      <div className="pointer-events-none absolute h-[60%] w-[85%] rounded-full bg-radial-gold blur-3xl" />

      <motion.div
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        className="relative z-10 w-full"
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-[16/10] w-full"
        >
          <Image
            src={HERO_IMAGE}
            alt="Luxury car rental Jaipur — ViRaj Rides"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 640px"
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Ground shadow */}
      <div className="absolute bottom-[12%] h-8 w-3/5 rounded-[100%] bg-black/70 blur-xl" />
    </div>
  );
}
