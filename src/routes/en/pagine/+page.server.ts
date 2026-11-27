import type { Lang } from '#lib/i18n.ts';
import {
	listPublishedContent,
	listTranslations,
	withTranslations
} from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	const [posts, translations] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts', { readingTime: true }),
		listTranslations(locals.supabase, 'en').catch(() => new Map())
	]);
	return {
		lang: 'en' as Lang,
		posts: withTranslations(posts, translations),
		alternates: { it: '/pagine', en: '/en/pagine' }
	};
}
