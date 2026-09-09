import { listPublishedContent } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load() {
	return { posts: await listPublishedContent(supabaseAdmin, 'posts') };
}
