import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_path?: string | null;
  created_at: string;
}

export interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: unknown; error: Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
