import { error } from '@sveltejs/kit';
import { getContentBySlug } from '$lib/server/public-content';

export async function load({ params, locals }) {
	const project = await getContentBySlug(locals.supabase, 'projects', params.slug);
	if (!project) throw error(404, 'Pagina non trovata');

	return { slug: params.slug, meta: project, contentHtml: project.contentHtml ?? '' };
}
