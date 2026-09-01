"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

const MODEL = "/models/showroom-car.glb";

// Self-host the Draco decoder so the showroom never depends on an external CDN.
useGLTF.setDecoderPath("/draco/");

type Props = {
  /** Optional scroll progress (0→1). When provided, the car rotates as you scroll. */
  progress?: MotionValue<number>;
  /** Continuous slow auto-rotation when no scroll progress is bound. */
  autoRotate?: boolean;
  /** Total rotation swept across the scroll range, in radians. */
  sweep?: number;
};

export default function ShowroomCar({
  progress,
  autoRotate = true,
  sweep = Math.PI * 2,
}: Props) {
  const group = useRef<THREE.Group>(null);
  // `true` enables the Draco decoder — the model is Draco-compressed (1.1 MB).
  const { scene } = useGLTF(MODEL, true);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (progress) {
      // Scroll-driven turntable — the showroom platform rotating the car
      const p = progress.get();
      const target = -0.5 + p * sweep;
      // Smoothly ease toward the scroll-derived angle
      group.current.rotation.y += (target - group.current.rotation.y) * 0.12;
    } else if (autoRotate) {
      group.current.rotation.y += delta * 0.25;
    }

    // Gentle floating motion (the "luxury levitation" effect)
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.8) * 0.06;
    group.current.rotation.z = Math.sin(t * 0.5) * 0.008;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

useGLTF.preload(MODEL, true);
