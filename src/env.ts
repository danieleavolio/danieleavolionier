import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_ANON_KEY: { public: true, static: true },
	PUBLIC_SUPABASE_URL: { public: true, static: true },
	SUPABASE_SERVICE_ROLE_KEY: { static: true },
	// Facoltativa: senza chiave il sito resta in italiano e il salvataggio non traduce.
	DEEPL_API_KEY: {
		description: 'Chiave DeepL (piano Free: finisce con :fx).',
		schema: (value) => value?.trim() || undefined
	}
});
