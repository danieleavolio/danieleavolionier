import { fail } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth';
import {
	emptyContent,
	listAdminContent,
	removeContent,
	saveContent
} from '$lib/server/admin-content';

export async function load({ locals }) {
	await requireAdmin(locals);
	const items = await listAdminContent(locals.supabase, 'posts');
	return {
		items: items.map((item) => ({ ...item, metadata: { ...item.metadata, contentType: 'posts' } })),
		empty: { ...emptyContent(), metadata: { contentType: 'posts' } }
	};
}

export const actions = {
	save: async ({ request, locals }) => {
		await requireAdmin(locals);
		try {
			await saveContent(locals.supabase, 'posts', await request.formData());
			return { message: 'Post salvato.' };
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
