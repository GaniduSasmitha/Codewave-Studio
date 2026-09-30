import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function ModernPillNavbar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isPathActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('codewave.studio.tech@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 w-full">
      {/* Outer Floating Pill Container (Exact layout structure of Image 1) */}
      <div className="relative mx-auto flex h-[64px] max-w-5xl items-center justify-between rounded-full border border-white/15 dark:border-[#D4AF37]/35 bg-[#0D111A]/90 dark:bg-[#070D1D]/95 px-2 sm:px-3 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(212,175,55,0.12)] backdrop-blur-xl transition-all duration-300">
        
        {/* Left Circular Emblem Badge (Matching planet icon circle in Image 1) */}
        <Link
          to="/"
          data-cursor-text="Home"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0B132B] shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C623]"
          aria-label="Codewave Studio Home"
        >
          {/* Planet / Orbit Planet SVG emblem like in Image 1 */}
          <svg className="h-6 w-6 text-[#0B132B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="6" />
            <path d="M2.5 12a14.5 14.5 0 0 0 19 0" />
            <path d="M2.5 12a14.5 14.5 0 0 1 19 0" />
            <circle cx="17" cy="7" r="1.5" fill="currentColor" />
          </svg>
          <span className="sr-only">Codewave Studio</span>
        </Link>

        {/* Center Navigation Links (Matching Image 1 pill navbar tabs) */}
        <nav className="hidden lg:flex items-center gap-1.5 px-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = isPathActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                data-cursor-text="Go"
                className={`relative px-4 py-2 text-sm font-semibold transition-colors rounded-full ${
                  isActive
                    ? 'text-white dark:text-[#0B132B]'
                    : 'text-gray-300 hover:text-white dark:text-[#F9E79F]/80 dark:hover:text-[#F3C623]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pillActiveNav"
                    className="absolute inset-0 bg-[#222834] dark:bg-[#D4AF37] rounded-full shadow-[0_0_16px_rgba(212,175,55,0.3)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Pill Capsule (Matching Image 1 right white pill capsule) */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-[#171F30] border border-[#D4AF37]/30 pl-3 pr-1.5 py-1 rounded-full">
              {profile?.role === 'customer' ? (
                <Link
                  to="/#orders-dashboard"
                  className="text-xs font-bold text-[#F9E79F] hover:text-[#F3C623] transition-colors pr-1"
                >
                  My Orders
                </Link>
              ) : profile?.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="text-xs font-bold text-[#F9E79F] hover:text-[#F3C623] transition-colors pr-1"
                >
                  Admin Portal
                </Link>
              ) : null}
              <ProfileMenu />
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Image 1 style Email Pill CTA button */}
              <button
                onClick={handleCopyEmail}
                data-cursor-text={copiedEmail ? 'Copied' : 'Email'}
                title="Click to copy email address"
                className="relative flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0B132B] shadow-md transition-all duration-200 hover:bg-[#F9E79F] hover:shadow-lg active:scale-95 border border-white/20 cursor-pointer"
              >
                <svg className="h-3.5 w-3.5 text-[#0B132B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{copiedEmail ? 'Copied!' : 'codewave.studio.tech@gmail.com'}</span>
              </button>

              <Link
                to="/login"
                data-cursor-text="Login"
                className="rounded-full bg-[#182032] border border-white/10 px-3.5 py-2 text-xs font-bold text-gray-200 hover:text-white hover:border-[#D4AF37]/50 transition-colors"
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Bar Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {user && <ProfileMenu />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#161D2B] text-white transition-colors hover:border-[#F3C623] cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-4 right-4 top-[76px] z-50 mx-auto max-w-lg space-y-3 overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#070D1D]/98 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                const isActive = isPathActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0B132B] font-bold shadow-md'
                        : 'text-[#F9E79F] hover:bg-[#131B2E] hover:text-[#F3C623]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-[#0B132B]" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Contact & Auth CTA */}
            <div className="pt-3 border-t border-[#1E3A5F] flex flex-col gap-2.5">
              <button
                onClick={(e) => {
                  handleCopyEmail(e);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-[#0B132B] text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="h-4 w-4 text-[#0B132B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {copiedEmail ? 'Email Copied!' : 'codewave.studio.tech@gmail.com'}
              </button>

              {!user && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl border border-[#CBD5E1]/30 dark:border-[#1E3A5F] text-center text-xs font-bold text-[#F9E79F] hover:bg-[#131B2E]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl bg-[#D4AF37] text-center text-xs font-bold text-[#0B132B] shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
