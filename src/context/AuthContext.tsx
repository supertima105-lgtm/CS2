import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; confirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  signInDemo: (email?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      // Check if there was a saved demo user session in local storage
      const savedDemo = localStorage.getItem('cs2_demo_user');
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo));
        } catch {
          // ignore error
        }
      }
      setLoading(false);
      return;
    }

    // 1. Fetch current active session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen to real-time auth changes (Sign in, Sign out, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  // Sign In with Email & Password
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isConfigured) {
      // Fallback Demo Login
      signInDemo(email);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Ошибка подключения к серверу' };
    }
  };

  // Sign Up with Email & Password
  const signUp = async (
    email: string,
    password: string
  ): Promise<{ error: string | null; confirmationRequired?: boolean }> => {
    if (!isConfigured) {
      signInDemo(email);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Check if Supabase requires email verification
      const confirmationRequired = Boolean(data.user && !data.session);
      return { error: null, confirmationRequired };
    } catch (err: any) {
      return { error: err.message || 'Ошибка регистрации' };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    localStorage.removeItem('cs2_demo_user');
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  // Demo Sign-in mode for testing
  const signInDemo = (email: string = 'player@cs2.pro') => {
    const demoUser = {
      id: 'demo-cs2-user-' + Math.random().toString(36).substring(2, 7),
      email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    localStorage.setItem('cs2_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
