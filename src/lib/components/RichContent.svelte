<script lang="ts">
	import { onMount } from 'svelte';
	import { renderMermaidBlocks } from '$lib/mermaid';

	export let html = '';

	let container: HTMLElement;

	onMount(() => {
		void renderMermaidBlocks(container);
	});
</script>

<div class="rich-content prose" bind:this={container}>
	{@html html}
</div>

<style>
	.rich-content :global(img),
	.rich-content :global(video),
	.rich-content :global(iframe) {
		max-width: 100%;
		margin: 1rem auto;
		display: block;
	}

	.rich-content :global(iframe) {
		width: 100%;
		min-height: 20rem;
		border: 0;
	}

	.rich-content :global(.rich-gallery) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
	}

	.rich-content :global(.rich-gallery img) {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.rich-content :global(.rich-grading) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 1rem;
		border-radius: 8px;
		width: 100%;
		margin: 1rem 0;
	}
	.rich-content :global(.rg-grade) {
		font-size: 4rem;
		font-weight: bold;
		text-align: center;
		grid-column: span 2;
		color: var(--automataWhite);
		width: 100px;
		height: 100px;
		border-radius: 100%;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.rich-content :global(.rg-low .rg-grade) {
		background-color: #cd674d;
	}
	.rich-content :global(.rg-mid .rg-grade) {
		background-color: #ece7d5;
		color: var(--automataBlack0);
	}
	.rich-content :global(.rg-high .rg-grade) {
		background-color: #e1d8aa;
		color: var(--automataBlack0);
	}
	.rich-content :global(.rg-list) {
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--automataBlack);
		color: var(--automataWhite);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.rich-content :global(.rg-pros) {
		border-left: 5px solid var(--automataYellow);
	}
	.rich-content :global(.rg-pros h3) {
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--automataYellow);
	}
	.rich-content :global(.rg-pros li::marker) {
		color: var(--automataYellow);
	}
	.rich-content :global(.rg-cons) {
		border-left: 5px solid var(--automataRed);
	}
	.rich-content :global(.rg-cons h3) {
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--automataRed);
	}
	.rich-content :global(.rg-cons li::marker) {
		color: var(--automataRed);
	}
	.rich-content :global(.rg-title) {
		grid-column: span 2;
		font-weight: bold;
		text-align: center;
		margin: 1em 0 0;
		color: var(--automataWhite);
	}
	.rich-content :global(.rg-low .rg-title) {
		color: #cd674d;
	}
	.rich-content :global(.rg-mid .rg-title) {
		color: #ece7d5;
	}
	.rich-content :global(.rg-high .rg-title) {
		color: #e1d8aa;
	}
	.rich-content :global(.rich-grading ul) {
		margin: 0.5rem 0 0;
	}

	.rich-content :global(.rich-mermaid) {
		display: flex;
		justify-content: center;
		padding: 1rem;
		margin: 1rem 0;
		background: var(--automataBg);
		border: 1px solid var(--automataColor);
		border-radius: 8px;
	}
	.rich-content :global(.rich-mermaid svg) {
		max-width: 100%;
		height: auto;
	}

	.rich-content :global(.rich-grading) {
		padding: 1rem;
		border: 1px solid var(--automataColor);
		text-align: center;
		font-weight: 700;
	}
</style>
