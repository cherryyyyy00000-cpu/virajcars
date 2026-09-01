"use client";

import ShowroomStage from "@/components/three/ShowroomStage";

/**
 * Hero visual — a real 3D car floating on a reflective showroom platform.
 * Slowly auto-rotates, and the visitor can drag it to inspect any angle.
 */
export default function HeroVisual() {
  return (
    <div className="relative h-full w-full">
      <ShowroomStage autoRotate interactive floor />
    </div>
  );
}
