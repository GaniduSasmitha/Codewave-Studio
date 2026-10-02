import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import Logo from '../../components/Logo';
import AuthMascotsPanel from '../../components/AuthMascotsPanel';
import GoogleSignInButton from '../../components/GoogleSignInButton';

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

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Single Unified Master Glass Card */}
      <GlassCard className="p-0 border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#0B132B]/95 shadow-2xl backdrop-blur-2xl rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[560px]">
          {/* Left/Top Column: Animated Mascots Stage */}
          <div className="lg:col-span-6 bg-[#070D1D]/95 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#CBD5E1] dark:border-[#1E3A5F] flex flex-col justify-center p-2 sm:p-4 lg:p-6">
            <AuthMascotsPanel />
          </div>

          {/* Right/Bottom Column: Auth Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white/50 dark:bg-[#131B2E]/60 backdrop-blur-xl">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#0B132B] dark:text-[#F9E79F]">Welcome Back</h1>
              <p className="text-[#1E3A5F] dark:text-[#8496B8] text-xs mt-2">Sign in to manage your website projects.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-xl text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-xl text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <AnimatedButton type="submit" variant="primary" disabled={loading} className="w-full py-3 cursor-pointer rounded-xl">
                {loading ? 'Signing In...' : 'Sign In'}
              </AnimatedButton>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full border-t border-[#CBD5E1] dark:border-[#1E3A5F]"></div>
              <span className="relative bg-[#F0F4F9] dark:bg-[#131B2E] backdrop-blur-md px-3 text-xs text-[#0B132B] dark:text-[#8496B8] font-semibold uppercase tracking-wider">
                or
              </span>
            </div>

            <GoogleSignInButton onError={setErrorMsg} />

            <div className="mt-6 text-center text-xs text-[#1E3A5F] dark:text-[#8496B8] font-medium">
              Don't have an account?{' '}
              <Link to={`/signup${packageId ? `?package=${packageId}` : ''}`} className="text-[#0B132B] dark:text-[#F3C623] hover:underline font-bold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
