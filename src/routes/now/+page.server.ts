import { listNowItems } from '$lib/server/public-content';

export async function load({ locals }) {
	return { items: await listNowItems(locals.supabase) };
}
