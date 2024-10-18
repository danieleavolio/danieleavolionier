<script lang="ts">
	import { goto } from '$app/navigation';
	import { categoryStore } from '$lib/stores/categoryStore';
	import { projectsCategoryStore } from '$lib/stores/categoryStore';

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
		background-color: var(--automataColor);
		color: var(--automataBg);
		padding: 0.2em 0.5em;
		cursor: pointer;
		border-radius: 0;
	}

	.active {
		transition: background-color 0.3s;
		background-color: var(--automataRed);
	}
</style>
