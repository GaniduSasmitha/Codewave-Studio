import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactMascotProps {
  focusedField: 'name' | 'email' | 'message' | null;
  isSuccess: boolean;
}

export default function ContactMascot({ focusedField, isSuccess }: ContactMascotProps) {
  const headRef = useRef<HTMLDivElement>(null);
  const [cursorEyeOffset, setCursorEyeOffset] = useState({ x: 0, y: 0 });
  // Track mouse and touch cursor for smooth eye movement when no field is focused
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!headRef.current) return;
      const rect = headRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 1) {
        setCursorEyeOffset({ x: 0, y: 0 });
        return;
      }

      // Constrain maximum eye shift to 4px radius for a subtle, natural glance
      const maxShift = 4;
      const angle = Math.atan2(deltaY, deltaX);
      const shiftDist = Math.min(distance * 0.015, maxShift);

      setCursorEyeOffset({
        x: Math.cos(angle) * shiftDist,
        y: Math.sin(angle) * shiftDist,
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

  // Speech text calculation
  let speechText = "Hi! Tell us about your project. 👋";
  if (isSuccess) {
    speechText = "Woohoo! Message received! 🚀";
  } else if (focusedField === 'name') {
    speechText = "Nice to meet you! What's your name?";
  } else if (focusedField === 'email') {
    speechText = "Awesome! Where can we write back to you?";
  } else if (focusedField === 'message') {
    speechText = "I'm listening! Tell us all the details.";
  }

  // Eye position offsets: focusedField takes priority over cursor tracking
  let finalEyeOffset = { x: 0, y: 0 };
  if (isSuccess) {
    finalEyeOffset = { x: 0, y: 0 };
  } else if (focusedField === 'name') {
    finalEyeOffset = { x: -3, y: 1 };
  } else if (focusedField === 'email') {
    finalEyeOffset = { x: -3, y: 3 };
  } else if (focusedField === 'message') {
    finalEyeOffset = { x: 0, y: 4 };
  } else {
    // Default to cursor/touch-tracking eye position on all devices including mobile
    finalEyeOffset = cursorEyeOffset;
  }

  // Head transform / lean
  let headTransform = { scale: 1, y: 0, rotate: 0 };
  if (isSuccess) {
    headTransform = { scale: 1.1, y: -6, rotate: 4 };
  } else if (focusedField === 'message') {
    headTransform = { scale: 1.05, y: 3, rotate: -2 };
  } else if (focusedField === 'name') {
    headTransform = { scale: 1.02, y: 0, rotate: -3 };
  } else if (focusedField === 'email') {
    headTransform = { scale: 1.02, y: 1, rotate: -1 };
  }

  return (
    <div className="flex flex-col items-center justify-center mb-6 relative select-none">
      {/* Glassmorphic Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          initial={{ opacity: 0, y: 6, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.92 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mb-3 px-4 py-2 rounded-2xl bg-white/95 dark:bg-[#0B132B]/95 border border-[#D4AF37]/50 backdrop-blur-md shadow-lg shadow-[#D4AF37]/10 text-xs font-semibold text-slate-800 dark:text-[#F9E79F] text-center relative max-w-xs"
        >
          <span>{speechText}</span>
          {/* Bubble Pointer Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-[#0B132B]/95 border-r border-b border-[#D4AF37]/50 rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* Main Mascot Robot Container */}
      <motion.div
        animate={
          isSuccess
            ? {
              y: [0, -16, 0, -10, 0],
              rotate: [0, -6, 6, -3, 0],
            }
            : {
              y: [0, -5, 0],
            }
        }
        transition={
          isSuccess
            ? { duration: 0.7, ease: "easeOut" }
            : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative flex flex-col items-center justify-center"
      >
        {/* Antenna */}
        <div className="flex flex-col items-center relative z-0 -mb-1">
          {/* Glowing Tip */}
          <motion.div
            animate={{
              scale: isSuccess ? [1, 1.5, 1.2, 1.5, 1] : [1, 1.25, 1],
              boxShadow: isSuccess
                ? [
                  "0 0 8px #D4AF37",
                  "0 0 24px #D4AF37, 0 0 36px #F3C623",
                  "0 0 12px #D4AF37",
                ]
                : [
                  "0 0 6px #D4AF37",
                  "0 0 16px #F3C623",
                  "0 0 6px #D4AF37",
                ],
            }}
            transition={{
              duration: isSuccess ? 0.4 : 2,
              repeat: isSuccess ? 3 : Infinity,
              ease: "easeInOut",
            }}
            className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3C623] border border-white/60 z-10"
          />
          {/* Antenna Pole */}
          <motion.div
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3.5 bg-gradient-to-b from-[#D4AF37] to-[#0B132B] rounded-full -mt-0.5"
          />
        </div>

        {/* Robot Head Body */}
        <motion.div
          ref={headRef}
          animate={headTransform}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-2xl bg-gradient-to-b from-[#131B2E] via-[#0B132B] to-[#070D1D] border-2 border-[#D4AF37]/60 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center overflow-visible"
        >
          {/* Ear Nubs */}
          <div className="absolute -left-2 w-2 h-4 rounded-l-md bg-[#0B132B] border-l border-y border-[#D4AF37]/50" />
          <div className="absolute -right-2 w-2 h-4 rounded-r-md bg-[#0B132B] border-r border-y border-[#D4AF37]/50" />

          {/* Visor / Face Screen */}
          <div className="w-[82%] h-[75%] rounded-xl bg-[#070D1D] border border-[#1E3A5F] flex items-center justify-center px-3 relative overflow-hidden shadow-inner">
            {/* Ambient Visor Grid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/15 via-transparent to-[#F3C623]/15 pointer-events-none" />

            {/* Eyes & Face Container */}
            <motion.div
              animate={{
                x: finalEyeOffset.x,
                y: finalEyeOffset.y,
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center justify-between w-full px-2 z-10"
            >
              {/* Left Eye */}
              <motion.div
                animate={{
                  scaleY: isSuccess ? [1, 0.2, 1] : [1, 1, 0.1, 1],
                }}
                transition={{
                  duration: isSuccess ? 0.3 : 4,
                  repeat: isSuccess ? 2 : Infinity,
                  repeatDelay: isSuccess ? 0 : 3.5,
                }}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#F9E79F] font-bold" />
              </motion.div>

              {/* Mouth Curve */}
              <div className="w-2.5 h-1 border-b-2 border-[#D4AF37] rounded-full" />

              {/* Right Eye */}
              <motion.div
                animate={{
                  scaleY: isSuccess ? [1, 0.2, 1] : [1, 1, 0.1, 1],
                }}
                transition={{
                  duration: isSuccess ? 0.3 : 4,
                  repeat: isSuccess ? 2 : Infinity,
                  repeatDelay: isSuccess ? 0 : 3.5,
                }}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#F9E79F] font-bold" />
              </motion.div>
            </motion.div>
          </div>

          {/* Chin Base Notch */}
          <div className="absolute -bottom-1 w-6 h-1 rounded-full bg-[#D4AF37]/50" />
        </motion.div>
      </motion.div>
    </div>
  );
}
