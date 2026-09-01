"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";

/**
 * Client-only loader for the WebGL showroom.
 * Three.js needs the browser, so we disable SSR and show an elegant
 * gold loading ring while the scene streams in.
 */
const ShowroomScene = dynamic(() => import("./ShowroomScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold/25 border-t-gold" />
      <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/30">
        Entering Showroom
      </p>
    </div>
  ),
});

export default function ShowroomStage(props: {
  progress?: MotionValue<number>;
  autoRotate?: boolean;
  interactive?: boolean;
  floor?: boolean;
}) {
  return <ShowroomScene {...props} />;
}
