import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '$lib/supabaseConfig';

// Never attach visitor cookies to cacheable reads (including visits by an admin).
// This client has only the anonymous role; published-only filters and RLS both apply.
export const publicSupabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});
