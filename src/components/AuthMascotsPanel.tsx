import { useState, useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';

export default function AuthMascotsPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates between -0.5 and 0.5
      const normX = (clientX - centerX) / window.innerWidth;
      const normY = (clientY - centerY) / window.innerHeight;

      setCursorPos({
        x: Math.max(-0.5, Math.min(0.5, normX)),
        y: Math.max(-0.5, Math.min(0.5, normY)),
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Head tilt & Eye offset formulas
  const headRotate = cursorPos.x * 16; // -8deg to +8deg
  const headTranslateY = cursorPos.y * 8;
  const eyeX = cursorPos.x * 10; // -5px to +5px
  const eyeY = cursorPos.y * 10;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const characterVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-[#150C0C]/90 border border-[#54281B] relative overflow-hidden text-center select-none shadow-2xl min-h-[300px] sm:min-h-[380px] lg:min-h-[480px]"
    >
      {/* Ambient Multi-Color Radial Background Glows */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-[#85431E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#D39858]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#150C0C]/40 to-[#150C0C] pointer-events-none z-0" />

      {/* Top Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#85431E]/15 border border-[#85431E]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#D39858] shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#D39858] animate-ping" />
          <span>CODEWAVE CREW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#EACEAA] tracking-tight">
          Welcome to the Squad
        </h2>
        <p className="text-xs sm:text-sm text-[#B58E78] max-w-sm mx-auto leading-relaxed">
          Our interactive crew is tracking your journey. Log in to launch your custom web builds.
        </p>
      </motion.div>

      {/* Main 5 Mascot Characters Stage */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex items-end justify-center gap-2 sm:gap-4 lg:gap-5 relative z-10 mt-6 pb-2"
      >
        {/* ================= CHARACTER 1: ROBOT ("BOTTY") ================= */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center relative group"
        >
          {/* Head & Body Group with Head Tilt */}
          <motion.div
            animate={{
              rotate: headRotate * 0.9,
              y: headTranslateY * 0.5,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center relative"
          >
            {/* Antenna */}
            <div className="flex flex-col items-center -mb-1 relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: ['0 0 8px #85431E', '0 0 20px #85431E', '0 0 8px #85431E'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-3.5 h-3.5 rounded-full bg-[#85431E] border border-white/50"
              />
              <div className="w-1 h-3 bg-[#54281B]" />
            </div>

            {/* Robot Head & Torso */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-b from-[#85431E] via-[#D39858] to-[#34150F] border-2 border-[#85431E]/60 shadow-lg shadow-[#85431E]/30 flex flex-col items-center justify-between p-2 relative">
              {/* Visor Screen */}
              <div className="w-full h-11 sm:h-13 rounded-xl bg-[#150C0C] border border-[#85431E]/40 flex items-center justify-between px-2.5 relative overflow-hidden shadow-inner">
                {/* Eyes follow cursor */}
                <motion.div
                  animate={{ x: eyeX, y: eyeY }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#85431E] shadow-[0_0_10px_#85431E] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EACEAA] font-bold" />
                  </div>
                  <div className="w-2 h-0.5 border-b-2 border-[#85431E] rounded-full" />
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#85431E] shadow-[0_0_10px_#85431E] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EACEAA] font-bold" />
                  </div>
                </motion.div>
              </div>

              {/* Chest Badge */}
              <div className="w-6 h-2 rounded-full bg-[#85431E]/30 border border-[#85431E]/40" />
            </div>

            {/* Waving Arm (Left) */}
            <motion.div
              animate={{ rotate: [0, 25, 0, 25, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-3 top-8 w-3 h-8 rounded-full bg-[#85431E] border border-[#D39858]/40 origin-top"
            />
            {/* Arm (Right) */}
            <div className="absolute -right-3 top-10 w-3 h-7 rounded-full bg-[#85431E] border border-[#D39858]/40" />
          </motion.div>

          {/* Legs */}
          <div className="flex gap-3 -mt-1 z-0">
            <div className="w-2.5 h-5 bg-[#34150F] rounded-b-md border-b-2 border-[#85431E]" />
            <div className="w-2.5 h-5 bg-[#34150F] rounded-b-md border-b-2 border-[#85431E]" />
          </div>
        </motion.div>

        {/* ================= CHARACTER 2: WARM MONSTER ("ZIPPER") ================= */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="flex flex-col items-center relative group"
        >
          <motion.div
            animate={{
              rotate: headRotate * 1.1,
              y: headTranslateY * 0.6,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center relative"
          >
            {/* Hair Tuft / Crown */}
            <div className="flex gap-1 -mb-1">
              <div className="w-2 h-3 bg-[#D39858] rounded-t-full rotate-[-15deg]" />
              <div className="w-2.5 h-4 bg-[#EACEAA] rounded-t-full" />
              <div className="w-2 h-3 bg-[#D39858] rounded-t-full rotate-[15deg]" />
            </div>

            {/* Body */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-t-3xl rounded-b-2xl bg-gradient-to-b from-[#D39858] via-[#85431E] to-[#34150F] border-2 border-[#EACEAA]/60 shadow-lg shadow-[#85431E]/30 flex flex-col items-center justify-center p-3 relative">
              {/* Big Expressive Eyes */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F8F3ED] border-2 border-[#34150F] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.8, y: eyeY * 0.8 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-3 h-3 rounded-full bg-[#34150F] flex items-center justify-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#EACEAA]" />
                  </motion.div>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F8F3ED] border-2 border-[#34150F] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.8, y: eyeY * 0.8 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-3 h-3 rounded-full bg-[#34150F] flex items-center justify-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#EACEAA]" />
                  </motion.div>
                </div>
              </div>

              {/* Cheerful Mouth */}
              <div className="w-6 h-3 rounded-b-full bg-[#150C0C] border-t-2 border-[#EACEAA] flex items-center justify-center overflow-hidden">
                <div className="w-2 h-1 bg-[#D39858] rounded-t-full mt-1" />
              </div>
            </div>

            {/* Raised Arms celebrating */}
            <motion.div
              animate={{ rotate: [-20, -35, -20] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-3 top-4 w-3.5 h-10 rounded-full bg-[#D39858] border border-[#EACEAA]/40 origin-bottom"
            />
            <motion.div
              animate={{ rotate: [20, 35, 20] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 top-4 w-3.5 h-10 rounded-full bg-[#D39858] border border-[#EACEAA]/40 origin-bottom"
            />
          </motion.div>

          {/* Cute Feet */}
          <div className="flex gap-4 -mt-1 z-0">
            <div className="w-4 h-3 bg-[#34150F] rounded-b-xl border-t-2 border-[#D39858]" />
            <div className="w-4 h-3 bg-[#34150F] rounded-b-xl border-t-2 border-[#D39858]" />
          </div>
        </motion.div>

        {/* ================= CHARACTER 3: GOLDEN STAR ("STARRY") ================= */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="flex flex-col items-center relative group z-20"
        >
          <motion.div
            animate={{
              rotate: headRotate * 1.2,
              y: headTranslateY * 0.7,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center relative"
          >
            {/* Star Body Header */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              {/* Star SVG Backing */}
              <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(211,152,88,0.5)]" viewBox="0 0 100 100">
                <polygon
                  points="50,5 64,34 95,38 72,61 78,92 50,76 22,92 28,61 5,38 36,34"
                  fill="url(#starGradient)"
                  stroke="#EACEAA"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="starGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D39858" />
                    <stop offset="100%" stopColor="#85431E" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Eyes & Mouth overlaid inside Star */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <div className="flex gap-3 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{ x: eyeX * 0.7, y: eyeY * 0.7 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="w-2.5 h-2.5 rounded-full bg-[#D39858]"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#EACEAA]" />
                    </motion.div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{ x: eyeX * 0.7, y: eyeY * 0.7 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="w-2.5 h-2.5 rounded-full bg-[#D39858]"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#EACEAA]" />
                    </motion.div>
                  </div>
                </div>
                {/* Big Smile */}
                <div className="w-5 h-2.5 rounded-b-full bg-[#34150F] border-t border-[#EACEAA]" />
              </div>
            </div>

            {/* Welcoming Waving Arms */}
            <motion.div
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-4 top-10 w-3 h-10 rounded-full bg-[#D39858] border border-[#EACEAA] origin-top"
            />
            <motion.div
              animate={{ rotate: [15, -15, 15] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 top-10 w-3 h-10 rounded-full bg-[#D39858] border border-[#EACEAA] origin-top"
            />
          </motion.div>

          {/* Long Stick Legs */}
          <div className="flex gap-5 -mt-3 z-0">
            <div className="w-2 h-12 bg-[#85431E] rounded-b-md border-b-4 border-[#EACEAA]" />
            <div className="w-2 h-12 bg-[#85431E] rounded-b-md border-b-4 border-[#EACEAA]" />
          </div>
        </motion.div>

        {/* ================= CHARACTER 4: HONEY BLOB ("SQUISHY") ================= */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -5, 0], scaleX: [1, 1.05, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="flex flex-col items-center relative group z-10"
        >
          <motion.div
            animate={{
              rotate: headRotate * 0.8,
              y: headTranslateY * 0.4,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center relative"
          >
            {/* Wide Squishy Blob Body */}
            <div className="w-18 h-14 sm:w-22 sm:h-16 rounded-t-full rounded-b-2xl bg-gradient-to-b from-[#EACEAA] via-[#D39858] to-[#85431E] border-2 border-[#EACEAA]/70 shadow-lg shadow-[#D39858]/30 flex flex-col items-center justify-center p-2 relative">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-5 h-5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.7, y: eyeY * 0.7 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-[#EACEAA]"
                  >
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </motion.div>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.7, y: eyeY * 0.7 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-[#EACEAA]"
                  >
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </motion.div>
                </div>
              </div>
              <div className="w-3 h-1 border-b-2 border-[#EACEAA] rounded-full" />
            </div>
          </motion.div>

          {/* Tiny Nubs */}
          <div className="flex gap-4 -mt-1">
            <div className="w-3 h-2 bg-[#34150F] rounded-b-full border-t border-[#D39858]" />
            <div className="w-3 h-2 bg-[#34150F] rounded-b-full border-t border-[#D39858]" />
          </div>
        </motion.div>

        {/* ================= CHARACTER 5: BURNT/GARLIC MINIS ("GIZMO") ================= */}
        <motion.div
          variants={characterVariants}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          className="flex flex-col items-center relative group"
        >
          <motion.div
            animate={{
              rotate: headRotate * 1.3,
              y: headTranslateY * 0.6,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center relative"
          >
            {/* Top Sphere Body */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#85431E] to-[#D39858] border-2 border-[#EACEAA] shadow-md shadow-[#85431E]/30 flex flex-col items-center justify-center p-1 relative z-10">
              <div className="flex gap-1.5 mb-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.8, y: eyeY * 0.8 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-[#D39858]"
                  />
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#150C0C] border border-[#EACEAA] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ x: eyeX * 0.8, y: eyeY * 0.8 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-[#D39858]"
                  />
                </div>
              </div>
              <div className="w-2 h-0.5 border-b border-[#EACEAA] rounded-full" />
            </div>

            {/* Bottom Triangle/Cone Buddy */}
            <div className="w-14 h-12 -mt-3 rounded-b-xl bg-gradient-to-b from-[#34150F] to-[#85431E] border-2 border-[#54281B] flex flex-col items-center justify-center p-1">
              <div className="flex gap-1.5 mt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D39858] shadow-[0_0_6px_#D39858]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#D39858] shadow-[0_0_6px_#D39858]" />
              </div>
            </div>
          </motion.div>

          {/* Feet */}
          <div className="flex gap-3 -mt-1">
            <div className="w-2.5 h-4 bg-[#150C0C] rounded-b-md border-b-2 border-[#85431E]" />
            <div className="w-2.5 h-4 bg-[#150C0C] rounded-b-md border-b-2 border-[#85431E]" />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Features Pill List */}
      <div className="mt-4 pt-4 border-t border-[#54281B]/60 grid grid-cols-2 gap-3 text-[11px] font-mono text-[#B58E78] z-10 w-full max-w-xs">
        <div className="flex items-center gap-1.5 justify-center bg-[#34150F]/60 py-1.5 px-3 rounded-lg border border-[#54281B]">
          <span className="text-[#85431E]">✓</span> 3D Web Systems
        </div>
        <div className="flex items-center gap-1.5 justify-center bg-[#34150F]/60 py-1.5 px-3 rounded-lg border border-[#54281B]">
          <span className="text-[#85431E]">✓</span> Live Tracking
        </div>
      </div>
    </div>
  );
}
