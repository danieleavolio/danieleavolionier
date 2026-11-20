import { json } from '@sveltejs/kit';
import { translateMany } from '#lib/server/translate.ts';

export async function POST({ request }) {
	const body = (await request.json()) as { texts?: string[]; html?: boolean };
	const texts = Array.isArray(body.texts) ? body.texts : [];
	const translations = await translateMany(texts, 'en', body.html === true);
	return json({ translations });
}
