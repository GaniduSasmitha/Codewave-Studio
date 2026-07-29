import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

const planNames: Record<string, string> = {
  starter: "Starter Package ($499)",
  business: "Business Suite ($999)",
  custom: "Custom WebGL App ($1999)",
  maintenance: "Active Maintenance ($99/mo)"
};

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') || '';

  const { signUp, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    const { error } = await signUp(email, password, fullName);
    if (error) {
      setErrorMsg(error.message || 'Failed to sign up. Please try again.');
    } else {
      setSuccessMsg('Account created! Please check your email to confirm registration, then log in.');
    }
  };

  return (
    <div className="py-20 max-w-md mx-auto px-4 text-left">
      <GlassCard className="p-8 border border-white/5 bg-slate-900/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Get Started</h1>
          <p className="text-slate-400 text-xs mt-2">Create your account to initiate your project.</p>
        </div>

        {packageId && planNames[packageId] && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/25 text-xs text-slate-300 font-semibold leading-relaxed">
            Selected Plan: <span className="text-accent font-bold">{planNames[packageId]}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold leading-relaxed">
            ✔ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Your full name"
            />
          </div>

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
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </AnimatedButton>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-semibold">
            Log In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
