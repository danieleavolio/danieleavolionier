import { fail } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth';
import { listNowItems } from '$lib/server/content';

const empty = {
	id: '',
	title: '',
	description: '',
	category: 'In corso',
	status: 'active',
	link: '',
	position: 0,
	published: true
};

export async function load({ locals }) {
	await requireAdmin(locals);
	return { items: await listNowItems(locals.supabase, true), empty };
}

export const actions = {
	save: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const title = form.get('title')?.toString().trim();
		const description = form.get('description')?.toString().trim();
		if (!title || !description)
			return fail(400, { message: 'Titolo e descrizione sono obbligatori.' });

		const rawStatus = form.get('status')?.toString();
		const status = ['active', 'completed', 'paused'].includes(rawStatus ?? '')
			? rawStatus
			: 'active';
		const payload = {
			title,
			description,
			category: form.get('category')?.toString().trim() || 'In corso',
			status,
			link: form.get('link')?.toString().trim() || null,
			position: Number(form.get('position') ?? 0) || 0,
			published: form.get('published') === 'true'
		};
		const id = form.get('id')?.toString();
		const { error } = id
			? await locals.supabase.from('now_items').update(payload).eq('id', id)
			: await locals.supabase.from('now_items').insert(payload);
		if (error) return fail(400, { message: error.message });
		return { message: 'Aggiornamento Now salvato.' };
	},
	remove: async ({ request, locals }) => {
		await requireAdmin(locals);
		const id = (await request.formData()).get('id')?.toString();
		if (!id) return fail(400, { message: 'Elemento mancante.' });
		const { error } = await locals.supabase.from('now_items').delete().eq('id', id);
		if (error) return fail(400, { message: error.message });
		return { message: 'Aggiornamento eliminato.' };
	}
};
