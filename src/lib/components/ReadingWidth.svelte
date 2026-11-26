<script lang="ts">
	import { onMount } from 'svelte';

	let narrow = $state(false);

	function set(next: boolean) {
		narrow = next;
		if (next) document.documentElement.dataset.reading = 'narrow';
		else delete document.documentElement.dataset.reading;
		try {
			localStorage.setItem('reading-width', next ? 'narrow' : 'wide');
		} catch {
			// Storage can be unavailable; the layout still switches for this visit.
		}
	}

	onMount(() => {
		narrow = document.documentElement.dataset.reading === 'narrow';
	});
</script>

<span class="reading-width" role="group" aria-label="Larghezza di lettura">
	<button type="button" aria-pressed={!narrow} onclick={() => set(false)}>Wide</button>
	<button type="button" aria-pressed={narrow} onclick={() => set(true)}>Narrow</button>
</span>

<style>
	.reading-width {
		display: inline-flex;
		vertical-align: middle;
		gap: 0;
		margin-inline-start: var(--size-3);
	}

	/* On phones the column is already full width: the toggle does nothing. */
	@media (max-width: 800px) {
		.reading-width {
			display: none;
		}
	}

	button {
		min-block-size: 2.25rem;
		padding: 0.3rem 0.9rem;
		border: 1px solid var(--yr-line-strong);
		background: transparent;
		color: var(--automataColor);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
	}

	button + button {
		border-left: 0;
	}

	button[aria-pressed='true'] {
		border-color: var(--yr-accent);
		color: var(--yr-accent);
		box-shadow: inset 0 -2px 0 var(--yr-accent);
	}
</style>
