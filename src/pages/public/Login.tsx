import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import Logo from '../../components/Logo';
import AuthMascotsPanel from '../../components/AuthMascotsPanel';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') || '';

  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else if (packageId) {
        navigate(`/?package=${packageId}#orders-dashboard`);
      } else {
        navigate('/');
      }
    }
  }, [user, profile, packageId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const { error } = await signIn(cleanEmail, cleanPassword);
    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Single Unified Master Glass Card */}
      <GlassCard className="p-0 border border-[#E3D5C5] dark:border-[#54281B] bg-white/90 dark:bg-[#150C0C]/90 shadow-2xl backdrop-blur-2xl rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[560px]">
          {/* Left/Top Column: Animated Mascots Stage */}
          <div className="lg:col-span-6 bg-[#150C0C]/95 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E3D5C5] dark:border-[#54281B] flex flex-col justify-center p-2 sm:p-4 lg:p-6">
            <AuthMascotsPanel />
          </div>

          {/* Right/Bottom Column: Auth Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white/50 dark:bg-[#34150F]/40 backdrop-blur-xl">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#34150F] dark:text-[#EACEAA]">Welcome Back</h1>
              <p className="text-[#54281B] dark:text-[#B58E78] text-xs mt-2">Sign in to manage your website projects.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#54281B] dark:text-[#EACEAA] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 bg-[#F8F3ED] dark:bg-[#150C0C] border border-[#E3D5C5] dark:border-[#54281B] rounded-xl text-sm text-[#34150F] dark:text-[#EACEAA] focus:outline-none focus:border-[#85431E] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-[#54281B] dark:text-[#EACEAA] uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 bg-[#F8F3ED] dark:bg-[#150C0C] border border-[#E3D5C5] dark:border-[#54281B] rounded-xl text-sm text-[#34150F] dark:text-[#EACEAA] focus:outline-none focus:border-[#85431E] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <AnimatedButton type="submit" variant="primary" disabled={loading} className="w-full py-3 cursor-pointer rounded-xl">
                {loading ? 'Signing In...' : 'Sign In'}
              </AnimatedButton>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full border-t border-[#E3D5C5] dark:border-[#54281B]"></div>
              <span className="relative bg-[#F8F3ED] dark:bg-[#34150F] backdrop-blur-md px-3 text-xs text-[#85431E] dark:text-[#B58E78] font-semibold uppercase tracking-wider">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#F8F3ED] hover:bg-[#E3D5C5] dark:bg-[#34150F] dark:hover:bg-[#54281B] text-[#34150F] dark:text-[#EACEAA] font-semibold rounded-xl text-sm transition-all duration-200 shadow-sm border border-[#E3D5C5] dark:border-[#54281B] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="mt-6 text-center text-xs text-[#54281B] dark:text-[#B58E78] font-medium">
              Don't have an account?{' '}
              <Link to={`/signup${packageId ? `?package=${packageId}` : ''}`} className="text-[#85431E] dark:text-[#D39858] hover:underline font-bold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
