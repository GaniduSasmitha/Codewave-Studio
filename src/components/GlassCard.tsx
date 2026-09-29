import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hoverEffect = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -10px rgba(133, 67, 30, 0.35)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white/90 border border-[#D39858]/30 dark:bg-[#34150F]/85 dark:border-[#54281B] dark:shadow-xl dark:shadow-black/60 backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
