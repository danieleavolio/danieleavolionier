import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load({ params }) {
	const project = await getContentBySlug(supabaseAdmin, 'projects', params.slug);
	if (!project) throw error(404, 'Pagina non trovata');

	return { slug: params.slug, meta: project, contentHtml: project.contentHtml ?? '' };
}
