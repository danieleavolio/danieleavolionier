import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/content';

export async function load({ params, locals }) {
	const post = await getContentBySlug(locals.supabase, 'posts', params.slug);
	if (!post) throw error(404, 'Pagina non trovata');

	return { slug: params.slug, meta: post, contentHtml: post.contentHtml ?? '' };
}
