import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border-slate-700/80 shadow-inner'
          : 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-200 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
            opacity: isDark ? 0 : 1
          }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Sun Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Moon Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </motion.div>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider font-mono">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </motion.button>
  );
}
