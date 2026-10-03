import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    popular: false
  },
  {
    id: "business",
    name: "Business",
    price: "$199",
    billing: "One-time payment",
    desc: "Up to 10 pages, CMS/blog, SEO setup, custom contact forms, 2 revision rounds, 10-day delivery.",
    popular: true
  },
  {
    id: "custom",
    name: "Custom",
    price: "starting at $399",
    billing: "Quote-based",
    desc: "Full-stack web app, database, user auth, admin dashboard, unlimited revisions during build, timeline based on scope.",
    popular: false
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

interface PricingEnvelopeProps {
  tier: (typeof tiers)[number];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

function PricingEnvelope({ tier, isOpen, onToggle, onSelect }: PricingEnvelopeProps) {
  const details = tier.desc.replace(/\.$/, '').split(', ');
  const envelopeId = `pricing-envelope-${tier.id}`;

  return (
    <article className="relative mx-auto h-[460px] w-full max-w-[390px] pt-20 sm:h-[480px] sm:pt-24">
      {tier.popular && (
        <span className="absolute left-1/2 top-2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#F3C623]/60 bg-[#D4AF37] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#0B132B] shadow-lg shadow-[#D4AF37]/20">
          Most Popular
        </span>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={envelopeId}
        aria-label={`${isOpen ? 'Close' : 'Open'} ${tier.name} pricing envelope`}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        className={`group absolute inset-x-0 bottom-5 h-[245px] cursor-pointer rounded-[28px] outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-[#F3C623] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F0F4F9] dark:focus-visible:ring-offset-[#0B132B] ${isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
      >
        {/* Envelope back */}
        <div className={`absolute inset-0 rounded-[28px] border shadow-2xl transition-colors duration-300 ${tier.popular
          ? 'border-[#D4AF37] bg-[#1C2541] shadow-[#D4AF37]/20'
          : 'border-[#2A4B7C] bg-[#131B2E] shadow-[#0B132B]/25'
          }`} />

        {/* Letter */}
        <motion.div
          id={envelopeId}
          initial={false}
          animate={{
            y: isOpen ? -150 : 0,
            scale: isOpen ? 1 : 0.96
          }}
          transition={{ type: 'spring', stiffness: 210, damping: 24 }}
          className={`absolute inset-x-4 -top-20 h-[330px] overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-[#FEF9E7] p-5 text-[#0B132B] shadow-2xl sm:inset-x-6 ${isOpen ? 'z-40' : 'z-10'}`}
        >
          <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#D4AF37]/35 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7A5C07]">Codewave Studio</p>
              <h3 className="mt-1 text-xl font-extrabold">{tier.name} Package</h3>
            </div>
            <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#7A5C07]">
              {tier.id === 'custom' ? 'Custom' : 'Fixed'}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <span className={`${tier.id === 'custom' ? 'text-2xl' : 'text-3xl'} font-black leading-none`}>{tier.price}</span>
            <span className="pb-0.5 text-[10px] font-semibold text-[#1E3A5F]">{tier.billing}</span>
          </div>

          <ul className="mt-4 grid gap-1.5 text-[11px] font-medium leading-4 text-[#1E3A5F]">
            {details.map((detail) => (
              <li key={detail} className="flex items-start gap-2">
                <span className="mt-0.5 font-black text-[#8A6A00]">✓</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <AnimatedButton
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            variant="primary"
            className="absolute inset-x-5 bottom-4 py-2.5"
          >
            {tier.id === 'custom' ? 'Get a Quote' : `Order ${tier.name}`}
          </AnimatedButton>
        </motion.div>

        {/* Open/close flap */}
        <motion.div
          initial={false}
          animate={{ rotateX: isOpen ? -178 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            clipPath: 'polygon(0 0, 50% 62%, 100% 0)',
            transformOrigin: 'top center',
            backfaceVisibility: 'hidden'
          }}
          className={`absolute inset-0 rounded-[28px] border-t border-[#D4AF37]/35 bg-[#1C2541] ${isOpen ? 'z-[5]' : 'z-30'}`}
        />

        {/* Envelope front */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[28px]">
          <div
            className="absolute inset-0 bg-[#172038]"
            style={{ clipPath: 'polygon(0 0, 52% 58%, 0 100%)' }}
          />
          <div
            className="absolute inset-0 bg-[#1C2541]"
            style={{ clipPath: 'polygon(100% 0, 48% 58%, 100% 100%)' }}
          />
          <div
            className="absolute inset-0 bg-[#131B2E]"
            style={{ clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#D4AF37]/40" />
        </div>

        <motion.div
          animate={{ y: isOpen ? 7 : 0 }}
          className="pointer-events-none absolute inset-x-0 bottom-7 z-30 text-center"
        >
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#F3C623] shadow-lg shadow-[#D4AF37]/10">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F9E79F]">{tier.name}</p>
          <p className="mt-1 text-[10px] font-medium text-[#8496B8]">{isOpen ? 'Tap to close' : 'Tap to view details'}</p>
        </motion.div>
      </div>
    </article>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [openTierId, setOpenTierId] = useState<string | null>(null);

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

      {/* Tier Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tiers.map((tier, i) => (
          <ScrollReveal key={tier.id} delay={i * 0.1}>
            <PricingEnvelope
              tier={tier}
              isOpen={openTierId === tier.id}
              onToggle={() => setOpenTierId((current) => current === tier.id ? null : tier.id)}
              onSelect={() => handleSelectPackage(tier.id)}
            />
          </ScrollReveal>
        ))}
      </div>

      <p className="mx-auto max-w-3xl rounded-xl border border-[#CBD5E1] bg-white/80 p-4 text-center text-sm leading-6 text-[#1E3A5F] dark:border-[#1E3A5F] dark:bg-[#131B2E] dark:text-[#D7DEEC]">
        Fixed-package prices shown above are the final Codewave Studio service prices for the listed scope. Custom work is quote-based. Any optional third-party costs or work outside the listed scope will be disclosed and agreed before you pay.
      </p>

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
          <div className="mt-8 bg-white/90 dark:bg-[#131B2E] backdrop-blur-lg border border-[#CBD5E1] dark:border-[#1E3A5F] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#CBD5E1] dark:divide-[#1E3A5F] text-left text-sm text-[#1E3A5F] dark:text-[#F9E79F]">
                <thead className="bg-[#F0F4F9] dark:bg-[#070D1D] text-xs uppercase text-[#0B132B] dark:text-[#F3C623] font-semibold">
                  <tr>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Starter</th>
                    <th className="px-6 py-4">Business</th>
                    <th className="px-6 py-4">Custom</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#1E3A5F]">
                  {featuresList.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-[#CBD5E1]/30 dark:hover:bg-[#1E3A5F]/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#0B132B] dark:text-[#F9E79F]">{feature.name}</td>
                      <td className="px-6 py-4">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? <span className="text-[#725700] dark:text-[#F3C623] text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.starter
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.business === 'boolean' ? (
                          feature.business ? <span className="text-[#725700] dark:text-[#F3C623] text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
                        ) : (
                          feature.business
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {typeof feature.custom === 'boolean' ? (
                          feature.custom ? <span className="text-[#725700] dark:text-[#F3C623] text-lg">✔</span> : <span className="text-red-500 text-lg">✘</span>
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
