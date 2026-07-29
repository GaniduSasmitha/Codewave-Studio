import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';

interface Order {
  id: string;
  package: string;
  price: number;
  status: string;
  created_at: string;
}

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Metrics
  const [stats, setStats] = useState({
    total: 0,
    pendingVerification: 0,
    verified: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, package, price, status, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const orderList = data || [];
        setOrders(orderList);

        // Aggregate statistics
        const total = orderList.length;
        const pendingVerification = orderList.filter((o) => o.status === 'pending_verification').length;
        
        // Count verified, in_progress, and completed as verified
        const verified = orderList.filter((o) => 
          ['verified', 'in_progress', 'completed'].includes(o.status)
        ).length;

        // Sum prices for non-cancelled and non-rejected projects for revenue
        const revenue = orderList
          .filter((o) => o.status !== 'cancelled' && o.status !== 'rejected')
          .reduce((acc, curr) => acc + Number(curr.price), 0);

        setStats({ total, pendingVerification, verified, revenue });
      } catch (err) {
        console.error('Error loading admin dashboard details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">Oversee client orders, verify payments, and advance project statuses.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Summary Stat Tiles */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <GlassCard className="p-6 border border-white/5 bg-slate-900/10" hoverEffect={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</h3>
              <p className="text-4xl font-extrabold text-white mt-3 font-mono">{stats.total}</p>
            </GlassCard>

            <GlassCard className="p-6 border border-white/5 bg-slate-900/10" hoverEffect={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Verification</h3>
              <p className="text-4xl font-extrabold text-accent mt-3 font-mono">{stats.pendingVerification}</p>
            </GlassCard>

            <GlassCard className="p-6 border border-white/5 bg-slate-900/10" hoverEffect={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payments Verified</h3>
              <p className="text-4xl font-extrabold text-primary mt-3 font-mono">{stats.verified}</p>
            </GlassCard>

            <GlassCard className="p-6 border border-white/5 bg-slate-900/10" hoverEffect={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</h3>
              <p className="text-4xl font-extrabold text-emerald-400 mt-3 font-mono">${stats.revenue}</p>
            </GlassCard>
          </div>

          {/* Recent Orders Showcase */}
          <GlassCard className="p-6 border border-white/5 bg-slate-900/10" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6">
              <SectionHeading
                title="Recent Project"
                gradientWord="Requests"
                subtitle="Actions pending verification or recent updates."
              />
              <Link to="/admin/orders" className="text-sm font-semibold text-accent hover:underline mb-8">
                View All Orders →
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-slate-500 text-center py-12 text-sm">No client project orders found.</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-4 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-white">{planNames[order.package] || "Custom Project"}</p>
                      <p className="text-xs text-slate-500 mt-1">ID: #{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-semibold">${order.price}</span>
                      <span className="text-xs text-slate-500 font-mono hidden md:block">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-xs text-accent hover:underline border border-slate-800 hover:bg-slate-950 px-3 py-1 rounded font-bold"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
