import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/auth.ts';
import { supabaseAdmin } from '#lib/server/supabase.ts';

const BUCKET = 'notes';
const MAX_PDF_BYTES = 50 * 1024 * 1024;

function slugify(name: string): string {
	const base = name
		.replace(/\.pdf$/i, '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	return base.slice(0, 60) || 'appunti';
}

// Il browser carica il PDF direttamente su Supabase con l'URL firmato: il file
// non passa dalla funzione Vercel (limite ~4,5 MB sul corpo della richiesta).
export const POST: RequestHandler = async ({ request, locals }) => {
	await requireAdmin(locals);

	const body = await request.json().catch(() => null);
	const name = typeof body?.name === 'string' ? body.name : '';
	const size = Number(body?.size);
	const type = typeof body?.type === 'string' ? body.type : '';
	if (!name || type !== 'application/pdf')
		return json({ message: 'Carica un file PDF.' }, { status: 400 });
	if (!Number.isFinite(size) || size <= 0 || size > MAX_PDF_BYTES)
		return json({ message: 'Il PDF supera il limite di 50 MB.' }, { status: 400 });

	const path = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}-${slugify(name)}.pdf`;
	const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);
	if (error || !data) {
		console.error('Signed upload URL failed:', error);
		return json(
			{ message: 'Impossibile preparare il caricamento: ' + (error?.message ?? 'errore') },
			{ status: 502 }
		);
	}
	const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
	return json({ signedUrl: data.signedUrl, path, url: pub.publicUrl });
};
