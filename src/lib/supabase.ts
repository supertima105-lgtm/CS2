import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid URL & Key are provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

// Fallback dummy URL to prevent createClient throwing on initialization if unconfigured
const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = isSupabaseConfigured() ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Database Types for Supabase
 */
export interface DBUserLineup {
  id?: string;
  user_id: string;
  lineup_id: string;
  is_favorite: boolean;
  is_learned: boolean;
  updated_at?: string;
}

/**
 * SQL Schema for Supabase SQL Editor:
 * 
 * -- 1. Create table for user lineup progress
 * create table if not exists public.user_lineups (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users(id) on delete cascade not null,
 *   lineup_id text not null,
 *   is_favorite boolean default false not null,
 *   is_learned boolean default false not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id, lineup_id)
 * );
 * 
 * -- 2. Enable Row Level Security (RLS)
 * alter table public.user_lineups enable row level security;
 * 
 * -- 3. Create RLS Policies so each user ONLY accesses their own data
 * create policy "Users can select own lineup records"
 *   on public.user_lineups for select
 *   using (auth.uid() = user_id);
 * 
 * create policy "Users can insert own lineup records"
 *   on public.user_lineups for insert
 *   with check (auth.uid() = user_id);
 * 
 * create policy "Users can update own lineup records"
 *   on public.user_lineups for update
 *   using (auth.uid() = user_id);
 * 
 * create policy "Users can delete own lineup records"
 *   on public.user_lineups for delete
 *   using (auth.uid() = user_id);
 */
