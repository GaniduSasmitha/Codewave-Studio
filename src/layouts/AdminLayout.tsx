import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const channel = supabase
      .channel('admin-nav-unread-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3ED] dark:bg-[#150C0C] text-[#34150F] dark:text-[#EACEAA] flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-[#E3D5C5] dark:border-[#54281B] bg-[#F8F3ED]/90 dark:bg-[#150C0C]/90 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin">
            <Logo size="md" subtitle="Admin Console" />
          </Link>
          
          <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <Link to="/admin" className="text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/admin/orders" className="text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent transition-colors">Orders</Link>
            <Link to="/admin/messages" className="text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1.5">
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#85431E]/20 text-[#85431E] dark:text-[#D39858] border border-[#85431E]/40 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/" className="text-[#B58E78] hover:text-primary dark:hover:text-accent transition-colors">Main Site</Link>
          </nav>
          
          {/* Desktop: Theme toggle & profile menu */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user && <ProfileMenu />}
          </div>

          {/* Mobile Menu Toggle & Theme Toggle & Profile Menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user && <ProfileMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#54281B] dark:text-[#B58E78] hover:text-primary dark:hover:text-[#EACEAA] focus:outline-none p-2"
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
              className="md:hidden border-b border-[#E3D5C5] dark:border-[#54281B] bg-[#F8F3ED]/95 dark:bg-[#150C0C]/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#E3D5C5] dark:border-[#54281B]/40">Dashboard</Link>
                <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#E3D5C5] dark:border-[#54281B]/40">Orders</Link>
                <Link to="/admin/messages" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#54281B] dark:text-[#EACEAA] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#E3D5C5] dark:border-[#54281B]/40 flex items-center justify-between">
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#85431E]/20 text-[#85431E] dark:text-[#D39858] border border-[#85431E]/40">
                      {unreadCount} unread
                    </span>
                  )}
                </Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#B58E78] hover:text-accent py-2.5">Main Site</Link>
              </div>

              {/* Theme Toggle in Mobile Menu */}
              <div className="pt-2 border-t border-[#E3D5C5] dark:border-[#54281B] flex items-center justify-between">
                <span className="text-sm font-medium text-[#54281B] dark:text-[#B58E78]">Theme</span>
                <ThemeToggle showLabel={true} />
              </div>

              <div className="pt-3 border-t border-[#E3D5C5] dark:border-[#54281B]">
                {user && <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />}
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
