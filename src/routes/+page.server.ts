import { listPublishedContent } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };
import { translateElements } from '#lib/server/translate.ts';

export async function load({ locals }) {
	const [posts, progetti] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts', { limit: 3 }),
		listPublishedContent(locals.supabase, 'projects', { limit: 3 })
	]);

	return {
		posts: await translateElements(posts, locals.locale),
		progetti: await translateElements(progetti, locals.locale)
	};
}
