import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

type CredentialResponse = {
  credential?: string;
};

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        nonce?: string;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: 'standard';
          theme: 'outline';
          size: 'large';
          text: 'continue_with';
          shape: 'rectangular';
          logo_alignment: 'left';
          width: number;
        }
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

function loadGoogleIdentityServices() {
  if (window.google?.accounts.id) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Google Sign-In could not be loaded.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Sign-In could not be loaded.'));
    document.head.appendChild(script);
  });
}

async function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce = btoa(String.fromCharCode(...bytes));
  const encodedNonce = new TextEncoder().encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return { nonce, hashedNonce };
}

type GoogleSignInButtonProps = {
  onError: (message: string) => void;
};

export default function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [useOAuthFallback, setUseOAuthFallback] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!googleClientId) {
      setUseOAuthFallback(true);
      return;
    }

    let cancelled = false;

    const renderGoogleButton = async () => {
      try {
        const { nonce, hashedNonce } = await createNonce();
        await loadGoogleIdentityServices();

        if (cancelled || !buttonRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          nonce: hashedNonce,
          callback: async ({ credential }) => {
            if (!credential) {
              onError('Google did not return a sign-in credential. Please try again.');
              return;
            }

            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: credential,
              nonce
            });

            if (error) onError(error.message || 'Failed to sign in with Google. Please try again.');
          }
        });

        const width = Math.min(400, Math.max(200, Math.floor(buttonRef.current.clientWidth)));
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width
        });
      } catch (error) {
        if (!cancelled) {
          setUseOAuthFallback(true);
          onError(error instanceof Error ? error.message : 'Google Sign-In could not be loaded.');
        }
      }
    };

    void renderGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [googleClientId, onError]);

  const handleOAuthFallback = async () => {
    onError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });

    if (error) onError(error.message || 'Failed to sign in with Google. Please try again.');
  };

  if (useOAuthFallback) {
    return (
      <button
        type="button"
        onClick={() => void handleOAuthFallback()}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#F0F4F9] hover:bg-[#CBD5E1] dark:bg-[#131B2E] dark:hover:bg-[#1C2541] text-[#0B132B] dark:text-[#F9E79F] font-semibold rounded-xl text-sm transition-all duration-200 shadow-sm border border-[#CBD5E1] dark:border-[#1E3A5F] cursor-pointer"
      >
        <GoogleLogo />
        <span className="font-medium">Continue with Google</span>
      </button>
    );
  }

  return <div ref={buttonRef} className="flex min-h-10 w-full items-center justify-center overflow-hidden rounded-xl" />;
}

function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
