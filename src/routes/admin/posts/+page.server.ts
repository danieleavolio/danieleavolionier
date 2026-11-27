import { fail } from '@sveltejs/kit';
import { DEEPL_API_KEY } from '$app/env/private';
import { requireAdmin } from '#lib/server/auth.ts';
import {
	emptyContent,
	listAdminContent,
	removeContent,
	saveContent
} from '#lib/server/admin-content.ts';

// Il salvataggio aspetta DeepL: un articolo lungo può richiedere più dei 10 secondi di base.
export const config = { maxDuration: 60 };

export async function load({ locals }) {
	await requireAdmin(locals);
	try {
		const items = await listAdminContent(locals.supabase, 'posts');
		return {
			items: items.map((item) => ({
				...item,
				metadata: { ...item.metadata, contentType: 'posts' }
			})),
			empty: { ...emptyContent(), metadata: { contentType: 'posts' } }
		};
	} catch (cause) {
		console.error('Error listing admin posts:', cause);
		return {
			items: [],
			empty: { ...emptyContent(), metadata: { contentType: 'posts' } }
		};
	}
}

export const actions = {
	save: async ({ request, locals }) => {
		await requireAdmin(locals);
		try {
			const translation = await saveContent(locals.supabase, 'posts', await request.formData(), {
				deeplApiKey: DEEPL_API_KEY
			});
			const note = {
				updated: ' Traduzione inglese aggiornata.',
				unchanged: ' Traduzione inglese già aggiornata.',
				failed: ' Traduzione inglese non riuscita: l’articolo resta solo in italiano.',
				skipped: '',
				'n/a': ''
			}[translation];
			return { message: `Post salvato.${note}` };
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : 'Salvataggio non riuscito.';
			return fail(400, { message });
		}
	},
	remove: async ({ request, locals }) => {
		await requireAdmin(locals);
		try {
			const form = await request.formData();
			await removeContent(locals.supabase, 'posts', form.get('slug')?.toString() ?? '');
			return { message: 'Post eliminato.' };
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : 'Eliminazione non riuscita.';
			return fail(400, { message });
		}
	}
};
