import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import SlipUpload from '../../components/SlipUpload';

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
}

const steps = [
  { id: "pending_payment", label: "Pending Payment" },
  { id: "pending_verification", label: "Pending Verification" },
  { id: "verified", label: "Payment Verified" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" }
];

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrderDetails = async (silent = false) => {
    if (!id) return;
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setErrorMsg(err.message || 'Failed to retrieve order details.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`order-timeline-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Realtime timeline update received:', payload);
          fetchOrderDetails(true); // silent fetch on update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50svh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <GlassCard className="p-12 text-center border border-white/5 bg-slate-900/10 max-w-xl mx-auto mt-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white">Order not found</h3>
        <p className="text-slate-400 text-sm mt-2">
          {errorMsg || "We couldn't retrieve the requested order details. Please verify your portal link."}
        </p>
        <Link
          to="/portal"
          className="mt-8 inline-block bg-primary hover:bg-primary/95 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Back to Dashboard
        </Link>
      </GlassCard>
    );
  }

  // Parse requirements JSON
  let requirements = { businessName: '', preferredDomain: '', description: '' };
  try {
    requirements = JSON.parse(order.requirements);
  } catch (e) {
    requirements.description = order.requirements;
  }

  // Map 'rejected' status back to step 0 ("Pending Payment") so timeline shows Pending Payment as active
  const isRejected = order.status === 'rejected';
  const currentStepIndex = (order.status === 'pending_payment' || isRejected)
    ? 0
    : steps.findIndex((s) => s.id === order.status);

  return (
    <div className="max-w-3xl mx-auto text-left space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/portal" className="text-xs text-accent hover:underline font-bold uppercase tracking-wider">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mt-2">Track Project Progress</h1>
        </div>
        <div className="flex items-center gap-2">
          {isRejected && (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Receipt Rejected
            </span>
          )}
          <span className="text-xs font-mono text-slate-500 bg-slate-950/60 border border-white/5 px-3 py-1 rounded">
            ID: {order.id.slice(0, 8)}...
          </span>
        </div>
      </div>

      {/* Visual Stepper */}
      <GlassCard className="p-8 border border-white/5 bg-slate-900/10" hoverEffect={false}>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-8">Project Timeline</h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
          {/* Connector Line for Desktop */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-10 hidden md:block">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {steps.map((step, idx) => {
            const isCompleted = !isRejected && idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                    isActive && isRejected ? "bg-red-500/20 border-red-500 text-red-400 ring-2 ring-red-500/30 animate-pulse" :
                    isCompleted ? "bg-primary border-primary text-white" :
                    isActive ? "bg-background border-accent text-accent ring-2 ring-accent/30 animate-pulse" :
                    "bg-slate-950 border-slate-800 text-slate-600"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isActive && isRejected ? "text-red-400 font-bold" :
                    isActive ? "text-accent font-bold" : isCompleted ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Persistent Rejected Warning Message in Timeline */}
        {isRejected && (
          <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <span className="text-lg">⚠️</span>
              <span>Payment Receipt Rejected — Action Required</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Your previously submitted payment slip was reviewed and rejected by our team. Please upload a clear photo or PDF of your payment receipt below to re-initiate payment verification.
            </p>
          </div>
        )}
      </GlassCard>

      {/* Details Card */}
      <GlassCard className="p-8 border border-white/5 bg-slate-900/10 space-y-6 animate-fade-in" hoverEffect={false}>
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{requirements.businessName || "Project Order"}</h2>
            <p className="text-xs text-slate-500 mt-1">Package: {planNames[order.package] || "Custom Build"}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Total Price</span>
            <span className="text-xl font-bold text-white">${order.price}</span>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-sm">
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
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Project Description</span>
          <p className="text-slate-300 text-xs mt-2 bg-slate-950/60 p-4 rounded border border-white/5 leading-relaxed whitespace-pre-wrap">
            {requirements.description}
          </p>
        </div>
      </GlassCard>

      {/* Slip Upload Wrapper */}
      {['pending_payment', 'pending_verification', 'rejected'].includes(order.status) && user && (
        <div className="animate-fade-in">
          <SlipUpload
            orderId={order.id}
            userId={user.id}
            orderStatus={order.status}
            slipUrl={order.slip_url}
            onUploadSuccess={() => fetchOrderDetails(true)}
          />
        </div>
      )}
    </div>
  );
}
