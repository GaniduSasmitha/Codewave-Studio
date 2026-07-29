import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (role: 'customer' | 'admin') => {
    localStorage.setItem('user_role', role);
    localStorage.setItem('isAuthenticated', 'true');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/portal');
    }
  };

  return (
    <div className="py-20 max-w-md mx-auto px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-white">
        Log <span className="gradient-brand bg-clip-text text-transparent">In</span>
      </h1>
      <p className="mt-4 text-slate-400">
        Choose your role to test the protected routes setup.
      </p>
      <div className="mt-8 space-y-4">
        <button
          onClick={() => handleLogin('customer')}
          className="w-full bg-primary hover:bg-primary/95 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Log in as Client (Portal)
        </button>
        <button
          onClick={() => handleLogin('admin')}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Log in as Administrator
        </button>
      </div>
    </div>
  );
}
