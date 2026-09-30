import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_path?: string | null;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data as Profile;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
      return null;
    }
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

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          const currentProfile = await fetchProfile(session.user.id);
          await syncGoogleAvatar(session.user, currentProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        if (session) {
          setUser(session.user);
          const currentProfile = await fetchProfile(session.user.id);
          await syncGoogleAvatar(session.user, currentProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
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
        options: {
          data: {
            full_name: fullName,
            role: 'customer' // Trigger will capture and default, but passing here too
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Optimistically clear state immediately so the UI reacts at once
    // (don't wait for onAuthStateChange to fire after the Supabase call)
    setUser(null);
    setProfile(null);
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading
  };
}
