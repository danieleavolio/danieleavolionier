import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.isAdmin) throw redirect(303, '/admin/posts');
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString().trim();
		const password = form.get('password')?.toString();

		if (!email || !password) return fail(400, { message: 'Inserisci email e password.' });

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
		if (error) return fail(401, { message: 'Credenziali non valide.' });

		throw redirect(303, '/admin/posts');
	},
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
