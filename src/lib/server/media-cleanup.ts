import { supabaseAdmin } from '$lib/server/supabase';

export const POST_IMAGES_BUCKET = 'post-images';

const PUBLIC_URL_PATTERN = /\/storage\/v1\/object\/public\/post-images\/([^?<>"'\s,]+)/;

/**
 * Returns the path inside the `post-images` bucket when [value] points at an
 * image stored there, null for every other URL (remote or static assets).
 */
export function postImagePathFromUrl(value: unknown): string | null {
	if (typeof value !== 'string' || !value.trim()) return null;
	const match = value.match(PUBLIC_URL_PATTERN);
	return match ? decodeURIComponent(match[1]) : null;
}

function pushPathFromHtmlAttribute(paths: Set<string>, html: string, attribute: string): void {
	const pattern = new RegExp(`${attribute}=["']([^"']+)["']`, 'g');
	for (const match of html.matchAll(pattern)) {
		for (const part of match[1].split(',')) {
			const path = postImagePathFromUrl(part);
			if (path) paths.add(path);
		}
	}
} /**
 * Collects every bucket path the content references: inline images and media
 * sources in the HTML, gallery blocks (`data-images` attributes) and the two
 * metadata/cover image fields.
 */
export function referencedPostImagePaths(input: {
	contentHtml: string;
	image: string;
	metadata: Record<string, unknown>;
}): Set<string> {
	const paths = new Set<string>();
	const html = input.contentHtml ?? '';

	for (const attribute of ['src', 'poster', 'data-images']) {
		pushPathFromHtmlAttribute(paths, html, attribute);
	}

	const cover = postImagePathFromUrl(input.image);
	if (cover) paths.add(cover);

	const gameImage = postImagePathFromUrl(input.metadata?.gameImage);
	if (gameImage) paths.add(gameImage);

	return paths;
}

export function storedPostImagePaths(
	metadata: Record<string, unknown> | null | undefined
): string[] {
	const stored = metadata?.storageImages;
	return Array.isArray(stored)
		? stored.filter((path): path is string => typeof path === 'string')
		: [];
}

/**
 * Deletes images from the `post-images` bucket. Failures are logged, not
 * thrown: cleanup must never prevent a content save that already happened.
 */
export async function deletePostImages(paths: string[]): Promise<void> {
	const unique = [...new Set(paths)].filter(Boolean);
	if (unique.length === 0) return;

	const { error } = await supabaseAdmin.storage.from(POST_IMAGES_BUCKET).remove(unique);
	if (error) console.error('Failed to delete unused post images:', error);
}
