import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// The anon key is intentionally public and is protected by Supabase RLS.
// The fallback keeps the public site bootable when Vercel env vars are not set.
export const supabaseUrl = PUBLIC_SUPABASE_URL || 'https://hiflawlyjmooblzwngnf.supabase.co';
export const supabaseAnonKey =
	PUBLIC_SUPABASE_ANON_KEY ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZmxhd2x5am1vb2JsenduZ25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTE0MDEsImV4cCI6MjA4MTQ2NzQwMX0.RZbtmJZwqjapqY_zkbpITMZXez9nh21jRPPri-4QsHQ';
