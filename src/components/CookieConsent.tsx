import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'codewave_cookie_notice_acknowledged';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem(STORAGE_KEY) !== 'true'), []);
  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return <aside aria-label="Cookie notice" className="fixed bottom-3 left-3 z-[100] flex w-72 max-w-[calc(100vw-1.5rem)] flex-col gap-3 rounded-xl border border-[#D4AF37]/60 bg-white p-4 text-left shadow-2xl dark:bg-[#131B2E] sm:bottom-5 sm:left-5 sm:w-80">
    <p className="text-xs leading-5 text-[#1E3A5F] dark:text-[#E3E8F2]">We use essential browser storage for secure login sessions and site preferences. We do not use analytics or advertising cookies. <Link to="/cookies" className="font-semibold text-[#725700] underline dark:text-[#F3C623]">Cookie Policy</Link></p>
    <button type="button" onClick={accept} className="min-h-10 shrink-0 rounded-lg bg-[#D4AF37] px-5 py-2 text-sm font-bold text-[#0B132B] hover:bg-[#F3C623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B] focus-visible:ring-offset-2">Accept</button>
  </aside>;
}
