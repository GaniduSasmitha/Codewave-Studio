import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedButton from '../../components/AnimatedButton';

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$79",
    billing: "One-time payment",
    desc: "Up to 5 pages, responsive design, contact form, basic SEO, 1 revision round, 5-day delivery.",
    popular: false,
    delivery: "5-day delivery",
    features: [
      "Up to 5 custom pages",
      "Responsive mobile-first design",
      "Contact & lead capture form",
      "Basic SEO optimization",
      "1 revision round"
    ]
  },
  {
    id: "business",
    name: "Business",
    price: "$199",
    billing: "One-time payment",
    desc: "Up to 10 pages, CMS/blog, SEO setup, custom contact forms, 2 revision rounds, 10-day delivery.",
    popular: true,
    delivery: "10-day delivery",
    features: [
      "Up to 10 custom pages",
      "CMS / Blog integration",
      "SEO setup & search indexing",
      "Custom contact forms",
      "2 revision rounds"
    ]
  },
  {
    id: "custom",
    name: "Custom",
    price: "starting at $399",
    billing: "Quote-based",
    desc: "Full-stack web app, database, user auth, admin dashboard, unlimited revisions during build, timeline based on scope.",
    popular: false,
    delivery: "Based on scope",
    features: [
      "Full-stack web app & database",
      "User auth & admin dashboard",
      "Custom APIs & automated workflows",
      "Full SEO & search indexing",
      "Unlimited revisions during build"
    ]
  }
];

const featuresList = [
  { name: "Pages Included", starter: "Up to 5 pages", business: "Up to 10 pages", custom: "Scope-based" },
  { name: "Responsive Design", starter: true, business: true, custom: true },
  { name: "Contact & Lead Forms", starter: "Contact form", business: "Custom contact forms", custom: "Advanced & Automated" },
  { name: "SEO Optimization", starter: "Basic SEO", business: "SEO setup", custom: "Full SEO & Indexing" },
  { name: "CMS / Blog Integration", starter: false, business: true, custom: true },
  { name: "Full-Stack Web App & Database", starter: false, business: false, custom: true },
  { name: "User Auth & Admin Dashboard", starter: false, business: false, custom: true },
  { name: "Revision Rounds", starter: "1 revision round", business: "2 revision rounds", custom: "Unlimited during build" },
  { name: "Delivery Time", starter: "5-day delivery", business: "10-day delivery", custom: "Based on scope" },
  { name: "Support & Maintenance", starter: "Standard Support", business: "Priority Support", custom: "Dedicated Support" }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Track open state for each folder tier card (Business open by default)
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({
    starter: false,
    business: true,
    custom: false
  });

  const toggleTier = (id: string) => {
    setOpenTiers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectPackage = (packageId: string) => {
    if (packageId === 'custom') {
      navigate('/contact?package=custom');
    } else if (user && profile?.role === 'customer') {
      navigate(`/?package=${packageId}#orders-dashboard`);
    } else {
      navigate(`/signup?package=${packageId}`);
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <ScrollReveal>
        <SectionHeading
          title="Flexible Plans for"
          gradientWord="Your Goals"
          subtitle="Simple, flat pricing packages with no hidden setup fees."
          align="center"
        />
      </ScrollReveal>

      {/* Folder Tab Tier Cards Grid */}
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 items-start">
        {tiers.map((tier, i) => {
          const isOpen = !!openTiers[tier.id];

          return (
            <ScrollReveal key={tier.id} delay={i * 0.1}>
              <div className="relative pt-7 group">
                {/* Physical Folder Tab Header Header */}
                <div
                  onClick={() => toggleTier(tier.id)}
                  className={`absolute top-0 left-6 z-20 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-t-xl border-t border-l border-r text-xs font-bold cursor-pointer transition-all duration-300 shadow-md ${
                    tier.popular
                      ? 'bg-slate-900 border-indigo-500/60 text-white'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="tracking-wide uppercase font-extrabold">{tier.name}</span>
                  </span>

                  {tier.popular && (
                    <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Main Glass Folder Card Body */}
                <motion.div
                  layout
                  onClick={() => toggleTier(tier.id)}
                  className={`rounded-3xl rounded-tl-none p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden backdrop-blur-xl cursor-pointer shadow-2xl flex flex-col justify-between ${
                    tier.popular
                      ? 'border-indigo-500/50 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-indigo-950/30 shadow-indigo-500/10'
                      : 'border-slate-800/90 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  {/* Subtle Background Glow Accent for Popular */}
                  {tier.popular && (
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  )}

                  <div className="space-y-6">
                    {/* Header Area */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {tier.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                          {tier.desc}
                        </p>
                      </div>

                      {/* Expand / Collapse Indicator */}
                      <div className="flex-shrink-0 pt-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition-transform duration-300">
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block text-xs font-bold"
                          >
                            ▼
                          </motion.span>
                        </span>
                      </div>
                    </div>

                    {/* Closed State Hint */}
                    {!isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-3 px-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center justify-between"
                      >
                        <span>Click to reveal pricing & features</span>
                        <span>→</span>
                      </motion.div>
                    )}

                    {/* Animated Revealed Content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="space-y-6 pt-2 overflow-hidden"
                        >
                          {/* Prominent Price Reveal */}
                          <motion.div
                            initial={{ scale: 0.85, opacity: 0, y: -10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                            className="pt-4 border-t border-slate-200 dark:border-slate-800/80"
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {tier.price}
                              </span>
                            </div>
                            <span className="text-slate-500 text-xs block mt-1 font-medium">
                              {tier.billing}
                            </span>
                          </motion.div>

                          {/* Staggered Feature List Items */}
                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                              Included Features
                            </span>
                            {tier.features.map((feat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: idx * 0.075 + 0.1,
                                  duration: 0.3,
                                  ease: 'easeOut'
                                }}
                                className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium"
                              >
                                <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  ✓
                                </span>
                                <span>{feat}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Action Button (Revealed at end of sequence) */}
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: tier.features.length * 0.075 + 0.15,
                              duration: 0.3
                            }}
                            className="pt-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AnimatedButton
                              onClick={() => handleSelectPackage(tier.id)}
                              variant={tier.popular ? 'primary' : 'glass'}
                              className="w-full py-3 cursor-pointer shadow-lg"
                            >
                              {tier.id === 'custom' ? 'Get a Quote' : `Order ${tier.name}`}
                            </AnimatedButton>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Bottom Delivery Info Label */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="text-cyan-400">⚡</span>
                      <span>{tier.delivery}</span>
                    </span>
                    <span>Codewave Tier</span>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Full Features Comparison Table */}
      <section className="pt-12">
        <ScrollReveal>
          <SectionHeading
            title="Feature"
            gradientWord="Comparison"
            subtitle="Compare all features across packages to select the best fit."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-8 bg-white/80 dark:bg-slate-950/20 backdrop-blur-lg border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950/60 text-xs uppercase text-slate-600 dark:text-slate-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Starter</th>
                    <th className="px-6 py-4">Business</th>
                    <th className="px-6 py-4">Custom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {featuresList.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{feature.name}</td>
                      <td className="px-6 py-4">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.starter
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.business === 'boolean' ? (
                          feature.business ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.business
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.custom === 'boolean' ? (
                          feature.custom ? <span className="text-primary dark:text-accent text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.custom
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
