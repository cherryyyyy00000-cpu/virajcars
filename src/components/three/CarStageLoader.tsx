"use client";

import dynamic from "next/dynamic";

// Three.js must render client-side only (no SSR) to avoid window/WebGL errors.
const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-14 w-14 animate-spin-slow rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  ),
});

export default function CarStageLoader(props: {
  bodyColor?: string;
  accent?: string;
  autoRotate?: boolean;
}) {
  return <CarScene {...props} />;
}
