import type { Element, NowItem } from '$lib/types';
import { convertGradingTags } from '$lib/rich-grading';
import { repairPlainMarkdownHtml } from '$lib/server/markdown-repair';
import { calculateReadingTime } from '$lib/utils';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentRow } from './content-row';

export type PublicContentTable = 'posts' | 'projects';

function toElement(row: ContentRow, contentType: PublicContentTable): Element {
	const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
	return {
		title: row.title ?? row.slug,
		slug: row.slug,
		description: row.description ?? '',
		date: row.date ?? row.created_at ?? new Date().toISOString(),
		categories: Array.isArray(row.categories) ? row.categories : [],
		published: row.published !== false,
		updatedAt: row.updated_at ?? undefined,
		image: row.image ?? undefined,
		contentHtml: prepareMedia(
			convertGradingTags(repairPlainMarkdownHtml(row.content_html ?? ''), metadata)
		),
		metadata: { contentType },
		isReview: Boolean(metadata.isReview),
		gameName: metadata.gameName,
		gameImage: metadata.gameImage,
		ratingValue: typeof metadata.ratingValue === 'number' ? metadata.ratingValue : undefined,
		reviewBody: metadata.reviewBody,
		developer: metadata.developer
	};
}

function prepareMedia(html: string): string {
	// Article-body media is below the title/cover, so it must not compete with LCP.
	return html.replace(
		/<(img|iframe|video)\b([^>]*)>/gi,
		(tag, name: string, attributes: string) => {
			let additions = '';
			if (name.toLowerCase() === 'video') {
				if (!/\bpreload\s*=/i.test(attributes)) additions += ' preload="metadata"';
			} else {
				if (!/\bloading\s*=/i.test(attributes)) additions += ' loading="lazy"';
				if (name.toLowerCase() === 'img' && !/\bdecoding\s*=/i.test(attributes))
					additions += ' decoding="async"';
			}
			return tag.replace(/\s*\/?\s*>$/, `${additions}>`);
		}
	);
}

export async function listPublishedContent(
	supabase: SupabaseClient,
	table: PublicContentTable,
	options: { limit?: number; readingTime?: boolean } = {}
): Promise<Element[]> {
	const columns = 'slug,title,description,date,categories,image,updated_at';
	let query = supabase
		.from(table)
		.select(options.readingTime ? `${columns},content_html` : columns)
		.eq('published', true)
		.order('date', { ascending: false });
	if (options.limit) query = query.limit(options.limit);
	const { data, error } = await query.returns<ContentRow[]>();
	if (error) throw error;
	return (data ?? []).map((row: ContentRow) => ({
		slug: row.slug,
		title: row.title ?? row.slug,
		description: row.description ?? '',
		date: row.date,
		categories: Array.isArray(row.categories) ? row.categories : [],
		image: row.image || undefined,
		updatedAt: row.updated_at ?? undefined,
		published: true,
		...(options.readingTime
			? {
					readingTime: calculateReadingTime(
						repairPlainMarkdownHtml(row.content_html) || row.description
					)
				}
			: {})
	}));
}

export async function getContentBySlug(
	supabase: SupabaseClient,
	table: PublicContentTable,
	slug: string,
	options: { metadataOnly?: boolean } = {}
): Promise<Element | null> {
	const { data, error } = await supabase
		.from(table)
		.select(
			options.metadataOnly
				? 'slug,title,description,date,updated_at'
				: 'slug,title,description,date,categories,image,published,content_html,metadata,updated_at'
		)
		.eq('slug', slug)
		.eq('published', true)
		.maybeSingle<ContentRow>();
	if (error) throw error;
	return data ? toElement(data, table) : null;
}

export async function listNowItems(
	supabase: SupabaseClient,
	includeDrafts = false
): Promise<NowItem[]> {
	let query = supabase.from('now_items').select('*').order('position', { ascending: true });
	if (!includeDrafts) query = query.eq('published', true);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as NowItem[];
}

export async function listContentMetadata(
	supabase: SupabaseClient,
	table: PublicContentTable
): Promise<Pick<Element, 'slug' | 'title' | 'description' | 'date' | 'updatedAt'>[]> {
	const { data, error } = await supabase
		.from(table)
		.select('slug,title,description,date,updated_at')
		.eq('published', true)
		.order('date', { ascending: false });
	if (error) throw error;
	return (data ?? []).map((row: ContentRow) => ({
		slug: row.slug,
		title: row.title ?? row.slug,
		description: row.description ?? '',
		date: row.date,
		updatedAt: row.updated_at ?? undefined
	}));
}
