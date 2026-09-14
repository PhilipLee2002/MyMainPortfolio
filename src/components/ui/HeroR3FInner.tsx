'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type * as THREE from 'three';

interface SceneProps {
  reducedMotion: boolean;
}

function Scene({ reducedMotion }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !tiltRef.current) return;

    if (reducedMotion) {
      groupRef.current.position.set(1.35, 0.12, 0);
      tiltRef.current.rotation.set(0.12, 0.35, 0);
      if (lightRef.current) lightRef.current.position.set(2.4, 1.6, 4);
      return;
    }

    const mx = mouse.current.x;
    const my = mouse.current.y;

    const targetX = 1.35 + mx * viewport.width * 0.14;
    const targetY = 0.12 + -my * viewport.height * 0.12;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.07;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.07;

    // ±30° tilt toward the pointer, with inertia
    const targetRotX = my * 0.52;
    const targetRotY = mx * 0.58;
    tiltRef.current.rotation.x += (targetRotX - tiltRef.current.rotation.x) * 0.08;
    tiltRef.current.rotation.y += (targetRotY - tiltRef.current.rotation.y) * 0.08;
    tiltRef.current.rotation.z += (mx * 0.08 - tiltRef.current.rotation.z) * 0.06;

    // Idle spin lives on the inner group so mouse tilt stays independent
    tiltRef.current.children[0].rotation.y += delta * 0.18;

    if (lightRef.current) {
      lightRef.current.position.x += (mx * 4.2 - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (-my * 3.2 + 1.2 - lightRef.current.position.y) * 0.1;
      lightRef.current.position.z = 4.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight
        ref={lightRef}
        color="#D49B4A"
        intensity={2.4}
        distance={14}
        decay={2}
        position={[2.4, 1.6, 4]}
      />
      <pointLight color="#8a6a3a" intensity={0.55} position={[-3, -1.5, 2]} />

      <group ref={groupRef} position={[1.35, 0.12, 0]} scale={1.58}>
        <group ref={tiltRef}>
          <group>
            {/* Inner solid — gives the form mass */}
            <mesh>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#1a1410"
                roughness={0.42}
                metalness={0.38}
                envMapIntensity={0.4}
              />
            </mesh>
            {/* Outer wireframe shell, slightly larger for depth */}
            <mesh scale={1.045}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#D49B4A"
                wireframe
                transparent
                opacity={0.78}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

interface HeroR3FInnerProps {
  reducedMotion: boolean;
}

/** Full-bleed canvas for hero atmosphere background accent. */
export default function HeroR3FInner({ reducedMotion }: HeroR3FInnerProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.4], fov: 42 }} style={{ width: '100%', height: '100%' }}>
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
