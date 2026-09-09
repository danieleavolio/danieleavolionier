import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { supabaseAnonKey, supabaseUrl } from '$lib/supabaseConfig';

export const handle: Handle = async ({ event, resolve }) => {
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
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();
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

	return resolve(event);
};
