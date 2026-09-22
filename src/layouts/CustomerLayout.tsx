import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

export default function CustomerLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/portal">
            <Logo size="md" subtitle="Client Portal" />
          </Link>
          
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/portal" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/portal/new-order" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">New Order</Link>
          </nav>
          
          {/* Desktop: Theme toggle & profile menu */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu />
          </div>

          {/* Mobile Menu Toggle & Theme Toggle & Profile Menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <ProfileMenu />
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
                <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 border-b border-slate-200/60 dark:border-slate-800/40">Dashboard</Link>
                <Link to="/portal/new-order" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5">New Order</Link>
              </div>

              {/* Theme Toggle in Mobile Menu */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle showLabel={true} />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
