import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import SocialLinks from '../components/SocialLinks';
import CookieConsent from '../components/CookieConsent';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-[#0B132B] text-[#0B132B] dark:text-[#F9E79F] flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/90 dark:bg-[#0B132B]/90 backdrop-blur sticky top-0 z-50 transition-colors duration-300 relative">
        {/* Ambient Radial Gradient Glow behind Header */}
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 blur-2xl pointer-events-none opacity-80 dark:opacity-60 overflow-hidden" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Nav Links with 3D Flip & Layered Text Glow */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative py-1 group inline-block"
                  style={{ perspective: '300px', transformStyle: 'preserve-3d' }}
                >
                  <motion.span
                    className={`inline-block transition-colors duration-250 ${
                      isActive
                        ? 'text-[#725700] dark:text-accent font-bold'
                        : 'text-[#1E3A5F] dark:text-[#F9E79F]/80 group-hover:text-primary dark:group-hover:text-accent'
                    }`}
                    style={{
                      textShadow: isActive
                        ? '0 0 10px rgba(212, 175, 55, 0.8), 0 0 22px rgba(243, 198, 35, 0.6)'
                        : undefined,
                    }}
                    whileHover={{
                      rotateX: -12,
                      scale: 1.06,
                      y: -1,
                      textShadow: isActive
                        ? '0 0 14px rgba(212, 175, 55, 0.95), 0 0 26px rgba(243, 198, 35, 0.8)'
                        : '0 0 8px rgba(212, 175, 55, 0.6), 0 0 18px rgba(243, 198, 35, 0.45)',
                    }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Active Link Indicator Underline + Royal Gold Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px_rgba(212,175,55,0.9)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Desktop auth area */}
          <div className="hidden md:flex items-center space-x-4">
            {user && profile?.role === 'customer' ? (
              <>
                <Link
                  to="/#orders-dashboard"
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('orders-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors"
                >
                  My Orders
                </Link>
                <ProfileMenu />
              </>
            ) : user && profile?.role === 'admin' ? (
              <>
                <Link to="/admin" className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">
                  Admin Dashboard
                </Link>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">Log in</Link>
                <Link to="/signup" className="text-sm font-bold gradient-brand text-[#0B132B] px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02]">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle and profile menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            {user && <ProfileMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1E3A5F] dark:text-[#8496B8] hover:text-primary dark:hover:text-[#F9E79F] focus:outline-none p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden border-b border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/95 dark:bg-[#0B132B]/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-1.5">
                {navItems.map((item) => {
                  const isActive = isPathActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between active:scale-[0.98] ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-l-4 border-primary dark:border-accent text-[#725700] dark:text-accent font-bold shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]'
                          : 'text-[#1E3A5F] dark:text-[#F9E79F] hover:bg-[#CBD5E1]/50 dark:hover:bg-[#131B2E] hover:text-primary dark:hover:text-accent'
                      }`}
                      style={{
                        textShadow: isActive
                          ? '0 0 10px rgba(212, 175, 55, 0.6), 0 0 18px rgba(243, 198, 35, 0.4)'
                          : undefined,
                      }}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#D4AF37]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#1E3A5F] flex flex-col gap-3">
                {user ? (
                  <>
                    {profile?.role === 'customer' ? (
                      <Link
                        to="/#orders-dashboard"
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          if (location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('orders-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-center text-sm font-medium text-[#0B132B] dark:text-[#F9E79F] py-3 rounded-lg border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#CBD5E1]/30 hover:bg-[#CBD5E1]/60 dark:bg-[#131B2E] dark:hover:bg-[#131B2E]/80 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        My Orders
                      </Link>
                    ) : profile?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center text-sm font-medium text-[#0B132B] dark:text-[#F9E79F] py-3 rounded-lg border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#CBD5E1]/30 hover:bg-[#CBD5E1]/60 dark:bg-[#131B2E] dark:hover:bg-[#131B2E]/80 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-sm font-medium text-[#0B132B] dark:text-[#F9E79F] py-3 rounded-lg border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#CBD5E1]/30 hover:bg-[#CBD5E1]/60 dark:bg-[#131B2E] dark:hover:bg-[#131B2E]/80 transition-colors min-h-[44px] flex items-center justify-center">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center text-sm font-bold gradient-brand text-[#0B132B] py-3 rounded-lg transition-colors min-h-[44px] flex items-center justify-center">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer
        className={`relative z-20 border-t py-10 transition-colors duration-300 ${
          location.pathname === '/'
            ? 'border-[#CBD5E1] bg-[#E2E8F0] dark:border-[#20292D] dark:bg-[#0A0F12]'
            : 'border-[#CBD5E1] bg-[#E2E8F0] dark:border-[#1E3A5F] dark:bg-[#070D1D]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-7 text-sm text-[#405678] dark:text-[#B7C4DC] md:grid-cols-3 md:items-start">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" showText={true} />
            <p>© {new Date().getFullYear()} Codewave Studio. All rights reserved.</p>
          </div>
          <div className="text-center md:text-left">
            <p className="font-bold text-[#0B132B] dark:text-[#F9E79F]">Codewave Studio</p>
            <a className="mt-2 block underline hover:text-[#725700] dark:hover:text-[#F3C623]" href="mailto:codewave.studio.tech@gmail.com">codewave.studio.tech@gmail.com</a>
            <p className="mt-1">Sri Lanka</p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
              <Link className="hover:text-[#725700] hover:underline dark:hover:text-[#F3C623]" to="/privacy">Privacy</Link>
              <Link className="hover:text-[#725700] hover:underline dark:hover:text-[#F3C623]" to="/terms">Terms</Link>
              <Link className="hover:text-[#725700] hover:underline dark:hover:text-[#F3C623]" to="/refund-policy">Refunds</Link>
              <Link className="hover:text-[#725700] hover:underline dark:hover:text-[#F3C623]" to="/cookies">Cookies</Link>
            </nav>
            <SocialLinks />
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
