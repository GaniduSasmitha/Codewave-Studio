import { Link } from 'react-router-dom';

export default function OrderStatus() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Order Status</h1>
        <Link to="/portal" className="text-sm text-primary hover:underline font-semibold">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">E-Commerce Website</h2>
            <p className="text-sm text-slate-500 mt-1">Order #ORD-0847</p>
          </div>
          <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            In Progress
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-white">Milestones</h3>
          <div className="relative pl-6 border-l border-slate-800 space-y-6">
            <div className="relative">
              <span className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></span>
              <p className="text-white font-medium">Design Completed</p>
              <p className="text-xs text-slate-500">July 25, 2026</p>
            </div>
            <div className="relative">
              <span className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background animate-pulse"></span>
              <p className="text-white font-medium">Development Phase</p>
              <p className="text-xs text-slate-400">Currently in coding phase</p>
            </div>
            <div className="relative">
              <span className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-800 ring-4 ring-background"></span>
              <p className="text-slate-500 font-medium">Verification & Deployment</p>
              <p className="text-xs text-slate-600">Pending development completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
