import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Hero3D from '../../components/Hero3D';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
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

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  pending_verification: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  verified: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  rejected: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
};

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom WebGL App",
  maintenance: "Active Maintenance"
};

const steps = [
  { id: "pending_payment", label: "Pending Payment" },
  { id: "pending_verification", label: "Pending Verification" },
  { id: "verified", label: "Payment Verified" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" }
];

const packages = [
  { id: "starter", name: "Starter Package", price: 499, desc: "Sleek lead generation presence." },
  { id: "business", name: "Business Suite", price: 999, desc: "Portal integration and backends." },
  { id: "custom", name: "Custom WebGL App", price: 1999, desc: "Immersive 3D interactive web." },
  { id: "maintenance", name: "Active Maintenance", price: 99, desc: "Server safety updates." }
];

const testimonials = [
  {
    text: "Codewave transformed our legacy dashboard into a beautiful, lightning-fast 3D product catalog. Our conversion rate increased by 40%!",
    author: "Sarah Jenkins",
    role: "VP of Product, Acme Corp"
  },
  {
    text: "The glassmorphic layouts, micro-animations, and overall dark theme design guidelines matched our branding perfectly. An absolute work of art.",
    author: "Michael Chang",
    role: "Co-Founder, Fintech Lab"
  },
  {
    text: "Professional WebGL interactive developers. They took our complex wireframes and converted them into high-fidelity fluid motion states on time.",
    author: "Elena Rostova",
    role: "Technical Lead, Cyberdyne Systems"
  }
];

const features = [
  {
    title: "Lightning Performance",
    desc: "Built on top of Vite and highly optimized custom React components. Score 100 on Google PageSpeed out of the box.",
    icon: "⚡"
  },
  {
    title: "Immersive 3D Elements",
    desc: "Interactive low-poly WebGL shapes and 3D product views custom-crafted using React Three Fiber and GSAP animations.",
    icon: "📦"
  },
  {
    title: "Secure & Scalable",
    desc: "Complete database operations, authentication routines, and secure file uploads handled via Supabase API engines.",
    icon: "🔒"
  },
  {
    title: "Responsive Design",
    desc: "Curated dark mode colors, glassmorphic blur overlays, and responsive mobile grids that look stunning on any resolution.",
    icon: "📱"
  }
];

const previewProjects = [
  {
    title: "Metaverse Showroom",
    category: "3D Interaction / WebGL",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Nova Fintech Suite",
    category: "SaaS App / Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // New Order states
  const [newOrderStep, setNewOrderStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [selectedPrice, setSelectedPrice] = useState(499);
  const [businessName, setBusinessName] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [description, setDescription] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const fetchOrders = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoadingOrders(true);
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
      if (!silent) setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'customer') {
      fetchOrders();
    }
  }, [user, profile]);

  useEffect(() => {
    if (!user || profile?.role !== 'customer') return;

    const channel = supabase
      .channel('customer-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime change received for customer:', payload);
          fetchOrders(true); // silent fetch on changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const handleSelectPackage = (pkgId: string, price: number) => {
    setSelectedPackage(pkgId);
    setSelectedPrice(price);
    setNewOrderStep(2);
  };

  const handleNextStep = () => {
    if (newOrderStep === 2) {
      if (!businessName.trim() || !description.trim()) {
        setOrderError('Please fill in both Business Name and Project Description.');
        return;
      }
      setOrderError('');
    }
    setNewOrderStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setOrderError('');
    setNewOrderStep((prev) => prev - 1);
  };

  const handleCreateOrder = async () => {
    if (!user) return;
    setSubmittingOrder(true);
    setOrderError('');

    const requirements = {
      businessName,
      preferredDomain,
      description
    };

    try {
      const { error } = await supabase.from('orders').insert({
        customer_id: user.id,
        package: selectedPackage,
        price: selectedPrice,
        requirements: JSON.stringify(requirements),
        status: 'pending_payment'
      });

      if (error) throw error;
      
      // Reset form states
      setNewOrderOpen(false);
      setNewOrderStep(1);
      setSelectedPackage('starter');
      setSelectedPrice(499);
      setBusinessName('');
      setPreferredDomain('');
      setDescription('');
      
      // Refresh orders list
      fetchOrders();
    } catch (err: any) {
      console.error('Error creating order:', err);
      setOrderError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };



  useEffect(() => {
    if (window.location.hash === '#orders-dashboard') {
      const el = document.getElementById('orders-dashboard');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 border border-primary/30 px-3.5 py-1.5 rounded-full bg-primary/5 backdrop-blur text-xs font-semibold text-accent uppercase tracking-wider">
            <span>✨ Code meets Craft</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your <br />
            <span className="gradient-brand bg-clip-text text-transparent">Digital Wave</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
            We build immersive 3D experiences, stunning interfaces, and high-performance applications custom tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user && profile?.role === 'customer' ? (
              <AnimatedButton
                onClick={() => document.getElementById('orders-dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                variant="primary"
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </AnimatedButton>
            ) : (
              <>
                <AnimatedButton onClick={() => navigate('/pricing')} variant="primary" className="w-full sm:w-auto">
                  Get a Website
                </AnimatedButton>
                <AnimatedButton onClick={() => navigate('/portfolio')} variant="glass" className="w-full sm:w-auto">
                  View Our Work
                </AnimatedButton>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center relative">
          <div className="absolute -inset-4 gradient-brand opacity-10 blur-3xl pointer-events-none"></div>
          <Hero3D />
        </div>
      </section>

      {/* Customer Dashboard Section */}
      {user && profile?.role === 'customer' && (
        <section id="orders-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Client Dashboard</h2>
              <p className="text-slate-400 mt-2 text-sm font-medium">Manage your current orders and request new services directly.</p>
            </div>
            <AnimatedButton onClick={() => { setNewOrderOpen(true); setNewOrderStep(1); setOrderError(''); }} variant="primary" className="py-2.5 px-6 cursor-pointer">
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
              <AnimatedButton onClick={() => { setNewOrderOpen(true); setNewOrderStep(1); setOrderError(''); }} variant="primary" className="mt-8 mx-auto px-8 cursor-pointer">
                Create Order
              </AnimatedButton>
            </GlassCard>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {orders.map((order) => {
                // Parse requirements JSON
                let requirements = { businessName: '', preferredDomain: '', description: '' };
                try {
                  requirements = JSON.parse(order.requirements);
                } catch (e) {
                  requirements.description = order.requirements;
                }
                const isExpanded = expandedOrder === order.id;
                const currentStepIndex = steps.findIndex((s) => s.id === order.status);

                return (
                  <GlassCard
                    key={order.id}
                    className={`flex flex-col justify-between border border-white/5 bg-slate-900/10 hover:border-primary/20 transition-all duration-300 ${
                      isExpanded ? "md:col-span-2 lg:col-span-3 border-primary/20 bg-slate-950/40" : ""
                    }`}
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
                          {requirements.businessName || planNames[order.package] || "Custom Project"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Package: {planNames[order.package] || "Custom Build"}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-2">
                          ${order.price}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details and Timeline */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-6 animate-fade-in text-left">
                        {/* Timeline */}
                        <div className="bg-slate-950/40 p-6 rounded-xl border border-white/5">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Project Timeline</h4>
                          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
                            {/* Connector Line for Desktop */}
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-10 hidden md:block">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                              ></div>
                            </div>

                            {steps.map((step, idx) => {
                              const isCompleted = idx < currentStepIndex;
                              const isActive = idx === currentStepIndex;
                              return (
                                <div key={step.id} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all duration-300 ${
                                      isCompleted ? "bg-primary border-primary text-white" :
                                      isActive ? "bg-background border-accent text-accent ring-2 ring-accent/30 animate-pulse" :
                                      "bg-slate-950 border-slate-800 text-slate-600"
                                    }`}
                                  >
                                    {isCompleted ? "✓" : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      isActive ? "text-accent font-bold" : isCompleted ? "text-slate-300" : "text-slate-500"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Domain & Requirements details */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 text-xs">
                          <div>
                            <span className="text-slate-500 font-semibold uppercase tracking-wider block">Preferred Domain</span>
                            <span className="text-white mt-1 block font-medium">{requirements.preferredDomain || "None specified"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold uppercase tracking-wider block">Project Description</span>
                            <p className="text-slate-300 mt-1.5 p-3 bg-slate-950/60 rounded border border-white/5 leading-relaxed whitespace-pre-wrap">
                              {requirements.description}
                            </p>
                          </div>
                        </div>

                        {/* Slip Upload Inline within expanded card */}
                        {['pending_payment', 'pending_verification', 'rejected'].includes(order.status) && (
                          <div className="pt-4 border-t border-slate-800/60 max-w-xl">
                            <SlipUpload
                              orderId={order.id}
                              userId={user.id}
                              orderStatus={order.status}
                              slipUrl={order.slip_url}
                              onUploadSuccess={() => fetchOrders(true)}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="text-xs text-accent hover:underline font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? "Collapse Timeline" : "Track Progress"}</span>
                        <span>{isExpanded ? "↑" : "→"}</span>
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* New Order Modal */}
          <AnimatePresence>
            {newOrderOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8 text-left"
                >
                  <button
                    onClick={() => setNewOrderOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-2 focus:outline-none cursor-pointer"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white">Create a New Project</h3>
                    <p className="text-slate-400 text-xs mt-1">Request your design and development setup in a few quick steps.</p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                    <span className={newOrderStep === 1 ? "text-accent font-extrabold" : newOrderStep > 1 ? "text-primary" : ""}>1. Select Plan</span>
                    <span className="text-slate-700">|</span>
                    <span className={newOrderStep === 2 ? "text-accent font-extrabold" : newOrderStep > 2 ? "text-primary" : ""}>2. Requirements</span>
                    <span className="text-slate-700">|</span>
                    <span className={newOrderStep === 3 ? "text-accent font-extrabold" : ""}>3. Review & Submit</span>
                  </div>

                  {orderError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold leading-relaxed">
                      ⚠️ {orderError}
                    </div>
                  )}

                  {/* Step 1: Package Selection */}
                  {newOrderStep === 1 && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-1">
                      {packages.map((pkg) => (
                        <GlassCard
                          key={pkg.id}
                          onClick={() => handleSelectPackage(pkg.id, pkg.price)}
                          className="p-5 cursor-pointer border border-white/5 bg-slate-950/20 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="text-base font-bold text-white">{pkg.name}</h4>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{pkg.desc}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center">
                            <span className="text-lg font-black text-white">${pkg.price}</span>
                            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Select →</span>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Requirements */}
                  {newOrderStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-1">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">Selected plan:</span>
                        <span className="text-xs font-bold text-white bg-slate-950/60 border border-white/5 px-2.5 py-1 rounded">
                          {packages.find(p => p.id === selectedPackage)?.name} (${selectedPrice})
                        </span>
                      </div>

                      <div>
                        <label htmlFor="businessName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Business Name
                        </label>
                        <input
                          id="businessName"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="e.g. Acme Corporation"
                        />
                      </div>

                      <div>
                        <label htmlFor="preferredDomain" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Preferred Domain
                        </label>
                        <input
                          id="preferredDomain"
                          type="text"
                          value={preferredDomain}
                          onChange={(e) => setPreferredDomain(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="e.g. acme.com (optional)"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Project Description / Design Notes
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary transition-colors h-24"
                          placeholder="Explain preferred colors, required views, WebGL elements, and integrations..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-800/60">
                        <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-full sm:w-1/2 py-2.5 cursor-pointer">
                          Back to Plans
                        </AnimatedButton>
                        <AnimatedButton onClick={handleNextStep} variant="primary" className="w-full sm:w-1/2 py-2.5 cursor-pointer">
                          Review Summary
                        </AnimatedButton>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Confirm */}
                  {newOrderStep === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Review Order Details</h4>

                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold uppercase tracking-wider block">Selected Package</span>
                          <span className="text-white font-bold block mt-0.5">{packages.find(p => p.id === selectedPackage)?.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold uppercase tracking-wider block">Cost</span>
                          <span className="text-white font-bold block mt-0.5">${selectedPrice}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold uppercase tracking-wider block">Business Name</span>
                          <span className="text-white font-bold block mt-0.5">{businessName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold uppercase tracking-wider block">Preferred Domain</span>
                          <span className="text-white font-bold block mt-0.5">{preferredDomain || "None provided"}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-slate-500 font-semibold uppercase tracking-wider block text-xs">Design Notes & Scope</span>
                        <p className="text-slate-300 text-xs mt-1.5 bg-slate-950/60 p-3 rounded border border-white/5 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/60">
                        <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-full sm:w-1/2 py-2.5 cursor-pointer">
                          Back to Edit
                        </AnimatedButton>
                        <AnimatedButton
                          onClick={handleCreateOrder}
                          variant="primary"
                          disabled={submittingOrder}
                          className="w-full sm:w-1/2 py-2.5 cursor-pointer"
                        >
                          {submittingOrder ? "Submitting Order..." : "Confirm & Submit"}
                        </AnimatedButton>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Why Trust Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            title="Why Partner With"
            gradientWord="Codewave?"
            subtitle="We blend state-of-the-art technologies with award-winning design aesthetics."
            align="center"
          />
        </ScrollReveal>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-slate-900 font-bold mb-6 text-xl">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Condensed Portfolio Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            title="Featured"
            gradientWord="Showcase"
            subtitle="Explore a handpicked preview of our premium design layouts."
          />
          <Link
            to="/portfolio"
            className="text-sm font-semibold text-accent hover:underline mb-8 md:mb-0 flex items-center gap-1.5 self-start md:self-auto"
          >
            Explore Full Portfolio <span>→</span>
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
          {previewProjects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <GlassCard hoverEffect={false} className="group overflow-hidden p-0 relative rounded-2xl border border-white/5 bg-slate-950/20">
                <div className="aspect-video w-full overflow-hidden relative">
                  {/* Subtle placeholder fallback for images using absolute overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-primary/20 z-0"></div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-6xl tracking-widest select-none z-0 opacity-20">
                    CODEWAVE
                  </div>
                </div>
                <div className="p-6 bg-slate-950/40 backdrop-blur border-t border-white/5 relative z-20">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <SectionHeading
            title="Client"
            gradientWord="Feedback"
            subtitle="Hear directly from business owners who partnered with us."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-12 relative">
          <GlassCard className="min-h-[220px] flex flex-col justify-between relative overflow-hidden" hoverEffect={false}>
            <div className="absolute top-6 left-6 text-7xl font-serif text-primary/10 select-none">“</div>
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg md:text-xl text-slate-200 leading-relaxed italic"
                >
                  {testimonials[activeTestimonial].text}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-6">
              <div>
                <h4 className="font-bold text-white">{testimonials[activeTestimonial].author}</h4>
                <p className="text-xs text-slate-500">{testimonials[activeTestimonial].role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-lg border border-slate-800 hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <GlassCard className="relative overflow-hidden p-12 text-center border border-primary/20 bg-gradient-to-tr from-slate-950 to-primary/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to Start Your Project?</h2>
            <p className="mt-4 max-w-xl mx-auto text-slate-400">
              Let's craft an industry-leading digital presence custom tailored to your business rules.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <AnimatedButton onClick={() => navigate('/contact')} variant="primary" className="w-full sm:w-auto">
                Get Started Today
              </AnimatedButton>
              <AnimatedButton onClick={() => navigate('/pricing')} variant="glass" className="w-full sm:w-auto">
                Compare Packages
              </AnimatedButton>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
}
