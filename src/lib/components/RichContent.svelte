<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { renderBarCharts } from '#lib/bar-chart.ts';
	import { enhanceBlocks, handleBlockChange, handleBlockClick } from '#lib/blocks-content.ts';
	import { renderBlocks } from '#lib/blocks.ts';
	import { handleTermClick, handleTermKey, renderGlossary } from '#lib/glossary.ts';
	import { highlightCodeBlocks } from '#lib/highlight.ts';
	import { renderMermaidBlocks } from '#lib/mermaid.ts';
	import { highlightTables } from '#lib/table-highlight.ts';
	import { linkGalleryImages } from '#lib/rich-gallery.ts';
	import GalleryLightbox from './GalleryLightbox.svelte';

	export let html = '';

	let container: HTMLElement;
	let gallery: {
		items: { src: string; alt: string; video?: boolean }[];
		start: number;
	} | null = null;
	$: renderedHtml = linkGalleryImages(
		highlightCodeBlocks(renderBlocks(renderBarCharts(renderGlossary(html))))
	);

	function openGallery(event: MouseEvent) {
		if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
			return;
		const link = event.target instanceof Element ? event.target.closest('a') : null;
		const group = link?.closest('.rich-gallery[data-rich-block="gallery"]');
		if (!group || !link) return;
		const media = [
			...group.querySelectorAll<HTMLImageElement | HTMLVideoElement>('a > img, a > video')
		];
		const start = media.findIndex((item) => item.parentElement === link);
		if (start < 0) return;
		event.preventDefault();
		gallery = {
			items: media.map((item) => ({
				src: item.src,
				alt: item instanceof HTMLImageElement ? item.alt : '',
				video: item instanceof HTMLVideoElement
			})),
			start
		};
	}

	let observer: IntersectionObserver | undefined;

	function observeBlocks() {
		if (!container) return;
		if (!observer) {
			void renderMermaidBlocks(container);
			return;
		}
		container.querySelectorAll('pre').forEach((block) => observer?.observe(block));
	}

	// New HTML (live preview) brings new diagram blocks: watch them again.
	$: if (container && renderedHtml)
		void tick().then(() => {
			observeBlocks();
			enhanceBlocks(container);
			highlightTables(container);
		});

	onMount(() => {
		const content = container;
		content.addEventListener('click', openGallery);
		content.addEventListener('click', handleBlockClick);
		content.addEventListener('change', handleBlockChange);
		content.addEventListener('click', handleTermClick);
		content.addEventListener('keydown', handleTermKey);
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) continue;
						observer?.unobserve(entry.target);
						void renderMermaidBlocks(entry.target as HTMLElement);
					}
				},
				{ rootMargin: '400px' }
			);
		}
		observeBlocks();
		return () => {
			observer?.disconnect();
			observer = undefined;
			content.removeEventListener('click', openGallery);
			content.removeEventListener('click', handleBlockClick);
			content.removeEventListener('change', handleBlockChange);
			content.removeEventListener('click', handleTermClick);
			content.removeEventListener('keydown', handleTermKey);
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

	/* Titoli raggiunti dall'indice: non finiscono sotto la barra in alto. */
	.rich-content :global(h2[id]),
	.rich-content :global(h3[id]) {
		scroll-margin-block-start: 6rem;
	}

	/* Glossario: termine sottolineato, definizione in tooltip (hover, focus, tocco). */
	.rich-content :global(.rich-term) {
		position: relative;
		border-block-end: 1px dotted var(--yr-accent);
		cursor: help;
	}

	.rich-content :global(.rich-term:focus-visible) {
		outline: 2px solid var(--yr-accent);
		outline-offset: 2px;
	}

	.rich-content :global(.rich-term-tip) {
		display: none;
		position: absolute;
		z-index: 5;
		inset-block-start: calc(100% + 0.35rem);
		inset-inline-start: 0;
		inline-size: max-content;
		max-inline-size: min(20rem, calc(100vw - 2rem));
		padding: 0.5rem 0.7rem;
		border: 1px solid var(--yr-line-strong);
		background: var(--automataBg);
		color: var(--automataColor);
		font-size: 0.9rem;
		font-weight: 400;
		font-style: normal;
		line-height: 1.45;
		text-align: left;
		box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 15%);
	}

	.rich-content :global(.rich-term:hover > .rich-term-tip),
	.rich-content :global(.rich-term:focus-within > .rich-term-tip),
	.rich-content :global(.rich-term.is-open > .rich-term-tip) {
		display: block;
	}

	/* Sul telefono la definizione sta in basso, a tutta larghezza. */
	@media (max-width: 800px) {
		.rich-content :global(.rich-term-tip) {
			position: fixed;
			inset-block: auto 1rem;
			inset-inline: 1rem;
			inline-size: auto;
			max-inline-size: none;
		}
	}

	.rich-content :global(table) {
		display: block;
		border-collapse: collapse;
		border-radius: 0;
		max-width: 100%;
		width: fit-content;
		overflow-x: auto;
	}

	.rich-content :global(th),
	.rich-content :global(td) {
		border-radius: 0;
		padding: 0.4rem 0.7rem;
		border: 1px solid var(--yr-line-strong);
		text-align: left;
		vertical-align: top;
		/* The container breaks anywhere; table cells must wrap on words or narrow columns shred to one letter per line. */
		overflow-wrap: normal;
		word-break: normal;
		min-inline-size: 5.5rem;
		line-height: 1.5;
	}

	/* Article paragraph spacing and leading would balloon every row. */
	.rich-content :global(td > p),
	.rich-content :global(th > p) {
		margin: 0;
		line-height: 1.5;
		text-align: left;
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

	.rich-content :global(.rich-callout) {
		position: relative;
		padding-left: 2.6rem;
	}

	.rich-content :global(.rich-callout::before) {
		position: absolute;
		inset: 0.7rem auto auto 0.8rem;
		inline-size: 1.2rem;
		block-size: 1.2rem;
		display: grid;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
		content: 'i';
	}

	.rich-content :global(.callout-warning) {
		border-left-color: var(--automataRed);
	}

	.rich-content :global(.callout-warning::before) {
		content: '!';
		color: var(--automataRed);
		border-radius: 0;
	}

	.rich-content :global(.callout-error) {
		border-left-color: var(--automataRed);
		background: var(--automataRedOpacity);
	}

	.rich-content :global(.callout-error::before) {
		content: '×';
		color: var(--automataRed);
		background: var(--automataBg);
		font-size: 1rem;
	}

	.rich-content :global(.callout-tip) {
		border-left-color: var(--automataYellow);
	}

	.rich-content :global(.callout-tip::before) {
		content: '★';
		border-style: dashed;
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
		border: 1px solid var(--yr-line-strong);
		background: var(--yr-muted);
		cursor: zoom-in;
	}

	.rich-content :global(.rich-gallery > a:hover),
	.rich-content :global(.rich-gallery > a:focus-visible) {
		border-color: var(--automataRed);
		outline: 1px solid var(--automataRed);
	}

	.rich-content :global(.rich-gallery > a.gallery-video) {
		position: relative;
	}

	.rich-content :global(.rich-gallery > a.gallery-video::after) {
		content: '▶';
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 1.6rem;
		color: #fff;
		text-shadow: 0 0 6px rgb(0 0 0 / 70%);
		pointer-events: none;
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
		padding: 1rem;
		margin: 1rem 0;
		background: var(--automataBg);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		overflow-x: auto;
	}
	.rich-content :global(.rich-mermaid svg) {
		flex: none;
		margin-inline: auto;
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
	.rich-content :global(svg.pele) {
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

	/* Always full column width, in both wide and narrow reading modes. */
	.rich-content :global(.rich-bar-chart),
	.rich-content :global(.rich-bar-chart .rich-bar-chart__rows) {
		inline-size: 100%;
		max-inline-size: none;
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

	/* Evidenziazione tabelle: oltre al colore c'è un simbolo, così non dipende solo dal colore. */
	.rich-content :global(td.rich-hl-best),
	.rich-content :global(td.rich-hl-worst) {
		white-space: nowrap;
	}

	.rich-content :global(td.rich-hl-best) {
		background: color-mix(in srgb, var(--yr-accent) 22%, transparent);
		font-weight: 700;
	}

	.rich-content :global(td.rich-hl-worst) {
		background: color-mix(in srgb, var(--automataRed) 22%, transparent);
		font-weight: 700;
	}

	.rich-content :global(td.rich-hl-best::after) {
		content: ' ▲';
		font-size: 0.7em;
	}

	.rich-content :global(td.rich-hl-worst::after) {
		content: ' ▼';
		font-size: 0.7em;
		color: var(--automataRed);
	}

	.rich-content :global(.rich-bar-chart__pie-wrap) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem 1.5rem;
		padding: 0.85rem;
	}

	.rich-content :global(.rich-bar-chart__pie) {
		flex: 0 0 auto;
		inline-size: min(11rem, 100%);
		aspect-ratio: 1;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--yr-line-strong);
	}

	.rich-content :global(.rich-bar-chart--anello .rich-bar-chart__pie) {
		mask: radial-gradient(circle, transparent 0 55%, #000 56%);
	}

	.rich-content :global(.rich-bar-chart__legend) {
		display: grid;
		flex: 1 1 14rem;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rich-content :global(.rich-bar-chart__slice) {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 0.5rem;
		max-inline-size: none;
		margin: 0;
		padding: 0;
		background: none;
		line-height: 1.35;
	}

	.rich-content :global(.rich-bar-chart__slice strong) {
		color: inherit;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.rich-content :global(.rich-bar-chart__swatch) {
		inline-size: 0.85rem;
		aspect-ratio: 1;
		background: var(--slice-color);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--automataColor) 35%, transparent);
	}

	.rich-content :global(.rich-grading) {
		padding: 1rem;
		border: 1px solid var(--automataColor);
		text-align: center;
		font-weight: 700;
	}

	/* Blocchi di contenuto (blocks-content.ts) */
	.rich-content :global(.rich-terminale),
	.rich-content :global(.rich-tldr),
	.rich-content :global(.rich-accordion),
	.rich-content :global(.rich-timeline),
	.rich-content :global(.rich-citazione),
	.rich-content :global(.rich-passi) {
		text-align: left;
	}

	.rich-content :global(.rich-tldr li),
	.rich-content :global(.rich-passi li),
	.rich-content :global(.rich-timeline li) {
		line-height: 1.5;
	}

	.rich-content :global(.rich-tldr li) {
		margin-block: 0.25rem;
		padding-block: 0;
	}

	/* Il `figure` del tema centra e restringe i figli: qui servono a tutta larghezza. */
	.rich-content :global(.rich-terminale),
	.rich-content :global(.rich-citazione) {
		place-items: stretch;
	}

	.rich-content :global(.rich-terminale) {
		padding: 0;
	}

	.rich-content :global(.rich-terminale figcaption),
	.rich-content :global(.rich-citazione figcaption) {
		max-inline-size: none;
	}

	.rich-content :global(.rich-accordion details),
	.rich-content :global(.rich-accordion summary) {
		border-radius: 0;
		box-shadow: none;
	}

	.rich-content :global(.rich-citazione cite a) {
		padding: 0;
		letter-spacing: normal;
		text-decoration: underline;
		text-shadow: none;
		text-transform: none;
		background: none;
	}

	.rich-content :global(.rich-terminale) {
		display: block;
		margin: 1.25rem 0;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		font-family: var(--font-mono);
	}

	.rich-content :global(.rich-terminale__bar) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.3rem 0.75rem;
		background: var(--automataColor);
		color: var(--automataBg);
		font-size: 0.85rem;
	}

	.rich-content :global(.rich-terminale__copy) {
		padding: 0.1rem 0.5rem;
		border: 1px solid currentcolor;
		border-radius: 0;
		box-shadow: none;
		color: inherit;
		background: transparent;
		font: inherit;
	}

	.rich-content :global(.rich-terminale__body) {
		padding: 0.6rem 0.75rem;
		overflow-x: auto;
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre;
	}

	.rich-content :global(.rich-terminale__cmd::before) {
		content: '$ ';
		color: var(--automataRed);
		user-select: none;
	}

	.rich-content :global(.rich-terminale__out) {
		opacity: 0.8;
	}

	.rich-content :global(.rich-tldr) {
		margin-block: 1.25rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--automataColor);
		border-inline-start-width: 5px;
		background: var(--automataBgRGBA);
	}

	.rich-content :global(.rich-tldr__title) {
		margin: 0 0 0.4rem;
		font-family: var(--font-mono);
		font-weight: 700;
		text-transform: uppercase;
	}

	.rich-content :global(.rich-tldr ul) {
		margin: 0;
		padding-inline-start: 1.2rem;
	}

	.rich-content :global(.rich-accordion) {
		margin-block: 1.25rem;
		border: 1px solid var(--yr-line-strong);
	}

	.rich-content :global(.rich-accordion details + details) {
		border-block-start: 1px solid var(--yr-line-strong);
	}

	.rich-content :global(.rich-accordion summary) {
		padding: 0.55rem 0.9rem;
		cursor: pointer;
		font-weight: 700;
	}

	.rich-content :global(.rich-accordion details[open] > summary) {
		background: var(--automataBgRGBA);
	}

	.rich-content :global(.rich-accordion__body) {
		padding: 0.25rem 0.9rem 0.75rem;
	}

	.rich-content :global(.rich-accordion__body p) {
		margin: 0.5rem 0 0;
	}

	.rich-content :global(.rich-timeline) {
		margin-block: 1.25rem;
		padding: 0 0 0 1.25rem;
		border-inline-start: 2px solid var(--automataColor);
		list-style: none;
	}

	.rich-content :global(.rich-timeline li) {
		position: relative;
		display: grid;
		gap: 0.15rem;
		margin-block: 0 1.1rem;
	}

	.rich-content :global(.rich-timeline li::before) {
		content: '';
		position: absolute;
		inset-block-start: 0.35rem;
		inset-inline-start: calc(-1.25rem - 6px);
		inline-size: 10px;
		block-size: 10px;
		background: var(--automataColor);
	}

	.rich-content :global(.rich-timeline p) {
		margin: 0;
	}

	.rich-content :global(.rich-timeline__date) {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		opacity: 0.8;
	}

	.rich-content :global(.rich-timeline--orizzontale) {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem 0 0.5rem;
		border-inline-start: 0;
		border-block-start: 2px solid var(--automataColor);
		overflow-x: auto;
	}

	.rich-content :global(.rich-timeline--orizzontale li) {
		flex: 0 0 min(15rem, 70%);
		margin: 0;
	}

	.rich-content :global(.rich-timeline--orizzontale li::before) {
		inset-block-start: calc(-1.25rem - 6px);
		inset-inline-start: 0;
	}

	.rich-content :global(.rich-citazione) {
		display: block;
		margin: 1.5rem 0;
		padding: 0 0 0 1rem;
		border-inline-start: 5px solid var(--automataColor);
	}

	.rich-content :global(.rich-citazione blockquote) {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 1.15em;
	}

	.rich-content :global(.rich-citazione blockquote p:first-child) {
		margin-top: 0;
	}

	.rich-content :global(.rich-citazione figcaption) {
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}

	.rich-content :global(.rich-citazione figcaption span::before) {
		content: '— ';
	}

	.rich-content :global(.rich-passi) {
		margin-block: 1.25rem;
		padding-inline-start: 0;
		list-style: none;
		counter-reset: passo;
	}

	.rich-content :global(.rich-passi li) {
		counter-increment: passo;
		margin-block: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--yr-line-strong);
	}

	.rich-content :global(.rich-passi label) {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 700;
	}

	.rich-content :global(.rich-passi label::before) {
		content: counter(passo) '.';
		order: -1;
		font-family: var(--font-mono);
	}

	.rich-content :global(.rich-passi input:checked + span) {
		text-decoration: line-through;
		opacity: 0.6;
	}

	.rich-content :global(.rich-passi p) {
		margin: 0.25rem 0 0 1.75rem;
		font-size: 0.9rem;
	}

	@media (max-width: 800px) {
		/* Pros/cons: left-aligned, tight lines, instead of centred text with article-size leading. */
		.rich-content :global(.rg-list) {
			text-align: left;
		}
		.rich-content :global(.rg-list li) {
			line-height: 1.5;
			margin-block: 0.4rem;
		}
		.rich-content :global(pre) {
			line-height: 1.55;
			font-size: 0.85rem;
		}
		/* Keep tall or oversized images from filling several screens on a phone. */
		.rich-content :global(img:not(.rich-gallery img)),
		.rich-content :global(video) {
			max-height: 70vh;
			width: auto;
			height: auto;
			object-fit: contain;
		}
		.rich-content :global(iframe) {
			min-height: 14rem;
		}
		/* Tables: compact cells, code kept on one line so the table scrolls sideways instead of growing tall. */
		.rich-content :global(table) {
			font-size: 0.85rem;
		}
		.rich-content :global(th),
		.rich-content :global(td) {
			padding: 0.3rem 0.5rem;
			min-inline-size: 4.5rem;
			line-height: 1.4;
		}
		.rich-content :global(td code),
		.rich-content :global(th code) {
			white-space: nowrap;
		}
		/* Diagrams are laid out wider than the screen (see mermaid.ts) and scaled down to fit. */
		.rich-content :global(.rich-mermaid) {
			padding: 0.5rem;
		}
		/* Bar charts: tighter labels so long names do not push the value onto its own line. */
		.rich-content :global(.rich-bar-chart__title) {
			font-size: 0.9rem;
		}
		.rich-content :global(.rich-bar-chart__labels) {
			font-size: 0.9rem;
			gap: 0.1rem 0.5rem;
		}
		.rich-content :global(.rich-bar-chart__labels strong) {
			white-space: nowrap;
			margin-inline-start: auto;
		}
		.rich-content :global(.rich-bar-chart__rows) {
			padding: 0.7rem;
		}
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
