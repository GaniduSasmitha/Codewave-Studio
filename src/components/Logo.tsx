interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export default function Logo({
  size = 'md',
  showText = true,
  subtitle,
  className = ''
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Code Emblem Icon */}
      <div className={`${iconSizes[size]} rounded-xl bg-[#EACEAA]/20 dark:bg-[#34150F] border border-[#D39858]/30 dark:border-[#54281B] shadow-sm dark:shadow-lg flex items-center justify-center relative overflow-hidden group flex-shrink-0`}>
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#85431E] to-[#D39858] opacity-20 group-hover:opacity-40 transition-opacity" />
        
        {/* Code Brackets Icon */}
        <svg
          className="w-5 h-5 relative z-10 text-[#85431E] dark:text-[#D39858]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-[#150C0C] dark:text-[#EACEAA] leading-none flex items-center gap-1.5`}>
            Codewave
            <span className="text-[#D39858] dark:text-[#D39858] font-semibold text-[0.85em]">Studio</span>
          </span>
          {subtitle && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B58E78] dark:text-[#B58E78] mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
