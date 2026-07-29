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

    // Set initial states
    gsap.set(el, {
      opacity: 0,
      y: distance
    });

    // Create animation with ScrollTrigger
    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%', // start animation when top of element reaches 88% of screen height
        toggleActions: 'play none none none' // run once
      }
    });

    // Cleanup to prevent memory leaks
    return () => {
      anim.kill();
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
    };
  }, [delay, duration, distance]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
