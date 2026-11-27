<script lang="ts">
	import type { SearchResult } from '#lib/search.ts';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import Spinner from './ui/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { langFromPath } from '#lib/i18n.ts';

	let search: 'loading' | 'ready' | 'error' = 'loading';
	let searchTerm = '';
	let results: SearchResult[] = [];
	let showModal = false;
	let dialog: HTMLDialogElement;
	let searchInput: HTMLInputElement;
	let selectedIndex = 0;
	let searchApi: typeof import('#lib/search.ts') | undefined;
	let loadPromise: Promise<void> | undefined;
	let loadedLang = 'it';

	function loadSearch(): Promise<void> {
		// L'indice dipende dalla lingua della pagina: se cambia, si ricarica.
		const lang = langFromPath(page.url.pathname);
		if (loadPromise && loadedLang === lang) return loadPromise;
		loadedLang = lang;
		search = 'loading';
		loadPromise = (async () => {
			const [api, posts] = await Promise.all([
				import('#lib/search.ts'),
				fetch(lang === 'en' ? '/en/search.json' : '/search.json').then((response) => {
					if (!response.ok) throw new Error(`Search returned ${response.status}`);
					return response.json();
				})
			]);
			api.createIndex(posts);
			searchApi = api;
			search = 'ready';
		})().catch((error) => {
			console.error('Failed to load search data:', error);
			search = 'error';
			loadPromise = undefined;
		});
		return loadPromise;
	}

	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				// The article editor uses Ctrl+K for links and handles it first.
				if (e.defaultPrevented) return;
				e.preventDefault();
				showModal = !showModal;
				if (showModal) {
					void loadSearch();
					tick().then(() => searchInput?.focus());
				}
				return;
			}

			if (showModal) {
				if (e.key === 'Escape') {
					showModal = false;
					dialog?.close();
				} else if (e.key === 'ArrowDown') {
					e.preventDefault();
					if (results.length > 0) {
						selectedIndex = (selectedIndex + 1) % results.length;
					}
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					if (results.length > 0) {
						selectedIndex = (selectedIndex - 1 + results.length) % results.length;
					}
				} else if (e.key === 'Enter') {
					if (results.length > 0 && results[selectedIndex]) {
						e.preventDefault();
						selectResult(results[selectedIndex]);
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	$: if (search === 'ready' && searchApi) {
		results = searchApi.searchPostsIndex(searchTerm);
		selectedIndex = 0;
	}

	$: if (showModal && searchInput) {
		tick().then(() => searchInput?.focus());
	}

	const selectResult = (result: SearchResult) => {
		if (result.isExternal) {
			window.open(result.slug, '_blank', 'noopener,noreferrer');
		} else {
			const target = result.slug.startsWith('/') ? result.slug : '/' + result.slug;
			goto(target);
		}
		showModal = false;
		searchTerm = '';
		dialog?.close();
	};

	function formatType(type?: string): string {
		switch (type) {
			case 'post':
				return 'BLOG';
			case 'progetto':
				return 'PROGETTO';
			case 'appunto':
				return 'APPUNTI';
			default:
				return 'CONTENUTO';
		}
	}
</script>

<div class="search-icon">
	<button
		on:pointerenter={() => void loadSearch()}
		on:focus={() => void loadSearch()}
		on:click={() => {
			showModal = !showModal;
			if (showModal) {
				void loadSearch();
				tick().then(() => searchInput?.focus());
			}
		}}
		title="Cerca (Ctrl+K)"
		aria-label="Cerca nel sito"
	>
		<Icon name="search" size={22} />
	</button>
</div>

<Modal bind:dialog bind:showModal isSearch={true}>
	{#if search === 'ready'}
		<div class="search">
			<div class="input-wrapper">
				<span class="search-input-icon"><Icon name="search" size={18} /></span>
				<input
					class="yr-field"
					bind:this={searchInput}
					bind:value={searchTerm}
					placeholder="Cerca articoli, progetti, appunti (premi ↑↓ e Invio)..."
					autocomplete="off"
					spellcheck="false"
					type="search"
				/>
			</div>

			<div class="results">
				{#if results.length > 0}
					<ul>
						{#each results as result, i (result.slug)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<li
								on:click={() => selectResult(result)}
								class="link"
								class:selected={selectedIndex === i}
								transition:fade={{ duration: 20 }}
							>
								<div class="item-header">
									<span class="type-badge {result.type || 'post'}">
										[{formatType(result.type)}]
									</span>
									<h3>
										<!-- eslint-disable-next-line svelte/no-at-html-tags -- Search highlights escape input with escapeHtml before adding mark tags. -->
										{@html result.title}
									</h3>
								</div>
								{#if result.content && result.content.length > 0}
									<!-- eslint-disable-next-line svelte/no-at-html-tags -- Search snippets use the same escaped highlighting helper. -->
									<p>{@html result.content.join(' ')}</p>
								{/if}
							</li>
						{/each}
					</ul>
				{:else if searchTerm.trim()}
					<p class="no-results">Nessun risultato trovato per "{searchTerm}".</p>
				{:else}
					<p class="hint-text">
						Digita per cercare tra tutti gli articoli, progetti e dispense universitarie.
					</p>
				{/if}
			</div>

			<div class="palette-footer">
				<span><kbd>↑</kbd> <kbd>↓</kbd> Spostati</span>
				<span><kbd>↵</kbd> Seleziona</span>
				<span><kbd>ESC</kbd> Chiudi</span>
			</div>
		</div>
	{:else if search === 'error'}
		<div class="search" role="status">
			<p>Ricerca temporaneamente non disponibile.</p>
			<button on:click={() => void loadSearch()}>Riprova</button>
		</div>
	{:else}
		<div class="search loading-state" role="status">
			<Spinner size={18} label="" />
			<span>CARICAMENTO</span>
			<span class="yr-dots" aria-hidden="true"></span>
		</div>
	{/if}
</Modal>

<style>
	.search {
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.loading-state {
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		letter-spacing: 0.18rem;
		text-transform: uppercase;
	}

	.search-icon {
		transform: translateY(0);
	}

	@media (min-width: 1300px) {
		.search-icon {
			transform: translateY(-10px);
		}
	}

	button {
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
		border: 1px solid transparent;
		padding: 0.5em;
		cursor: pointer;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.12s ease,
			color 0.12s ease,
			border-color 0.12s ease;
	}

	button:hover {
		background-color: var(--automataWhite);
		border-color: var(--automataWhite);
		color: var(--automataBlackO);
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input-icon {
		position: absolute;
		left: 0.75em;
		display: flex;
		color: var(--automataWhite);
		opacity: 0.8;
		pointer-events: none;
	}

	input {
		width: 100%;
		padding: 0.75em 1em 0.75em 2.6em;
		font-size: 1.05rem;
		background-color: #3a3832;
		color: var(--automataWhite);
		border: 1px solid #57544a;
		border-radius: 0;
		outline: none;
		transition:
			border-color 0.12s ease,
			box-shadow 0.12s ease;
	}

	input:focus {
		border-color: var(--automataWhite);
		box-shadow: inset 0 -2px 0 var(--automataWhite);
	}

	input:focus-visible {
		outline-color: var(--automataWhite) !important;
	}

	/* input placeholder */
	input::placeholder {
		color: var(--automataWhite);
		opacity: 0.65;
	}

	.results {
		max-height: 55vh;
		overflow-y: auto;
		margin-top: 0.5em;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.6em;
		padding: 0;
		margin: 0;
	}

	.link {
		cursor: pointer;
		background-color: #3a3832;
		color: var(--automataWhite);
		padding: 0.85em 1.1em;
		border: 1px solid #57544a;
		border-radius: 0;
		transition:
			background-color 0.12s,
			border-color 0.12s;
	}

	.link:hover,
	.link.selected {
		background-color: #4e4b42;
		border-color: var(--automataWhite);
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 0.6em;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.12em 0.4em;
		border: 1px solid currentColor;
		border-radius: 0;
		background: transparent;
	}

	.type-badge::before {
		content: '';
		width: 0.4em;
		height: 0.4em;
		background: currentColor;
	}

	.type-badge.post {
		color: var(--automataYellow);
	}

	.type-badge.progetto {
		color: var(--automataRed);
	}

	.type-badge.appunto {
		color: #9fb8a8;
	}

	h3 {
		margin: 0;
		font-size: 1.05rem;
		color: var(--automataWhite);
	}

	.results p {
		margin-top: 0.4em;
		margin-bottom: 0;
		font-size: 0.88rem;
		color: rgba(236, 231, 213, 0.72);
	}

	.results .no-results,
	.results .hint-text {
		color: var(--automataColor);
	}

	.no-results,
	.hint-text {
		color: var(--automataColor);
		text-align: center;
		padding: 2em 1em;
		font-style: italic;
	}

	.palette-footer {
		display: flex;
		justify-content: flex-end;
		gap: 1.2em;
		padding-top: 0.75em;
		border-top: 1px solid var(--automataBlackOpacity);
		font-size: 0.78rem;
		color: var(--automataColor);
	}

	.palette-footer kbd {
		font-family: inherit;
		background: var(--automataBgRGBA);
		padding: 0.1em 0.35em;
		border-radius: 0;
		border: 1px solid var(--automataBlackOpacity);
	}
</style>
