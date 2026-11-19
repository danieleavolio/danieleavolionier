<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();
	export let postTitle = '';
	export let postUrl = '';
	let message = '';

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(postUrl);
			message = $t('copied');
		} catch {
			message = $t('copy_failed');
		}
	}
</script>

<section class="share-buttons" aria-label={$t('share')}>
	<span class="share-label">{$t('share')}</span>
	<div class="actions">
		<a
			class="share-action"
			href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`}
			target="_blank"
			rel="noopener noreferrer"><Icon name="external" size={16} />{$t('share_x')}</a
		>
		<button type="button" class="share-action" on:click={copyLink}
			><Icon name="copy" size={16} />{$t('copy_link')}</button
		>
	</div>
	<p class="feedback" role="status">{message}</p>
</section>

<style>
	.share-buttons {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
		margin-block: 1.5rem;
		padding-block: 1rem;
		border-block: 1px solid var(--yr-line);
	}
	.share-label {
		font-size: 0.72rem;
		letter-spacing: 0.16rem;
		text-transform: uppercase;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.share-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		box-sizing: border-box;
		min-height: 2.75rem;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: var(--yr-muted);
		color: var(--automataColor);
		box-shadow: none;
		font: inherit;
		font-size: 0.75rem;
		line-height: 1.5;
		letter-spacing: 0.08rem;
		text-transform: uppercase;
		text-shadow: none;
		text-decoration: none;
		cursor: pointer;
	}
	.share-action::before,
	.share-action::after {
		display: none;
	}
	.share-action:hover,
	.share-action:focus-visible {
		background: var(--automataColor);
		color: var(--automataBg);
		border-color: var(--automataColor);
	}
	.feedback {
		flex-basis: 100%;
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.feedback:empty {
		display: none;
	}
</style>
