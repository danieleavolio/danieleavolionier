import { json } from '@sveltejs/kit';
import {
	listPublishedContent,
	listTranslations,
	withTranslations
} from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

// Indice di ricerca inglese: solo gli articoli tradotti. In una route a parte perché
// l'ISR non distingue le query string.
export async function GET({ locals }) {
	const [posts, translations] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts'),
		listTranslations(locals.supabase, 'en').catch(() => new Map())
	]);
	return json({
		posts: withTranslations(posts, translations).map(({ slug, title, description }) => ({
			slug: `en/pagine/${slug}`,
			title,
			description
		})),
		progetti: [],
		notes: []
	});
}
