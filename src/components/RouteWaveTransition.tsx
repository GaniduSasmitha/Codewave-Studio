import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

type WaveOrigin = { x: number; y: number };

export default function RouteWaveTransition() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const routeKey = `${location.pathname}${location.search}`;
  const previousRoute = useRef(routeKey);
  const lastPointer = useRef<WaveOrigin>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rememberPointer = (event: PointerEvent) => {
      lastPointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointerdown', rememberPointer, { passive: true, capture: true });
    return () => window.removeEventListener('pointerdown', rememberPointer, { capture: true });
  }, []);

  useEffect(() => {
    if (previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;

    if (reduceMotion) return;

    if (lastPointer.current.x === 0 && lastPointer.current.y === 0) {
      lastPointer.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, routeKey]);

  const origin = lastPointer.current;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={routeKey}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,198,35,0.34),rgba(19,27,46,0.88)_48%,rgba(7,13,29,0.96))]"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`, opacity: 0 }}
            animate={{
              clipPath: `circle(160vmax at ${origin.x}px ${origin.y}px)`,
              opacity: [0, 0.96, 0.9, 0],
            }}
            transition={{ duration: 0.86, times: [0, 0.16, 0.62, 1], ease: [0.22, 1, 0.36, 1] }}
          />

          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F3C623] shadow-[0_0_22px_rgba(243,198,35,0.8)]"
              style={{ left: origin.x, top: origin.y }}
              initial={{ scale: 0, opacity: 0.85 }}
              animate={{ scale: 42 + ring * 18, opacity: [0.8, 0.42, 0] }}
              transition={{ duration: 0.72, delay: ring * 0.06, ease: 'easeOut' }}
            />
          ))}

          <motion.svg
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-1/2 h-[72vh] w-full -translate-y-1/2 drop-shadow-[0_0_24px_rgba(212,175,55,0.45)]"
            initial={{ x: '-115%', opacity: 0 }}
            animate={{ x: ['-115%', '0%', '115%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.82, times: [0, 0.28, 0.72, 1], ease: 'easeInOut' }}
          >
            <path
              d="M-80 318C120 112 322 108 522 302s400 194 600 0 400-194 598 0v180c-198-194-398-194-598 0s-400 194-600 0-400-194-602 0Z"
              fill="rgba(212,175,55,0.9)"
            />
            <path
              d="M-100 260C120 42 340 42 560 260s440 218 660 0 440-218 660 0"
              fill="none"
              stroke="#F9E79F"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M-120 390c190-152 380-152 570 0s380 152 570 0 380-152 570 0"
              fill="none"
              stroke="#F3C623"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.7"
            />
          </motion.svg>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/70 bg-[#0B132B]/90 px-5 py-2 text-xs font-black tracking-[0.32em] text-[#F9E79F] shadow-[0_0_28px_rgba(243,198,35,0.38)]"
            initial={{ scale: 0.72, opacity: 0 }}
            animate={{ scale: [0.72, 1, 1.04], opacity: [0, 1, 0] }}
            transition={{ duration: 0.78, times: [0, 0.3, 1], ease: 'easeOut' }}
          >
            CODEWAVE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
