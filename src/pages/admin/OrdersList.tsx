import { Link } from 'react-router-dom';

export default function OrdersList() {
  const orders = [
    { id: 'ORD-0847', name: 'E-Commerce Website', client: 'Acme Corp', status: 'In Progress', date: '2026-07-25' },
    { id: 'ORD-0848', name: 'UI/UX Design System', client: 'Beta LLC', status: 'Pending', date: '2026-07-28' },
    { id: 'ORD-0849', name: 'WebGL 3D Showroom', client: 'Cyberdyne', status: 'Completed', date: '2026-07-15' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">All Orders</h1>
      
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-900/20">
                <td className="px-6 py-4 font-mono text-slate-300">{order.id}</td>
                <td className="px-6 py-4 font-semibold text-white">{order.name}</td>
                <td className="px-6 py-4 text-slate-400">{order.client}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                    order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/admin/orders/${order.id}`} className="text-accent hover:underline font-semibold">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
