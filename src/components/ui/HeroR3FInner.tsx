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
  const spinRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
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
    if (!groupRef.current || !tiltRef.current || !spinRef.current) return;

    const hero = document.getElementById('hero');
    let s = 0;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const h = hero.offsetHeight || 1;
      s = Math.max(0, Math.min(1, -rect.top / h));
    }

    if (reducedMotion) {
      groupRef.current.position.set(1.55, 0.05, 0);
      tiltRef.current.rotation.set(0.1, 0.28, 0);
      spinRef.current.rotation.set(0, 0.4, 0);
      if (lightRef.current) lightRef.current.position.set(2.8, 1.8, 4);
      return;
    }

    const mx = mouse.current.x;
    const my = mouse.current.y;

    const targetX = 1.55 + mx * viewport.width * 0.06;
    const targetY = 0.05 + -my * viewport.height * 0.07;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.07;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.07;

    const targetRotX = my * 0.42;
    const targetRotY = mx * 0.48;
    tiltRef.current.rotation.x += (targetRotX - tiltRef.current.rotation.x) * 0.08;
    tiltRef.current.rotation.y += (targetRotY - tiltRef.current.rotation.y) * 0.08;
    tiltRef.current.rotation.z += (mx * 0.06 - tiltRef.current.rotation.z) * 0.06;

    spinRef.current.rotation.y += delta * 0.12;
    spinRef.current.rotation.x += (s * 0.95 - spinRef.current.rotation.x) * 0.08;
    spinRef.current.rotation.z += (s * 0.22 - spinRef.current.rotation.z) * 0.08;

    if (lightRef.current) {
      lightRef.current.position.x += (mx * 3.6 - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (-my * 2.8 + 1.4 - lightRef.current.position.y) * 0.1;
      lightRef.current.position.z = 4.4;
    }
    if (rimRef.current) {
      rimRef.current.position.x += (-mx * 2.2 - 2.4 - rimRef.current.position.x) * 0.08;
      rimRef.current.intensity = 1.6 + s * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight
        ref={lightRef}
        color="#D49B4A"
        intensity={2.8}
        distance={16}
        decay={2}
        position={[2.8, 1.8, 4]}
      />
      {/* Rim light — catches the far edge like metal */}
      <pointLight
        ref={rimRef}
        color="#E8C07A"
        intensity={1.6}
        distance={10}
        decay={2}
        position={[-3.2, 0.4, -1.6]}
      />
      <pointLight color="#8a6a3a" intensity={0.45} position={[-2.4, -1.8, 2]} />

      <group ref={groupRef} position={[1.55, 0.05, 0]} scale={2.65}>
        <group ref={tiltRef}>
          <group ref={spinRef}>
            <mesh>
              <icosahedronGeometry args={[1, 2]} />
              <meshStandardMaterial
                color="#1a1410"
                roughness={0.38}
                metalness={0.48}
                envMapIntensity={0.5}
              />
            </mesh>
            <mesh scale={1.035}>
              <icosahedronGeometry args={[1, 2]} />
              <meshStandardMaterial
                color="#D49B4A"
                wireframe
                transparent
                opacity={0.82}
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

export default function HeroR3FInner({ reducedMotion }: HeroR3FInnerProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 40 }} style={{ width: '100%', height: '100%' }}>
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
