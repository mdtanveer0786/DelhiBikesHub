import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error(`
  ❌ Missing Supabase environment variables!
  ────────────────────────────────────────
  Required variables:
    SUPABASE_URL            = ${supabaseUrl ? '✅ Set' : '❌ Missing'}
    SUPABASE_ANON_KEY       = ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}
    SUPABASE_SERVICE_ROLE_KEY = ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}
  
  Copy server/.env.example to server/.env and fill in values.
  `);
  process.exit(1);
}

// Public client (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (bypasses RLS — server-only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
