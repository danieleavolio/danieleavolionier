<script lang="ts">
	import { createIndex, searchPostsIndex, type SearchResult } from '$lib/search';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import { goto } from '$app/navigation';

	let search: 'loading' | 'ready' = 'loading';
	let searchTerm = '';
	let results: SearchResult[] = [];
	let showModal = false;
	let dialog: HTMLDialogElement;
	let searchInput: HTMLInputElement;
	let selectedIndex = 0;
	let isMac = false;

	onMount(() => {
		if (typeof navigator !== 'undefined') {
			isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
		}

		fetch('/search.json')
			.then((res) => res.json())
			.then((posts) => {
				createIndex(posts);
				search = 'ready';
			})
			.catch((err) => {
				console.error('Failed to load search data:', err);
			});

		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				showModal = !showModal;
				if (showModal) {
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

	$: if (search === 'ready') {
		results = searchPostsIndex(searchTerm);
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
		on:click={() => {
			showModal = !showModal;
			if (showModal) {
				tick().then(() => searchInput?.focus());
			}
		}}
		title="Cerca (Ctrl+K)"
		aria-label="Cerca nel sito"
	>
		<span class="material-symbols-outlined"> search </span>
		<kbd class="kbd-shortcut">{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
	</button>
</div>

<Modal bind:dialog bind:showModal isSearch={true}>
	{#if search === 'ready'}
		<div class="search">
			<div class="input-wrapper">
				<span class="material-symbols-outlined search-input-icon"> search </span>
				<input
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
							<!-- svelte-ignore a11y-no-static-element-interactions -->
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
										{@html result.title}
									</h3>
								</div>
								{#if result.content && result.content.length > 0}
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
	{/if}
</Modal>

<style>
	.search {
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
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
		border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
		padding: 0.35em 0.65em;
		cursor: pointer;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		transition: all 0.2s ease;
	}

	button:hover {
		background-color: var(--automataBlackOpacity);
		border-color: var(--automataWhite);
	}

	.kbd-shortcut {
		font-family: inherit;
		font-size: 0.72rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 0.15em 0.4em;
		border-radius: 3px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		letter-spacing: 0.05em;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input-icon {
		position: absolute;
		left: 0.75em;
		color: var(--text-2, rgba(255, 255, 255, 0.6));
		pointer-events: none;
	}

	input {
		width: 100%;
		padding: 0.75em 1em 0.75em 2.6em;
		font-size: 1.05rem;
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.2));
		border-radius: 4px;
		outline: none;
		transition: border-color 0.2s ease;
	}

	input:focus {
		border-color: var(--automataWhite);
	}

	/* input placeholder */
	::placeholder {
		color: var(--text-2, rgba(255, 255, 255, 0.5));
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
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		padding: 0.85em 1.1em;
		border: 1px solid transparent;
		border-radius: 4px;
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.link:hover,
	.link.selected {
		background-color: var(--automataBlackO);
		border-color: var(--automataWhite);
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 0.6em;
	}

	.type-badge {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		padding: 0.15em 0.45em;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.12);
	}

	.type-badge.post {
		color: #9cdcfe;
	}

	.type-badge.progetto {
		color: #ce9178;
	}

	.type-badge.appunto {
		color: #4ec9b0;
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
		color: var(--text-2, rgba(255, 255, 255, 0.75));
	}

	.no-results,
	.hint-text {
		color: var(--text-2, rgba(255, 255, 255, 0.6));
		text-align: center;
		padding: 2em 1em;
		font-style: italic;
	}

	.palette-footer {
		display: flex;
		justify-content: flex-end;
		gap: 1.2em;
		padding-top: 0.75em;
		border-top: 1px solid var(--border, rgba(255, 255, 255, 0.1));
		font-size: 0.78rem;
		color: var(--text-2, rgba(255, 255, 255, 0.6));
	}

	.palette-footer kbd {
		font-family: inherit;
		background: rgba(255, 255, 255, 0.08);
		padding: 0.1em 0.35em;
		border-radius: 3px;
		border: 1px solid rgba(255, 255, 255, 0.15);
	}
</style>
