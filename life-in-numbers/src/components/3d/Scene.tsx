"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Animated Orb ──────────────────────────────────────────────────────────────
function AnimatedOrb({
  position,
  color,
  size,
  speed,
  distort,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    meshRef.current.rotation.y += 0.005 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.7}
          distort={distort}
          speed={2}
          roughness={0}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
}

// ── Particle Field ────────────────────────────────────────────────────────────
function ParticleField({ count = 200 }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#22d3ee" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ── Main Landing Scene ────────────────────────────────────────────────────────
export function LandingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
      <spotLight position={[0, 10, 0]} intensity={0.8} color="#a78bfa" />

      <Environment preset="night" />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade />
      <ParticleField count={300} />

      {/* Central hero orb */}
      <AnimatedOrb position={[0, 0, 0]} color="#6366f1" size={2} speed={1} distort={0.4} />

      {/* Surrounding orbs representing life metrics */}
      <AnimatedOrb position={[-4, 1.5, -2]} color="#22d3ee" size={0.8} speed={1.2} distort={0.3} />
      <AnimatedOrb position={[4, -1, -3]}  color="#10b981" size={0.9} speed={0.8} distort={0.35} />
      <AnimatedOrb position={[-3, -2, -1]} color="#f59e0b" size={0.6} speed={1.5} distort={0.5} />
      <AnimatedOrb position={[3.5, 2, -1]} color="#a78bfa" size={0.7} speed={0.9} distort={0.4} />
      <AnimatedOrb position={[0, -3, -2]}  color="#f472b6" size={0.5} speed={1.3} distort={0.45} />
      <AnimatedOrb position={[-2, 3, -3]}  color="#34d399" size={0.55} speed={1.1} distort={0.3} />
    </Canvas>
  );
}

// ── Score Orb (Dashboard) ──────────────────────────────────────────────────────
function ScoreOrbMesh({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.85}
          distort={0.2}
          speed={1.5}
          roughness={0}
          metalness={0.3}
        />
      </Sphere>
    </Float>
  );
}

export function ScoreOrb({ score }: { score: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#22d3ee" />
      <Environment preset="night" />
      <ScoreOrbMesh score={score} />
    </Canvas>
  );
}
