import { error, redirect } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lang } from '#lib/i18n.ts';
import {
	getContentBySlug,
	getTranslatedContent,
	listPublishedContent,
	listTranslations,
	type TranslationSummary,
	withTranslations
} from '#lib/server/public-content.ts';
import { selectRelatedPosts } from '#lib/server/related-posts.ts';
import type { RelatedPost } from '#lib/types.ts';

/** Dati di un articolo in italiano o in inglese; in inglese, senza traduzione, torna all'italiano. */
export async function loadArticle(supabase: SupabaseClient, slug: string, lang: Lang) {
	const post = await getContentBySlug(supabase, 'posts', slug);
	if (!post) throw error(404, 'Pagina non trovata');

	let translations = new Map<string, TranslationSummary>();
	try {
		translations = await listTranslations(supabase, 'en');
	} catch (cause) {
		// Prima della migrazione la tabella non esiste: il sito resta in italiano.
		console.warn('Translations unavailable:', cause);
	}
	const hasEnglish = translations.has(slug);

	let shown = post;
	if (lang === 'en') {
		const translated = hasEnglish ? await getTranslatedContent(supabase, slug, 'en') : null;
		if (!translated) throw redirect(302, `/pagine/${encodeURIComponent(slug)}`);
		shown = { ...post, ...translated };
	}

	let relatedPosts: RelatedPost[] = [];
	try {
		// Lightweight summaries only. No article bodies, editor documents or browser fetches.
		const candidates = await listPublishedContent(supabase, 'posts');
		const pool =
			lang === 'en' ? candidates.filter((item) => translations.has(item.slug)) : candidates;
		relatedPosts = selectRelatedPosts(post, pool, lang);
		if (lang === 'en') relatedPosts = withTranslations(relatedPosts, translations);
	} catch (cause) {
		// A secondary recommendation failure must not take the requested article offline.
		console.warn('Related posts unavailable:', cause);
	}

	const { contentHtml, ...meta } = shown;
	return {
		slug,
		lang,
		meta,
		contentHtml: contentHtml ?? '',
		relatedPosts,
		alternates: {
			it: `/pagine/${encodeURIComponent(slug)}`,
			en: hasEnglish ? `/en/pagine/${encodeURIComponent(slug)}` : null
		}
	};
}
