"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  MeshReflectorMaterial,
  PresentationControls,
  Center,
  Bounds,
} from "@react-three/drei";
import { Suspense } from "react";
import type { MotionValue } from "framer-motion";
import ShowroomCar from "./ShowroomCar";

type Props = {
  progress?: MotionValue<number>;
  autoRotate?: boolean;
  /** Allow the visitor to drag-rotate the car. */
  interactive?: boolean;
  /** Show the reflective showroom floor. */
  floor?: boolean;
};

/**
 * A real 3D luxury showroom.
 *
 * - Polished reflective floor (like a real showroom's marble)
 * - Studio softbox lighting + warm gold rim lights via Lightformers
 * - Car floats gently and can be dragged to rotate 360°
 * - Optional scroll-driven turntable rotation
 *
 * Lighting is built from in-scene Lightformers (no external HDRI fetch),
 * so it loads instantly and works offline.
 */
export default function ShowroomScene({
  progress,
  autoRotate = true,
  interactive = true,
  floor = true,
}: Props) {
  const car = (
    <Bounds fit clip observe margin={1.15}>
      <Center>
        <ShowroomCar progress={progress} autoRotate={autoRotate} />
      </Center>
    </Bounds>
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [4.5, 1.5, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {/* ---------- Lighting rig (studio softboxes) ---------- */}
        <ambientLight intensity={0.25} />
        <spotLight
          position={[6, 8, 4]}
          angle={0.35}
          penumbra={1}
          intensity={2.2}
          color="#fff4e0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-7, 5, -3]} angle={0.4} penumbra={1} intensity={1.1} color="#C9A24B" />

        <Environment resolution={256}>
          {/* Big overhead softbox — the classic showroom ceiling light */}
          <Lightformer
            form="rect"
            intensity={3.2}
            position={[0, 6, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[12, 6, 1]}
            color="#ffffff"
          />
          {/* Warm gold side strips for that luxury sheen */}
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[-6, 2, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[8, 3, 1]}
            color="#E7C877"
          />
          <Lightformer
            form="rect"
            intensity={2.0}
            position={[6, 2, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[8, 3, 1]}
            color="#C9A24B"
          />
          {/* Cool fill from behind for edge definition */}
          <Lightformer
            form="rect"
            intensity={1.4}
            position={[0, 3, -7]}
            rotation={[0, Math.PI, 0]}
            scale={[10, 4, 1]}
            color="#9fb6d1"
          />
          {/* Subtle ring to catch the paint's clearcoat */}
          <Lightformer form="ring" intensity={1.6} position={[3, 4, 4]} scale={3} color="#ffffff" />
        </Environment>

        {/* ---------- The car ---------- */}
        {interactive ? (
          <PresentationControls
            global
            snap={false}
            speed={1.3}
            rotation={[0, -0.35, 0]}
            polar={[-0.12, 0.28]}
            azimuth={[-Math.PI, Math.PI]}
            config={{ mass: 2, tension: 260, friction: 30 }}
          >
            {car}
          </PresentationControls>
        ) : (
          car
        )}

        {/* ---------- Showroom floor ---------- */}
        {floor && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]}>
            <planeGeometry args={[60, 60]} />
            <MeshReflectorMaterial
              blur={[400, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={22}
              roughness={0.9}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#0b0b0d"
              metalness={0.65}
              mirror={0.55}
            />
          </mesh>
        )}

        <ContactShadows
          position={[0, -1.0, 0]}
          opacity={0.7}
          scale={14}
          blur={2.4}
          far={3}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
