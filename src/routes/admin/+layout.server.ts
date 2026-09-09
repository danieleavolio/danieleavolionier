import { requireAdmin } from '$lib/server/auth';

export async function load({ locals, url }) {
	if (url.pathname !== '/admin/login') await requireAdmin(locals);
	return { user: locals.user ? { email: locals.user.email } : null, isAdmin: locals.isAdmin };
}
