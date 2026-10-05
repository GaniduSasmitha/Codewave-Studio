import { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  SiDocker,
  SiGsap,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import AnimatedButton from '../../components/AnimatedButton';
import GlassCard from '../../components/GlassCard';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import SlipUpload from '../../components/SlipUpload';
import AnimatedDeleteButton from '../../components/AnimatedDeleteButton';

const Hero3D = lazy(() => import('../../components/Hero3D'));

import evoraImg from '../../assets/projects/evora.png';
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
  starter: "Business Web",
  business: "E-Commerce",
  custom: "Web App",
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
  { id: "starter", name: "Business Web", price: 30000, desc: "Up to 5 pages, responsive design, contact form, 5-day delivery." },
  { id: "business", name: "E-Commerce", price: 70000, desc: "Up to 10 pages, CMS/blog, SEO setup, 10-day delivery." },
  { id: "custom", name: "Web App", price: 120000, desc: "Quote required. Full-stack web app, database, auth, admin dashboard, and custom scope." },
  { id: "maintenance", name: "Maintenance & Support", price: 15000, desc: "Monthly monitoring, updates, and developer support." }
];

const features = [
  {
    title: "Lightning Performance",
    desc: "Built with modern React tooling and performance-conscious components tailored to each project."
  },
  {
    title: "Immersive 3D Elements",
    desc: "Interactive low-poly WebGL shapes and 3D product views custom-crafted using React Three Fiber and GSAP animations."
  },
  {
    title: "Secure & Scalable",
    desc: "Complete database operations, authentication routines, and secure file uploads handled via Supabase API engines."
  },
  {
    title: "Responsive Design",
    desc: "Curated dark mode colors, glassmorphic blur overlays, and responsive mobile grids that look stunning on any resolution."
  }
];

const previewProjects = [
  {
    title: "Evora",
    category: "EV CHARGING / DESIGNATHON",
    link: null,
    image: evoraImg
  },
  {
    title: "Personal Fitness Tracker",
    category: "SAAS APP / FITNESS",
    link: "https://personal-fitness-tracker-cyan.vercel.app/",
    image: fitnessTrackerImg
  }
];

const technologyStack = [
  { id: 'react', name: 'React', color: '#61DAFB' },
  { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
  { id: 'vite', name: 'Vite', color: '#A855F7' },
  { id: 'tailwind', name: 'Tailwind CSS', color: '#38BDF8' },
  { id: 'supabase', name: 'Supabase', color: '#3ECF8E' },
  { id: 'postgresql', name: 'PostgreSQL', color: '#4169E1' },
  { id: 'threejs', name: 'Three.js', color: '#D4AF37' },
  { id: 'gsap', name: 'GSAP', color: '#88CE02' },
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'docker', name: 'Docker', color: '#2496ED' },
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
  const [selectedPrice, setSelectedPrice] = useState(30000);
  const [businessName, setBusinessName] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [description, setDescription] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [shouldRenderHero, setShouldRenderHero] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldRenderHero(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

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

      const { error } = await supabase.rpc('create_customer_order', {
        package_id: selectedPackage,
        requirements_payload: reqData
      });

      if (error) throw error;

      // Reset form states
      setNewOrderOpen(false);
      setNewOrderStep(1);
      setSelectedPackage('starter');
      setSelectedPrice(30000);
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

    const { error } = await supabase.rpc('hide_own_order', { order_id: order.id });

    if (error) throw new Error(error.message || 'Failed to delete order.');

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
                <AnimatedButton onClick={() => navigate('/pricing')} variant="primary" className="w-full sm:w-auto">
                  Get a Website
                </AnimatedButton>
              )}
            </div>
          </div>
          <div className="relative h-[380px] sm:h-[420px] lg:h-auto lg:min-h-[500px]">
            {shouldRenderHero ? (
              <Suspense fallback={<div className="h-full w-full rounded-[2rem] bg-[radial-gradient(circle_at_70%_34%,rgba(212,175,55,0.12),rgba(19,27,46,0.7)_30%,#0A0F12_68%)]" />}>
                <Hero3D />
              </Suspense>
            ) : <div className="h-full w-full rounded-[2rem] bg-[radial-gradient(circle_at_70%_34%,rgba(212,175,55,0.12),rgba(19,27,46,0.7)_30%,#0A0F12_68%)]" />}
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
                <h3 className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F]">No active orders</h3>
                <p className="text-[#1E3A5F] dark:text-[#8496B8] text-sm mt-2 max-w-sm mx-auto">
                  You don't have any custom design or development orders. Start your first project now.
                </p>
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
                                LKR {order.price?.toLocaleString()}
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
                                  {/* Connector Line connecting Pending Payment to Completed */}
                                  <div className="absolute top-3.5 left-6 right-6 h-1 bg-[#CBD5E1] dark:bg-[#1E3A5F] hidden md:block pointer-events-none z-0 rounded-full">
                                    <div
                                      className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full shadow-[0_0_10px_#D4AF37]"
                                      style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                                    ></div>
                                  </div>
                                  <div className="absolute top-3.5 bottom-3.5 left-[13px] w-1 bg-[#CBD5E1] dark:bg-[#1E3A5F] md:hidden pointer-events-none z-0 rounded-full">
                                    <div
                                      className="w-full bg-[#D4AF37] transition-all duration-500 rounded-full shadow-[0_0_10px_#D4AF37]"
                                      style={{ height: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
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
                              <span className="text-lg font-black text-[#725700] dark:text-[#F3C623]">{pkg.id === 'custom' ? `From LKR ${pkg.price.toLocaleString()}` : `LKR ${pkg.price.toLocaleString()}${pkg.id === 'maintenance' ? '/month' : ''}`}</span>
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
                            {packages.find(p => p.id === selectedPackage)?.name} (LKR {selectedPrice.toLocaleString()}{selectedPackage === 'maintenance' ? '/month' : ''})
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
                            <span className="text-[#725700] dark:text-[#F3C623] font-bold block mt-0.5">LKR {selectedPrice.toLocaleString()}{selectedPackage === 'maintenance' ? '/month' : ''}</span>
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

        {/* Technology Stack */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/35 bg-gradient-to-br from-white via-[#F8FAFC] to-[#D4AF37]/10 px-5 py-10 shadow-[0_24px_80px_-40px_rgba(11,19,43,0.5)] dark:from-[#070D1D] dark:via-[#0B132B] dark:to-[#131B2E] sm:px-8 sm:py-14 lg:px-12">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#1E3A5F]/15 blur-3xl dark:bg-[#D4AF37]/10" />

              <div className="relative text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#725700] dark:text-[#F3C623]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  Our technology stack
                </span>
                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0B132B] dark:text-[#F9E79F] sm:text-4xl lg:text-5xl">
                  Built With <span className="gradient-brand bg-clip-text text-transparent">Modern Technologies</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#405678] dark:text-[#AAB7CF] sm:text-base">
                  Reliable tools for fast interfaces, secure data, immersive experiences, and scalable cloud delivery.
                </p>
              </div>

              <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-12 lg:grid-cols-5">
                {technologyStack.map((technology, index) => (
                  <ScrollReveal key={technology.id} delay={(index % 5) * 0.06}>
                    <div className="group flex min-h-[116px] h-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#CBD5E1] bg-white/75 px-3 py-5 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/65 hover:shadow-[0_18px_35px_-20px_rgba(212,175,55,0.75)] dark:border-[#1E3A5F] dark:bg-[#131B2E]/85 dark:hover:border-[#D4AF37]/65 sm:min-h-[92px] sm:flex-row sm:justify-start sm:px-4 sm:text-left">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-[#F0F4F9] shadow-inner transition-transform duration-300 group-hover:scale-110 dark:bg-[#070D1D]"
                        style={{ color: technology.color, borderColor: `${technology.color}55` }}
                      >
                        <TechnologyIcon name={technology.id} />
                      </span>
                      <span className="text-xs font-extrabold leading-tight text-[#0B132B] dark:text-[#F9E79F] sm:text-sm">
                        {technology.name}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Client Feedback */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              title="Client"
              gradientWord="Feedback"
              subtitle="Honest experiences from the people and teams we build for."
              align="center"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard hoverEffect={false} className="relative mt-12 overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-br from-white via-[#F8FAFC] to-[#D4AF37]/10 p-0 dark:from-[#0B132B] dark:via-[#131B2E] dark:to-[#D4AF37]/15">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#1E3A5F]/10 blur-3xl dark:bg-[#D4AF37]/10" />

              <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-16">
                <div className="flex justify-center lg:justify-start">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-[2.25rem] border border-[#D4AF37]/40 bg-white/70 shadow-[0_20px_60px_-20px_rgba(212,175,55,0.45)] backdrop-blur-md dark:bg-[#070D1D]/60 sm:h-52 sm:w-52">
                    <span className="absolute left-5 top-3 font-serif text-7xl leading-none text-[#D4AF37]/25" aria-hidden="true">“</span>
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#725700] dark:text-[#F3C623]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M7 8h10M7 12h6m-8 8 3.5-3H17a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 2 3.46V20Z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-[#725700] dark:text-[#F3C623]">Coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#725700] dark:text-[#F3C623]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    Reviews coming soon
                  </span>
                  <h3 className="mt-5 text-2xl font-extrabold text-[#0B132B] dark:text-[#F9E79F] sm:text-3xl">
                    Our client story is just getting started.
                  </h3>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#405678] dark:text-[#AAB7CF] sm:text-base lg:mx-0">
                    We haven&apos;t received public client feedback yet. As projects are completed and clients share their experience, verified reviews will appear here clearly and honestly.
                  </p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
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

function TechnologyIcon({ name }: { name: string }) {
  const icons = {
    react: SiReact,
    typescript: SiTypescript,
    vite: SiVite,
    tailwind: SiTailwindcss,
    supabase: SiSupabase,
    postgresql: SiPostgresql,
    threejs: SiThreedotjs,
    gsap: SiGsap,
    aws: FaAws,
    docker: SiDocker,
  };
  const Icon = icons[name as keyof typeof icons] || SiReact;

  return <Icon className="h-7 w-7" aria-hidden="true" />;
}
