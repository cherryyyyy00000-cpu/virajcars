"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type CarModelProps = {
  bodyColor?: string;
  accent?: string;
};

/**
 * A fully procedural low-poly luxury sports car built from primitives.
 * No external GLTF asset required — renders beautifully with PBR materials.
 */
export default function CarModel({
  bodyColor = "#C9A24B",
  accent = "#1b1b1d",
}: CarModelProps) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Spin the wheels for a subtle "alive" feel
    if (wheels.current) {
      wheels.current.children.forEach((w) => {
        w.rotation.x += delta * 1.2;
      });
    }
  });

  const bodyMat = (
    <meshPhysicalMaterial
      color={bodyColor}
      metalness={0.9}
      roughness={0.25}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1.4}
    />
  );

  const wheelPositions: [number, number, number][] = [
    [-1.15, -0.35, 0.85],
    [1.15, -0.35, 0.85],
    [-1.15, -0.35, -0.85],
    [1.15, -0.35, -0.85],
  ];

  return (
    <group ref={group} scale={1.15} position={[0, -0.1, 0]}>
      {/* Lower body */}
      <RoundedBox args={[3.6, 0.7, 1.7]} radius={0.28} smoothness={6} position={[0, 0, 0]}>
        {bodyMat}
      </RoundedBox>

      {/* Hood / front slope */}
      <RoundedBox args={[1.5, 0.45, 1.55]} radius={0.22} smoothness={6} position={[1.15, 0.28, 0]}>
        {bodyMat}
      </RoundedBox>

      {/* Cabin / roof */}
      <RoundedBox args={[1.9, 0.62, 1.4]} radius={0.3} smoothness={6} position={[-0.15, 0.55, 0]}>
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.85}
          roughness={0.3}
          clearcoat={1}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Windshield / glass greenhouse */}
      <RoundedBox args={[1.75, 0.5, 1.28]} radius={0.24} smoothness={6} position={[-0.1, 0.6, 0]}>
        <meshPhysicalMaterial
          color="#0b0f14"
          metalness={0.2}
          roughness={0.05}
          transmission={0.6}
          transparent
          opacity={0.85}
          envMapIntensity={2}
        />
      </RoundedBox>

      {/* Trunk / rear */}
      <RoundedBox args={[1.2, 0.4, 1.55]} radius={0.2} smoothness={6} position={[-1.35, 0.22, 0]}>
        {bodyMat}
      </RoundedBox>

      {/* Front headlights (emissive) */}
      {[0.65, -0.65].map((z) => (
        <mesh key={z} position={[1.92, 0.12, z]}>
          <boxGeometry args={[0.08, 0.16, 0.32]} />
          <meshStandardMaterial
            color={accent}
            emissive={"#fff7e0"}
            emissiveIntensity={2.2}
          />
        </mesh>
      ))}

      {/* Rear tail lights */}
      {[0.6, -0.6].map((z) => (
        <mesh key={`r${z}`} position={[-1.95, 0.2, z]}>
          <boxGeometry args={[0.06, 0.14, 0.36]} />
          <meshStandardMaterial color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={1.8} />
        </mesh>
      ))}

      {/* Accent side stripe */}
      <mesh position={[0, -0.05, 0.86]}>
        <boxGeometry args={[3.4, 0.06, 0.02]} />
        <meshStandardMaterial color={accent} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.05, -0.86]}>
        <boxGeometry args={[3.4, 0.06, 0.02]} />
        <meshStandardMaterial color={accent} metalness={1} roughness={0.3} />
      </mesh>

      {/* Wheels */}
      <group ref={wheels}>
        {wheelPositions.map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.3, 28]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.5} />
            {/* Rim */}
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.32, 12]} />
              <meshStandardMaterial color="#C9A24B" metalness={1} roughness={0.2} />
            </mesh>
          </mesh>
        ))}
      </group>
    </group>
  );
}
