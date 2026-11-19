import { error } from '@sveltejs/kit';
import { getContentBySlug, listPublishedContent } from '#lib/server/public-content.ts';
import { selectRelatedPosts } from '#lib/server/related-posts.ts';
import { translateMany } from '#lib/server/translate.ts';
import type { RelatedPost } from '#lib/types.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ params, locals }) {
	const post = await getContentBySlug(locals.supabase, 'posts', params.slug);
	if (!post) throw error(404, 'Pagina non trovata');

	let relatedPosts: RelatedPost[] = [];
	try {
		const candidates = await listPublishedContent(locals.supabase, 'posts');
		relatedPosts = selectRelatedPosts(post, candidates);
	} catch (cause) {
		console.warn('Related posts unavailable:', cause);
	}

	const { contentHtml, ...meta } = post;
	let translatedMeta = meta;
	let translatedHtml = contentHtml ?? '';
	let translatedRelated = relatedPosts;

	if (locals.locale === 'en') {
		const [title, description, html, relatedTitles, relatedDescriptions, relatedReasons] =
			await Promise.all([
				translateMany([meta.title ?? ''], locals.locale),
				translateMany([meta.description ?? ''], locals.locale),
				translateMany([contentHtml ?? ''], locals.locale, true),
				translateMany(
					relatedPosts.map((item) => item.title),
					locals.locale
				),
				translateMany(
					relatedPosts.map((item) => item.description),
					locals.locale
				),
				translateMany(
					relatedPosts.map((item) => item.reason),
					locals.locale
				)
			]);
		translatedMeta = { ...meta, title: title[0], description: description[0] };
		translatedHtml = html[0] ?? translatedHtml;
		translatedRelated = relatedPosts.map((item, index) => ({
			...item,
			title: relatedTitles[index] ?? item.title,
			description: relatedDescriptions[index] ?? item.description,
			reason: relatedReasons[index] ?? item.reason
		}));
	}

	return {
		slug: params.slug,
		meta: translatedMeta,
		contentHtml: translatedHtml,
		relatedPosts: translatedRelated
	};
}
