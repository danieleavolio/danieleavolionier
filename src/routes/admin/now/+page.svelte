<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmModal from '#lib/components/ConfirmModal.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import type { NowItem } from '#lib/types.ts';

	export let data;
	export let form;

	type EditableNow = Omit<NowItem, 'link'> & { link: string };
	const emptyItem: EditableNow = {
		...data.empty,
		status: data.empty.status as EditableNow['status'],
		link: data.empty.link ?? ''
	};
	const statusLabels: Record<string, string> = {
		active: 'In corso',
		completed: 'Completato',
		paused: 'In pausa'
	};
	let selected: EditableNow = emptyItem;
	let itemToDelete: NowItem | null = null;
	let deleteForm: HTMLFormElement;

	function edit(item: NowItem) {
		selected = { ...item, link: item.link ?? '' };
	}
	function create() {
		selected = { ...emptyItem };
	}
	function promptDelete(item: NowItem) {
		itemToDelete = item;
	}
	function handleConfirmDelete() {
		if (deleteForm) {
			deleteForm.requestSubmit();
		}
		itemToDelete = null;
	}
</script>

<svelte:head><title>Now admin | Daniele Avolio</title></svelte:head>

<div class="manager">
	<section class="yr-panel" aria-labelledby="archive-title">
		<h2 id="archive-title" class="yr-panel__head">
			<span class="yr-panel__square"></span>Archivio // Now
			<span class="yr-badge yr-badge--solid count">{data.items.length}</span>
		</h2>
		<div class="yr-panel__body">
			<div class="toolbar">
				<p class="hint">Seleziona un aggiornamento da modificare oppure creane uno nuovo.</p>
				<button type="button" class="yr-button yr-button--primary" on:click={create}>Nuovo</button>
			</div>
			{#if data.items.length}
				<ul class="grid">
					{#each data.items as item (item.id)}
						<li class="card" class:active={selected.id === item.id}>
							<button type="button" class="card-main" on:click={() => edit(item)}>
								<span class="card-title">{item.title}</span>
								<span class="card-meta">
									<span class="yr-badge">{statusLabels[item.status] ?? item.status}</span>
									{#if !item.published}<span class="yr-badge yr-badge--muted">Bozza</span>{/if}
								</span>
							</button>
							<button
								type="button"
								class="card-delete"
								aria-label={`Elimina ${item.title}`}
								title="Elimina"
								on:click={() => promptDelete(item)}>×</button
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty" role="status">Nessun aggiornamento ancora.</p>
			{/if}
		</div>
	</section>

	<section class="editor-section" aria-label="Editor">
		<form method="POST" action="?/save" use:enhance id="now-form" class="now-form">
			<div class="action-bar">
				<div class="action-title">
					<span
						class="yr-badge"
						class:yr-badge--alert={!selected.id}
						class:yr-badge--solid={Boolean(selected.id)}>{selected.id ? 'Modifica' : 'Nuovo'}</span
					>
					<span class="action-name" title={selected.title}>{selected.title || 'Senza titolo'}</span>
				</div>
				<button type="submit" class="yr-button yr-button--primary">Salva</button>
			</div>

			{#if form?.message}<p class="status-bar" role="status">{form.message}</p>{/if}

			<input type="hidden" name="id" value={selected.id} />

			<section class="yr-panel" aria-labelledby="now-main">
				<h2 id="now-main" class="yr-panel__head">
					<span class="yr-panel__square"></span>01 // Dati principali
				</h2>
				<div class="yr-panel__body fields">
					<div class="f-wide">
						<label class="yr-label" for="title">Titolo</label>
						<input id="title" name="title" bind:value={selected.title} required />
					</div>
					<div class="f-wide">
						<label class="yr-label" for="description">Descrizione</label>
						<textarea id="description" name="description" bind:value={selected.description} required
						></textarea>
					</div>
					<div>
						<label class="yr-label" for="category">Categoria</label>
						<input id="category" name="category" bind:value={selected.category} required />
					</div>
					<div>
						<label class="yr-label" for="status">Stato</label>
						<select id="status" name="status" bind:value={selected.status}>
							<option value="active">In corso</option>
							<option value="completed">Completato</option>
							<option value="paused">In pausa</option>
						</select>
					</div>
				</div>
			</section>

			<section class="yr-panel" aria-labelledby="now-extra">
				<h2 id="now-extra" class="yr-panel__head">
					<span class="yr-panel__square"></span>02 // Link, ordine e pubblicazione
				</h2>
				<div class="yr-panel__body fields">
					<div>
						<label class="yr-label" for="link">Link opzionale</label>
						<input id="link" name="link" type="url" bind:value={selected.link} />
					</div>
					<div>
						<label class="yr-label" for="position">Ordine</label>
						<input id="position" name="position" type="number" bind:value={selected.position} />
					</div>
					<div class="f-wide">
						<Switch name="published" bind:checked={selected.published} label="Pubblicato" />
					</div>
				</div>
			</section>
		</form>
	</section>
</div>

<form bind:this={deleteForm} method="POST" action="?/remove" use:enhance>
	<input type="hidden" name="id" value={itemToDelete?.id ?? ''} />
</form>

<ConfirmModal
	open={Boolean(itemToDelete)}
	title="Elimina Aggiornamento"
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
		justify-content: space-between;
		gap: 0.6rem 1rem;
	}
	.hint {
		margin: 0;
		opacity: 0.8;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 0.6rem;
		max-height: min(24rem, 50vh);
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
		gap: 0.4rem;
		margin-top: auto;
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
	}
	.now-form {
		display: grid;
		gap: 1.25rem;
		min-width: 0;
	}
	.action-bar {
		position: sticky;
		inset-block-start: 0;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem 1rem;
		padding: 0.55rem 0.8rem;
		border: 1px solid var(--yr-line);
		border-inline-start: 4px solid var(--yr-accent);
		background-color: var(--yr-surface);
		box-shadow: var(--yr-shadow);
	}
	.action-title {
		display: flex;
		align-items: center;
		flex: 1 1 14rem;
		gap: 0.7rem;
		min-width: 0;
	}
	.action-name {
		min-width: 0;
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.action-bar :global(.yr-button) {
		min-height: 2.2rem;
		padding-block: 0.25rem;
	}
	.status-bar {
		margin: 0;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--automataRed);
		border-inline-start-width: 4px;
		background-color: var(--yr-surface);
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}
	.fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
		gap: 0.9rem 1rem;
	}
	.f-wide {
		grid-column: 1 / -1;
	}
	input:not([type='checkbox']),
	textarea,
	select {
		background-color: var(--automataBg);
	}
	textarea {
		min-height: 6rem;
	}
</style>
