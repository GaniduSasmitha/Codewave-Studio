import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// A stable set of vivid background colors for avatars, deterministically picked
// from the first char of the display name so the same user always gets the same color.
const AVATAR_COLORS = [
  '#6366F1', // indigo
  '#22D3EE', // cyan
  '#F59E0B', // amber
  '#10B981', // emerald
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#F97316', // orange
  '#14B8A6', // teal
];

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

interface ProfileMenuProps {
  /** Extra className applied to the root wrapper */
  className?: string;
}

export default function ProfileMenu({ className = '' }: ProfileMenuProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!user) return null;

  const displayName = profile?.full_name || user.email || 'User';
  const email = user.email || '';
  const role = profile?.role || 'customer';
  const roleLabel = role === 'admin' ? 'Admin' : 'Customer';
  const avatarInitial = getInitial(displayName);
  const avatarBg = getAvatarColor(displayName);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Avatar trigger button */}
      <button
        id="profile-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group cursor-pointer"
      >
        {/* Circular avatar */}
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-200 flex-shrink-0"
          style={{ backgroundColor: avatarBg }}
          aria-hidden="true"
        >
          {avatarInitial}
        </span>

        {/* Name — hidden on mobile */}
        <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[140px] truncate group-hover:text-white transition-colors">
          {profile?.full_name || email}
        </span>

        {/* Chevron */}
        <svg
          className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4.293 5.293a1 1 0 011.414 0L8 7.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="profile-menu-dropdown"
            role="menu"
            aria-labelledby="profile-menu-trigger"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2.5 w-64 origin-top-right rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-4 border-b border-slate-800/70">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0 ring-2 ring-slate-700"
                  style={{ backgroundColor: avatarBg }}
                  aria-hidden="true"
                >
                  {avatarInitial}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
                </div>
              </div>

              {/* Role badge */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                    role === 'admin'
                      ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-cyan-400' : 'bg-indigo-400'}`}
                    aria-hidden="true"
                  />
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                id="profile-menu-signout"
                role="menuitem"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 cursor-pointer"
              >
                {/* Logout icon */}
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
