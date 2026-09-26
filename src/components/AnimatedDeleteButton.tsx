import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnimatedDeleteButtonProps {
  onDelete: () => Promise<void> | void;
  isBlocked?: boolean;
  blockedMessage?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export default function AnimatedDeleteButton({
  onDelete,
  isBlocked = false,
  blockedMessage = 'Cannot delete an order that is currently in progress.',
  confirmTitle = 'Confirm Deletion',
  confirmMessage = 'Are you sure you want to delete this item? This cannot be undone.',
  label = 'Delete',
  className = '',
  size = 'md',
  disabled = false,
  onSuccess,
  onError,
}: AnimatedDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isShakingBlocked, setIsShakingBlocked] = useState(false);
  const [impactCount, setImpactCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const letters = label.split('');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled || isAnimating || deleting) return;

    if (isBlocked) {
      // Trigger blocked rejection shake animation
      setIsShakingBlocked(true);
      setLocalError(blockedMessage);
      if (onError) onError(blockedMessage);

      setTimeout(() => {
        setIsShakingBlocked(false);
      }, 600);

      // Auto clear local error after 4 seconds
      setTimeout(() => {
        setLocalError(null);
      }, 4000);
      return;
    }

    // Open confirmation dialog
    setLocalError(null);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsAnimating(true);

    // Trigger sequential trash impact vibrations for each letter landing
    letters.forEach((_, idx) => {
      setTimeout(() => {
        setImpactCount((prev) => prev + 1);
      }, (idx + 1) * 90);
    });

    // Total animation time for letters flying in
    const totalAnimTime = letters.length * 90 + 350;

    setTimeout(async () => {
      setDeleting(true);
      try {
        await onDelete();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        console.error('Delete error:', err);
        const msg = err.message || 'Failed to delete item.';
        setLocalError(msg);
        if (onError) onError(msg);
      } finally {
        setDeleting(false);
        setIsAnimating(false);
      }
    }, totalAnimTime);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 min-h-[32px]',
    md: 'px-3.5 py-1.5 text-xs gap-2 min-h-[38px]',
    lg: 'px-4 py-2.5 text-sm gap-2.5 min-h-[44px]',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-block text-left">
      {/* Local Error Alert Badge */}
      {localError && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-64 p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-[11px] text-rose-200 font-semibold shadow-xl backdrop-blur-md text-center leading-tight pointer-events-none"
          >
            ⚠️ {localError}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Main Animated Button */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || deleting}
        animate={
          isShakingBlocked
            ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={`relative inline-flex items-center justify-center font-bold rounded-xl border border-rose-500/30 dark:border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:border-rose-500/50 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        {/* Trash Can Icon */}
        <motion.div
          key={impactCount}
          animate={
            impactCount > 0
              ? {
                  scale: [1, 1.3, 0.9, 1.15, 1],
                  rotate: [0, -14, 14, -6, 0],
                  y: [0, -3, 0],
                }
              : {}
          }
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 flex items-center justify-center"
        >
          <svg
            className={`${iconSizes[size]} fill-none stroke-current`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </motion.div>

        {/* Flying Letters Container */}
        <div className="relative flex items-center gap-[1px]">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              animate={
                isAnimating
                  ? {
                      x: -(index + 1) * 14,
                      y: [-2, -18, 4],
                      rotate: [0, -25 - index * 10, 60],
                      scale: [1, 1.1, 0.2],
                      opacity: [1, 0.9, 0],
                    }
                  : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
              }
              transition={
                isAnimating
                  ? {
                      delay: index * 0.09,
                      duration: 0.35,
                      ease: [0.32, 0, 0.67, 0],
                    }
                  : { duration: 0.2 }
              }
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Loading Spinner Overlay when Deleting */}
        {deleting && (
          <div className="absolute inset-0 bg-rose-950/80 flex items-center justify-center rounded-xl z-20">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-left relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl flex-shrink-0">
                  🗑️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{confirmTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">Action confirmation</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {confirmMessage}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
