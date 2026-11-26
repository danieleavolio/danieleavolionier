import type { PageServerLoad } from './$types';
import { listNotes } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };

export const load = (async ({ locals }) => {
	try {
		return { notes: await listNotes(locals.supabase) };
	} catch (cause) {
		console.error('Error listing notes:', cause);
		return { notes: [] };
	}
}) satisfies PageServerLoad;
