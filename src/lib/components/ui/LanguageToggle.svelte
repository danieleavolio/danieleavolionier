<script lang="ts">
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { useI18n } from '#lib/i18n.ts';
	import Icon from './Icon.svelte';

	const i18n = useI18n();
	const { t } = i18n;

	async function toggle() {
		const current = get(i18n.locale);
		const next = current === 'it' ? 'en' : 'it';
		i18n.setLocale(next);
		await goto(`?lang=${next}`, { replace: true, reset: false });
	}
</script>

<button
	type="button"
	class="language-toggle"
	on:click={toggle}
	aria-label={$t('language')}
	title={$t('language')}
>
	<Icon name="globe" size={20} />
	<span>{$t('language')}</span>
</button>

<style>
	.language-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex: 0 0 auto;
		min-width: 2.75rem;
		height: 2.75rem;
		box-sizing: border-box;
		padding: 0 0.6rem;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: var(--yr-muted);
		color: var(--automataColor);
		box-shadow: none;
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.12rem;
		text-transform: uppercase;
		cursor: pointer;
	}
	.language-toggle:hover,
	.language-toggle:focus-visible {
		border-color: var(--yr-accent);
		background: var(--yr-accent);
		color: var(--automataBg);
	}
	span {
		display: none;
	}
	@media (min-width: 1301px) {
		span {
			display: inline;
		}
	}
</style>
