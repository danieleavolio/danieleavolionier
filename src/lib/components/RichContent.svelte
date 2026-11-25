<script lang="ts">
	import { onMount } from 'svelte';
	import { renderBarCharts } from '#lib/bar-chart.ts';
	import { highlightCodeBlocks } from '#lib/highlight.ts';
	import { renderMermaidBlocks } from '#lib/mermaid.ts';
	import { linkGalleryImages } from '#lib/rich-gallery.ts';
	import GalleryLightbox from './GalleryLightbox.svelte';

	export let html = '';

	let container: HTMLElement;
	let gallery: { items: { src: string; alt: string }[]; start: number } | null = null;
	$: renderedHtml = linkGalleryImages(highlightCodeBlocks(renderBarCharts(html)));

	function openGallery(event: MouseEvent) {
		if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
			return;
		const link = event.target instanceof Element ? event.target.closest('a') : null;
		const group = link?.closest('.rich-gallery[data-rich-block="gallery"]');
		if (!group || !link) return;
		const images = [...group.querySelectorAll<HTMLImageElement>('a > img')];
		const start = images.findIndex((image) => image.parentElement === link);
		if (start < 0) return;
		event.preventDefault();
		gallery = { items: images.map(({ src, alt }) => ({ src, alt })), start };
	}

	onMount(() => {
		const content = container;
		content.addEventListener('click', openGallery);
		if (!('IntersectionObserver' in window)) {
			void renderMermaidBlocks(container);
			return () => content.removeEventListener('click', openGallery);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					observer.unobserve(entry.target);
					void renderMermaidBlocks(entry.target as HTMLElement);
				}
			},
			{ rootMargin: '400px' }
		);
		container.querySelectorAll('pre').forEach((block) => observer.observe(block));
		return () => {
			observer.disconnect();
			content.removeEventListener('click', openGallery);
		};
	});
</script>

<div class="rich-content prose" bind:this={container}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- CMS HTML is sanitized on save; rendering preserves authored rich blocks. -->
	{@html renderedHtml}
</div>

{#if gallery}
	<GalleryLightbox {...gallery} dismiss={() => (gallery = null)} />
{/if}

<style>
	.rich-content {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.rich-content :global(table) {
		display: block;
		max-width: 100%;
		width: fit-content;
		overflow-x: auto;
	}

	.rich-content :global(th),
	.rich-content :global(td) {
		padding: 0.4rem 0.7rem;
		border: 1px solid var(--yr-line-strong);
		text-align: left;
		vertical-align: top;
	}

	.rich-content :global(th) {
		font-weight: 700;
		background: var(--automataBgRGBA);
	}

	.rich-content :global(.rich-callout) {
		margin-block: 1.25rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--yr-line-strong);
		border-left-width: 5px;
		background: var(--automataBgRGBA);
	}

	.rich-content :global(.rich-callout > :first-child) {
		margin-top: 0;
	}

	.rich-content :global(.rich-callout > :last-child) {
		margin-bottom: 0;
	}

	.rich-content :global(.callout-warning) {
		border-left-color: var(--automataRed);
	}

	.rich-content :global(.callout-tip) {
		border-left-color: var(--automataYellow);
	}

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
		grid-template-columns: repeat(auto-fit, minmax(min(7rem, 100%), 1fr));
		gap: 0.65rem;
		margin-block: 1.25rem;
	}

	.rich-content :global(.rich-gallery > a) {
		display: block;
		overflow: hidden;
		outline-offset: 2px;
		background: var(--yr-muted);
		cursor: zoom-in;
	}

	.rich-content :global(.rich-gallery img),
	.rich-content :global(.rich-gallery video) {
		width: 100%;
		aspect-ratio: 4 / 3;
		margin: 0;
		object-fit: cover;
	}

	.rich-content :global(.rich-grading) {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--yr-line-strong);
		box-sizing: border-box;
		width: 100%;
		margin: 1rem 0;
	}
	.rich-content :global(.rg-grade) {
		font-size: 4rem;
		font-weight: bold;
		text-align: center;
		grid-column: span 2;
		color: #26241e;
		width: 100px;
		height: 100px;
		border-radius: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 1;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.rich-content :global(.rg-max) {
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}
	.rich-content :global(.rg-low .rg-grade) {
		background-color: #cd674d;
	}
	.rich-content :global(.rg-mid .rg-grade) {
		background-color: #ece7d5;
	}
	.rich-content :global(.rg-high .rg-grade) {
		background-color: #e1d8aa;
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
		color: var(--automataColor);
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
		border-radius: 0;
		overflow-x: auto;
	}
	.rich-content :global(.rich-mermaid svg) {
		max-width: 100%;
		height: auto;
		font-family: var(--font-mono);
	}
	.rich-content :global(.rich-mermaid[data-renderer='pele']) {
		--pele-bg: var(--automataBg);
		--pele-fg: var(--automataColor);
		--pele-muted: var(--automataColor);
		--pele-line: var(--yr-accent);
		--pele-surface: var(--automataBgRGBA);
		--pele-surface-alt: var(--automataBgRGBA);
		--pele-border: var(--yr-accent);
		--pele-accent: var(--automataRed);
		--pele-radius: 0px;
	}
	.rich-content :global(svg.pele-flowchart) {
		/* Unstyled SVG labels inherit fill, including inside the admin's sections. */
		fill: var(--pele-fg);
	}
	.rich-content :global(.rich-mermaid .pele-xychart) {
		--pele-series-1: var(--yr-accent);
		--pele-series-2: var(--automataRed);
	}

	.rich-content :global(.rich-bar-chart) {
		margin: 1.25rem 0;
		border-color: var(--yr-line-strong);
		color: var(--automataColor);
	}

	.rich-content :global(.rich-bar-chart__title) {
		font-family: var(--font-mono);
		font-size: 1rem;
		letter-spacing: normal;
		text-transform: none;
	}

	.rich-content :global(.rich-bar-chart__rows) {
		display: grid;
		gap: 0.9rem;
		margin: 0;
		padding: 0.85rem;
		list-style: none;
	}

	.rich-content :global(.rich-bar-chart__row) {
		display: grid;
		gap: 0.3rem;
		max-inline-size: none;
		margin: 0;
		padding: 0;
		background: none;
	}

	.rich-content :global(.rich-bar-chart__labels) {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.1rem 0.75rem;
		font-size: 1rem;
		line-height: 1.35;
	}

	.rich-content :global(.rich-bar-chart__labels strong) {
		color: inherit;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.rich-content :global(.rich-bar-chart__track) {
		block-size: var(--chart-track, 0.65rem);
		background: var(--yr-muted);
	}

	.rich-content :global(.rich-bar-chart__bar) {
		inline-size: var(--bar-width);
		block-size: 100%;
		background: var(--chart-item-color, var(--chart-color, var(--yr-accent)));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--automataColor) 28%, transparent);
	}

	.rich-content :global(.rich-bar-chart__scroll) {
		overflow-x: auto;
		padding: 0.85rem;
	}

	.rich-content :global(.rich-bar-chart__plot) {
		--chart-height: clamp(7rem, 24vw, 11rem);
		position: relative;
		min-inline-size: calc(var(--chart-count) * 4.5rem);
	}

	.rich-content :global(.rich-bar-chart__plot::before) {
		position: absolute;
		inset: 0 0 auto;
		block-size: var(--chart-height);
		box-shadow: inset 0 -1px var(--yr-line-strong);
		background: repeating-linear-gradient(to top, var(--yr-line) 0 1px, transparent 1px 25%);
		content: '';
	}

	.rich-content :global(.rich-bar-chart__plot .rich-bar-chart__rows) {
		position: relative;
		grid-template-columns: repeat(var(--chart-count), minmax(0, 1fr));
		inline-size: 100%;
		gap: 0;
		padding: 0;
	}

	.rich-content :global(.rich-bar-chart__plot .rich-bar-chart__row) {
		grid-template-rows: var(--chart-height) 1fr;
		gap: 0.45rem;
	}

	.rich-content :global(.rich-bar-chart__plot .rich-bar-chart__labels) {
		display: grid;
		align-content: start;
		justify-content: stretch;
		padding-inline: 0.2rem;
		text-align: center;
	}

	.rich-content :global(.rich-bar-chart__plot .rich-bar-chart__track) {
		position: relative;
		grid-row: 1;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		block-size: var(--chart-height);
		background: none;
	}

	.rich-content :global(.rich-bar-chart--colonne .rich-bar-chart__bar) {
		inline-size: var(--chart-weight, 60%);
		max-inline-size: 9rem;
		block-size: var(--bar-width);
	}

	.rich-content :global(.rich-bar-chart__line) {
		position: absolute;
		inset: 0 0 auto;
		inline-size: 100%;
		block-size: var(--chart-height);
		overflow: visible;
		fill: none;
		stroke: var(--chart-color, var(--yr-accent));
		stroke-width: var(--chart-stroke, 3px);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.rich-content :global(.rich-bar-chart__point) {
		position: absolute;
		inset-inline-start: 50%;
		inset-block-end: var(--bar-width);
		inline-size: calc(var(--chart-stroke, 3px) + 4px);
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--chart-item-color, var(--chart-color, var(--yr-accent)));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--automataColor) 35%, transparent);
		transform: translate(-50%, 50%);
	}

	.rich-content :global(.rich-grading) {
		padding: 1rem;
		border: 1px solid var(--automataColor);
		text-align: center;
		font-weight: 700;
	}

	@media (max-width: 480px) {
		.rich-content :global(.rich-grading) {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}
		.rich-content :global(.rg-grade),
		.rich-content :global(.rg-title) {
			grid-column: 1;
		}
	}
</style>
