import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function OrganicWaveFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('codewave.studio.tech@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/94717441420',
      bgHover: 'hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/19e8CDwei6/',
      bgHover: 'hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/codewave-studio-tech/about/',
      bgHover: 'hover:bg-sky-600 hover:shadow-[0_0_20px_rgba(2,132,199,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/codewavestudiotech-stack',
      bgHover: 'hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden pt-24 sm:pt-28 lg:pt-36">
      {/* Layered wave divider */}
      <div className="absolute inset-x-0 top-0 z-10 h-24 overflow-hidden leading-none pointer-events-none sm:h-28 lg:h-36">
        <svg
          className="block h-full w-full"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="footer-wave-gold" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="0.2" stopColor="#F3C623" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#F9E79F" />
              <stop offset="0.8" stopColor="#F3C623" stopOpacity="0.9" />
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="footer-wave-blue" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E3A5F" stopOpacity="0.12" />
              <stop offset="1" stopColor="#1E3A5F" stopOpacity="0.62" />
            </linearGradient>
          </defs>

          <path
            d="M0 112C170 35 340 43 510 105C690 170 850 152 1020 82C1180 16 1320 42 1440 94V180H0V112Z"
            fill="url(#footer-wave-blue)"
          />
          <path
            d="M0 128C190 55 348 143 548 104C735 67 874 15 1065 83C1218 138 1345 106 1440 70V180H0V128Z"
            fill="#070D1D"
          />
          <path
            d="M0 128C190 55 348 143 548 104C735 67 874 15 1065 83C1218 138 1345 106 1440 70"
            stroke="url(#footer-wave-gold)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M88 113C267 72 390 130 548 104C735 67 874 15 1065 83C1175 122 1272 119 1354 94"
            stroke="#F9E79F"
            strokeWidth="1"
            strokeDasharray="3 12"
            strokeLinecap="round"
            opacity="0.42"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Main Footer Container */}
      <div className="relative z-20 -mt-px bg-[#070D1D] pb-10 pt-5 text-[#F9E79F]/90 sm:pt-6">
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1E3A5F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          {/* Top Brand Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-12 mb-12 border-b border-[#1E3A5F]/70 gap-6">
            <div className="space-y-2 max-w-xl">
              <Logo size="lg" showText={true} subtitle="Digital Craft Studio" />
              <p className="text-sm text-[#B7C4DC] leading-relaxed pt-2">
                Empowering brands and businesses with futuristic web apps, 3D interactive experiences, and robust enterprise solutions.
              </p>
            </div>

            {/* Quick Email Copy Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#131B2E] border border-[#D4AF37]/30 p-2.5 sm:p-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 px-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-[#F9E79F]">Available for projects</span>
              </div>
              <button
                onClick={handleCopyEmail}
                data-cursor-text="Copy"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#070D1D] hover:bg-[#D4AF37] text-white hover:text-[#0B132B] font-medium text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-[#D4AF37]/40 shadow-sm cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {copied ? 'Email Copied!' : 'codewave.studio.tech@gmail.com'}
              </button>
            </div>
          </div>

          {/* 4 Column Layout (Matching Image 2 footer architecture) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16">

            {/* Column 1: Services */}
            <div className="space-y-4">
              <h3 className="text-base font-bold tracking-wide text-white uppercase border-b border-[#D4AF37]/40 pb-2 inline-block">
                Services & Solutions
              </h3>
              <ul className="space-y-2.5 text-sm text-[#B7C4DC]">
                <li>
                  <Link to="/services" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Web Applications & SaaS
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    3D Interactive Web
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    UI/UX Engineering
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    E-Commerce Solutions
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Enterprise Software
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-base font-bold tracking-wide text-white uppercase border-b border-[#D4AF37]/40 pb-2 inline-block">
                Company & Navigation
              </h3>
              <ul className="space-y-2.5 text-sm text-[#B7C4DC]">
                <li>
                  <Link to="/" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Home Overview
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Our Story & Team
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Portfolio Showcase
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Transparent Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#F3C623] transition-colors flex items-center gap-1.5 group">
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    Get In Touch
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Studio Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold tracking-wide text-white uppercase border-b border-[#D4AF37]/40 pb-2 inline-block">
                Studio Details
              </h3>
              <div className="space-y-3 text-sm text-[#B7C4DC]">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#F3C623] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Sri Lanka</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#F3C623] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:codewave.studio.tech@gmail.com" className="hover:text-[#F3C623] transition-colors break-all">
                    codewave.studio.tech@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#F3C623] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="https://wa.me/94717441420" target="_blank" rel="noopener noreferrer" className="hover:text-[#F3C623] transition-colors">
                    +94 71 744 1420
                  </a>
                </div>

                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#131B2E] text-[#F3C623] border border-[#D4AF37]/30">
                    Mon - Sat (9am - 8pm IST)
                  </span>
                </div>
              </div>
            </div>

            {/* Column 4: "Follow us" (Matching Image 2 circular buttons) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold tracking-wide text-white uppercase border-b border-[#D4AF37]/40 pb-2 inline-block">
                Follow us
              </h3>
              <p className="text-xs text-[#B7C4DC]">
                Stay connected with our latest tech updates, designs, and project reveals:
              </p>

              {/* Circular Icon Row (as in Image 2) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    title={item.name}
                    data-cursor-text={item.name}
                    className={`w-11 h-11 rounded-full bg-[#131B2E] text-white border border-[#D4AF37]/30 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 ${item.bgHover}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 border-t border-[#1E3A5F]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8496B8]">
            <p>© {new Date().getFullYear()} <span className="text-[#F9E79F] font-semibold">codewave.studio.tech</span>. All rights reserved.</p>

            <nav aria-label="Footer Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link to="/privacy" className="hover:text-[#F3C623] transition-colors">Privacy Policy</Link>
              <span className="opacity-40">|</span>
              <Link to="/terms" className="hover:text-[#F3C623] transition-colors">Terms of Service</Link>
              <span className="opacity-40">|</span>
              <Link to="/refund-policy" className="hover:text-[#F3C623] transition-colors">Refund Policy</Link>
              <span className="opacity-40">|</span>
              <Link to="/cookies" className="hover:text-[#F3C623] transition-colors">Cookie Policy</Link>
            </nav>
          </div>

        </div>
      </div>
    </footer>
  );
}
