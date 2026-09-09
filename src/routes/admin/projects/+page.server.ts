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
	const items = await listAdminContent(locals.supabase, 'projects');
	return {
		items: items.map((item) => ({
			...item,
			metadata: { ...item.metadata, contentType: 'projects' }
		})),
		empty: { ...emptyContent(), metadata: { contentType: 'projects' } }
	};
}

export const actions = {
	save: async ({ request, locals }) => {
		await requireAdmin(locals);
		try {
			await saveContent(locals.supabase, 'projects', await request.formData());
			return { message: 'Progetto salvato.' };
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : 'Salvataggio non riuscito.';
			return fail(400, { message });
		}
	},
	remove: async ({ request, locals }) => {
		await requireAdmin(locals);
		try {
			const form = await request.formData();
			await removeContent(locals.supabase, 'projects', form.get('slug')?.toString() ?? '');
			return { message: 'Progetto eliminato.' };
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : 'Eliminazione non riuscita.';
			return fail(400, { message });
		}
	}
};
