import { listNowItems } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	return { items: await listNowItems(locals.supabase) };
}
