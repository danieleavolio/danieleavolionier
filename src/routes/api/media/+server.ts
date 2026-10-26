import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth';
import { supabaseAdmin } from '$lib/server/supabase';

const BUCKET = 'post-images';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'image/avif': '.avif'
};

// Vercel serverless functions have a ~4.5 MB request body limit, so keep the
// limit slightly below it.
function mediaPath(contentType: string): string {
	const extension = EXTENSION_BY_TYPE[contentType] ?? '';
	const now = new Date();
	const stamp = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, '0'),
		String(now.getDate()).padStart(2, '0')
	].join('');
	return `posts/${stamp}-${crypto.randomUUID()}${extension}`;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	await requireAdmin(locals);

	const form = await request.formData().catch(() => null);
	if (!form) return json({ message: 'Corpo della richiesta non valido.' }, { status: 400 });

	const file = form.get('file');
	if (!(file instanceof File)) return json({ message: 'Nessun file ricevuto.' }, { status: 400 });
	const { type: contentType } = file;
	if (!contentType || !(contentType in EXTENSION_BY_TYPE)) {
		return json(
			{ message: 'Formato immagine non supportato (usa jpg, png, webp, gif o avif).' },
			{ status: 400 }
		);
	}
	if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
		return json({ message: 'L\u2019immagine supera il limite di 4 MB.' }, { status: 400 });
	}

	const path = mediaPath(contentType);
	const { error: uploadError } = await supabaseAdmin.storage
		.from(BUCKET)
		.upload(path, file, { contentType, cacheControl: '2678400', upsert: false });

	if (uploadError) {
		console.error('Image upload to Supabase Storage failed:', uploadError);
		return json(
			{ message: 'Caricamento nel cloud non riuscito: ' + uploadError.message },
			{
				status: 502
			}
		);
	}

	const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
	return json({ url: data.publicUrl, path });
};
