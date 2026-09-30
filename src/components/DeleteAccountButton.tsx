import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function DeleteAccountButton({ onComplete }: { onComplete?: () => void }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const deleteAccount = async () => {
    setDeleting(true);
    setError('');
    const { error: deleteError } = await supabase.rpc('delete_own_account');
    if (deleteError) {
      setError(deleteError.message || 'We could not delete your account. Please contact support.');
      setDeleting(false);
      return;
    }
    await signOut();
    onComplete?.();
    navigate('/', { replace: true });
  };

  return <>
    <button type="button" onClick={() => setConfirming(true)} className="w-full min-h-11 rounded-lg border border-red-700/40 px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-700/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:text-red-300 dark:border-red-400/40">
      Delete my account
    </button>
    {confirming && createPortal(
      <div role="presentation" className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
        <div role="alertdialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="w-full max-w-md rounded-2xl border border-red-500/40 bg-white p-6 shadow-2xl dark:bg-[#131B2E]">
          <h2 id="delete-account-title" className="text-xl font-bold text-[#0B132B] dark:text-[#F9E79F]">Permanently delete your account?</h2>
          <p id="delete-account-description" className="mt-3 text-sm leading-6 text-[#405678] dark:text-[#D7DEEC]">This permanently deletes your profile, orders, and uploaded payment slips. This action cannot be undone.</p>
          {error && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" disabled={deleting} onClick={() => { setConfirming(false); setError(''); }} className="min-h-11 rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#0B132B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A00] dark:border-[#1E3A5F] dark:text-[#F9E79F]">Cancel</button>
            <button type="button" disabled={deleting} onClick={deleteAccount} className="min-h-11 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:opacity-60">{deleting ? 'Deleting…' : 'Delete permanently'}</button>
          </div>
        </div>
      </div>, document.body
    )}
  </>;
}
