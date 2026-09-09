import { listPublishedContent } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load() {
	const [posts, progetti] = await Promise.all([
		listPublishedContent(supabaseAdmin, 'posts'),
		listPublishedContent(supabaseAdmin, 'projects')
	]);

	return { posts, progetti };
}
