import { error } from '@sveltejs/kit';
import { getContentBySlug } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ params, locals }) {
	const project = await getContentBySlug(locals.supabase, 'projects', params.slug);
	if (!project) throw error(404, 'Pagina non trovata');

	const { contentHtml, ...meta } = project;
	return { slug: params.slug, meta, contentHtml: contentHtml ?? '' };
}
