import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import AuthMascotsPanel from '../../components/AuthMascotsPanel';
import GoogleSignInButton from '../../components/GoogleSignInButton';

const planNames: Record<string, string> = {
  starter: "Business Web (LKR 30,000)",
  business: "E-Commerce (LKR 70,000)",
  custom: "Web App (Starting at LKR 120,000)",
  maintenance: "Maintenance & Support (LKR 15,000/mo)"
};

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') || '';

  const { signUp, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [legalConsent, setLegalConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setSuccessMsg('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!legalConsent) {
      setErrorMsg('You must agree to the Privacy Policy and Terms of Service to create an account.');
      return;
    }

    if (cleanName.length > 100) {
      setErrorMsg('Full name cannot exceed 100 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const { error } = await signUp(cleanEmail, cleanPassword, cleanName);
    if (error) {
      setErrorMsg(error.message || 'Failed to sign up. Please try again.');
    } else {
      setSuccessMsg('Account created! Please check your email to confirm registration, then log in.');
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#0B132B] dark:text-[#F9E79F]">Get Started</h1>
              <p className="text-[#1E3A5F] dark:text-[#8496B8] text-xs mt-2">Create your account to initiate your project.</p>
            </div>

            {packageId && planNames[packageId] && (
              <div className="mb-6 p-4 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs text-[#0B132B] dark:text-[#F9E79F] font-semibold leading-relaxed">
                Selected Plan: <span className="text-[#725700] dark:text-[#F3C623] font-bold">{planNames[packageId]}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed">
                ✔ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 bg-[#F0F4F9] dark:bg-[#0B132B] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-xl text-sm text-[#0B132B] dark:text-[#F9E79F] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Your full name"
                />
              </div>

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
                <label htmlFor="password" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#F9E79F] uppercase tracking-wider">
                  Password
                </label>
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

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#1E3A5F] dark:text-[#D7DEEC]">
                <input
                  type="checkbox"
                  required
                  checked={legalConsent}
                  onChange={(e) => setLegalConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#8A6A00]"
                />
                <span>I agree to the <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link> and <Link to="/terms" className="font-semibold underline">Terms of Service</Link>.</span>
              </label>

              <AnimatedButton type="submit" variant="primary" disabled={loading} className="w-full py-3 cursor-pointer rounded-xl">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </AnimatedButton>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full border-t border-[#CBD5E1] dark:border-[#1E3A5F]"></div>
              <span className="relative bg-[#F0F4F9] dark:bg-[#131B2E] backdrop-blur-md px-3 text-xs text-[#0B132B] dark:text-[#8496B8] font-semibold uppercase tracking-wider">
                or
              </span>
            </div>

            {legalConsent ? (
              <GoogleSignInButton onError={setErrorMsg} />
            ) : (
              <button
                type="button"
                onClick={() => setErrorMsg('You must agree to the Privacy Policy and Terms of Service to continue with Google.')}
                className="w-full px-4 py-3 bg-[#F0F4F9] hover:bg-[#CBD5E1] dark:bg-[#131B2E] dark:hover:bg-[#1C2541] text-[#0B132B] dark:text-[#F9E79F] font-semibold rounded-xl text-sm transition-all duration-200 shadow-sm border border-[#CBD5E1] dark:border-[#1E3A5F] cursor-pointer"
              >
                Continue with Google
              </button>
            )}

            <div className="mt-6 text-center text-xs text-[#1E3A5F] dark:text-[#8496B8] font-medium">
              Already have an account?{' '}
              <Link to={`/login${packageId ? `?package=${packageId}` : ''}`} className="text-[#0B132B] dark:text-[#F3C623] hover:underline font-bold">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
