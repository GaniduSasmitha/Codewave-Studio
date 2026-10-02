import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hoverEffect = true, onClick }: GlassCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -10px rgba(212, 175, 55, 0.45)' } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white/90 border border-[#D4AF37]/35 dark:bg-[#131B2E]/90 dark:border-[#1E3A5F] dark:hover:border-[#D4AF37]/60 dark:shadow-2xl dark:shadow-[#070D1D]/80 backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A00] focus-visible:ring-offset-2 dark:focus-visible:ring-[#F3C623] dark:focus-visible:ring-offset-[#0B132B]' : ''
        } ${className}`}
    >
      {children}
    </motion.div>
  );
}
