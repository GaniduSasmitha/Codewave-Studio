import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Client Dashboard</h1>
        <p className="text-slate-400 mt-2">Manage your current orders and request new services.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-xl font-bold text-white">Active Orders</h2>
          <div className="mt-4 divide-y divide-slate-800">
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-white">E-Commerce Website</p>
                <p className="text-xs text-slate-500">Order ID: #ORD-0847</p>
              </div>
              <Link
                to="/portal/order-status"
                className="text-sm text-primary hover:underline font-semibold"
              >
                View Status
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Need a new service?</h2>
            <p className="text-slate-400 text-sm mt-2">
              Launch another custom project, design sprint, or optimization package with us.
            </p>
          </div>
          <Link
            to="/portal/new-order"
            className="mt-6 inline-block bg-primary hover:bg-primary/95 text-white font-medium text-center py-2.5 rounded-lg transition-colors"
          >
            Start a New Project Order
          </Link>
        </div>
      </div>
    </div>
  );
}
