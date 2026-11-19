<script lang="ts">
	import { goto } from '$app/navigation';
	import { useI18n } from '#lib/i18n.ts';

	const i18n = useI18n();
	const { locale, t } = i18n;

	async function toggle() {
		const next = $locale === 'it' ? 'en' : 'it';
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
	{$locale === 'it' ? 'IT' : 'EN'}
</button>

<style>
	.language-toggle {
		display: inline-grid;
		place-items: center;
		flex: 0 0 auto;
		min-width: 1.75rem;
		height: 1.75rem;
		box-sizing: border-box;
		padding: 0 0.25rem;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: var(--automataColor);
		font: inherit;
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.08rem;
		cursor: pointer;
	}
	.language-toggle:hover,
	.language-toggle:focus-visible {
		border-color: var(--yr-accent);
		background: var(--yr-accent);
		color: var(--automataBg);
	}
</style>
