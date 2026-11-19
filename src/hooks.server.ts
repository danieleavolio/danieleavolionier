import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit/hooks';
import { error as httpError } from '@sveltejs/kit';
import { supabaseAnonKey, supabaseUrl } from '#lib/supabaseConfig.ts';
import { publicSupabase } from '#lib/server/public-supabase.ts';
import { detectLocale } from '#lib/i18n.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	let requested: string | null = null;
	try {
		requested = event.url.searchParams.get('lang');
	} catch {
		// Prerendered pages have no query string.
	}
	const acceptLanguage = event.request?.headers?.get?.('accept-language');
	event.locals.locale =
		requested === 'it' || requested === 'en' ? requested : detectLocale(acceptLanguage);
	const needsAuth =
		pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/api/media';
	if (!needsAuth) {
		event.locals.supabase = publicSupabase;
		event.locals.user = null;
		event.locals.isAdmin = false;
		event.locals.getSession = async () => null;
		const response = await resolve(event);
		if (pathname === '/end-of-the-lova') response.headers.set('X-Robots-Tag', 'noindex, nofollow');
		return response;
	}

	// Authenticated pages and uploads must never use shared caches.
	event.setHeaders({ 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' });
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.getSession = async () => {
		try {
			const {
				data: { session }
			} = await event.locals.supabase.auth.getSession();
			return session;
		} catch {
			return null;
		}
	};

	try {
		const { data, error } = await event.locals.supabase.auth.getUser();
		const user = !error && data?.user ? data.user : null;
		event.locals.user = user;

		if (user) {
			const { data: adminRecord } = await event.locals.supabase
				.from('admin_users')
				.select('user_id')
				.eq('user_id', user.id)
				.maybeSingle();
			event.locals.isAdmin = Boolean(adminRecord);
		} else {
			event.locals.isAdmin = false;
		}
	} catch {
		event.locals.user = null;
		event.locals.isAdmin = false;
	}

	// /admin is client-rendered, so its layout loader alone cannot guard the
	// initial HTML request. Enforce the same boundary before resolving it.
	if ((pathname === '/admin' || pathname.startsWith('/admin/')) && pathname !== '/admin/login') {
		if (!event.locals.user && !event.isDataRequest)
			return new Response(null, {
				status: 303,
				headers: {
					Location: '/admin/login',
					'Cache-Control': 'private, no-store',
					'X-Robots-Tag': 'noindex, nofollow'
				}
			});
		if (event.locals.user && !event.locals.isAdmin)
			throw httpError(403, 'Accesso amministratore richiesto');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

export const handleError: import('@sveltejs/kit/hooks').HandleServerError = ({
	error,
	event,
	kind
}) => {
	// Kit 3 also passes expected errors (404, 403, etc.). Keep their status and message.
	if (kind !== 'unknown') return;
	console.error('Unhandled server error on', event.url.pathname, error);
	return { message: 'Si è verificato un errore imprevisto.' };
};
