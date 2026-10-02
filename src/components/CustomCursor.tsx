import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'text' | 'button'>('default');
  const [isVisible, setIsVisible] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor]');

      if (interactiveEl) {
        setIsHovered(true);
        const text = interactiveEl.getAttribute('data-cursor-text') || '';
        setCursorText(text);

        const tagName = interactiveEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          setCursorVariant('text');
        } else if (tagName === 'button' || tagName === 'a' || interactiveEl.getAttribute('role') === 'button') {
          setCursorVariant('button');
        } else {
          setCursorVariant('pointer');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* Central Precision Glowing Dot */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full bg-[#F3C623] shadow-[0_0_12px_#F3C623] mix-blend-difference pointer-events-none ${cursorVariant === 'text' ? 'w-1 h-5' : 'w-3 h-3'
          }`}
        animate={{
          x: mousePos.x - (cursorVariant === 'text' ? 2 : 6),
          y: mousePos.y - (cursorVariant === 'text' ? 10 : 6),
          scale: isMouseDown ? 0.6 : isHovered ? (cursorVariant === 'button' ? 1.6 : 1.2) : 1,
          opacity: isVisible && mousePos.x >= 0 ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 1200,
          damping: 50,
          mass: 0.1,
        }}
      />

      {/* Outer Magnetic Trailing Halo Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full border flex items-center justify-center transition-colors duration-200 ${isHovered
            ? 'border-[#F3C623]/80 bg-[#F3C623]/10 backdrop-blur-[2px] shadow-[0_0_20px_rgba(243,198,35,0.3)]'
            : 'border-[#D4AF37]/40 bg-transparent'
          }`}
        animate={{
          x: mousePos.x - (isHovered ? 26 : 18),
          y: mousePos.y - (isHovered ? 26 : 18),
          width: isHovered ? 52 : 36,
          height: isHovered ? 52 : 36,
          scale: isMouseDown ? 0.85 : 1,
          opacity: isVisible && mousePos.x >= 0 ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 28,
          mass: 0.4,
        }}
      >
        <AnimatePresence>
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[9px] font-black tracking-wider uppercase text-[#0B132B] dark:text-[#F9E79F] px-1 text-center select-none"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
