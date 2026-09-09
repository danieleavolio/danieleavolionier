import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { supabaseAnonKey, supabaseUrl } from '$lib/supabaseConfig';

// Public reads can safely use the anon key and RLS. The service role is optional
// at runtime and remains reserved for the one-off migration script.
export const supabaseAdmin = createClient(
	supabaseUrl,
	SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);
