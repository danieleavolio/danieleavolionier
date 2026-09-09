import { json } from '@sveltejs/kit';
import { listPublishedContent } from '$lib/server/content';

export async function GET({ locals }) {
	return json(await listPublishedContent(locals.supabase, 'posts'));
}
