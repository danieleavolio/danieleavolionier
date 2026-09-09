import { listPublishedContent } from '$lib/server/content';

export async function load({ locals }) {
	return { posts: await listPublishedContent(locals.supabase, 'posts') };
}
