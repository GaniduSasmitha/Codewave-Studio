import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';

interface Profile {
  full_name: string;
  role: string;
}

interface Order {
  id: string;
  customer_id: string;
  package: string;
  price: number;
  status: string;
  created_at: string;
  profiles?: Profile | Profile[]; // Handle single object or array depending on query parser
}

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  pending_verification: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  verified: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20"
};

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort state
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const fetchAllOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles:customer_id (full_name, role)');

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching admin orders list:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Realtime change received for admin:', payload);
          fetchAllOrders(true); // silent fetch on update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter and Sort logic
  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Sort by selection
    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, sortBy]);

  return (
    <div className="space-y-8 text-left pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white">All Client Orders</h1>
        <p className="text-slate-400 mt-2">Manage customer transactions, view payments, and advance active scopes.</p>
      </div>

      {/* Filters and Sorting Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row justify-between gap-4 border border-white/5 bg-slate-900/10" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
          </select>
        </div>
      </GlassCard>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollReveal>
          {/* Card Layout for Mobile */}
          <div className="md:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <GlassCard className="p-6 text-center text-slate-500" hoverEffect={false}>
                No orders match the selected filters.
              </GlassCard>
            ) : (
              filteredOrders.map((order) => {
                let clientName = "Unknown Client";
                if (order.profiles) {
                  const prof = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                  clientName = prof?.full_name || "Unknown Client";
                }
                return (
                  <GlassCard key={order.id} className="p-5 border border-white/5 bg-slate-900/10 space-y-4" hoverEffect={false}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{clientName}</h4>
                        <span className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8)}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        statusColors[order.status] || "bg-slate-500/10 text-slate-400"
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-b border-slate-800/60 py-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Package</span>
                        <span className="font-semibold text-slate-300">{planNames[order.package] || "Custom Project"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Price</span>
                        <span className="font-bold text-white">${order.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-mono">{new Date(order.created_at).toLocaleDateString()}</span>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-xs text-accent hover:underline border border-slate-800 hover:bg-slate-950 px-4 py-2 rounded font-bold min-h-[44px] flex items-center justify-center"
                      >
                        Manage
                      </Link>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-slate-950/20 backdrop-blur-lg border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Plan Package</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      let clientName = "Unknown Client";
                      if (order.profiles) {
                        const prof = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                        clientName = prof?.full_name || "Unknown Client";
                      }

                      return (
                        <tr key={order.id} className="hover:bg-slate-900/10 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{clientName}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">#{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 font-semibold text-slate-300">
                            {planNames[order.package] || "Custom Project"}
                          </td>
                          <td className="px-6 py-4 font-bold text-white">${order.price}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              statusColors[order.status] || "bg-slate-500/10 text-slate-400"
                            }`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-xs text-accent hover:underline border border-slate-800 hover:bg-slate-950 px-3 py-1 rounded font-bold"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
