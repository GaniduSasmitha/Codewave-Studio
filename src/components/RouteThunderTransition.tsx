import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function RouteThunderTransition() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const routeKey = `${location.pathname}${location.search}`;
  const previousRoute = useRef(routeKey);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;

    if (reduceMotion) return;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 720);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, routeKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={routeKey}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.3, 0.85, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.68, times: [0, 0.1, 0.25, 0.43, 1], ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-[#F9E79F] mix-blend-screen"
            animate={{ opacity: [0, 0.48, 0.04, 0.28, 0] }}
            transition={{ duration: 0.58, times: [0, 0.09, 0.2, 0.34, 1] }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_18%,rgba(243,198,35,0.38),transparent_48%)]" />

          <motion.svg
            viewBox="0 0 240 820"
            className="absolute -top-[18vh] left-[58%] h-[120vh] w-44 -translate-x-1/2 drop-shadow-[0_0_18px_rgba(243,198,35,0.95)] sm:w-56"
            initial={{ pathLength: 0, opacity: 0, scaleY: 0.72 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0], scaleY: [0.72, 1, 1] }}
            transition={{ duration: 0.6, times: [0, 0.2, 1], ease: 'easeOut' }}
          >
            <motion.path
              d="M156 0 72 326h65L44 820l174-430h-71L222 0Z"
              fill="#F3C623"
              stroke="#F9E79F"
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </motion.svg>

          <motion.div
            className="absolute left-[20%] top-0 h-[72vh] w-1 origin-top rotate-[18deg] bg-gradient-to-b from-[#F9E79F] via-[#F3C623] to-transparent shadow-[0_0_16px_#F3C623]"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1], opacity: [0, 0.72, 0] }}
            transition={{ duration: 0.5, delay: 0.08, times: [0, 0.25, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
