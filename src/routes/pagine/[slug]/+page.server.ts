import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/public-content';

export const config = { isr: { expiration: 300 } };

export async function load({ params, locals }) {
	const post = await getContentBySlug(locals.supabase, 'posts', params.slug);
	if (!post) throw error(404, 'Pagina non trovata');

	const { contentHtml, ...meta } = post;
	return { slug: params.slug, meta, contentHtml: contentHtml ?? '' };
}
