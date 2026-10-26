const UPLOAD_ENDPOINT = '/api/media';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/avif'
]);

export type MediaUploadResult = {
	url: string;
	path: string;
};

export function findImageFiles(dataTransfer: DataTransfer | null): File[] {
	if (!dataTransfer) return [];
	return Array.from(dataTransfer.files).filter(
		(file) => file.type && ALLOWED_IMAGE_TYPES.has(file.type)
	);
}

/**
 * Uploads an image to the server, which stores it in the Supabase Storage
 * `post-images` bucket and returns its public URL.
 */
export async function uploadImage(file: File): Promise<MediaUploadResult> {
	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		throw new Error('Formato immagine non supportato (usa jpg, png, webp, gif o avif).');
	}
	if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
		throw new Error('L\u2019immagine supera il limite di 4 MB.');
	}

	const body = new FormData();
	body.append('file', file);

	const response = await fetch(UPLOAD_ENDPOINT, { method: 'POST', body });

	let payload: { url?: string; path?: string; message?: string } | null = null;
	try {
		payload = await response.json();
	} catch {
		// A non-JSON error page from the server; fall through to the generic message.
	}

	if (!response.ok || !payload?.url) {
		throw new Error(payload?.message ?? 'Caricamento dell\u2019immagine non riuscito.');
	}

	return { url: payload.url, path: payload.path ?? '' };
}
