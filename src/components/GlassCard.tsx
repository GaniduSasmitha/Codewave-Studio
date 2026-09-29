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
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -10px rgba(163, 55, 21, 0.25)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white/90 border border-[#394045]/20 dark:bg-[#20292D]/70 dark:border-[#394045] dark:shadow-xl dark:shadow-black/40 backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
