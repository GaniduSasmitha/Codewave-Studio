import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'glass';
  children: ReactNode;
  className?: string;
}

export default function AnimatedButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: AnimatedButtonProps) {
  const baseStyles = 'relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A00] focus-visible:ring-offset-2 dark:focus-visible:ring-[#F3C623] dark:focus-visible:ring-offset-[#0B132B] flex items-center justify-center gap-2 overflow-hidden disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'gradient-brand text-[#0B132B] font-bold hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] border border-[#F3C623]/50',
    secondary: 'border border-[#D4AF37]/40 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#0B132B] dark:bg-[#131B2E] dark:hover:bg-[#1C2541] dark:text-[#F9E79F] dark:border-[#D4AF37]/60 dark:hover:border-[#F3C623]',
    glass: 'bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-[#0B132B] dark:text-[#F9E79F] shadow-sm dark:shadow-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
