<script lang="ts">
	import { ChevronsDownUp, ChevronsUpDown, Cpu } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let categories: string[] = [];

	export let activeFilters: string[] = [];
	export let isShowing = false;
	let filters: HTMLElement;
	const dispatch = createEventDispatcher<{ filter: string[] }>();

	export const openForce = () => {
		isShowing = true;
		filters.style.setProperty('height', '300px');
		filters.style.setProperty('width', '100%');
		filters.style.setProperty('opacity', '1');
	};

	export const handleClick = () => {
		isShowing = !isShowing;

		if (isShowing) {
			filters.style.setProperty('height', '300px');
			filters.style.setProperty('width', '100%');
			filters.style.setProperty('opacity', '1');
		} else {
			filters.style.setProperty('height', '0');
			filters.style.setProperty('opacity', '0');
		}
	};

	export const clearFilters = () => {
		activeFilters = [];

		const items = filters.querySelectorAll<HTMLElement>('.filter-item');
		items.forEach((item) => {
			item.querySelector<HTMLElement>('.backdrop')?.style.setProperty('opacity', '0');
			item.style.setProperty('color', 'var(--automataColor)');
		});
		dispatch('filter', activeFilters);
	};
	export const setActive = (i: number) => {
		const target = document.getElementById(`-${i}`);
		const filter = categories[i];
		if (!target || !filter) return;
		if (activeFilters.includes(filter)) {
			activeFilters = activeFilters.filter((item) => item !== filter);
			// target the first child and set the style
			target.querySelector<HTMLElement>('.backdrop')?.style.setProperty('opacity', '0');
			target.style.setProperty('color', 'var(--automataColor)');
		} else {
			activeFilters = [...activeFilters, filter];
			// target the first child and set the style
			target.querySelector<HTMLElement>('.backdrop')?.style.setProperty('opacity', '1');
			target.style.setProperty('color', 'var(--automataBg)');
		}

		dispatch('filter', activeFilters);
	};
</script>

<section>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="filter-title" on:click={() => handleClick()} id="1">
		<h3>FILTRI</h3>
		{#if isShowing}
			<ChevronsDownUp cursor="pointer" />
		{:else}
			<ChevronsUpDown cursor="pointer" />
		{/if}
	</div>
	<div bind:this={filters} class="filters">
		{#each categories as category, i (category)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div on:click={() => setActive(i)}>
				<p class="filter-item" id="-{i}">
					<span class="backdrop"></span><Cpu />{category}
				</p>
			</div>
		{/each}
	</div>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	{#if activeFilters.length > 0}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p on:click={() => clearFilters()} transition:fly class="clear">RIPRISTINA</p>
	{/if}
</section>

<style>
	section {
		min-width: 0;
		max-width: 100%;
	}
	.filter-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em;
		cursor: pointer;
	}
	p {
		display: flex;
		align-items: center;
		gap: 0.2em;
		padding: 0.19em;
		cursor: pointer;
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--automataBg);
		padding: 1em;
		border-top: 2px solid var(--automataBlackOpacity);
		border-bottom: 2px solid var(--automataBlackOpacity);
		max-height: 300px;
		height: 0;
		min-width: min(300px, 100%);
		box-sizing: border-box;
		overflow: scroll;
		opacity: 0;
		transition: all 0.3s ease-in-out;
		scrollbar-color: var(--automataColor) var(--automataBg);
		scrollbar-width: thin;
		/* bare minimum scrollbar */
	}
	.filter-item {
		overflow-wrap: anywhere;
		min-width: 0;
	}

	.filter-item {
		color: var(--automataColor);
		text-transform: uppercase;
		position: relative;
		z-index: 2;
	}

	.filter-item::before {
		content: '';
		background-color: var(--automataColor);
		width: 100%;
		position: absolute;
		left: 0;
		height: 100%;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease-in-out;
		z-index: -1;
		cursor: pointer;
	}

	.filter-item:hover::before {
		transform: scaleX(1);
	}

	.filter-item:hover {
		color: var(--automataBg) !important;
		transition: 0.2s ease-in-out;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-color: var(--automataColor);
		opacity: 0;
	}

	.clear {
		background-color: var(--automataRedOpacity);
		font-size: 1.2em;
		padding: 0.5em;
		color: var(--automataColor);
		text-align: center;
		cursor: pointer;
		justify-content: center;
	}

	.clear:hover {
		background-color: var(--automataRed);
		transition: 0.2s ease-in-out;
	}
</style>
