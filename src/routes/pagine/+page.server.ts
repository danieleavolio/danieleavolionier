import { listPublishedContent } from '$lib/server/public-content';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	return { posts: await listPublishedContent(locals.supabase, 'posts', { readingTime: true }) };
}
