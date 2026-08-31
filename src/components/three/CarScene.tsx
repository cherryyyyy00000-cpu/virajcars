"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  ContactShadows,
  PresentationControls,
} from "@react-three/drei";
import { Suspense } from "react";
import CarModel from "./CarModel";

type CarSceneProps = {
  bodyColor?: string;
  accent?: string;
  /** Auto-rotate the car continuously (used on detail pages) */
  autoRotate?: boolean;
};

/**
 * Interactive 3D showroom stage.
 * - Rotates on mouse/drag via PresentationControls
 * - Floats gently via Float
 * - Studio lighting + reflections for a real-showroom feel
 */
export default function CarScene({
  bodyColor,
  accent,
  autoRotate = false,
}: CarSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [5, 2.2, 6], fov: 38 }}
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <spotLight
          position={[8, 12, 6]}
          angle={0.3}
          penumbra={1}
          intensity={2.4}
          castShadow
          color="#fff6df"
        />
        <spotLight position={[-8, 6, -4]} angle={0.4} penumbra={1} intensity={1.2} color="#C9A24B" />
        <pointLight position={[0, -3, 4]} intensity={0.6} color="#ffffff" />

        <PresentationControls
          global
          rotation={[0, -0.4, 0]}
          polar={[-0.2, 0.3]}
          azimuth={[-Infinity, Infinity]}
          config={{ mass: 2, tension: 300 }}
          snap={false}
          speed={1.4}
        >
          <Float
            speed={2}
            rotationIntensity={autoRotate ? 0.6 : 0.35}
            floatIntensity={1.1}
            floatingRange={[-0.1, 0.15]}
          >
            <CarModel bodyColor={bodyColor} accent={accent} />
          </Float>
        </PresentationControls>

        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.55}
          scale={12}
          blur={2.6}
          far={4}
          color="#000000"
        />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
