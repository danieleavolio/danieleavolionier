import type { Element, NowItem } from '$lib/types';

export type PublicContentTable = 'posts' | 'projects';

function toElement(row: Record<string, any>, contentType: PublicContentTable): Element {
	const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
	return {
		title: row.title ?? row.slug,
		slug: row.slug,
		description: row.description ?? '',
		date: row.date ?? row.created_at ?? new Date().toISOString(),
		categories: Array.isArray(row.categories) ? row.categories : [],
		published: row.published !== false,
		image: row.image ?? undefined,
		contentHtml: row.content_html ?? '',
		contentJson: row.content_json ?? null,
		legacyContent: row.legacy_content ?? row.content ?? null,
		metadata: { ...metadata, contentType },
		isReview: Boolean(metadata.isReview),
		gameName: metadata.gameName,
		gameImage: metadata.gameImage,
		ratingValue: typeof metadata.ratingValue === 'number' ? metadata.ratingValue : undefined,
		reviewBody: metadata.reviewBody,
		developer: metadata.developer
	};
}

export async function listPublishedContent(
	supabase: any,
	table: PublicContentTable
): Promise<Element[]> {
	const { data, error } = await supabase
		.from(table)
		.select('*')
		.eq('published', true)
		.order('date', { ascending: false });
	if (error) throw error;
	return (data ?? []).map((row: Record<string, any>) => toElement(row, table));
}

export async function getContentBySlug(
	supabase: any,
	table: PublicContentTable,
	slug: string
): Promise<Element | null> {
	const { data, error } = await supabase
		.from(table)
		.select('*')
		.eq('slug', slug)
		.eq('published', true)
		.maybeSingle();
	if (error) throw error;
	return data ? toElement(data, table) : null;
}

export async function listNowItems(supabase: any): Promise<NowItem[]> {
	const { data, error } = await supabase
		.from('now_items')
		.select('*')
		.eq('published', true)
		.order('position', { ascending: true });
	if (error) throw error;
	return (data ?? []) as NowItem[];
}

export async function searchContent(supabase: any): Promise<Element[]> {
	const [posts, projects] = await Promise.all([
		listPublishedContent(supabase, 'posts'),
		listPublishedContent(supabase, 'projects')
	]);
	return [...posts, ...projects];
}
