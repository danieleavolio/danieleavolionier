// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
			getSession: () => Promise<import('@supabase/supabase-js').Session | null>;
			user: import('@supabase/supabase-js').User | null;
			isAdmin: boolean;
			locale: import('#lib/i18n.ts').Locale;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
