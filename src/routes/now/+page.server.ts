import { listNowItems } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load() {
	return { items: await listNowItems(supabaseAdmin) };
}
