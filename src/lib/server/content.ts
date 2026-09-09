import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import type { Element, NowItem } from '$lib/types';

export type ContentTable = 'posts' | 'projects';

const allowedTags = [
	'a',
	'blockquote',
	'br',
	'code',
	'div',
	'em',
	'figcaption',
	'figure',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'iframe',
	'img',
	'li',
	'ol',
	'p',
	'pre',
	'source',
	'span',
	'strong',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'ul',
	'video'
];

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
	a: ['href', 'target', 'rel'],
	code: ['class'],
	div: ['class', 'data-rich-block', 'data-images', 'data-grade', 'data-max', 'data-title'],
	figcaption: ['class'],
	iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'frameborder'],
	img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
	pre: ['class'],
	source: ['src', 'type'],
	span: ['class'],
	table: ['class'],
	video: ['src', 'controls', 'width', 'height', 'poster', 'preload']
};

export function sanitizeContentHtml(html: string | null | undefined): string {
	return sanitizeHtml(html ?? '', {
		allowedTags,
		allowedAttributes,
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: false,
		allowedIframeHostnames: [
			'www.youtube.com',
			'youtube.com',
			'open.spotify.com',
			'player.vimeo.com'
		]
	});
}

function extractGalleryImages(source: string, name: string): string[] {
	const declaration = source.match(
		new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm')
	);
	if (!declaration) return [];
	return [...declaration[1].matchAll(/['"](https?:\/\/[^'"]+)['"]/g)].map((match) => match[1]);
}

function replaceLegacyBlocks(source: string, variables: Record<string, unknown> = {}): string {
	let html = source.replace(/<script[\s\S]*?<\/script>/gi, '');

	html = html.replace(/<Gallery\s+images=\{([\w-]+)\}\s*\/>/g, (_match, name: string) => {
		const images = extractGalleryImages(source, name);
		return images.length
			? `<div data-rich-block="gallery" class="rich-gallery" data-images="${images.join('|')}">${images
					.map((image) => `<img src="${image}" alt="Immagine della galleria" loading="lazy">`)
					.join('')}</div>`
			: '';
	});

	html = html.replace(/<Grading\b[\s\S]*?\/>/gi, (match) => {
		const gradeExpression = match.match(/grade=\{([^}]+)\}/i)?.[1]?.trim() ?? '';
		const title = match.match(/title="([^"]+)"/i)?.[1] ?? '';
		const value = variables[gradeExpression];
		const normalizedGrade = String(value ?? gradeExpression).replace(/[^0-9.]/g, '');
		const titleAttribute = title ? ` data-title="${title.replace(/"/g, '&quot;')}"` : '';
		return `<div data-rich-block="grading" data-grade="${normalizedGrade}" data-max="10"${titleAttribute} class="rich-grading">${title ? `<strong>${title}</strong> ` : ''}Valutazione: ${normalizedGrade}/10</div>`;
	});

	return html;
}

export function markdownToHtml(
	markdown: string | null | undefined,
	variables: Record<string, unknown> = {}
): string {
	if (!markdown) return '';
	const prepared = replaceLegacyBlocks(markdown, variables);
	const rendered = marked.parse(prepared, { async: false }) as string;
	return sanitizeContentHtml(rendered);
}

function toElement(row: Record<string, any>, contentType?: ContentTable): Element {
	const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
	const normalizedMetadata = { ...metadata, ...(contentType ? { contentType } : {}) };
	return {
		title: row.title ?? row.slug,
		slug: row.slug,
		description: row.description ?? '',
		date: row.date ?? row.created_at ?? new Date().toISOString(),
		categories: Array.isArray(row.categories) ? row.categories : [],
		published: row.published !== false,
		image: row.image ?? undefined,
		contentHtml: sanitizeContentHtml(row.content_html) || markdownToHtml(row.content, metadata),
		contentJson: row.content_json ?? null,
		legacyContent: row.legacy_content ?? row.content ?? null,
		metadata: normalizedMetadata,
		isReview: Boolean(normalizedMetadata.isReview),
		gameName: normalizedMetadata.gameName,
		gameImage: normalizedMetadata.gameImage,
		ratingValue:
			typeof normalizedMetadata.ratingValue === 'number'
				? normalizedMetadata.ratingValue
				: undefined,
		reviewBody: normalizedMetadata.reviewBody,
		developer: normalizedMetadata.developer
	};
}

export async function listPublishedContent(
	supabase: any,
	table: ContentTable,
	includeDrafts = false
): Promise<Element[]> {
	let query = supabase.from(table).select('*').order('date', { ascending: false });
	if (!includeDrafts) query = query.eq('published', true);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []).map((row: Record<string, any>) => toElement(row, table));
}

export async function getContentBySlug(
	supabase: any,
	table: ContentTable,
	slug: string,
	includeDrafts = false
): Promise<Element | null> {
	let query = supabase.from(table).select('*').eq('slug', slug).maybeSingle();
	if (!includeDrafts) query = query.eq('published', true);
	const { data, error } = await query;
	if (error) throw error;
	return data ? toElement(data, table) : null;
}

export async function listNowItems(supabase: any, includeDrafts = false): Promise<NowItem[]> {
	let query = supabase.from('now_items').select('*').order('position', { ascending: true });
	if (!includeDrafts) query = query.eq('published', true);
	const { data, error } = await query;
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
