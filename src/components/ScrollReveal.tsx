import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  distance = 30
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const startPos = isMobile ? 'top 98%' : 'top 88%';

    // Set initial states
    gsap.set(el, {
      opacity: 0,
      y: distance
    });

    const reveal = () => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: isMobile ? Math.min(delay, 0.1) : delay,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    // Create animation with ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: el,
      start: startPos,
      onEnter: reveal,
      once: true
    });

    // Safety fallback: Guarantee element is revealed even if ScrollTrigger miscalculates on mobile
    const safetyTimer = setTimeout(() => {
      reveal();
    }, 600 + delay * 1000);

    // Refresh ScrollTrigger layout metrics when images load
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('load', handleLoad);
      st.kill();
    };
  }, [delay, duration, distance]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

