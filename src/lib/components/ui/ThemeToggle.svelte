<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	let theme: 'light' | 'dark' = 'light';

	function apply(next: 'light' | 'dark') {
		theme = next;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage can be unavailable in private contexts; the visual switch still works.
		}
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', next === 'dark' ? '#2e2c26' : '#c8c2aa');
	}

	function toggle() {
		apply(theme === 'dark' ? 'light' : 'dark');
	}

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	});
</script>

<button
	type="button"
	class="theme-toggle"
	on:click={toggle}
	aria-label={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
	aria-pressed={theme === 'dark'}
	title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
>
	<Icon name="theme" size={20} />
</button>

<style>
	.theme-toggle {
		display: inline-grid;
		place-items: center;
		flex: 0 0 auto;
		width: 2.75rem;
		height: 2.75rem;
		box-sizing: border-box;
		padding: 0;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: var(--yr-muted);
		color: var(--automataColor);
		box-shadow: none;
		cursor: pointer;
	}
	.theme-toggle:hover,
	.theme-toggle:focus-visible {
		border-color: var(--yr-accent);
		background: var(--yr-accent);
		color: var(--automataBg);
	}
</style>
