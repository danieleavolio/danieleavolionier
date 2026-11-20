import { listPublishedContent } from '#lib/server/public-content.ts';

export const config = { isr: { expiration: 300 } };
import { translateElements } from '#lib/server/translate.ts';

export async function load({ locals }) {
	const progetti = await listPublishedContent(locals.supabase, 'projects');
	return { progetti: await translateElements(progetti, locals.locale) };
}
