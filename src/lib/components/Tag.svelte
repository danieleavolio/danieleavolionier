<script lang="ts">
	import { goto } from '$app/navigation';
	import { categoryStore } from '#lib/stores/categoryStore.ts';
	import { projectsCategoryStore } from '#lib/stores/categoryStore.ts';

	export let category: string;
	export let from: string;
	export let isActive: boolean = false;

	// Redirect to the from page and add the category to some route params

	const handleClick = () => {
		if (from === 'progetti') projectsCategoryStore.set(category);
		else categoryStore.set(category);
		goto('/' + from);
	};
</script>

<button class="tag {isActive ? 'active' : ''}" on:click={handleClick}
	>{category.toUpperCase()}</button
>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		min-height: 1.9rem;
		background-color: transparent;
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		padding: 0.18em 0.5em;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.1rem;
		cursor: pointer;
		transition:
			background-color 0.12s ease,
			color 0.12s ease;
		text-shadow: none;
	}

	.tag::before {
		content: '';
		width: 0.4rem;
		height: 0.4rem;
		flex: 0 0 auto;
		background-color: currentColor;
	}

	.tag:hover,
	.active {
		background-color: var(--automataColor);
		color: var(--automataBg);
	}
</style>
