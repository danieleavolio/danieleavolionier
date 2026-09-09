import { listPublishedContent } from '$lib/server/public-content';

export async function load({ locals }) {
	return { progetti: await listPublishedContent(locals.supabase, 'projects') };
}
