import { listPublishedContent } from '$lib/server/content';

export async function load({ locals }) {
	const [posts, progetti] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts'),
		listPublishedContent(locals.supabase, 'projects')
	]);

	return { posts, progetti };
}
