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
    name: "Business Web",
    price: "LKR 30,000",
    billing: "One-time payment",
    desc: "Up to 5 pages, responsive design, contact form, basic SEO, 1 revision round, 5-day delivery.",
    popular: false
  },
  {
    id: "business",
    name: "E-Commerce",
    price: "LKR 70,000",
    billing: "One-time payment",
    desc: "Up to 10 pages, CMS/blog, SEO setup, custom contact forms, 2 revision rounds, 10-day delivery.",
    popular: true
  },
  {
    id: "custom",
    name: "Web App",
    prefix: "Starting at",
    price: "LKR 120,000",
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

function PackageArtwork({ packageId }: { packageId: string }) {
  const commonProps = {
    className: 'h-14 w-20',
    viewBox: '0 0 80 56',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true
  };

  if (packageId === 'starter') {
    return (
      <svg {...commonProps}>
        <rect x="8" y="7" width="64" height="40" rx="5" />
        <path d="M8 17h64M17 12h.1M23 12h.1M29 12h.1" />
        <rect x="15" y="23" width="21" height="17" rx="2" />
        <path d="M43 24h20M43 31h16M43 38h12" />
        <path d="M30 51h20" />
      </svg>
    );
  }

  if (packageId === 'business') {
    return (
      <svg {...commonProps}>
        <rect x="8" y="7" width="64" height="42" rx="5" />
        <path d="M17 40V30M28 40V23M39 40V27M50 40V17" />
        <path d="m16 23 12-7 11 4 17-10" />
        <path d="m51 10 5 .2-.3 5" />
        <path d="M58 22h7M58 29h7M58 36h7" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect x="22" y="5" width="36" height="18" rx="4" />
      <rect x="5" y="34" width="28" height="17" rx="4" />
      <rect x="47" y="34" width="28" height="17" rx="4" />
      <path d="M40 23v6M19 34v-5h42v5" />
      <path d="m32 10-5 4 5 4M48 10l5 4-5 4M43 9l-6 10" />
      <circle cx="14" cy="42.5" r="2" />
      <path d="M20 42.5h7M54 39h14M54 45h10" />
    </svg>
  );
}

function PricingEnvelope({ tier, isOpen, onToggle, onSelect }: PricingEnvelopeProps) {
  const details = tier.desc.replace(/\.$/, '').split(', ');
  const envelopeId = `pricing-envelope-${tier.id}`;

  return (
    <article className="relative mx-auto h-[500px] w-full max-w-[390px] pt-20 sm:h-[530px] sm:pt-24">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={envelopeId}
        aria-label={`${isOpen ? 'Close' : 'Open'} ${tier.name} pricing card`}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        className="group absolute inset-x-0 bottom-5 h-[245px] cursor-pointer rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[#F3C623] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F0F4F9] dark:focus-visible:ring-offset-[#0B132B]"
      >
        {tier.popular && (
          <span className="absolute -right-2 top-4 z-50 whitespace-nowrap rounded-full border border-[#F3C623]/70 bg-[#D4AF37] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#0B132B] shadow-lg shadow-[#D4AF37]/20">
            Most Popular
          </span>
        )}

        {/* Open pocket back */}
        <div className={`absolute inset-x-2 inset-y-0 rounded-[30px] border shadow-2xl transition-colors duration-300 ${tier.popular
          ? 'border-[#D4AF37] bg-[#1C2541] shadow-[#D4AF37]/20'
          : 'border-[#2A4B7C] bg-[#172038] shadow-[#0B132B]/25'
          }`} />

        {/* Letter */}
        <motion.div
          id={envelopeId}
          initial={false}
          animate={{
            y: isOpen ? -215 : 0,
            scale: isOpen ? 1 : 0.96,
            height: isOpen ? 375 : 215
          }}
          transition={{ type: 'spring', stiffness: 210, damping: 24 }}
          className={`absolute inset-x-3.5 top-3 rounded-2xl border border-[#D4AF37]/50 bg-[#FEF9E7] p-4 sm:p-5 text-[#0B132B] shadow-2xl flex flex-col justify-between overflow-hidden sm:inset-x-4 ${isOpen ? 'z-40' : 'z-10'}`}
        >
          <motion.p
            initial={false}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-x-2 top-1 text-center text-[9px] font-extrabold uppercase leading-3 tracking-[0.16em] text-[#7A5C07]"
          >
            {tier.name} Package
          </motion.p>

          <div>
            <div className="mb-2.5 flex items-start justify-between gap-3 border-b border-[#D4AF37]/35 pb-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7A5C07]">Codewave Studio</p>
                <h3 className="mt-0.5 text-xl font-extrabold">{tier.name} Package</h3>
              </div>
              <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#7A5C07]">
                {tier.id === 'custom' ? 'Custom' : 'Fixed'}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div>
                {'prefix' in tier && tier.prefix && (
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7A5C07] leading-tight mb-0.5">
                    {tier.prefix}
                  </span>
                )}
                <span className="text-2xl font-black leading-tight tracking-tight">
                  {tier.price}
                </span>
              </div>
              <span className="pb-0.5 text-[10px] font-semibold text-[#1E3A5F] shrink-0">{tier.billing}</span>
            </div>

            <ul className="mt-3 grid gap-1.5 text-[11px] font-medium leading-4 text-[#1E3A5F]">
              {details.map((detail) => (
                <li key={detail} className="flex items-start gap-2">
                  <span className="mt-0.5 font-black text-[#8A6A00]">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <AnimatedButton
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            variant="primary"
            className="mt-3.5 w-fit shrink-0 cursor-pointer"
            style={{ padding: '7px 18px', fontSize: '11px' }}
          >
            {tier.id === 'custom' ? 'Get a Quote' : `Order ${tier.name}`}
          </AnimatedButton>
        </motion.div>

        {/* Open pocket front */}
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 top-8 z-20 overflow-hidden rounded-[26px] border ${tier.popular
          ? 'border-[#D4AF37] bg-gradient-to-b from-[#24304F] to-[#131B2E]'
          : 'border-[#2A4B7C] bg-gradient-to-b from-[#1C2541] to-[#131B2E]'
          }`}>
          <div className="absolute -left-5 -top-8 h-20 w-28 rounded-[50%] border-b border-[#D4AF37]/20 bg-[#1C2541]" />
          <div className="absolute -right-5 -top-8 h-20 w-28 rounded-[50%] border-b border-[#D4AF37]/20 bg-[#1C2541]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#D4AF37]/40" />
        </div>

        <motion.div
          animate={{ y: isOpen ? 7 : 0 }}
          className="pointer-events-none absolute inset-x-0 top-14 z-30 flex flex-col items-center text-center text-[#F3C623]"
        >
          <PackageArtwork packageId={tier.id} />
          <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#F9E79F]">{tier.name} Package</p>
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
      <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 md:gap-y-6 lg:grid-cols-3 lg:gap-6">
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
                    <th className="px-6 py-4">Business Web</th>
                    <th className="px-6 py-4">E-Commerce</th>
                    <th className="px-6 py-4">Web App</th>
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
