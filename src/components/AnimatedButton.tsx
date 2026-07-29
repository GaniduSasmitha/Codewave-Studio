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
    primary: 'bg-primary text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    secondary: 'border border-slate-800 hover:bg-slate-900 text-slate-100 hover:border-slate-700',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white shadow-lg'
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
