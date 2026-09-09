import { listNowItems } from '$lib/server/content';

export async function load({ locals }) {
	return { items: await listNowItems(locals.supabase) };
}
