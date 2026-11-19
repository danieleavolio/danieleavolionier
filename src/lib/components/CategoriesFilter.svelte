<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();

	export let categories: string[] = [];
	export let activeFilters: string[] = [];
	export let isShowing = false;
	const dispatch = createEventDispatcher<{ filter: string[] }>();

	export const openForce = () => {
		isShowing = true;
	};
	export const handleClick = () => {
		isShowing = !isShowing;
	};
	export const clearFilters = () => {
		activeFilters = [];
		dispatch('filter', activeFilters);
	};
	export const setActive = (i: number) => {
		const category = categories[i];
		if (!category) return;
		activeFilters = activeFilters.includes(category)
			? activeFilters.filter((item) => item !== category)
			: [...activeFilters, category];
		dispatch('filter', activeFilters);
	};
</script>

<section aria-label="Filtri per categoria">
	<button type="button" class="filter-title" aria-expanded={isShowing} on:click={handleClick}>
		<span>{$t('filters')}{activeFilters.length ? ` (${activeFilters.length})` : ''}</span>
		<Icon name="chevron-down" size={18} />
	</button>
	{#if isShowing}
		<div class="filters">
			{#each categories as category, i (category)}
				<button
					type="button"
					class="filter-item"
					class:active={activeFilters.includes(category)}
					aria-pressed={activeFilters.includes(category)}
					on:click={() => setActive(i)}
				>
					<span class="filter-square" aria-hidden="true"></span>
					<span>{category}</span>
				</button>
			{/each}
		</div>
	{/if}
	{#if activeFilters.length}
		<button type="button" class="clear" on:click={clearFilters}>{$t('reset')}</button>
	{/if}
</section>

<style>
	section {
		min-width: 0;
		width: 100%;
	}
	button {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.6rem 0.75rem;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: var(--yr-muted);
		color: var(--automataColor);
		font: inherit;
		font-size: 0.8rem;
		line-height: 1.5;
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.08rem;
		text-shadow: none;
		cursor: pointer;
	}
	.filter-title {
		justify-content: space-between;
	}

	.filter-title :global(svg) {
		transition: transform 0.15s ease;
	}

	.filter-title[aria-expanded='true'] :global(svg) {
		transform: rotate(180deg);
	}
	.filters {
		display: grid;
		gap: 0.3rem;
		max-height: 20rem;
		overflow-y: auto;
		padding: 0.5rem;
		background: var(--yr-surface);
		scrollbar-color: var(--automataRed) transparent;
		scrollbar-width: thin;
	}
	.filter-item span:last-child {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.filter-square {
		flex: 0 0 0.75rem;
		height: 0.75rem;
		background: currentColor;
	}
	button:hover,
	button:focus-visible,
	.active {
		background: var(--automataColor);
		color: var(--automataBg);
	}
	.clear {
		margin-top: 0.5rem;
		border: 1px solid var(--automataRed);
	}
</style>
