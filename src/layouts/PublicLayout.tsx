import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModernPillNavbar from '../components/ModernPillNavbar';
import OrganicWaveFooter from '../components/OrganicWaveFooter';
import CookieConsent from '../components/CookieConsent';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F0F4F9] dark:bg-[#0B132B] text-[#0B132B] dark:text-[#F9E79F] flex flex-col font-sans transition-colors duration-300">
      {/* Image 1 inspired Modern Floating Pill Navbar */}
      <ModernPillNavbar />

      {/* Main Content View with Smooth Page Transitions */}
      <main className="flex-1 overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Image 2 inspired Organic Wave Multi-Column Footer */}
      <OrganicWaveFooter />

      {/* Cookie notice stays in the bottom-left corner. */}
      <CookieConsent />
    </div>
  );
}
