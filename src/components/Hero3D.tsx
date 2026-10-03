import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Effects, Instance, Instances, RoundedBox, Sparkles } from '@react-three/drei';
import { CanvasTexture, getConsoleFunction, MathUtils, setConsoleFunction, SRGBColorSpace, Vector2 } from 'three';
import type { Group } from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { useTheme } from '../context/ThemeContext';

const BloomPass = extend(UnrealBloomPass);

function useExpectedContextDisposalLogFilter() {
  useEffect(() => {
    const previousConsoleFunction = getConsoleFunction();
    let expectedDisposal = false;

    const consoleFunction: Parameters<typeof setConsoleFunction>[0] = (level, message, ...params) => {
      if (expectedDisposal && level === 'log' && message === 'THREE.WebGLRenderer: Context Lost.') {
        return;
      }

      if (previousConsoleFunction) {
        previousConsoleFunction(level, message, ...params);
        return;
      }

      const method = level === 'warn' ? console.warn : level === 'error' ? console.error : console.log;
      method(message, ...params);
    };

    setConsoleFunction(consoleFunction);

    return () => {
      // R3F deliberately loses the context after disposing the renderer. Keep
      // genuine context-loss logs visible while the scene is mounted, and only
      // suppress the expected teardown notification.
      expectedDisposal = true;
      window.setTimeout(() => {
        if (getConsoleFunction() === consoleFunction) {
          setConsoleFunction(previousConsoleFunction);
        }
      }, 1000);
    };
  }, []);
}

const COLORS = {
  background: '#0A0F12',
  body: '#1E3A5F',
  bodyHighlight: '#405678',
  accent: '#D4AF37',
  accentBright: '#F3C623',
  cream: '#F9E79F',
} as const;

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    ));
  } catch {
    return false;
  }
}

type SceneProps = {
  isMobile: boolean;
  lowPower: boolean;
  reducedMotion: boolean;
  isDark: boolean;
  scrollProgress: React.MutableRefObject<number>;
  interaction: React.MutableRefObject<InteractionState>;
};

type InteractionState = {
  pointerX: number;
  pointerY: number;
  dragX: number;
  dragY: number;
};

function RendererBackground({ color }: { color: string }) {
  const renderer = useThree((state) => state.gl);

  useEffect(() => {
    renderer.setClearColor(color, 0);
  }, [color, renderer]);

  return null;
}

function useScreenTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 614;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, COLORS.bodyHighlight);
    background.addColorStop(0.52, COLORS.body);
    background.addColorStop(1, COLORS.background);
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const glow = context.createRadialGradient(215, 170, 20, 215, 170, 360);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.52)');
    glow.addColorStop(1, 'rgba(10, 15, 18, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = COLORS.accentBright;
    context.fillRect(68, 76, 84, 8);
    context.font = '700 25px system-ui, sans-serif';
    context.letterSpacing = '6px';
    context.fillText('CODEWAVE STUDIO', 68, 132);

    context.fillStyle = COLORS.cream;
    context.font = '800 68px system-ui, sans-serif';
    context.letterSpacing = '0px';
    context.fillText('Digital experiences', 68, 245);
    context.fillText('built to make an impact.', 68, 326);

    context.fillStyle = '#E3E8F2';
    context.font = '400 29px system-ui, sans-serif';
    context.fillText('Web design  \u2022  Development  \u2022  3D', 70, 402);

    context.strokeStyle = COLORS.accent;
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(68, 462, 270, 76, 38);
    context.stroke();
    context.fillStyle = COLORS.cream;
    context.font = '700 24px system-ui, sans-serif';
    context.fillText('EXPLORE CODEWAVE', 97, 510);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.anisotropy = 4;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, []);

  return texture;
}

function Keyboard({ simplified }: { simplified: boolean }) {
  const keys = useMemo(() => {
    const rows = simplified ? 3 : 5;
    const columns = simplified ? 8 : 12;
    const keyWidth = simplified ? 0.31 : 0.22;
    const xGap = simplified ? 0.37 : 0.27;
    const zGap = 0.23;
    return Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      return {
        position: [
          (column - (columns - 1) / 2) * xGap,
          -0.665,
          -0.48 + row * zGap,
        ] as [number, number, number],
        scale: [keyWidth, 0.05, 0.145] as [number, number, number],
      };
    });
  }, [simplified]);

  return (
    <Instances limit={60} range={keys.length}>
      <boxGeometry />
      <meshStandardMaterial color={COLORS.background} emissive={COLORS.accent} emissiveIntensity={0.14} roughness={0.68} metalness={0.28} />
      {keys.map((key, index) => (
        <Instance key={index} position={key.position} scale={key.scale} />
      ))}
    </Instances>
  );
}

function Laptop({ isMobile, lowPower, reducedMotion, scrollProgress, interaction }: SceneProps) {
  const laptopRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const restingLidAngle = -0.18;
  const screenTexture = useScreenTexture();

  useFrame(({ clock }, delta) => {
    if (!laptopRef.current || !lidRef.current) return;

    if (reducedMotion) {
      laptopRef.current.position.set(isMobile ? 0 : 1.85, isMobile ? -0.25 : -0.05, 0);
      laptopRef.current.rotation.set(0.05, isMobile ? -0.08 : -0.2, 0.015);
      laptopRef.current.scale.setScalar(isMobile ? 0.82 : 1);
      lidRef.current.rotation.x = restingLidAngle;
      return;
    }

    const elapsed = clock.getElapsedTime();
    const entrance = MathUtils.smoothstep(Math.min(elapsed / 1.55, 1), 0, 1);
    const progress = scrollProgress.current;
    const input = interaction.current;
    const targetX = isMobile
      ? 0
      : MathUtils.lerp(1.85, 1.55, progress);
    const targetY = isMobile
      ? -0.25
      : MathUtils.lerp(-0.05, 0.22, progress);
    const targetScale = (isMobile ? 0.82 : MathUtils.lerp(0.94, 0.82, progress))
      * MathUtils.lerp(0.72, 1, entrance);
    const targetRotationY = (isMobile ? -0.08 : -0.2) + progress * (isMobile ? 0.2 : 0.62) + input.pointerX * 0.11 + input.dragX;
    const targetRotationX = 0.05 + progress * (isMobile ? 0.025 : 0.08) - input.pointerY * 0.075 + input.dragY;

    laptopRef.current.position.x = MathUtils.damp(laptopRef.current.position.x, targetX, 3.2, delta);
    laptopRef.current.position.y = MathUtils.damp(laptopRef.current.position.y, targetY, 3.2, delta);
    laptopRef.current.rotation.x = MathUtils.damp(laptopRef.current.rotation.x, targetRotationX, 3.2, delta);
    laptopRef.current.rotation.y = MathUtils.damp(laptopRef.current.rotation.y, targetRotationY, 3.2, delta);
    laptopRef.current.rotation.z = MathUtils.damp(laptopRef.current.rotation.z, 0.015 - progress * 0.08, 3.2, delta);
    laptopRef.current.scale.setScalar(MathUtils.damp(laptopRef.current.scale.x, targetScale, 3.4, delta));

    const entranceLidTarget = MathUtils.lerp(1.38, restingLidAngle, entrance);
    const lidTarget = MathUtils.lerp(entranceLidTarget, 1.38, progress);
    lidRef.current.rotation.x = MathUtils.damp(lidRef.current.rotation.x, lidTarget, 5.2, delta);
  });

  return (
    <group
      ref={laptopRef}
      position={[isMobile ? 0 : 1.85, isMobile ? -0.25 : -0.05, 0]}
      rotation={[0.05, isMobile ? -0.08 : -0.2, 0.015]}
      scale={isMobile ? 0.4 : 0.68}
    >
      <RoundedBox args={[4, 0.18, 2.45]} radius={0.1} smoothness={3} position={[0, -0.86, 0.08]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.body} emissive={COLORS.bodyHighlight} emissiveIntensity={0.12} roughness={0.46} metalness={0.48} />
      </RoundedBox>

      <RoundedBox args={[3.78, 0.055, 2.18]} radius={0.06} smoothness={2} position={[0, -0.75, 0.05]}>
        <meshStandardMaterial color={COLORS.bodyHighlight} roughness={0.56} metalness={0.34} />
      </RoundedBox>

      <Keyboard simplified={isMobile || lowPower} />

      <RoundedBox args={[1.18, 0.025, 0.72]} radius={0.045} smoothness={2} position={[0, -0.705, 0.72]}>
        <meshStandardMaterial color={COLORS.background} roughness={0.65} metalness={0.22} />
      </RoundedBox>

      {[-1.7, 1.7].map((x) => (
        <RoundedBox key={x} args={[0.1, 0.026, 1.05]} radius={0.025} smoothness={2} position={[x, -0.704, 0.12]}>
          <meshStandardMaterial color={COLORS.background} emissive={COLORS.accent} emissiveIntensity={0.08} roughness={0.8} />
        </RoundedBox>
      ))}

      <RoundedBox args={[4.05, 0.12, 0.12]} radius={0.055} smoothness={3} position={[0, -0.79, -1.08]}>
        <meshStandardMaterial color={COLORS.accent} roughness={0.45} metalness={0.38} />
      </RoundedBox>

      <group ref={lidRef} position={[0, -0.79, -1.08]} rotation={[1.38, 0, 0]}>
        <RoundedBox args={[3.82, 2.45, 0.15]} radius={0.11} smoothness={4} position={[0, 1.22, 0]} castShadow>
          <meshStandardMaterial color={COLORS.body} emissive={COLORS.bodyHighlight} emissiveIntensity={0.12} roughness={0.46} metalness={0.48} />
        </RoundedBox>

        <mesh position={[0, 1.22, 0.091]}>
          <planeGeometry args={[3.5, 2.12]} />
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        </mesh>

        <mesh position={[0, 2.34, 0.096]}>
          <circleGeometry args={[0.028, 12]} />
          <meshBasicMaterial color={COLORS.accentBright} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Scene(props: SceneProps) {
  const bloomEnabled = !props.isMobile && !props.lowPower && !props.reducedMotion;

  return (
    <>
      <ambientLight intensity={0.52} color={COLORS.cream} />
      <directionalLight position={[5, 5, 5]} intensity={1.7} color={COLORS.cream} />
      <pointLight position={[-3.5, 1.5, 2.5]} intensity={22} distance={9} decay={2} color={COLORS.accent} />
      <pointLight position={[3.5, 1.5, -1]} intensity={14} distance={8} decay={2} color={COLORS.accentBright} />

      <Sparkles
        count={props.isMobile || props.lowPower ? 24 : 72}
        scale={[16, 9, 7]}
        size={props.isMobile ? 0.7 : 0.9}
        speed={props.reducedMotion ? 0 : 0.08}
        opacity={0.22}
        color={COLORS.accentBright}
      />
      <Sparkles
        count={props.isMobile || props.lowPower ? 10 : 28}
        scale={[14, 8, 6]}
        size={props.isMobile ? 0.55 : 0.72}
        speed={props.reducedMotion ? 0 : 0.05}
        opacity={0.18}
        color={COLORS.accent}
      />

      <Laptop {...props} />

      {bloomEnabled && (
        <Effects multisamping={0} disableGamma>
          <BloomPass args={[new Vector2(512, 512), 0.26, 0.32, 0.48]} threshold={0.48} strength={0.26} radius={0.32} />
        </Effects>
      )}
    </>
  );
}

export default function Hero3D() {
  useExpectedContextDisposalLogFilter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [lowPower, setLowPower] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const interaction = useRef<InteractionState>({ pointerX: 0, pointerY: 0, dragX: 0, dragY: 0 });

  useEffect(() => {
    setWebGLAvailable(canUseWebGL());
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateCapabilities = () => {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      setIsMobile(window.innerWidth < 768);
      setLowPower((navigator.hardwareConcurrency || 8) <= 4 || (memory !== undefined && memory <= 4));
      setReducedMotion(motionQuery.matches);
    };
    updateCapabilities();
    window.addEventListener('resize', updateCapabilities, { passive: true });
    motionQuery.addEventListener('change', updateCapabilities);
    return () => {
      window.removeEventListener('resize', updateCapabilities);
      motionQuery.removeEventListener('change', updateCapabilities);
    };
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      if (isMobile) {
        scrollProgress.current = MathUtils.clamp(
          window.scrollY / Math.max(window.innerHeight * 0.62, 1),
          0,
          1,
        );
        if (heroRef.current) heroRef.current.style.opacity = '1';
        return;
      }

      const progress = MathUtils.clamp(window.scrollY / Math.max(window.innerHeight * 0.88, 1), 0, 1);
      scrollProgress.current = progress;
      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - MathUtils.smoothstep(progress, 0.5, 0.96));
      }
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, [isMobile]);

  useEffect(() => {
    if (reducedMotion) {
      interaction.current = { pointerX: 0, pointerY: 0, dragX: 0, dragY: 0 };
      return;
    }

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startDragX = 0;
    let startDragY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      const bounds = heroRef.current?.getBoundingClientRect();
      const isInsideStage = Boolean(bounds
        && event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom);
      const isLaptopArea = isMobile ? isInsideStage : event.clientX > window.innerWidth * 0.46;
      if (event.button !== 0 || (!isMobile && scrollProgress.current > 0.9) || !isLaptopArea) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startDragX = interaction.current.dragX;
      startDragY = interaction.current.dragY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = heroRef.current?.getBoundingClientRect();
      const active = isMobile || scrollProgress.current < 0.9;
      const width = isMobile && bounds ? bounds.width : window.innerWidth;
      const height = isMobile && bounds ? bounds.height : window.innerHeight;
      const left = isMobile && bounds ? bounds.left : 0;
      const top = isMobile && bounds ? bounds.top : 0;
      interaction.current.pointerX = active ? ((event.clientX - left) / width - 0.5) * 2 : 0;
      interaction.current.pointerY = active ? ((event.clientY - top) / height - 0.5) * 2 : 0;
      if (!dragging) return;

      interaction.current.dragX = MathUtils.clamp(
        startDragX + ((event.clientX - startX) / width) * 2.5,
        -0.72,
        0.72,
      );
      interaction.current.dragY = MathUtils.clamp(
        startDragY + ((event.clientY - startY) / height) * 1.1,
        -0.2,
        0.24,
      );
    };

    const handlePointerUp = () => {
      dragging = false;
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isMobile, reducedMotion]);

  if (!webGLAvailable) {
    return (
      <div
        aria-hidden="true"
        className={isMobile ? 'relative h-full w-full overflow-hidden rounded-[2rem]' : 'fixed inset-0 -z-10 pointer-events-none'}
        style={{
          background: isDark
            ? `radial-gradient(circle at 55% 35%, ${COLORS.body}, ${COLORS.background} 68%)`
            : 'radial-gradient(circle at 55% 35%, rgba(212, 175, 55, 0.18), #F0F4F9 68%)',
        }}
      />
    );
  }

  return (
    <div
      ref={heroRef}
      aria-hidden="true"
      className={isMobile
        ? 'relative h-full w-full overflow-hidden rounded-[2rem] border border-[#D4AF37]/20 shadow-[0_24px_70px_rgba(11,19,43,0.2)] cursor-grab active:cursor-grabbing'
        : 'fixed inset-0 -z-10 pointer-events-none'}
      style={{
        background: isDark
          ? 'radial-gradient(circle at 70% 34%, rgba(212, 175, 55, 0.12) 0%, rgba(19, 27, 46, 0.7) 30%, #0A0F12 68%)'
          : 'radial-gradient(circle at 70% 34%, rgba(212, 175, 55, 0.2) 0%, rgba(226, 232, 240, 0.86) 34%, #F0F4F9 72%)',
        opacity: 1,
        transition: reducedMotion ? 'none' : 'opacity 180ms linear',
        touchAction: isMobile ? 'pan-y' : 'auto',
      }}
    >
      <Canvas
        frameloop={reducedMotion ? 'demand' : 'always'}
        dpr={isMobile || lowPower ? 1 : [1, 1.5]}
        camera={{ position: [0, 0.2, 7.1], fov: isMobile ? 54 : 48, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', touchAction: isMobile ? 'pan-y' : 'auto' }}
        shadows={!isMobile && !lowPower}
      >
        <RendererBackground color={isDark ? COLORS.background : '#F0F4F9'} />
        <fog attach="fog" args={[isDark ? COLORS.background : '#F0F4F9', 8, 20]} />
        <Scene
          isMobile={isMobile}
          lowPower={lowPower}
          reducedMotion={reducedMotion}
          isDark={isDark}
          scrollProgress={scrollProgress}
          interaction={interaction}
        />
      </Canvas>
    </div>
  );
}
