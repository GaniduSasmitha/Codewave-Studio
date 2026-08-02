import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from '../components/ProfileMenu';
import Logo from '../components/Logo';

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
          
          {/* Desktop: auth area */}
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
                  className="text-sm font-medium hover:text-white transition-colors"
                >
                  My Orders
                </Link>
                <ProfileMenu />
              </>
            ) : user && profile?.role === 'admin' ? (
              <>
                <Link to="/admin" className="text-sm font-medium hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Log in</Link>
                <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Profile Menu */}
          <div className="flex md:hidden items-center gap-3">
            {user && <ProfileMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2"
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
              className="md:hidden border-b border-slate-800 bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white py-2.5 border-b border-slate-800/40">Services</Link>
                <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white py-2.5 border-b border-slate-800/40">Portfolio</Link>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white py-2.5 border-b border-slate-800/40">Pricing</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white py-2.5 border-b border-slate-800/40">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white py-2.5">Contact</Link>
              </div>
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
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
                        className="text-center text-sm font-medium hover:text-white py-3 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        My Orders
                      </Link>
                    ) : profile?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center text-sm font-medium hover:text-white py-3 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <ProfileMenu variant="mobile" onItemClick={() => setMobileMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-sm font-medium hover:text-white py-3 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center">
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
      <footer className="border-t border-slate-800 py-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Logo size="sm" showText={true} />
          <p>© {new Date().getFullYear()} Codewave Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
