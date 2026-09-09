import { listPublishedContent } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load() {
	return { progetti: await listPublishedContent(supabaseAdmin, 'projects') };
}
