import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';

const packages = [
  { id: "starter", name: "Starter Package", price: 79, desc: "Up to 5 pages, responsive design, contact form, 5-day delivery." },
  { id: "business", name: "Business Suite", price: 199, desc: "Up to 10 pages, CMS/blog, SEO setup, 10-day delivery." },
  { id: "custom", name: "Custom Web App", price: 399, desc: "Full-stack web app, database, auth, admin dashboard, custom scope." },
  { id: "maintenance", name: "Maintenance & Support", price: 15, desc: "24/7 server monitoring, updates, and developer support." }
];

export default function NewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [selectedPrice, setSelectedPrice] = useState(79);

  // Requirements form fields
  const [businessName, setBusinessName] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg && packages.some((p) => p.id === pkg)) {
      setSelectedPackage(pkg);
      const match = packages.find((p) => p.id === pkg);
      if (match) {
        setSelectedPrice(match.price);
      }
      setStep(2);
    }
  }, [searchParams]);

  const handleSelectPackage = (pkgId: string, price: number) => {
    setSelectedPackage(pkgId);
    setSelectedPrice(price);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!businessName.trim() || !description.trim()) {
        setErrorMsg('Please fill in both Business Name and Project Description.');
        return;
      }
      if (businessName.trim().length > 100) {
        setErrorMsg('Business Name must be under 100 characters.');
        return;
      }
      if (preferredDomain.trim().length > 100) {
        setErrorMsg('Preferred Domain must be under 100 characters.');
        return;
      }
      if (description.trim().length > 2000) {
        setErrorMsg('Project Description must be under 2000 characters.');
        return;
      }
      setErrorMsg('');
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setErrorMsg('');

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
      navigate('/portal');
    } catch (err: any) {
      console.error('Error creating order:', err);
      setErrorMsg(err.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activePlan = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="max-w-2xl mx-auto text-left space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#EACEAA]">Create a New Project</h1>
        <p className="text-[#B58E78] mt-2">Request your design and development setup in a few quick steps.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 bg-[#150C0C] p-4 rounded-xl border border-[#54281B] text-xs font-semibold text-[#B58E78] uppercase tracking-wider">
        <span className={step === 1 ? "text-[#D39858] font-extrabold" : step > 1 ? "text-[#85431E]" : ""}>1. Select Plan</span>
        <span className="text-[#54281B]">|</span>
        <span className={step === 2 ? "text-[#D39858] font-extrabold" : step > 2 ? "text-[#85431E]" : ""}>2. Requirements</span>
        <span className="text-[#54281B]">|</span>
        <span className={step === 3 ? "text-[#D39858] font-extrabold" : ""}>3. Review & Submit</span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Package Selection */}
      {step === 1 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {packages.map((pkg) => (
            <GlassCard
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg.id, pkg.price)}
              className="p-6 cursor-pointer border border-[#54281B] bg-[#34150F]/70 hover:border-[#85431E] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-[#EACEAA]">{pkg.name}</h3>
                <p className="text-[#B58E78] text-xs mt-2 leading-relaxed">{pkg.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#54281B] flex justify-between items-center">
                <span className="text-xl font-black text-[#D39858]">${pkg.price}</span>
                <span className="text-xs font-semibold text-[#85431E] uppercase tracking-wider">Select →</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Step 2: Requirements */}
      {step === 2 && (
        <GlassCard className="p-8 border border-[#54281B] bg-[#34150F]/80 space-y-6" hoverEffect={false}>
          <div className="flex justify-between items-center border-b border-[#54281B] pb-4 mb-2">
            <span className="text-sm font-semibold text-[#D39858] uppercase tracking-wider">Selected plan:</span>
            <span className="text-sm font-bold text-[#EACEAA] bg-[#150C0C] border border-[#54281B] px-3 py-1 rounded">
              {activePlan?.name} (${activePlan?.price})
            </span>
          </div>

          <div>
            <label htmlFor="businessName" className="block text-xs font-semibold text-[#B58E78] uppercase tracking-wider">
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-[#150C0C] border border-[#54281B] rounded-lg text-sm text-[#EACEAA] placeholder-[#B58E78]/50 focus:outline-none focus:border-[#85431E] transition-colors"
              placeholder="e.g. Acme Corporation"
            />
          </div>

          <div>
            <label htmlFor="preferredDomain" className="block text-xs font-semibold text-[#B58E78] uppercase tracking-wider">
              Preferred Domain
            </label>
            <input
              id="preferredDomain"
              type="text"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-[#150C0C] border border-[#54281B] rounded-lg text-sm text-[#EACEAA] placeholder-[#B58E78]/50 focus:outline-none focus:border-[#85431E] transition-colors"
              placeholder="e.g. acme.com (optional)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-[#B58E78] uppercase tracking-wider">
              Project Description / Design Notes
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full px-4 py-3 bg-[#150C0C] border border-[#54281B] rounded-lg text-sm text-[#EACEAA] placeholder-[#B58E78]/50 focus:outline-none focus:border-[#85431E] transition-colors h-32"
              placeholder="Explain preferred colors, required views, WebGL elements, and integrations..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#54281B]">
            <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-full sm:w-1/2 py-3 cursor-pointer">
              Back to Plans
            </AnimatedButton>
            <AnimatedButton onClick={handleNextStep} variant="primary" className="w-full sm:w-1/2 py-3 cursor-pointer">
              Review Summary
            </AnimatedButton>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <GlassCard className="p-8 border border-[#54281B] bg-[#34150F]/80 space-y-6 animate-fade-in" hoverEffect={false}>
          <h2 className="text-xl font-bold text-[#EACEAA] border-b border-[#54281B] pb-4">Review Order Details</h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-xs font-semibold text-[#B58E78] uppercase tracking-wider block">Selected Package</span>
              <span className="text-[#EACEAA] font-bold block mt-1">{activePlan?.name}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B58E78] uppercase tracking-wider block">Cost</span>
              <span className="text-[#D39858] font-bold block mt-1">${activePlan?.price}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B58E78] uppercase tracking-wider block">Business Name</span>
              <span className="text-[#EACEAA] font-bold block mt-1">{businessName}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B58E78] uppercase tracking-wider block">Preferred Domain</span>
              <span className="text-[#EACEAA] font-bold block mt-1">{preferredDomain || "None provided"}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-[#B58E78] uppercase tracking-wider block">Design Notes & Scope</span>
            <p className="text-[#EACEAA] text-xs mt-2 bg-[#150C0C] p-4 rounded border border-[#54281B] leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#54281B]">
            <AnimatedButton onClick={handlePrevStep} variant="secondary" className="w-full sm:w-1/2 py-3 cursor-pointer">
              Back to Edit
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSubmit}
              variant="primary"
              disabled={submitting}
              className="w-full sm:w-1/2 py-3 cursor-pointer"
            >
              {submitting ? "Submitting Order..." : "Confirm & Submit"}
            </AnimatedButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
