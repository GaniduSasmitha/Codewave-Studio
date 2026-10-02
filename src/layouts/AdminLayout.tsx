import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

interface AdminNotification {
  id: string;
  title: string;
  subject: string;
  preview: string;
  to: string;
  kind: 'message' | 'order';
}

const planNames: Record<string, string> = {
  starter: 'Starter Package',
  business: 'Business Suite',
  custom: 'Custom Web App',
  maintenance: 'Maintenance & Support'
};

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [notification, setNotification] = useState<AdminNotification | null>(null);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (!error && count !== null) {
        setUnreadMessageCount(count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchUnreadOrderCount = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .eq('deleted_by_admin', false);

      if (!error && count !== null) setUnreadOrderCount(count);
    } catch (err) {
      console.error('Error fetching unread order count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadOrderCount();

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
            const message = payload.new as { id: string; name: string; message: string };
            setNotification({
              id: message.id,
              title: 'New message received',
              subject: message.name,
              preview: message.message,
              to: '/admin/messages',
              kind: 'message'
            });
          }
        }
      )
      .subscribe();

    const orderChannel = supabase
      .channel('admin-nav-order-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          fetchUnreadOrderCount();

          if (payload.eventType === 'INSERT') {
            const order = payload.new as { id: string; package: string; price: number };
            setNotification({
              id: order.id,
              title: 'New project received',
              subject: planNames[order.package] || 'Custom Project',
              preview: `Order #${order.id.slice(0, 8)} · $${order.price}`,
              to: `/admin/orders/${order.id}`,
              kind: 'order'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(orderChannel);
    };
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-[#0B132B] text-[#0B132B] dark:text-[#F9E79F] flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/90 dark:bg-[#0B132B]/90 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin">
            <Logo size="md" subtitle="Admin Console" />
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <Link to="/admin" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/admin/orders" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1.5">
              <span>Orders</span>
              {unreadOrderCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 animate-pulse">{unreadOrderCount}</span>
              )}
            </Link>
            <Link to="/admin/messages" className="text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1.5">
              <span>Messages</span>
              {unreadMessageCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/50 animate-pulse">
                  {unreadMessageCount}
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
                <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40 flex items-center justify-between">
                  <span>Orders</span>
                  {unreadOrderCount > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40">{unreadOrderCount} unread</span>}
                </Link>
                <Link to="/admin/messages" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#1E3A5F] dark:text-[#F9E79F] hover:text-primary dark:hover:text-accent py-2.5 border-b border-[#CBD5E1] dark:border-[#1E3A5F]/40 flex items-center justify-between">
                  <span>Messages</span>
                  {unreadMessageCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/50">
                      {unreadMessageCount} unread
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
        {notification && (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={notification.kind === 'order' ? 'M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM8 7h8M2 12h20' : 'M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z'} />
                </svg>
              </div>

              <Link
                to={notification.to}
                onClick={() => setNotification(null)}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#725700] dark:text-[#F3C623]">{notification.title}</p>
                <p className="mt-1 truncate text-sm font-bold text-[#0B132B] dark:text-white">{notification.subject}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#405678] dark:text-[#D7DEEC]">{notification.preview}</p>
                <p className="mt-2 text-xs font-semibold text-[#725700] dark:text-[#F3C623]">View {notification.kind} →</p>
              </Link>

              <button
                type="button"
                onClick={() => setNotification(null)}
                className="rounded-md p-1 text-[#8496B8] transition-colors hover:bg-slate-100 hover:text-[#0B132B] dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Dismiss new message notification"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <motion.div
              key={notification.id}
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
