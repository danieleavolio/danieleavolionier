import { error, redirect } from '@sveltejs/kit';

export async function requireAdmin(locals: App.Locals): Promise<NonNullable<App.Locals['user']>> {
	let user = locals.user;
	if (!user) {
		try {
			const { data, error: userError } = await locals.supabase.auth.getUser();
			user = !userError && data?.user ? data.user : null;
		} catch {
			user = null;
		}
	}
	if (!user) throw redirect(303, '/admin/login');
	if (!locals.isAdmin) throw error(403, 'Accesso amministratore richiesto');
	return user;
}
