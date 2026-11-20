import { error } from '@sveltejs/kit';
import { getContentBySlug, listPublishedContent } from '#lib/server/public-content.ts';
import { selectRelatedPosts } from '#lib/server/related-posts.ts';
import type { RelatedPost } from '#lib/types.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ params, locals }) {
	const post = await getContentBySlug(locals.supabase, 'posts', params.slug);
	if (!post) throw error(404, 'Pagina non trovata');

	let relatedPosts: RelatedPost[] = [];
	try {
		// Lightweight summaries only. No article bodies, editor documents or browser fetches.
		const candidates = await listPublishedContent(locals.supabase, 'posts');
		relatedPosts = selectRelatedPosts(post, candidates);
	} catch (cause) {
		// A secondary recommendation failure must not take the requested article offline.
		console.warn('Related posts unavailable:', cause);
	}

	const { contentHtml, ...meta } = post;
	return { slug: params.slug, meta, contentHtml: contentHtml ?? '', relatedPosts };
}
