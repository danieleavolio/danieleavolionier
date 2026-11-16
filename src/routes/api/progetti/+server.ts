import { json } from '@sveltejs/kit';
import { listPublishedContent } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function GET({ locals }) {
	return json(await listPublishedContent(locals.supabase, 'projects'));
}
