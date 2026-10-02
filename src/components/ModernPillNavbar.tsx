import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu';
import SocialLinks from './SocialLinks';

const navItems = [
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const mobileNavItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/services', label: 'Services', icon: 'code' },
  { path: '/portfolio', label: 'Portfolio', icon: 'portfolio' },
  { path: '/pricing', label: 'Pricing', icon: 'pricing' },
  { path: '/about', label: 'About', icon: 'about' },
  { path: '/contact', label: 'Contact', icon: 'contact' },
];

export default function ModernPillNavbar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isPathActive = (path: string) => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

        {/* Left Logo Container: Emblem Circle + Codewave Studio Name */}
        <Link
          to="/"
          onClick={handleLogoClick}
          data-cursor-text="Home"
          className="relative flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full bg-[#131B2E]/90 hover:bg-[#18233C] border border-[#D4AF37]/35 transition-all duration-300 hover:scale-[1.02] active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C623] shadow-sm"
          aria-label="Codewave Studio Home"
        >
          {/* Inner White Emblem Circle */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0B132B] shadow-md transition-transform duration-300 group-hover:rotate-12">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0B132B] text-[#F3C623]">
              <svg
                className="w-3.5 h-3.5 text-[#F3C623]"
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
          </div>

          {/* Brand Name Text */}
          <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-1 select-none pr-0.5">
            Codewave<span className="text-[#F3C623] font-bold">Studio</span>
          </span>
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
                className={`relative px-4 py-2 text-sm font-semibold transition-colors rounded-full ${isActive
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
        <div className="hidden lg:flex items-center gap-2">
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
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="group flex h-11 w-12 flex-col items-end justify-center gap-[5px] rounded-full border border-[#D4AF37]/35 bg-[#161D2B] px-2.5 text-white shadow-sm transition-all hover:border-[#F3C623] hover:bg-[#1C2541] cursor-pointer"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            <span className="h-[3px] w-7 rounded-full bg-[#F9E79F] transition-colors group-hover:bg-[#F3C623]" />
            <span className="h-[3px] w-7 rounded-full bg-[#F9E79F] transition-colors group-hover:bg-[#F3C623]" />
            <span className="h-[3px] w-4 rounded-full bg-[#F9E79F] transition-colors group-hover:bg-[#F3C623]" />
          </button>
        </div>
      </div>

      {/* Mobile left-side drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 h-full w-full bg-[#070D1D]/70 backdrop-blur-[3px] cursor-default"
            />

            <motion.aside
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 left-0 flex w-[88vw] max-w-[400px] flex-col overflow-y-auto border-r border-[#D4AF37]/35 bg-[#0B132B] text-[#F9E79F] shadow-[22px_0_70px_rgba(0,0,0,0.55)]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1E3A5F] bg-[#0B132B]/95 px-5 py-5 backdrop-blur-xl">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3" aria-label="Codewave Studio Home">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#131B2E] text-[#F3C623] shadow-md">
                    <MobileNavIcon name="code" className="h-5 w-5" />
                  </span>
                  <span className="text-base font-extrabold tracking-tight text-white">
                    Codewave<span className="text-[#F3C623]">Studio</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1E3A5F] bg-[#131B2E] text-[#F9E79F] transition-colors hover:border-[#D4AF37] hover:text-[#F3C623] cursor-pointer"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 flex-col px-5 py-6">
                <nav aria-label="Mobile navigation" className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const isActive = isPathActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`relative flex min-h-14 items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${isActive
                            ? 'bg-[#D4AF37]/18 text-[#F3C623] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)]'
                            : 'text-[#F9E79F] hover:bg-[#131B2E] hover:text-[#F3C623]'
                          }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isActive && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-[#F3C623]" />}
                        <MobileNavIcon name={item.icon} className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-3 flex min-h-14 items-center gap-4 rounded-2xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 px-4 py-3.5 text-sm font-bold text-[#F3C623] transition-all hover:bg-[#D4AF37]/20"
                    >
                      <MobileNavIcon name="admin" className="h-5 w-5 shrink-0" />
                      <span>Admin Portal</span>
                      <span className="ml-auto rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0B132B]">Admin</span>
                    </Link>
                  )}

                  {profile?.role === 'customer' && (
                    <Link
                      to="/#orders-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-3 flex min-h-14 items-center gap-4 rounded-2xl border border-[#1E3A5F] bg-[#131B2E] px-4 py-3.5 text-sm font-bold text-[#F9E79F] transition-all hover:border-[#D4AF37]/50 hover:text-[#F3C623]"
                    >
                      <MobileNavIcon name="orders" className="h-5 w-5 shrink-0" />
                      <span>My Orders</span>
                    </Link>
                  )}
                </nav>

                <div className="my-6 h-px bg-[#1E3A5F]" />

                <div className="space-y-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8496B8]">Contact Codewave</p>
                  <a
                    href="tel:+94717441420"
                    className="flex items-center gap-3 rounded-2xl border border-[#1E3A5F] bg-[#131B2E] px-4 py-3.5 text-sm font-semibold text-[#F9E79F] transition-colors hover:border-[#D4AF37]/50 hover:text-[#F3C623]"
                  >
                    <MobileNavIcon name="phone" className="h-5 w-5 text-[#F3C623]" />
                    <span>+94 71 744 1420</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#1E3A5F] bg-[#131B2E] px-4 py-3.5 text-left text-xs font-semibold text-[#F9E79F] transition-colors hover:border-[#D4AF37]/50 hover:text-[#F3C623] cursor-pointer"
                  >
                    <MobileNavIcon name="email" className="h-5 w-5 shrink-0 text-[#F3C623]" />
                    <span className="truncate">{copiedEmail ? 'Email copied!' : 'codewave.studio.tech@gmail.com'}</span>
                  </button>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8496B8]">Follow us</p>
                  <SocialLinks className="flex-wrap [&_a]:h-11 [&_a]:w-11 [&_a]:rounded-xl" />
                </div>

                <div className="mt-auto pt-7">
                  {user ? (
                    <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl border border-[#D4AF37]/40 px-4 py-3 text-center text-sm font-bold text-[#F9E79F] transition-colors hover:bg-[#131B2E]"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl bg-[#D4AF37] px-4 py-3 text-center text-sm font-bold text-[#0B132B] shadow-md transition-colors hover:bg-[#F3C623]"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6" /></>,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
    portfolio: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M8 6V4h8v2M3 11h18" /></>,
    pricing: <><path d="M12 2v20M17 6.5C17 4.57 14.76 3 12 3S7 4.57 7 6.5 9.24 10 12 10s5 1.57 5 3.5S14.76 17 12 17s-5-1.57-5-3.5" /></>,
    about: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-4 2.5-6 6-6s6 2 6 6M15 15c3 0 5 1.6 5 5" /></>,
    contact: <><path d="M4 4h16v14H7l-3 3V4Z" /><path d="m7 8 5 4 5-4" /></>,
    admin: <><path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></>,
    orders: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a15 15 0 0 0 5 5L15 13l5 2v4c0 1.1-.9 2-2 2C9.7 21 3 14.3 3 6c0-1.1.9-2 2-2Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
