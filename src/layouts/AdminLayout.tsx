import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

interface IncomingMessageNotification {
  id: string;
  name: string;
  message: string;
}

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [incomingMessage, setIncomingMessage] = useState<IncomingMessageNotification | null>(null);

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
        (payload) => {
          fetchUnreadCount();

          if (payload.eventType === 'INSERT') {
            const message = payload.new as IncomingMessageNotification;
            setIncomingMessage({
              id: message.id,
              name: message.name,
              message: message.message
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!incomingMessage) return;

    const timeoutId = window.setTimeout(() => {
      setIncomingMessage(null);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [incomingMessage]);

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-[#0B132B] text-[#0B132B] dark:text-[#F9E79F] flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/90 dark:bg-[#0B132B]/90 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin">
            <Logo size="md" subtitle="Admin Console" />
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <Link to="/admin" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/admin/orders" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">Orders</Link>
            <Link to="/admin/messages" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1.5">
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/50 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/" className="text-[#8496B8] hover:text-primary dark:hover:text-accent transition-colors">Main Site</Link>
          </nav>

          {/* Desktop profile menu */}
          <div className="hidden md:flex items-center gap-3">
            {user && <ProfileMenu />}
          </div>

          {/* Mobile menu toggle and profile menu */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            {user && <ProfileMenu />}
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
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40">Dashboard</Link>
                <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40">Orders</Link>
                <Link to="/admin/messages" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40 flex items-center justify-between">
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/50">
                      {unreadCount} unread
                    </span>
                  )}
                </Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#8496B8] hover:text-accent py-2.5">Main Site</Link>
              </div>

              <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#1E3A5F]">
                {user && <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {incomingMessage && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed right-4 top-20 z-[60] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-xl border border-[#D4AF37]/60 bg-white shadow-2xl dark:bg-[#111C35]"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#725700] dark:text-[#F3C623]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                </svg>
              </div>

              <Link
                to="/admin/messages"
                onClick={() => setIncomingMessage(null)}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#725700] dark:text-[#F3C623]">New message received</p>
                <p className="mt-1 truncate text-sm font-bold text-[#0B132B] dark:text-white">{incomingMessage.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#405678] dark:text-[#D7DEEC]">{incomingMessage.message}</p>
                <p className="mt-2 text-xs font-semibold text-[#725700] dark:text-[#F3C623]">View message →</p>
              </Link>

              <button
                type="button"
                onClick={() => setIncomingMessage(null)}
                className="rounded-md p-1 text-[#8496B8] transition-colors hover:bg-slate-100 hover:text-[#0B132B] dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Dismiss new message notification"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <motion.div
              key={incomingMessage.id}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 8, ease: 'linear' }}
              className="h-1 origin-left bg-[#D4AF37]"
            />
          </motion.div>
        )}
      </AnimatePresence>
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
