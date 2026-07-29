import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/portal" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center font-black text-slate-900">C</span>
            <span>Client Portal</span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link to="/portal" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/portal/new-order" className="hover:text-primary transition-colors">New Order</Link>
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}
