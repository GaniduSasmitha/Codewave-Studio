import { useParams, Link } from 'react-router-dom';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/orders" className="text-sm text-accent hover:underline font-semibold">
            ← Back to Orders List
          </Link>
          <h1 className="text-3xl font-bold text-white mt-2">Manage Order {id}</h1>
        </div>
        <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Active
        </span>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">E-Commerce Website</h2>
          <p className="text-sm text-slate-500 mt-1">Requested by Acme Corp on July 25, 2026</p>
        </div>

        <div className="grid gap-6 grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Service Plan</h3>
            <p className="text-white mt-1">Custom Web Application</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pricing Tier</h3>
            <p className="text-white mt-1">Professional Plan ($198/mo)</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Requirements</h3>
          <p className="text-slate-300 mt-2 text-sm">
            High performance React frontend with Supabase backend database, tailwind dark theme default, and GSAP/Framer motion custom interactive micro-animations.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex gap-4">
          <button
            onClick={() => alert('Order Marked as Complete')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Mark Complete
          </button>
          <button
            onClick={() => alert('Order Cancelled/Archived')}
            className="border border-slate-800 hover:bg-slate-900 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Archive Order
          </button>
        </div>
      </div>
    </div>
  );
}
