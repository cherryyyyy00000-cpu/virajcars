"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A car standing under showroom lights.
 *
 * The car is a background-removed cutout so it genuinely floats, with a real
 * mirrored reflection on the polished floor beneath it — that reflection is
 * what makes a showroom read as a showroom.
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
      {/* Pool of light the car stands in */}
      <div
        className="pointer-events-none absolute inset-x-[6%] bottom-[16%] h-[26%] rounded-[100%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${accent}55, transparent 70%)` }}
      />

      {/* The car */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 88vw, 700px"
          quality={82}
          className="object-contain drop-shadow-[0_28px_28px_rgba(0,0,0,0.55)]"
        />
      </div>

      {/* Mirrored reflection on the polished floor */}
      <div
        className="relative -mt-[3%] aspect-[16/9] w-full opacity-25"
        style={{
          transform: "scaleY(-1)",
          maskImage: "linear-gradient(to top, transparent 6%, black 58%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 6%, black 58%)",
        }}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 640px) 88vw, 700px"
          quality={45}
          className="object-contain blur-[2px]"
        />
      </div>

      {/* Contact shadow where the tyres meet the floor */}
      <div className="pointer-events-none absolute inset-x-[14%] bottom-[46%] h-3 rounded-[100%] bg-black/75 blur-md" />
    </div>
  );
}
