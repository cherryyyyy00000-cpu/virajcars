"use client";

import { CARS } from "@/lib/cars";
import CarBay from "./CarBay";

/**
 * The walk through the showroom.
 *
 * The entrance lives in ShowroomEntrance (the hero). This is the interior:
 * one lit turntable bay per car, inside a single continuous showroom shell so
 * it reads as one space rather than a stack of sections.
 */
export default function ShowroomJourney() {
  return (
    <div className="relative bg-ink">
      {/* Showroom shell — travels with you through every bay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-screen">
          {/* ceiling light strip */}
          <div className="absolute inset-x-[12%] top-0 h-24 rounded-b-[50%] bg-gradient-to-b from-white/[0.06] to-transparent blur-2xl" />
          {/* polished floor */}
          <div className="showroom-floor absolute inset-x-0 bottom-0 h-[40vh] [mask-image:linear-gradient(to_top,black,transparent)]" />
          {/* side walls */}
          <div className="absolute inset-y-0 left-0 w-[13vw] bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[13vw] bg-gradient-to-l from-black/70 to-transparent" />
        </div>
      </div>

      <div className="relative z-10">
        {CARS.map((car, i) => (
          <CarBay key={car.id} car={car} index={i} />
        ))}
      </div>
    </div>
  );
}
