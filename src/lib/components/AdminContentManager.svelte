<script lang="ts">
	import { tick } from 'svelte';
	import { enhance } from '$app/forms';
	import AdminContentEditor from '#lib/components/AdminContentEditor.svelte';
	import ConfirmModal from '#lib/components/ConfirmModal.svelte';
	import type { EditableContent } from '#lib/server/admin-content.ts';

	type Labels = {
		/** Plural name shown in the archive panel, e.g. "Posts". */
		title: string;
		/** Title of the delete confirmation, e.g. "Elimina Post". */
		deleteTitle: string;
		/** Document title for the browser tab. */
		documentTitle: string;
	};

	let {
		data,
		form,
		contentType,
		labels
	}: {
		data: { items: EditableContent[]; empty: EditableContent };
		form: { message?: string } | null | undefined;
		contentType: 'posts' | 'projects';
		labels: Labels;
	} = $props();

	// svelte-ignore state_referenced_locally
	let selected: EditableContent = $state(data.empty);
	let itemToDelete: EditableContent | null = $state(null);
	let deleteForm: HTMLFormElement;
	let editorSection: HTMLElement;
	let archiveOpen = $state(true);
	let filter = $state('');
	// Cambia solo quando si apre un altro articolo: lo slug digitato non deve rimontare l'editor.
	let editorId = $state(0);

	const categoryOptions = $derived(data.items.flatMap((item) => item.categories));
	const visibleItems = $derived.by(() => {
		const needle = normalize(filter);
		return needle
			? data.items.filter((item) => normalize(item.title).includes(needle))
			: data.items;
	});
	const isNew = $derived(!selected.slug);

	function normalize(value: string): string {
		return value.toLocaleLowerCase('it').normalize('NFD').replace(/\p{M}/gu, '').trim();
	}

	function formatDate(value: string): string {
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	async function focusEditor() {
		archiveOpen = false;
		await tick();
		editorSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function newItem() {
		selected = { ...data.empty, metadata: { contentType } };
		editorId += 1;
		void focusEditor();
	}

	function edit(item: EditableContent) {
		selected = { ...item, categories: [...item.categories], metadata: { ...item.metadata } };
		editorId += 1;
		void focusEditor();
	}

	function handleConfirmDelete() {
		deleteForm?.requestSubmit();
		itemToDelete = null;
	}
</script>

<svelte:head><title>{labels.documentTitle}</title></svelte:head>

<div class="manager">
	<section class="yr-panel archive" aria-labelledby="archive-title">
		<h2 id="archive-title" class="yr-panel__head">
			<span class="yr-panel__square"></span>Archivio // {labels.title}
			<span class="yr-badge yr-badge--solid count">{data.items.length}</span>
		</h2>
		<div class="yr-panel__body">
			<div class="toolbar">
				{#if archiveOpen}
					<input
						class="filter"
						type="search"
						aria-label={`Filtra ${labels.title} per titolo`}
						placeholder="Filtra per titolo"
						bind:value={filter}
					/>
				{:else}
					<p class="summary" role="status">
						{#if isNew}
							Stai creando: <strong>nuovo contenuto</strong>
						{:else}
							Stai modificando: <strong>{selected.title}</strong>
						{/if}
					</p>
				{/if}
				<div class="toolbar-actions">
					<button
						type="button"
						class="yr-button yr-button--ghost"
						aria-expanded={archiveOpen}
						onclick={() => (archiveOpen = !archiveOpen)}
					>
						{archiveOpen ? 'Chiudi archivio' : 'Apri archivio'}
					</button>
					<button type="button" class="yr-button yr-button--primary" onclick={newItem}>
						Nuovo
					</button>
				</div>
			</div>

			{#if archiveOpen}
				{#if visibleItems.length}
					<ul class="grid">
						{#each visibleItems as item (item.slug)}
							<li class="card" class:active={selected.slug === item.slug}>
								<button type="button" class="card-main" onclick={() => edit(item)}>
									<span class="card-title">{item.title}</span>
									<span class="card-meta">
										<span class="card-date">{formatDate(item.date)}</span>
										<span
											class={['yr-badge', item.published ? 'yr-badge--solid' : 'yr-badge--muted']}
										>
											{item.published ? 'Pubblicato' : 'Bozza'}
										</span>
									</span>
								</button>
								<button
									type="button"
									class="card-delete"
									aria-label={`Elimina ${item.title}`}
									title="Elimina"
									onclick={() => (itemToDelete = item)}>×</button
								>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty" role="status">
						{data.items.length
							? 'Nessun titolo corrisponde al filtro.'
							: 'Nessun contenuto ancora.'}
					</p>
				{/if}
			{/if}
		</div>
	</section>

	<section class="editor-section" bind:this={editorSection} aria-label="Editor">
		{#key editorId}
			<AdminContentEditor item={selected} {form} {categoryOptions} />
		{/key}
	</section>
</div>

<form bind:this={deleteForm} method="POST" action="?/remove" use:enhance>
	<input type="hidden" name="slug" value={itemToDelete?.slug ?? ''} />
</form>

<ConfirmModal
	open={Boolean(itemToDelete)}
	title={labels.deleteTitle}
	itemName={itemToDelete?.title ?? ''}
	on:confirm={handleConfirmDelete}
	on:cancel={() => (itemToDelete = null)}
/>

<style>
	.manager {
		display: grid;
		gap: 1.25rem;
		min-width: 0;
	}

	.count {
		margin-inline-start: auto;
		background-color: var(--automataBg);
		color: var(--yr-accent);
		border-color: var(--automataBg);
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1rem;
	}

	.filter {
		flex: 1 1 14rem;
		max-width: 28rem;
	}

	.summary {
		flex: 1 1 14rem;
		min-width: 0;
		margin: 0;
		overflow-wrap: anywhere;
	}

	.toolbar-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-inline-start: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 0.6rem;
		max-height: min(26rem, 55vh);
		margin: 0.9rem 0 0;
		padding: 0.15rem 0.35rem 0.15rem 0.15rem;
		overflow-y: auto;
		list-style: none;
		scrollbar-width: thin;
	}

	.card {
		position: relative;
		display: flex;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 1px solid var(--yr-line);
		background-color: var(--automataBg);
		background-image: none;
		max-inline-size: none;
		transition:
			background-color 0.12s ease,
			border-color 0.12s ease;
	}

	.card:hover {
		border-color: var(--automataColor);
	}

	.card.active {
		border-color: var(--automataColor);
		background-color: var(--automataColor);
		color: var(--automataBg);
	}

	.card-main {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 0.5rem;
		min-width: 0;
		padding: 0.7rem 2.4rem 0.7rem 0.8rem;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: inherit;
		font: inherit;
		text-align: left;
		text-transform: none;
		letter-spacing: normal;
		cursor: pointer;
	}

	.card-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-weight: 600;
		text-align: left;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.6rem;
		margin-top: auto;
	}

	.card-date {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.card.active .yr-badge {
		border-color: currentColor;
		background-color: transparent;
		color: inherit;
		opacity: 1;
	}

	.card-delete {
		position: absolute;
		inset-block-start: 0.35rem;
		inset-inline-end: 0.35rem;
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: inherit;
		font-size: 1.15rem;
		line-height: 1;
		cursor: pointer;
	}

	.card-delete:hover,
	.card-delete:focus-visible {
		border-color: var(--automataRed);
		background-color: var(--automataRed);
		color: var(--automataWhite);
	}

	.empty {
		margin: 0.9rem 0 0;
		opacity: 0.75;
	}

	.editor-section {
		min-width: 0;
		scroll-margin-top: 1rem;
	}

	@media (max-width: 560px) {
		.toolbar-actions {
			width: 100%;
			margin-inline-start: 0;
		}
		.toolbar-actions :global(.yr-button) {
			flex: 1;
		}
		.filter {
			max-width: none;
		}
	}
</style>
