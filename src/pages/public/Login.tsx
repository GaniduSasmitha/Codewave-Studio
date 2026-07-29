import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="py-20 max-w-md mx-auto px-4 text-left">
      <GlassCard className="p-8 border border-white/5 bg-slate-900/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-xs mt-2">Sign in to manage your website projects.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <AnimatedButton type="submit" variant="primary" disabled={loading} className="w-full py-3">
            {loading ? 'Signing In...' : 'Sign In'}
          </AnimatedButton>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent hover:underline font-semibold">
            Create Account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
