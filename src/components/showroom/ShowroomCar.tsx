"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A car standing under showroom lights.
 *
 * The car is a background-removed cutout so it genuinely floats, with a
 * mirrored reflection on the polished floor beneath it — that reflection is
 * what makes a showroom read as a showroom.
 *
 * Performance: the reflection reuses the exact same optimised image URL (so
 * it's one network request, served from cache) and carries no blur filter.
 * Blurring a large image every frame was a major cause of jank.
 */
export default function ShowroomCar({
  src,
  alt,
  accent,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  accent: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Pool of light the car stands in — a gradient, not a blurred box */}
      <div
        className="pointer-events-none absolute inset-x-[4%] bottom-[14%] h-[30%] rounded-[100%]"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accent}40 0%, ${accent}14 45%, transparent 72%)`,
        }}
      />

      {/* The car */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 88vw, 680px"
          quality={78}
          className="object-contain drop-shadow-[0_22px_20px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Mirrored reflection on the polished floor */}
      <div
        className="relative -mt-[4%] aspect-[16/9] w-full opacity-[0.18]"
        style={{
          transform: "scaleY(-1)",
          maskImage: "linear-gradient(to top, transparent 10%, black 62%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 10%, black 62%)",
        }}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 640px) 88vw, 680px"
          quality={78}
          className="object-contain"
        />
      </div>

      {/* Contact shadow where the tyres meet the floor */}
      <div
        className="pointer-events-none absolute inset-x-[16%] bottom-[47%] h-4 rounded-[100%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 55%, transparent 78%)",
        }}
      />
    </div>
  );
}
