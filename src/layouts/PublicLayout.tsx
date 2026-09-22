import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import SocialLinks from '../components/SocialLinks';

export default function PublicLayout() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/services" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Services</Link>
            <Link to="/portfolio" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/pricing" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Pricing</Link>
            <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Contact</Link>
          </nav>
          
          {/* Desktop: auth area & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
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
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  My Orders
                </Link>
                <ProfileMenu />
              </>
            ) : user && profile?.role === 'admin' ? (
              <>
                <Link to="/admin" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">Log in</Link>
                <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Theme Toggle & Profile Menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user && <ProfileMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none p-2"
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
              className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 border-b border-slate-200/60 dark:border-slate-800/40">Services</Link>
                <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 border-b border-slate-200/60 dark:border-slate-800/40">Portfolio</Link>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 border-b border-slate-200/60 dark:border-slate-800/40">Pricing</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 border-b border-slate-200/60 dark:border-slate-800/40">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5">Contact</Link>
              </div>

              {/* Theme Toggle in Mobile Menu */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle showLabel={true} />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
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
                        className="text-center text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        My Orders
                      </Link>
                    ) : profile?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center text-sm font-medium bg-primary hover:bg-primary/95 text-white py-3 rounded-lg transition-colors min-h-[44px] flex items-center justify-center">
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
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-slate-100/80 dark:bg-slate-950/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" showText={true} />
            <p>© {new Date().getFullYear()} Codewave Studio. All rights reserved.</p>
          </div>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
