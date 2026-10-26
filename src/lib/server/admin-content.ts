import { error } from '@sveltejs/kit';
import { sanitizeContentHtml } from '$lib/server/sanitize';
import {
	deletePostImages,
	referencedPostImagePaths,
	storedPostImagePaths
} from '$lib/server/media-cleanup';
import type { RichTextDocument } from '$lib/types';

export type ContentTable = 'posts' | 'projects';

export type EditableContent = {
	slug: string;
	title: string;
	description: string;
	date: string;
	categories: string[];
	image: string;
	published: boolean;
	contentHtml: string;
	contentJson: RichTextDocument | null;
	legacyContent?: string | null;
	metadata: Record<string, unknown>;
};

function normalizeRow(row: Record<string, any>): EditableContent {
	const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
	return {
		slug: row.slug ?? '',
		title: row.title ?? '',
		description: row.description ?? '',
		date: row.date ?? new Date().toISOString().slice(0, 10),
		categories: Array.isArray(row.categories) ? row.categories : [],
		image: row.image ?? '',
		published: row.published !== false,
		contentHtml: row.content_html ?? '',
		contentJson: row.content_json ?? null,
		legacyContent: row.legacy_content ?? row.content ?? null,
		metadata
	};
}

export async function listAdminContent(
	supabase: any,
	table: ContentTable
): Promise<EditableContent[]> {
	const { data, error: queryError } = await supabase
		.from(table)
		.select('*')
		.order('date', { ascending: false });
	if (queryError) throw queryError;
	return (data ?? []).map(normalizeRow);
}

export function emptyContent(): EditableContent {
	return {
		slug: '',
		title: '',
		description: '',
		date: new Date().toISOString().slice(0, 10),
		categories: [],
		image: '',
		published: false,
		contentHtml: '<p></p>',
		contentJson: null,
		metadata: {}
	};
}

function parseJson(value: FormDataEntryValue | null): Record<string, unknown> | null {
	if (!value?.toString()) return null;
	try {
		const parsed = JSON.parse(value.toString());
		return parsed && typeof parsed === 'object' ? parsed : null;
	} catch {
		return null;
	}
}

export async function saveContent(
	supabase: any,
	table: ContentTable,
	form: FormData
): Promise<void> {
	const title = form.get('title')?.toString().trim();
	const slug = form.get('slug')?.toString().trim();
	const description = form.get('description')?.toString().trim();
	if (!title || !slug || !description)
		throw error(400, 'Titolo, slug e descrizione sono obbligatori.');
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
		throw error(400, 'Lo slug può contenere solo lettere minuscole, numeri e trattini.');
	}

	const contentHtml = sanitizeContentHtml(form.get('content_html')?.toString() ?? '');
	const stripped = contentHtml.replace(/<p><\/p>/g, '').trim();
	if (!contentHtml || !stripped) throw error(400, 'Il contenuto non può essere vuoto.');

	const categories = (form.get('categories')?.toString() ?? '')
		.split(',')
		.map((category) => category.trim())
		.filter(Boolean);
	const metadata = parseJson(form.get('metadata')) ?? {};
	const contentJson = parseJson(form.get('content_json')) as RichTextDocument | null;
	const date = form.get('date')?.toString() || new Date().toISOString().slice(0, 10);
	const originalSlug = form.get('original_slug')?.toString().trim();

	// Images uploaded to the post-images bucket are owned by this content item.
	// On save, every bucket image the item no longer references is deleted, so
	// replaced or unused images never pile up.
	const image = form.get('image')?.toString().trim() || '';
	const lookupSlug = originalSlug || slug;
	const { data: existingRow } = await supabase
		.from(table)
		.select('metadata')
		.eq('slug', lookupSlug)
		.maybeSingle();
	const storedImages = storedPostImagePaths(existingRow?.metadata);
	const referencedImages = referencedPostImagePaths({
		contentHtml,
		image,
		metadata
	});
	const nextMetadata = { ...metadata, storageImages: [...referencedImages] };

	const { error: saveError } = await supabase.from(table).upsert({
		slug,
		title,
		description,
		date,
		categories,
		image,
		published: form.get('published') === 'true',
		content_html: contentHtml,
		content_json: contentJson,
		legacy_content: form.get('legacy_content')?.toString() || null,
		metadata: nextMetadata
	});

	if (saveError) throw saveError;

	if (originalSlug && originalSlug !== slug) {
		await supabase.from(table).delete().eq('slug', originalSlug);
	}

	await deletePostImages(storedImages.filter((path) => !referencedImages.has(path)));
}

export async function removeContent(
	supabase: any,
	table: ContentTable,
	slug: string
): Promise<void> {
	if (!slug) throw error(400, 'Slug mancante.');

	const { data: existingRow } = await supabase
		.from(table)
		.select('metadata')
		.eq('slug', slug)
		.maybeSingle();

	const { error: removeError } = await supabase.from(table).delete().eq('slug', slug);
	if (removeError) throw removeError;

	await deletePostImages(storedPostImagePaths(existingRow?.metadata));
}
