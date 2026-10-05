import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContext } from './auth-context';
import type { Profile } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const activeUserIdRef = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      if (activeUserIdRef.current === userId) setProfile(null);
      return null;
    }

    if (activeUserIdRef.current === userId) setProfile(data);
    return data as Profile;
  };

  const syncGoogleAvatar = async (authUser: User, currentProfile: Profile | null) => {
    const isGoogleUser = authUser.app_metadata?.provider === 'google'
      || authUser.app_metadata?.providers?.includes('google');
    const hasGooglePhoto = Boolean(authUser.user_metadata?.picture || authUser.user_metadata?.avatar_url);
    if (!isGoogleUser || !hasGooglePhoto || currentProfile?.avatar_path) return;

    const attemptKey = `codewave_avatar_sync_${authUser.id}`;
    if (sessionStorage.getItem(attemptKey) === 'attempted') return;
    sessionStorage.setItem(attemptKey, 'attempted');

    const { error } = await supabase.functions.invoke('sync-oauth-avatar');
    if (error) {
      console.warn('Could not securely import Google profile photo:', error.message);
      return;
    }
    await fetchProfile(authUser.id);
  };

  const loadUserProfile = async (authUser: User) => {
    const currentProfile = await fetchProfile(authUser.id);
    if (activeUserIdRef.current === authUser.id) {
      await syncGoogleAvatar(authUser, currentProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    const applySession = (nextUser: User | null) => {
      activeUserIdRef.current = nextUser?.id ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      // Run database work outside the auth callback so token refreshes cannot
      // block Supabase's internal auth lock.
      window.setTimeout(() => {
        if (mounted && activeUserIdRef.current === nextUser.id) {
          void loadUserProfile(nextUser);
        }
      }, 0);
    };

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) applySession(data.session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) applySession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      applySession(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unable to sign in') };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unable to sign up') };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
