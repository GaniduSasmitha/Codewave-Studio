import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="py-20 max-w-md mx-auto px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-white">
        Create <span className="gradient-brand bg-clip-text text-transparent">Account</span>
      </h1>
      <p className="mt-4 text-slate-400">
        Sign up to start tracking your digital project orders.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="mt-8 space-y-6">
        <div>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary"
            placeholder="Email address"
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
