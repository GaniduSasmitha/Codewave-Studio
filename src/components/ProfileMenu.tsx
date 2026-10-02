import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

// A stable set of vivid background colors for avatars, deterministically picked
// from the first char of the display name so the same user always gets the same color.
const AVATAR_COLORS = [
  '#0B132B', // Deep Navy
  '#D4AF37', // Royal Gold
  '#131B2E', // Navy Surface
  '#F3C623', // Vibrant Gold
  '#1E3A5F', // Royal Blue
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

interface UserAvatarProps {
  src: string | null;
  displayName: string;
  initial: string;
  bgColor: string;
  sizeClass?: string;
  ringClass?: string;
}

function UserAvatar({
  src,
  displayName,
  initial,
  bgColor,
  sizeClass = 'w-8 h-8 text-sm',
  ringClass = 'ring-2 ring-[#CBD5E1] dark:ring-[#1E3A5F]',
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const showImg = Boolean(src && !imgError);

  return (
    <span
      className={`${sizeClass} ${ringClass} rounded-full flex items-center justify-center font-bold text-[#F9E79F] flex-shrink-0 overflow-hidden relative transition-all duration-200`}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      {showImg ? (
        <img
          src={src!}
          alt={displayName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        initial
      )}
    </span>
  );
}

interface ProfileMenuProps {
  /** Extra className applied to the root wrapper */
  className?: string;
  /** Rendering style: 'desktop' for dropdown popover, 'mobile' for inline menu block */
  variant?: 'desktop' | 'mobile';
  /** Optional callback fired when an item (like Sign Out) is clicked */
  onItemClick?: () => void;
}

export default function ProfileMenu({ className = '', variant = 'desktop', onItemClick }: ProfileMenuProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open && variant === 'desktop') {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, variant]);

  useEffect(() => {
    let active = true;
    const loadAvatar = async () => {
      if (!profile?.avatar_path) {
        setAvatarSrc(null);
        return;
      }
      const { data, error } = await supabase.storage
        .from('avatars')
        .createSignedUrl(profile.avatar_path, 60 * 60);
      if (active) setAvatarSrc(error ? null : data.signedUrl);
    };
    void loadAvatar();
    return () => { active = false; };
  }, [profile?.avatar_path]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open && variant === 'desktop') document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, variant]);

  if (!user) return null;

  const displayName = profile?.full_name || user.email || 'User';
  const email = user.email || '';
  const role = profile?.role || 'customer';
  const roleLabel = role === 'admin' ? 'Admin' : 'Customer';
  const avatarInitial = getInitial(displayName);
  const avatarBg = getAvatarColor(displayName);

  const handleSignOut = async () => {
    setOpen(false);
    if (onItemClick) onItemClick();
    await signOut();
    navigate('/');
  };

  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* User Info Header Block */}
        <div className="p-3.5 rounded-xl border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/90 dark:bg-[#131B2E] backdrop-blur-sm flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar
              src={avatarSrc}
              displayName={displayName}
              initial={avatarInitial}
              bgColor={avatarBg}
              sizeClass="w-10 h-10 text-base"
              ringClass="ring-2 ring-[#CBD5E1] dark:ring-[#1E3A5F]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0B132B] dark:text-[#F9E79F] truncate">
                {displayName}
              </p>
              <p className="text-xs text-[#1E3A5F] dark:text-[#8496B8] truncate mt-0.5">{email}</p>
            </div>
          </div>
          {/* Role badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide flex-shrink-0 ${role === 'admin'
                ? 'bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] ring-1 ring-[#D4AF37]/50'
                : 'bg-[#1E3A5F]/20 text-[#1E3A5F] dark:text-[#F9E79F] ring-1 ring-[#1E3A5F]/50'
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-[#D4AF37]' : 'bg-[#1E3A5F]'}`}
              aria-hidden="true"
            />
            {roleLabel}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          id="profile-menu-signout"
          onClick={handleSignOut}
          className="w-full text-center text-sm font-medium border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 py-3 px-4 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
        >
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
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Avatar trigger button */}
      <button
        id="profile-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Open profile menu for ${displayName}`}
        className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 group cursor-pointer"
      >
        {/* Circular avatar */}
        <UserAvatar
          src={avatarSrc}
          displayName={displayName}
          initial={avatarInitial}
          bgColor={avatarBg}
          sizeClass="w-8 h-8 text-sm"
          ringClass="ring-2 ring-transparent group-hover:ring-primary/40"
        />

        {/* Name — hidden on mobile */}
        <span className="hidden sm:block text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] max-w-[140px] truncate group-hover:text-primary dark:group-hover:text-accent transition-colors">
          {profile?.full_name || email}
        </span>

        {/* Chevron */}
        <svg
          className={`hidden sm:block w-3.5 h-3.5 text-[#8496B8] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
            className="absolute right-0 top-full mt-2.5 w-64 origin-top-right rounded-xl border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/95 dark:bg-[#131B2E] backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-4 border-b border-[#CBD5E1] dark:border-[#1E3A5F]">
              <div className="flex items-center gap-3">
                <UserAvatar
                  src={avatarSrc}
                  displayName={displayName}
                  initial={avatarInitial}
                  bgColor={avatarBg}
                  sizeClass="w-10 h-10 text-base"
                  ringClass="ring-2 ring-[#CBD5E1] dark:ring-[#1E3A5F]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0B132B] dark:text-[#F9E79F] truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-[#1E3A5F] dark:text-[#8496B8] truncate mt-0.5">{email}</p>
                </div>
              </div>

              {/* Role badge */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${role === 'admin'
                      ? 'bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] ring-1 ring-[#D4AF37]/50'
                      : 'bg-[#1E3A5F]/20 text-[#1E3A5F] dark:text-[#F9E79F] ring-1 ring-[#1E3A5F]/50'
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-[#D4AF37]' : 'bg-[#1E3A5F]'}`}
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
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-150 cursor-pointer"
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
