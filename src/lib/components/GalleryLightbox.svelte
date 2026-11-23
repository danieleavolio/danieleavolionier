<script lang="ts">
	import { onMount } from 'svelte';

	let {
		items,
		start,
		dismiss
	}: { items: { src: string; alt: string }[]; start: number; dismiss: () => void } = $props();

	let dialog: HTMLDialogElement;
	let current = $state(0);
	onMount(() => {
		current = start;
		dialog.showModal();
	});

	function move(by: number) {
		current = (current + by + items.length) % items.length;
	}

	function handleKey(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		move(event.key === 'ArrowLeft' ? -1 : 1);
	}
</script>

<dialog bind:this={dialog} aria-label="Galleria immagini" onclose={dismiss} onkeydown={handleKey}>
	<div class="bar">
		<p role="status">{current + 1} / {items.length}</p>
		<button type="button" onclick={() => dialog.close()}>Chiudi</button>
	</div>
	<img src={items[current].src} alt={items[current].alt} />
	{#if items.length > 1}
		<div class="bar">
			<button type="button" onclick={() => move(-1)}>← Precedente</button>
			<button type="button" onclick={() => move(1)}>Successiva →</button>
		</div>
	{/if}
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		width: min(64rem, calc(100vw - 1.5rem));
		max-height: calc(100dvh - 1.5rem);
		margin: auto;
		padding: 0.75rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--automataColor);
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 80%);
	}

	img {
		display: block;
		width: 100%;
		height: min(70dvh, 46rem);
		margin-block: 0.75rem;
		object-fit: contain;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	p {
		margin: 0;
	}

	button {
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--automataColor);
	}
</style>
