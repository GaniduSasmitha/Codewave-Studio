import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({ children, className = '', hoverEffect = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, borderColor: 'rgba(255, 255, 255, 0.15)', boxShadow: '0 12px 30px -10px rgba(99, 102, 241, 0.25)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-slate-950/40 backdrop-blur-lg border border-white/5 rounded-2xl p-6 shadow-xl transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
