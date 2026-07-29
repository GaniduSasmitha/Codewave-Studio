import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center font-black text-slate-900">C</span>
            <span>Codewave Studio</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 py-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Codewave Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
