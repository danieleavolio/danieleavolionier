import { json } from '@sveltejs/kit';
import { listPublishedContent } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function GET({ locals }) {
	const [posts, progetti] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts'),
		listPublishedContent(locals.supabase, 'projects')
	]);

	return json({
		posts: posts.map(({ slug, title, description }) => ({
			slug: `pagine/${slug}`,
			title,
			description
		})),
		progetti: progetti.map(({ slug, title, description }) => ({
			slug: `progetti/${slug}`,
			title,
			description
		}))
	});
}
