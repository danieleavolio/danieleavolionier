<script lang="ts">
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { langFromPath, ui } from '#lib/i18n.ts';

	/**
	 * Indice flottante dell'articolo: legge i titoli h2/h3 del contenuto, dà loro
	 * un id se manca e segna la sezione corrente. Compare a lato della colonna
	 * solo se c'è spazio (dipende da Wide/Narrow); senza JavaScript non c'è.
	 */
	let { html }: { html: string } = $props();

	type Entry = { id: string; text: string; level: 2 | 3 };
	let entries = $state<Entry[]>([]);
	let current = $state('');
	let t = $derived(ui(langFromPath(page.url.pathname)));

	const slugify = (text: string) =>
		text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'sezione';

	function collect(): HTMLElement[] {
		const headings = [
			...document.querySelectorAll<HTMLElement>('article .rich-content > :is(h2, h3)')
		];
		const used = headings.map((heading) => heading.id).filter(Boolean);
		entries = headings.map((heading) => {
			if (!heading.id) {
				const base = slugify(heading.textContent ?? '');
				let id = base;
				for (let n = 2; used.includes(id) || document.getElementById(id); n++) id = `${base}-${n}`;
				used.push(id);
				heading.id = id;
			}
			return {
				id: heading.id,
				text: (heading.textContent ?? '').trim(),
				level: heading.tagName === 'H3' ? 3 : 2
			};
		});
		return headings;
	}

	function jump(event: MouseEvent, id: string) {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
		try {
			history.replaceState(history.state, '', `#${id}`);
		} catch {
			// Some embedded contexts forbid history changes; the scroll still happened.
		}
	}

	$effect(() => {
		void html;
		let headings: HTMLElement[] = [];
		let frame = 0;
		let cancelled = false;

		const update = () => {
			frame = 0;
			let active = '';
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top > 160) break;
				active = heading.id;
			}
			current = active;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		void tick().then(() => {
			if (cancelled) return;
			headings = collect();
			update();
		});
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	});
</script>

{#if entries.length >= 2}
	<nav class="toc-rail" aria-label={t.tocLabel}>
		<p>{t.toc}</p>
		<ol>
			{#each entries as entry (entry.id)}
				<li class:sub={entry.level === 3}>
					<a
						href={`#${entry.id}`}
						aria-current={current === entry.id ? 'location' : undefined}
						onclick={(event) => jump(event, entry.id)}>{entry.text}</a
					>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	/* Larghezza 13rem + 2rem di respiro a sinistra della colonna di lettura. */
	.toc-rail {
		display: none;
		position: fixed;
		inset-block-start: 8rem;
		inset-inline-start: calc(50% - var(--reading-width, 72rem) / 2 - 15rem);
		inline-size: 13rem;
		max-block-size: calc(100dvh - 10rem);
		overflow-y: auto;
		font-size: 0.85rem;
		line-height: 1.35;
	}

	/* Wide: serve una finestra larga; Narrow: la colonna è stretta e c'è più spazio. */
	@media (min-width: 104rem) {
		.toc-rail {
			display: block;
		}
	}

	@media (min-width: 76rem) {
		:global(html[data-reading='narrow']) .toc-rail {
			display: block;
		}
	}

	/* Il titolo non finisce sotto la barra o al bordo superiore quando lo raggiungi dall'indice. */
	:global(article .rich-content > :is(h2, h3)) {
		scroll-margin-top: 6rem;
	}

	p {
		margin: 0 0 0.5rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	ol {
		inline-size: auto;
		margin: 0;
		padding: 0;
		list-style: none;
		border-inline-start: 1px solid var(--yr-line-strong);
	}

	/* Il tema dà a ol, li e a uno stile da menu: qui servono semplici voci di indice. */
	li {
		inline-size: auto;
		margin: 0;
		padding: 0;
		background: none;
	}

	li a {
		display: block;
		inline-size: auto;
		background: none;
		text-align: start;
		text-transform: none;
		letter-spacing: normal;
		font-family: inherit;
		font-size: inherit;
		padding: 0.25rem 0.6rem;
		margin-inline-start: -1px;
		border-inline-start: 2px solid transparent;
		color: var(--automataColor);
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	li.sub a {
		padding-inline-start: 1.3rem;
		font-size: 0.95em;
	}

	/* Il tema globale riempie gli hover con --automataColor: qui sfondo e testo sono espliciti per tema. */
	li a:hover,
	li a:focus-visible {
		background-color: var(--automataBgRGBA);
		color: var(--automataColor);
		text-decoration: underline;
	}

	li a[aria-current='location'] {
		border-inline-start-color: var(--yr-accent);
		color: var(--yr-accent);
		font-weight: 700;
	}
</style>
