import { listPublishedContent } from '#lib/server/public-content.ts';
import { translateElements } from '#lib/server/translate.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	const posts = await listPublishedContent(locals.supabase, 'posts', { readingTime: true });
	return { posts: await translateElements(posts, locals.locale) };
}
