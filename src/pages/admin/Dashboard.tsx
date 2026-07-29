import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">Oversee client orders, assign tasks, and monitor progress.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Orders</h3>
          <p className="text-4xl font-extrabold text-white mt-2">12</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Pending Approvals</h3>
          <p className="text-4xl font-extrabold text-accent mt-2">3</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">In Progress</h3>
          <p className="text-4xl font-extrabold text-primary mt-2">5</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recent Client Requests</h2>
          <Link to="/admin/orders" className="text-sm text-accent hover:underline font-semibold">
            View All Orders
          </Link>
        </div>
        <div className="divide-y divide-slate-800">
          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">E-Commerce Website</p>
              <p className="text-xs text-slate-500">Requested by client @ 2026-07-29</p>
            </div>
            <Link to="/admin/orders" className="text-sm border border-slate-800 hover:bg-slate-950 px-3 py-1 rounded-lg text-slate-300">
              Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
