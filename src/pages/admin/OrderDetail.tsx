import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Order {
  id: string;
  customer_id: string;
  package: string;
  price: number;
  requirements: string;
  status: string;
  slip_url: string | null;
  created_at: string;
  verified_at: string | null;
  verified_by: string | null;
  profiles?: Profile | Profile[];
}

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  pending_verification: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  verified: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20"
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedSlipUrl, setSignedSlipUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrderAndClient = async (silent = false) => {
    if (!id) return;
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles:customer_id (*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);

      if (data.slip_url) {
        await resolveSignedUrl(data.slip_url);
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setErrorMsg(err.message || 'Failed to retrieve order details.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const resolveSignedUrl = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('payment-slips')
        .createSignedUrl(path, 120); // 120 seconds expiry

      if (error) throw error;
      if (data) {
        setSignedSlipUrl(data.signedUrl);
      }
    } catch (err) {
      console.error('Error creating signed url:', err);
    }
  };

  useEffect(() => {
    fetchOrderAndClient();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`admin-order-detail-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Realtime change received for admin order detail:', payload);
          fetchOrderAndClient(true); // silent fetch on update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!id || !user) return;
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === 'verified') {
      updates.verified_at = new Date().toISOString();
      updates.verified_by = user.id;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSuccessMsg(`Order status successfully updated to "${newStatus.replace('_', ' ')}"!`);
      await fetchOrderAndClient();
    } catch (err: any) {
      console.error('Error updating status:', err);
      setErrorMsg(err.message || 'Failed to update order status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50svh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorMsg && !order) {
    return (
      <GlassCard className="p-12 text-center border border-white/5 bg-slate-900/10 max-w-xl mx-auto mt-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white">Order not found</h3>
        <p className="text-slate-400 text-sm mt-2">{errorMsg}</p>
        <Link
          to="/admin/orders"
          className="mt-8 inline-block bg-accent hover:bg-accent/90 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Back to Orders List
        </Link>
      </GlassCard>
    );
  }

  // Parse customer profile safely
  let clientProfile: Profile | null = null;
  if (order?.profiles) {
    clientProfile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
  }

  // Parse requirements JSON
  let requirements = { businessName: '', preferredDomain: '', description: '' };
  try {
    if (order) requirements = JSON.parse(order.requirements);
  } catch (e) {
    if (order) requirements.description = order.requirements;
  }

  const isPdf = order?.slip_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="max-w-6xl mx-auto text-left space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/orders" className="text-xs text-accent hover:underline font-bold uppercase tracking-wider">
            ← Back to Orders List
          </Link>
          <h1 className="text-3xl font-bold text-white mt-2">Manage Project Scope</h1>
        </div>
        <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
          order ? statusColors[order.status] || "bg-slate-500/10 text-slate-400" : ""
        }`}>
          {order?.status.replace(/_/g, ' ')}
        </span>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold leading-relaxed">
          ✔ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns - Client & Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer profile */}
            <GlassCard className="p-6 border border-white/5 bg-slate-900/10 space-y-4" hoverEffect={false}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Profile</h3>
              <div className="text-sm">
                <p className="text-lg font-bold text-white">{clientProfile?.full_name || "Unknown Customer"}</p>
                <p className="text-xs text-slate-400 mt-1">Profile User ID: #{order.customer_id}</p>
              </div>
            </GlassCard>

            {/* Scope sheet details */}
            <GlassCard className="p-6 border border-white/5 bg-slate-900/10 space-y-6" hoverEffect={false}>
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{requirements.businessName || "Project Details"}</h3>
                  <p className="text-xs text-slate-500 mt-1">Plan: {planNames[order.package] || "Custom Build"}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Total Price</span>
                  <span className="text-lg font-bold text-white">${order.price}</span>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Created Date</span>
                  <span className="text-white font-medium block mt-1">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Domain</span>
                  <span className="text-white font-medium block mt-1">{requirements.preferredDomain || "None specified"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Project Scope</span>
                <p className="text-slate-300 text-xs mt-2 bg-slate-950/60 p-4 rounded border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {requirements.description}
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Status Operations & Slip Viewer */}
          <div className="space-y-6">
            {/* Status transitions */}
            <GlassCard className="p-6 border border-white/5 bg-slate-900/10 space-y-4" hoverEffect={false}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verification Actions</h3>
              
              {/* Payment Verification Steps */}
              {order.status === 'pending_verification' && (
                <div className="flex gap-2">
                  <AnimatedButton
                    onClick={() => updateOrderStatus('verified')}
                    disabled={submitting}
                    variant="primary"
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Verify
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => updateOrderStatus('rejected')}
                    disabled={submitting}
                    variant="secondary"
                    className="w-1/2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                  >
                    Reject
                  </AnimatedButton>
                </div>
              )}

              {/* Advanced timelines */}
              {order.status === 'verified' && (
                <AnimatedButton
                  onClick={() => updateOrderStatus('in_progress')}
                  disabled={submitting}
                  variant="primary"
                  className="w-full"
                >
                  Start Development (In Progress)
                </AnimatedButton>
              )}

              {order.status === 'in_progress' && (
                <AnimatedButton
                  onClick={() => updateOrderStatus('completed')}
                  disabled={submitting}
                  variant="primary"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Complete Development
                </AnimatedButton>
              )}

              {/* Status information */}
              {['pending_payment', 'completed', 'cancelled', 'rejected'].includes(order.status) && (
                <p className="text-xs text-slate-500 italic">
                  {order.status === 'pending_payment' ? "Awaiting slip upload from customer." :
                   order.status === 'rejected' ? "Receipt rejected. Awaiting customer re-upload." :
                   order.status === 'completed' ? "Project completed successfully." :
                   "This order has been cancelled."}
                </p>
              )}
            </GlassCard>

            {/* Receipt Preview */}
            <GlassCard className="p-6 border border-white/5 bg-slate-900/10 space-y-4" hoverEffect={false}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Receipt</h3>
              {!order.slip_url ? (
                <div className="py-12 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-600">
                  No document uploaded by client.
                </div>
              ) : (
                <div className="space-y-4">
                  {isPdf ? (
                    <div className="p-4 border border-slate-800 rounded-lg text-center bg-slate-950/60">
                      <p className="text-xs text-slate-400 mb-4 font-semibold">📄 PDF Payment slip Document</p>
                      <a
                        href={signedSlipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-slate-800 hover:bg-slate-700 text-accent text-xs font-bold px-4 py-2 rounded border border-slate-700 transition-colors"
                      >
                        Open PDF in New Tab
                      </a>
                    </div>
                  ) : (
                    <div 
                      className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60 p-2 cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <img
                        src={signedSlipUrl}
                        alt="Receipt slip preview"
                        className="w-full max-h-[350px] object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {/* Modal for Slip Viewer */}
      {isModalOpen && signedSlipUrl && order && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] bg-slate-950 sm:bg-slate-900 border-0 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl p-4 overflow-hidden flex flex-col sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/85 mb-4 mt-2 sm:mt-0">
              <div>
                <h3 className="font-bold text-white text-base">Payment Receipt</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Order ID: #{order.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg min-h-[36px] flex items-center"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950/40 rounded-lg p-2">
              <img 
                src={signedSlipUrl} 
                alt="Receipt large view" 
                className="max-w-full max-h-[70vh] sm:max-h-[65vh] object-contain rounded" 
              />
            </div>
            <div className="pt-4 border-t border-slate-800/85 mt-4 text-center sm:hidden">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg min-h-[44px]"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
