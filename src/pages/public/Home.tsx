import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Hero3D from '../../components/Hero3D';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import SlipUpload from '../../components/SlipUpload';
import AnimatedDeleteButton from '../../components/AnimatedDeleteButton';

import beadoriaImg from '../../assets/projects/beadoria.png';
import fitnessTrackerImg from '../../assets/projects/fitness-tracker.png';

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
  pending_payment: "bg-[#D4AF37]/15 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/40",
  pending_verification: "bg-[#D4AF37]/25 text-[#0B132B] dark:text-[#F3C623] border border-[#D4AF37]/50",
  verified: "bg-[#1E3A5F]/30 text-[#1E3A5F] dark:text-[#F9E79F] border border-[#1E3A5F]/50",
  in_progress: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  rejected: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
};

const planNames: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Suite",
  custom: "Custom Web App",
  maintenance: "Maintenance & Support"
};

const steps = [
  { id: "pending_payment", label: "Pending Payment" },
  { id: "pending_verification", label: "Pending Verification" },
  { id: "verified", label: "Payment Verified" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" }
];

const packages = [
  { id: "starter", name: "Starter Package", price: 79, desc: "Up to 5 pages, responsive design, contact form, 5-day delivery." },
  { id: "business", name: "Business Suite", price: 199, desc: "Up to 10 pages, CMS/blog, SEO setup, 10-day delivery." },
  { id: "custom", name: "Custom Web App", price: 399, desc: "Quote required. Full-stack web app, database, auth, admin dashboard, and custom scope." },
  { id: "maintenance", name: "Maintenance & Support", price: 15, desc: "Monthly monitoring, updates, and developer support." }
];

const features = [
  {
    title: "Lightning Performance",
    desc: "Built with modern React tooling and performance-conscious components tailored to each project.",
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
    title: "Beadoria",
    category: "E-COMMERCE / JEWELRY",
    link: "https://ganidusasmitha.github.io/Beadoria/",
    image: beadoriaImg
  },
  {
    title: "Personal Fitness Tracker",
    category: "SAAS APP / FITNESS",
    link: "https://personal-fitness-tracker-cyan.vercel.app/",
    image: fitnessTrackerImg
  }
];

// Staggered Entrance Animation Variants for Hero Title
const heroTitleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1
    }
  }
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // New Order states
  const [newOrderStep, setNewOrderStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [selectedPrice, setSelectedPrice] = useState(79);
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
      const visibleOrders = (data || []).filter((o: any) => o.deleted_by_user !== true);
      setOrders(visibleOrders);
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
          fetchOrders(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  // Handle URL package parameter to open order modal automatically
  useEffect(() => {
    const pkg = searchParams.get('package');
    if (user && profile?.role === 'customer' && pkg) {
      const match = packages.find((p) => p.id === pkg);
      if (match) {
        if (match.id === 'custom') {
          navigate('/contact?package=custom', { replace: true });
          return;
        }
        setSelectedPackage(match.id);
        setSelectedPrice(match.price);
        setNewOrderStep(2);
        setNewOrderOpen(true);
        setOrderError('');
        const el = document.getElementById('orders-dashboard');
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [user, profile, searchParams, navigate]);

  const handleSelectPackage = (pkgId: string, price: number) => {
    if (pkgId === 'custom') {
      setNewOrderOpen(false);
      navigate('/contact?package=custom');
      return;
    }
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
      setNewOrderStep(3);
    }
  };

  const handlePrevStep = () => {
    if (newOrderStep > 1) {
      setNewOrderStep(newOrderStep - 1);
      setOrderError('');
    }
  };

  const handleCreateOrder = async () => {
    if (!user) return;
    setSubmittingOrder(true);
    setOrderError('');

    try {
      const reqData = JSON.stringify({
        businessName: businessName.trim(),
        preferredDomain: preferredDomain.trim(),
        description: description.trim()
      });

      const { error } = await supabase.from('orders').insert({
        customer_id: user.id,
        package: selectedPackage,
        price: selectedPrice,
        requirements: reqData,
        status: 'pending_payment'
      });

      if (error) throw error;

      // Reset form states
      setNewOrderOpen(false);
      setNewOrderStep(1);
      setSelectedPackage('starter');
      setSelectedPrice(79);
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

  const handleDeleteOrder = async (order: Order) => {
    if (!['completed', 'cancelled', 'rejected'].includes(order.status)) {
      throw new Error('Cannot delete an order that is currently in progress.');
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ deleted_by_user: true })
      .eq('id', order.id)
      .select();

    if (error) throw new Error(error.message || 'Failed to delete order.');
    if (!data || data.length === 0) {
      throw new Error('Failed to delete order: database permission denied or order not found.');
    }

    setOrders((prev) => prev.filter((o) => o.id !== order.id));
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

  return (
    <div className="relative isolate overflow-hidden bg-[#F0F4F9] dark:bg-[#0A0F12]">
      <div className="relative z-10 space-y-32 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="relative z-10 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 border border-primary/30 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/5 backdrop-blur text-xs font-semibold text-[#725700] dark:text-accent uppercase tracking-wider">
            <span>✨ Code meets Craft</span>
          </div>

          {/* Hero Entrance Title Animation */}
          <motion.h1
            variants={heroTitleVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0B132B] dark:text-[#F9E79F] leading-tight"
          >
            <motion.span variants={wordVariants} className="inline-block">Elevate</motion.span>{' '}
            <motion.span variants={wordVariants} className="inline-block">Your</motion.span> <br />
            <motion.span variants={wordVariants} className="inline-block gradient-brand bg-clip-text text-transparent">
              Digital Wave
            </motion.span>
          </motion.h1>

          <p className="max-w-md text-lg text-[#1E3A5F] dark:text-[#8496B8] leading-relaxed">
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
        <div className="relative h-[340px] sm:h-[400px] lg:h-auto lg:min-h-[500px]">
          <Hero3D />
        </div>
      </section>

      {/* Customer Dashboard Section */}
      {user && profile?.role === 'customer' && (
        <section id="orders-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#CBD5E1] dark:border-[#1E3A5F] pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0B132B] dark:text-[#F9E79F] tracking-tight">Client Dashboard</h2>
              <p className="text-[#1E3A5F] dark:text-[#8496B8] mt-2 text-sm font-medium">Manage your current orders and request new services directly.</p>
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
            <GlassCard className="p-12 text-center border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/80 dark:bg-[#131B2E]/80 max-w-xl mx-auto mt-8">
              <div className="text-4xl mb-4">📂</div>
              <h3 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F]">No active orders</h3>
              <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm mt-2 max-w-sm mx-auto">
                You don't have any custom design or development orders. Start your first project now.
              </p>
              <AnimatedButton onClick={() => { setNewOrderOpen(true); setNewOrderStep(1); setOrderError(''); }} variant="primary" className="mt-8 mx-auto px-8 cursor-pointer">
                Create Order
              </AnimatedButton>
            </GlassCard>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <AnimatePresence mode="popLayout">
                {orders.map((order) => {
                  let requirements = { businessName: '', preferredDomain: '', description: '' };
                  try {
                    requirements = JSON.parse(order.requirements);
                  } catch (e) {
                    requirements.description = order.requirements;
                  }
                  const isExpanded = expandedOrder === order.id;
                  const currentStepIndex = steps.findIndex((s) => s.id === order.status);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85, height: 0, overflow: 'hidden', transition: { duration: 0.35 } }}
                      layout
                      className={isExpanded ? "md:col-span-2 lg:col-span-3" : ""}
                    >
                      <GlassCard
                        className={`flex flex-col justify-between border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E]/90 hover:border-[#D4AF37]/60 transition-all duration-300 ${isExpanded ? "border-[#D4AF37] bg-white dark:bg-[#131B2E]" : ""
                          }`}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-[#1E3A5F]/20 text-[#8496B8]"
                              }`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-[#1E3A5F] dark:text-[#8496B8] font-mono">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F]">
                              {requirements.businessName || planNames[order.package] || "Custom Project"}
                            </h3>
                            <p className="text-xs text-[#1E3A5F] dark:text-[#8496B8] mt-1">Package: {planNames[order.package] || "Custom Build"}</p>
                            <p className="text-sm font-semibold text-[#725700] dark:text-[#F3C623] mt-2">
                              ${order.price}
                            </p>
                          </div>
                        </div>

                        {/* Expanded Details and Timeline */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-[#CBD5E1] dark:border-[#1E3A5F] space-y-6 animate-fade-in text-left">
                            {/* Timeline */}
                            <div className="bg-[#F0F4F9] dark:bg-[#070D1D] p-6 rounded-xl border border-[#CBD5E1] dark:border-[#1E3A5F]">
                              <h4 className="text-xs font-bold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-wider mb-6">Project Timeline</h4>
                              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
                                {/* Connector Line for Desktop */}
                                <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#CBD5E1] dark:bg-[#1E3A5F] -z-10 hidden md:block">
                                  <div
                                    className="h-full bg-[#D4AF37] transition-all duration-500"
                                    style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                                  ></div>
                                </div>

                                {steps.map((step, idx) => {
                                  const isCompleted = idx < currentStepIndex;
                                  const isActive = idx === currentStepIndex;
                                  return (
                                    <div key={step.id} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all duration-300 ${isCompleted ? "bg-[#D4AF37] border-[#D4AF37] text-[#0B132B]" :
                                          isActive ? "bg-[#131B2E] border-[#F3C623] text-[#F3C623] ring-2 ring-[#F3C623]/30 animate-pulse" :
                                            "bg-[#F0F4F9] dark:bg-[#070D1D] border-[#CBD5E1] dark:border-[#1E3A5F] text-[#8496B8]"
                                          }`}
                                      >
                                        {isCompleted ? "✓" : idx + 1}
                                      </div>
                                      <span
                                        className={`text-[10px] font-semibold ${isActive ? "text-[#F3C623] font-bold" : isCompleted ? "text-[#0B132B] dark:text-[#F9E79F]" : "text-[#8496B8]"
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
                                <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Preferred Domain</span>
                                <span className="text-[#0B132B] dark:text-[#F9E79F] mt-1 block font-medium">{requirements.preferredDomain || "None specified"}</span>
                              </div>
                              <div>
                                <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Project Description</span>
                                <p className="text-[#0B132B] dark:text-[#F9E79F] mt-1.5 p-3 bg-[#F0F4F9] dark:bg-[#070D1D] rounded border border-[#CBD5E1] dark:border-[#1E3A5F] leading-relaxed whitespace-pre-wrap">
                                  {requirements.description}
                                </p>
                              </div>
                            </div>

                            {/* Slip Upload Inline within expanded card */}
                            {['pending_payment', 'pending_verification', 'rejected'].includes(order.status) && user?.id && (
                              <div className="pt-4 border-t border-[#CBD5E1] dark:border-[#1E3A5F] max-w-xl">
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

                        <div className="mt-6 pt-4 border-t border-[#CBD5E1] dark:border-[#1E3A5F] flex justify-between items-center gap-3">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="text-xs text-[#725700] dark:text-accent hover:underline font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? "Collapse Timeline" : "Track Progress"}</span>
                            <span>{isExpanded ? "↑" : "→"}</span>
                          </button>

                          <AnimatedDeleteButton
                            onDelete={() => handleDeleteOrder(order)}
                            isBlocked={!['completed', 'cancelled', 'rejected'].includes(order.status)}
                            blockedMessage="Cannot delete an order that is currently in progress."
                            confirmTitle="Delete Project Order"
                            confirmMessage={`Are you sure you want to delete order #${order.id.slice(0, 8)}? This action cannot be undone.`}
                            size="sm"
                          />
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
                  className="w-full max-w-2xl bg-[#131B2E] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8 text-left"
                >
                  <button
                    onClick={() => setNewOrderOpen(false)}
                    className="absolute top-4 right-4 text-[#8496B8] hover:text-[#F9E79F] text-lg font-bold p-2 focus:outline-none cursor-pointer"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#0B132B] dark:text-[#F9E79F]">Create a New Project</h3>
                    <p className="text-[#1E3A5F] dark:text-[#8496B8] text-xs mt-1">Request your design and development setup in a few quick steps.</p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-4 bg-[#F0F4F9] dark:bg-[#070D1D] p-4 rounded-xl border border-[#CBD5E1] dark:border-[#1E3A5F] text-[10px] sm:text-xs font-semibold text-[#8496B8] uppercase tracking-wider mb-6">
                    <span className={newOrderStep === 1 ? "text-[#725700] dark:text-[#F3C623] font-extrabold" : newOrderStep > 1 ? "text-[#1E3A5F]" : ""}>1. Select Plan</span>
                    <span className="text-[#CBD5E1] dark:text-[#1E3A5F]">|</span>
                    <span className={newOrderStep === 2 ? "text-[#725700] dark:text-[#F3C623] font-extrabold" : newOrderStep > 2 ? "text-[#1E3A5F]" : ""}>2. Requirements</span>
                    <span className="text-[#CBD5E1] dark:text-[#1E3A5F]">|</span>
                    <span className={newOrderStep === 3 ? "text-[#725700] dark:text-[#F3C623] font-extrabold" : ""}>3. Review & Submit</span>
                  </div>
                  <p className="mb-5 text-xs leading-5 text-[#405678] dark:text-[#B7C4DC]">Fixed-package prices are the final service prices for the listed scope. Custom work requires an agreed quote; optional third-party costs are disclosed before payment.</p>

                  {orderError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
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
                          className="p-5 cursor-pointer border border-[#CBD5E1] dark:border-[#1E3A5F] bg-[#F0F4F9]/60 dark:bg-[#070D1D]/60 hover:border-[#D4AF37] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="text-base font-bold text-[#0B132B] dark:text-[#F9E79F]">{pkg.name}</h4>
                            <p className="text-[#1E3A5F] dark:text-[#8496B8] text-xs mt-1 leading-relaxed">{pkg.desc}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-[#1E3A5F] flex justify-between items-center">
                            <span className="text-lg font-black text-[#725700] dark:text-[#F3C623]">{pkg.id === 'custom' ? `From $${pkg.price}` : `$${pkg.price}${pkg.id === 'maintenance' ? '/month' : ''}`}</span>
                            <span className="text-xs font-semibold text-[#1E3A5F] dark:text-[#D4AF37] hover:text-[#F3C623] uppercase tracking-wider">{pkg.id === 'custom' ? 'Request quote →' : 'Select →'}</span>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Requirements */}
                  {newOrderStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#CBD5E1] dark:border-[#1E3A5F] pb-3 mb-1">
                        <span className="text-xs font-semibold text-[#725700] dark:text-[#F3C623] uppercase tracking-wider">Selected plan:</span>
                        <span className="text-xs font-bold text-[#0B132B] dark:text-[#F9E79F] bg-[#F0F4F9] dark:bg-[#070D1D] border border-[#CBD5E1] dark:border-[#1E3A5F] px-2.5 py-1 rounded">
                          {packages.find(p => p.id === selectedPackage)?.name} (${selectedPrice}{selectedPackage === 'maintenance' ? '/month' : ''})
                        </span>
                      </div>

                      <div>
                        <label htmlFor="businessName" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-wider">
                          Business Name
                        </label>
                        <input
                          id="businessName"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-[#F0F4F9] dark:bg-[#070D1D] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] placeholder-[#8496B8]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
                          placeholder="e.g. Acme Corporation"
                        />
                      </div>

                      <div>
                        <label htmlFor="preferredDomain" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-wider">
                          Preferred Domain
                        </label>
                        <input
                          id="preferredDomain"
                          type="text"
                          value={preferredDomain}
                          onChange={(e) => setPreferredDomain(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-[#F0F4F9] dark:bg-[#070D1D] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] placeholder-[#8496B8]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
                          placeholder="e.g. acme.com (optional)"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-xs font-semibold text-[#1E3A5F] dark:text-[#8496B8] uppercase tracking-wider">
                          Project Description / Design Notes
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1.5 block w-full px-4 py-2.5 bg-[#F0F4F9] dark:bg-[#070D1D] border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-lg text-sm text-[#0B132B] dark:text-[#F9E79F] placeholder-[#8496B8]/50 focus:outline-none focus:border-[#D4AF37] transition-colors h-24"
                          placeholder="Explain preferred colors, required views, WebGL elements, and integrations..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#CBD5E1] dark:border-[#1E3A5F]">
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
                      <h4 className="text-lg font-bold text-[#0B132B] dark:text-[#F9E79F] border-b border-[#CBD5E1] dark:border-[#1E3A5F] pb-3">Review Order Details</h4>

                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 text-xs">
                        <div>
                          <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Selected Package</span>
                          <span className="text-[#0B132B] dark:text-[#F9E79F] font-bold block mt-0.5">{packages.find(p => p.id === selectedPackage)?.name}</span>
                        </div>
                        <div>
                          <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Cost</span>
                          <span className="text-[#725700] dark:text-[#F3C623] font-bold block mt-0.5">${selectedPrice}{selectedPackage === 'maintenance' ? '/month' : ''}</span>
                        </div>
                        <div>
                          <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Business Name</span>
                          <span className="text-[#0B132B] dark:text-[#F9E79F] font-bold block mt-0.5">{businessName}</span>
                        </div>
                        <div>
                          <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block">Preferred Domain</span>
                          <span className="text-[#0B132B] dark:text-[#F9E79F] font-bold block mt-0.5">{preferredDomain || "None provided"}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[#1E3A5F] dark:text-[#8496B8] font-semibold uppercase tracking-wider block text-xs">Design Notes & Scope</span>
                        <p className="text-[#0B132B] dark:text-[#F9E79F] text-xs mt-1.5 bg-[#F0F4F9] dark:bg-[#070D1D] p-3 rounded border border-[#CBD5E1] dark:border-[#1E3A5F] leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#CBD5E1] dark:border-[#1E3A5F]">
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
            subtitle="We combine modern technologies with thoughtful, project-specific design."
            align="center"
          />
        </ScrollReveal>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="h-full flex flex-col justify-between border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E]/90 hover:border-[#D4AF37]/50">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 dark:bg-[#070D1D] border border-[#D4AF37]/40 dark:border-[#D4AF37]/60 shadow-md dark:shadow-[0_0_18px_rgba(212,175,55,0.25)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F] mb-3">{feat.title}</h3>
                  <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm leading-relaxed">{feat.desc}</p>
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
            className="text-sm font-semibold text-[#725700] dark:text-[#F3C623] hover:underline mb-8 md:mb-0 flex items-center gap-1.5 self-start md:self-auto"
          >
            Explore Full Portfolio <span>→</span>
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8">
          {previewProjects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <GlassCard hoverEffect={false} className="group overflow-hidden p-0 relative rounded-2xl border border-[#CBD5E1] dark:border-[#1E3A5F] bg-white/90 dark:bg-[#131B2E]/90">
                <div className="aspect-video w-full overflow-hidden relative border-b border-[#CBD5E1] dark:border-[#1E3A5F]">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#070D1D] to-[#D4AF37]/20 z-0"></div>
                      <div className="absolute inset-0 bg-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[#1E3A5F] font-black text-6xl tracking-widest select-none z-0 opacity-20">
                        CODEWAVE
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 bg-white/95 dark:bg-[#131B2E] border-t border-[#CBD5E1] dark:border-[#1E3A5F] relative z-20">
                  <span className="text-xs font-semibold text-[#725700] dark:text-[#F3C623] uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-2xl font-bold text-[#0B132B] dark:text-[#F9E79F] mt-2 group-hover:text-[#D4AF37] dark:group-hover:text-[#F3C623] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <GlassCard className="relative overflow-hidden p-12 text-center border border-[#D4AF37]/40 dark:border-[#D4AF37]/60 bg-gradient-to-tr from-white via-slate-50 to-[#D4AF37]/15 dark:from-[#070D1D] dark:via-[#131B2E] dark:to-[#D4AF37]/25 shadow-xl dark:shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 dark:bg-[#1E3A5F]/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B132B] dark:text-[#F9E79F]">Ready to Start Your Project?</h2>
            <p className="mt-4 max-w-xl mx-auto text-[#1E3A5F] dark:text-[#8496B8]">
              Let's craft a digital presence tailored to your business needs.
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
    </div>
  );
}
