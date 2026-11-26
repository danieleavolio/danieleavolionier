import { fail } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/auth.ts';
import { listNotes } from '#lib/server/public-content.ts';
import { supabaseAdmin } from '#lib/server/supabase.ts';

const empty = {
	id: '',
	title: '',
	description: '',
	category: 'Magistrale',
	file_url: '',
	file_path: '',
	position: 0,
	published: true
};

async function removeStoredFile(path: string | null | undefined) {
	if (!path) return;
	const { error } = await supabaseAdmin.storage.from('notes').remove([path]);
	if (error) console.error('Cannot remove note file:', error);
}

export async function load({ locals }) {
	await requireAdmin(locals);
	try {
		return { items: await listNotes(locals.supabase, true), empty };
	} catch (cause) {
		console.error('Error listing admin notes:', cause);
		return { items: [], empty };
	}
}

export const actions = {
	save: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const title = form.get('title')?.toString().trim();
		const fileUrl = form.get('file_url')?.toString().trim();
		if (!title || !fileUrl) return fail(400, { message: 'Titolo e link o PDF sono obbligatori.' });

		const filePath = form.get('file_path')?.toString().trim() || null;
		const payload = {
			title,
			description: form.get('description')?.toString().trim() ?? '',
			category: form.get('category')?.toString().trim() || 'Altro',
			file_url: fileUrl,
			file_path: filePath,
			position: Number(form.get('position') ?? 0) || 0,
			published: form.get('published') === 'true'
		};
		const id = form.get('id')?.toString();
		if (id) {
			const { data: previous } = await locals.supabase
				.from('notes')
				.select('file_path')
				.eq('id', id)
				.maybeSingle();
			const { error } = await locals.supabase.from('notes').update(payload).eq('id', id);
			if (error) return fail(400, { message: error.message });
			if (previous?.file_path && previous.file_path !== filePath)
				await removeStoredFile(previous.file_path);
		} else {
			const { error } = await locals.supabase.from('notes').insert(payload);
			if (error) return fail(400, { message: error.message });
		}
		return { message: 'Appunto salvato.' };
	},
	remove: async ({ request, locals }) => {
		await requireAdmin(locals);
		const id = (await request.formData()).get('id')?.toString();
		if (!id) return fail(400, { message: 'Elemento mancante.' });
		const { data: previous } = await locals.supabase
			.from('notes')
			.select('file_path')
			.eq('id', id)
			.maybeSingle();
		const { error } = await locals.supabase.from('notes').delete().eq('id', id);
		if (error) return fail(400, { message: error.message });
		await removeStoredFile(previous?.file_path);
		return { message: 'Appunto eliminato.' };
	}
};
