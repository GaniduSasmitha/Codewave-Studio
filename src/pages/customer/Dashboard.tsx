import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

interface Order {
  id: string;
  customer_id: string;
  package: string;
  price: number;
  requirements: string;
  status: string;
  slip_url: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  pending_verification: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  verified: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
};

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your current orders and request new services.</p>
        </div>
        <AnimatedButton onClick={() => navigate('/portal/new-order')} variant="primary" className="py-2.5 px-6">
          + New Project Order
        </AnimatedButton>
      </div>

      {loadingOrders ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <GlassCard className="p-12 text-center border border-white/5 bg-slate-900/10 max-w-xl mx-auto mt-8">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-white">No active orders</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            You don't have any custom design or development orders. Start your first project now.
          </p>
          <AnimatedButton onClick={() => navigate('/portal/new-order')} variant="primary" className="mt-8 mx-auto px-8">
            Create Order
          </AnimatedButton>
        </GlassCard>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {orders.map((order) => (
            <GlassCard
              key={order.id}
              className="flex flex-col justify-between border border-white/5 bg-slate-900/10 hover:border-primary/20 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    statusColors[order.status] || "bg-slate-500/10 text-slate-400"
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {planNames[order.package] || "Custom Project"}
                  </h3>
                  <p className="text-sm font-semibold text-slate-300 mt-2">
                    ${order.price}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <Link
                  to={`/portal/order/${order.id}`}
                  className="text-xs text-accent hover:underline font-bold tracking-wider uppercase flex items-center justify-between"
                >
                  <span>Track Progress</span>
                  <span>→</span>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
