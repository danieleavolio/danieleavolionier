import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load({ params }) {
	const post = await getContentBySlug(supabaseAdmin, 'posts', params.slug);
	if (!post) throw error(404, 'Pagina non trovata');

	return { slug: params.slug, meta: post, contentHtml: post.contentHtml ?? '' };
}
