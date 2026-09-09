import { error, redirect } from '@sveltejs/kit';

export async function requireAdmin(locals: App.Locals): Promise<NonNullable<App.Locals['user']>> {
	const user = locals.user ?? (await locals.supabase.auth.getUser()).data.user;
	if (!user) throw redirect(303, '/admin/login');
	if (!locals.isAdmin) throw error(403, 'Accesso amministratore richiesto');
	return user;
}
