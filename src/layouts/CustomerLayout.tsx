import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';

export default function CustomerLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-[#0B132B] text-[#0B132B] dark:text-[#F9E79F] flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/90 dark:bg-[#0B132B]/90 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/portal">
            <Logo size="md" subtitle="Client Portal" />
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/portal" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/portal/new-order" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">New Order</Link>
          </nav>

          {/* Desktop profile menu */}
          <div className="hidden md:flex items-center gap-3">
            <ProfileMenu />
          </div>

          {/* Mobile menu toggle and profile menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <ProfileMenu />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1E3A5F] dark:text-[#8496B8] hover:text-primary dark:hover:text-[#F9E79F] focus:outline-none p-2"
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
              <div className="flex flex-col space-y-2">
                <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40">Dashboard</Link>
                <Link to="/portal/new-order" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary py-2.5">New Order</Link>
              </div>

              <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#1E3A5F]">
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
