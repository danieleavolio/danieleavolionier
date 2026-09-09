import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Public reads can safely use the anon key and RLS. The service role is optional
// at runtime and remains reserved for the one-off migration script.
export const supabaseAdmin = createClient(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_ANON_KEY
);
