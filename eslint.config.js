import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'node_modules/**',
			'.svelte-kit/**',
			'.vercel/**',
			'build/**',
			'package/**',
			'test-results/**',
			'playwright-report/**',
			'**/.env',
			'**/.env.*'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: { extraFileExtensions: ['.svelte'] }
		},
		rules: {
			// The site is deployed at the domain root, not under a configurable base path.
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: { parserOptions: { parser: tseslint.parser } }
	},
	prettier
];
