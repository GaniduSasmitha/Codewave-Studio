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

  return <aside aria-label="Cookie notice" className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#D4AF37]/60 bg-white p-4 shadow-2xl dark:bg-[#131B2E] sm:flex sm:items-center sm:gap-5 sm:p-5">
    <p className="text-sm leading-6 text-[#1E3A5F] dark:text-[#E3E8F2]">We use essential browser storage for secure login sessions and site preferences. We do not use analytics or advertising cookies. <Link to="/cookies" className="font-semibold text-[#725700] underline dark:text-[#F3C623]">Cookie Policy</Link></p>
    <button type="button" onClick={accept} className="mt-4 min-h-11 w-full shrink-0 rounded-lg bg-[#D4AF37] px-6 py-2.5 font-bold text-[#0B132B] hover:bg-[#F3C623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B132B] focus-visible:ring-offset-2 sm:mt-0 sm:w-auto">Accept</button>
  </aside>;
}
