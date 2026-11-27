import type { Lang } from '#lib/i18n.ts';
import { listPublishedContent, listTranslations } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	const posts = await listPublishedContent(locals.supabase, 'posts', { readingTime: true });
	// Il selettore di lingua compare solo se esiste almeno una traduzione.
	const translated = await listTranslations(locals.supabase, 'en').catch(() => new Map());
	return {
		lang: 'it' as Lang,
		posts,
		alternates: { it: '/pagine', en: translated.size ? '/en/pagine' : null }
	};
}
