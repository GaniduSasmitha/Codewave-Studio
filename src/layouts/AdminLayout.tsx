import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-black text-slate-900">A</span>
            <span>Admin Console</span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link to="/admin" className="hover:text-accent transition-colors">Dashboard</Link>
            <Link to="/admin/orders" className="hover:text-accent transition-colors">Orders</Link>
          </nav>
          <div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium border border-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-hidden">
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
