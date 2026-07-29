import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { MathUtils } from 'three';
import type { Group, Mesh } from 'three';

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

function Scene3D({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<Group>(null);
  const mainMeshRef = useRef<Mesh>(null);
  const satellite1Ref = useRef<Mesh>(null);
  const satellite2Ref = useRef<Mesh>(null);

  useFrame((state) => {
    const { pointer, clock } = state;
    const elapsedTime = clock.getElapsedTime();

    // Parallax mouse movements
    if (groupRef.current) {
      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.4, 0.05);
      groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.4, 0.05);
    }

    // Centered distorted mesh slow rotation
    if (mainMeshRef.current) {
      mainMeshRef.current.rotation.y += 0.005;
      mainMeshRef.current.rotation.x += 0.003;
    }

    // Satellite orbits
    if (satellite1Ref.current) {
      satellite1Ref.current.position.x = Math.cos(elapsedTime * 0.8) * (isMobile ? 1.6 : 2.2);
      satellite1Ref.current.position.z = Math.sin(elapsedTime * 0.8) * (isMobile ? 1.6 : 2.2);
      satellite1Ref.current.position.y = Math.sin(elapsedTime * 0.4) * 0.3;
    }

    if (satellite2Ref.current) {
      satellite2Ref.current.position.x = Math.cos(elapsedTime * 1.2 + Math.PI) * (isMobile ? 1.9 : 2.6);
      satellite2Ref.current.position.z = Math.sin(elapsedTime * 1.2 + Math.PI) * (isMobile ? 1.9 : 2.6);
      satellite2Ref.current.position.y = Math.cos(elapsedTime * 0.6) * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.65 : 1.0}>
      {/* 3D Distorted Central Icosahedron */}
      <mesh ref={mainMeshRef}>
        <icosahedronGeometry args={[1.4, isMobile ? 0 : 1]} />
        <MeshDistortMaterial
          color="#6366F1"
          distort={0.25}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting Sphere 1 */}
      <mesh ref={satellite1Ref}>
        <sphereGeometry args={[0.15, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#22D3EE" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Orbiting Sphere 2 */}
      <mesh ref={satellite2Ref}>
        <sphereGeometry args={[0.2, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#A5B4FC" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Floating abstract code/design glass panel */}
      {!isMobile && (
        <mesh position={[0, -1.8, 0.5]} rotation={[-0.2, 0.2, 0.05]}>
          <boxGeometry args={[2.5, 0.5, 0.05]} />
          <meshPhysicalMaterial
            color="#0A0A0F"
            roughness={0.2}
            metalness={0.8}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

export default function Hero3D() {
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWebGLAvailable(checkWebGL());
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="w-full h-full min-h-[250px] flex items-center justify-center rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 gradient-brand opacity-20 blur-2xl"></div>
        <div className="absolute w-36 h-36 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <div className="z-10 text-slate-400 font-medium border border-white/10 px-4 py-2 bg-slate-900/50 rounded-xl backdrop-blur-md text-xs sm:text-sm">
          Codewave Interactive 3D Experience
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#22D3EE" />
        <pointLight position={[-5, -5, -5]} intensity={1.0} color="#6366F1" />
        <Scene3D isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
