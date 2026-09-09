import { listPublishedContent } from '$lib/server/content';

export async function load({ locals }) {
	return { progetti: await listPublishedContent(locals.supabase, 'projects') };
}
