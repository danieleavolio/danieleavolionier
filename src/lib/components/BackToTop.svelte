<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		const update = () => {
			visible = window.scrollY > window.innerHeight;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});

	function top() {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	}
</script>

{#if visible}
	<button type="button" class="back-to-top" aria-label="Torna su" onclick={top}>
		<span aria-hidden="true">▲</span> Su
	</button>
{/if}

<style>
	.back-to-top {
		position: fixed;
		inset-block-end: 1rem;
		inset-inline-end: 1rem;
		z-index: 900;
		min-block-size: 2.75rem;
		min-inline-size: 2.75rem;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--yr-accent);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--yr-accent);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		cursor: pointer;
	}

	.back-to-top:hover {
		background: var(--yr-accent);
		color: var(--automataBg);
	}
</style>
