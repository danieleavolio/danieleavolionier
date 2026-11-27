import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { deeplTranslator, translateArticle, type TranslateFn } from '#lib/server/translate.ts';

export type SyncResult = 'updated' | 'unchanged' | 'skipped' | 'failed';
export type TranslatablePost = {
	slug: string;
	title: string;
	description: string;
	contentHtml: string;
	published: boolean;
};

/** Impronta dell'italiano: se cambia, la traduzione è da rifare. */
export const sourceHash = ({ title, description, contentHtml }: TranslatablePost) =>
	createHash('sha256')
		.update(JSON.stringify([title, description, contentHtml]))
		.digest('hex');

/**
 * Traduce un articolo in inglese e lo salva in `translations`. Non lancia mai:
 * un errore di DeepL o di rete non deve impedire il salvataggio dell'articolo.
 */
export async function syncTranslation(
	supabase: SupabaseClient,
	post: TranslatablePost,
	options: { apiKey?: string; force?: boolean; translate?: TranslateFn } = {}
): Promise<SyncResult> {
	const translate =
		options.translate ?? (options.apiKey ? deeplTranslator(options.apiKey) : undefined);
	if (!translate || !post.published) return 'skipped';

	try {
		const hash = sourceHash(post);
		if (!options.force) {
			const { data } = await supabase
				.from('translations')
				.select('source_hash')
				.eq('slug', post.slug)
				.eq('lang', 'en')
				.maybeSingle<{ source_hash: string }>();
			if (data?.source_hash === hash) return 'unchanged';
		}
		const result = await translateArticle(post, translate);
		const { error } = await supabase.from('translations').upsert({
			slug: post.slug,
			lang: 'en',
			title: result.title,
			description: result.description,
			content_html: result.contentHtml,
			source_hash: hash
		});
		if (error) throw error;
		return 'updated';
	} catch (cause) {
		console.warn(`Traduzione di "${post.slug}" non riuscita:`, cause);
		return 'failed';
	}
}

export async function deleteTranslations(supabase: SupabaseClient, slug: string): Promise<void> {
	const { error } = await supabase.from('translations').delete().eq('slug', slug);
	if (error) console.warn(`Traduzioni di "${slug}" non cancellate:`, error);
}
