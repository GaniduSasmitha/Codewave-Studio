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
  const baseStyles = 'relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 overflow-hidden';

  const variants = {
    primary: 'gradient-brand text-white hover:shadow-[0_0_20px_rgba(163,55,21,0.5)] font-semibold',
    secondary: 'border border-[#394045] bg-[#B5A295]/20 hover:bg-[#B5A295]/30 text-[#0A0F12] dark:bg-transparent dark:hover:bg-[#20292D] dark:text-slate-100 dark:hover:border-[#394045]',
    glass: 'bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-[#394045]/30 hover:bg-slate-900/10 dark:hover:bg-white/10 text-[#0A0F12] dark:text-white shadow-sm dark:shadow-lg'
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
