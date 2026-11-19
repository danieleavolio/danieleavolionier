import { error } from '@sveltejs/kit';
import { getContentBySlug } from '#lib/server/public-content.ts';
import { translateMany } from '#lib/server/translate.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ params, locals }) {
	const project = await getContentBySlug(locals.supabase, 'projects', params.slug);
	if (!project) throw error(404, 'Pagina non trovata');

	const { contentHtml, ...meta } = project;
	let translatedMeta = meta;
	let translatedHtml = contentHtml ?? '';

	if (locals.locale === 'en') {
		const [title, description, html] = await Promise.all([
			translateMany([meta.title ?? ''], locals.locale),
			translateMany([meta.description ?? ''], locals.locale),
			translateMany([contentHtml ?? ''], locals.locale, true)
		]);
		translatedMeta = { ...meta, title: title[0], description: description[0] };
		translatedHtml = html[0] ?? translatedHtml;
	}

	return { slug: params.slug, meta: translatedMeta, contentHtml: translatedHtml };
}
