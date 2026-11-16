import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '#lib/supabaseConfig.ts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
