import { listPublishedContent } from '#lib/server/public-content.ts';
import { translateElements } from '#lib/server/translate.ts';

export const config = { isr: { expiration: 300 } };

export async function load({ locals }) {
	const progetti = await listPublishedContent(locals.supabase, 'projects');
	return { progetti: await translateElements(progetti, locals.locale) };
}
