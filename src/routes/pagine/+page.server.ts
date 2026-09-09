import { listPublishedContent } from '$lib/server/public-content';

export async function load({ locals }) {
	return { posts: await listPublishedContent(locals.supabase, 'posts') };
}
