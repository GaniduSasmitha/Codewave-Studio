import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="py-20 text-center max-w-md mx-auto px-4 flex flex-col items-center justify-center min-h-[60svh]">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-[#34150F] dark:text-[#EACEAA]">Access Denied</h1>
      <p className="mt-3 text-[#54281B] dark:text-[#B58E78] text-sm">
        You do not have the required permissions to view this page. Please log in with a different account.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="border border-[#E3D5C5] dark:border-[#54281B] bg-[#F8F3ED] dark:bg-[#34150F] hover:bg-[#E3D5C5] dark:hover:bg-[#54281B] text-[#34150F] dark:text-[#EACEAA] px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="bg-[#85431E] hover:bg-[#85431E]/90 text-[#EACEAA] px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
