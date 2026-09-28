<script lang="ts">
	import { enhance } from '$app/forms';
	import type { NowItem } from '$lib/types';

	export let data;
	export let form;

	type EditableNow = Omit<NowItem, 'link'> & { link: string };
	const emptyItem: EditableNow = {
		...data.empty,
		status: data.empty.status as EditableNow['status'],
		link: data.empty.link ?? ''
	};
	let selected: EditableNow = emptyItem;
	function edit(item: NowItem) {
		selected = { ...item, link: item.link ?? '' };
	}
	function create() {
		selected = { ...emptyItem };
	}
</script>

<svelte:head><title>Now admin | Daniele Avolio</title></svelte:head>

<div class="cms-layout">
	<aside class="list-panel">
		<div class="list-heading">
			<h1>Now</h1>
			<button type="button" on:click={create}>Nuovo</button>
		</div>
		<ul>
			{#each data.items as item}
				<li class:active={selected.id === item.id}>
					<button type="button" class="select-item" on:click={() => edit(item)}>{item.title}</button
					>
					<form
						method="POST"
						action="?/remove"
						use:enhance
						on:submit={(event) => {
							if (!confirm(`Sei sicuro di voler eliminare "${item.title}"?`)) {
								event.preventDefault();
							}
						}}
					>
						<input type="hidden" name="id" value={item.id} />
						<button type="submit" class="delete" aria-label={`Elimina ${item.title}`}>×</button>
					</form>
				</li>
			{/each}
		</ul>
	</aside>

	<section class="editor-panel">
		<form method="POST" action="?/save" use:enhance>
			<h1>{selected.id ? 'Modifica aggiornamento' : 'Nuovo aggiornamento'}</h1>
			<input type="hidden" name="id" value={selected.id} />
			<label for="title">Titolo</label><input
				id="title"
				name="title"
				bind:value={selected.title}
				required
			/>
			<label for="description">Descrizione</label><textarea
				id="description"
				name="description"
				bind:value={selected.description}
				required
			></textarea>
			<label for="category">Categoria</label><input
				id="category"
				name="category"
				bind:value={selected.category}
				required
			/>
			<label for="status">Stato</label>
			<select id="status" name="status" bind:value={selected.status}>
				<option value="active">In corso</option><option value="completed">Completato</option><option
					value="paused">In pausa</option
				>
			</select>
			<label for="link">Link opzionale</label><input
				id="link"
				name="link"
				type="url"
				bind:value={selected.link}
			/>
			<label for="position">Ordine</label><input
				id="position"
				name="position"
				type="number"
				bind:value={selected.position}
			/>
			<label class="checkbox"
				><input type="checkbox" name="published" value="true" bind:checked={selected.published} /> Pubblicato</label
			>
			<button type="submit">Salva</button>
			{#if form?.message}<p class="message">{form.message}</p>{/if}
		</form>
	</section>
</div>

<style>
	.cms-layout {
		display: grid;
		grid-template-columns: minmax(14rem, 20rem) 1fr;
		gap: 2rem;
		min-width: 0;
	}
	.list-panel {
		border-right: 1px solid var(--automataColor);
		padding-right: 1.5rem;
		min-width: 0;
	}
	.list-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--automataColor);
	}
	h1 {
		font-size: 1.5rem;
		margin: 0;
		letter-spacing: 0.15rem;
	}
	.list-heading button {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		padding: 0.45rem 1rem;
		background: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		white-space: nowrap;
	}
	.list-heading button:hover {
		background: var(--automataColor);
		color: var(--automataBg);
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0 0;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.6rem;
		margin: 0 0 0.4rem 0 !important;
		background-image: none !important;
		border: 1px solid transparent;
		border-radius: 0;
		box-sizing: border-box;
		max-inline-size: 100% !important;
		transition: all 0.15s ease-in-out;
	}
	li:hover {
		background: var(--automataBgRGBA);
		border-color: var(--automataColor);
	}
	li.active {
		background: var(--automataColor);
		border-color: var(--automataColor);
	}
	li.active .select-item {
		color: var(--automataBg);
		font-weight: 600;
	}
	li.active .delete {
		color: var(--automataBg);
	}
	.select-item {
		flex: 1;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0;
		box-shadow: none;
		text-align: left;
		text-transform: none;
		letter-spacing: normal;
		font-family: inherit;
		font-size: 0.9rem;
		color: var(--automataColor);
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.delete {
		padding: 0.1rem 0.4rem;
		margin: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 0;
		box-shadow: none;
		color: var(--automataColor);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		transition: all 0.15s ease-in-out;
	}
	.delete:hover {
		background: var(--automataRed);
		color: var(--automataWhite) !important;
		border-color: var(--automataRed);
	}
	.editor-panel {
		min-width: 0;
	}
	.editor-panel form {
		display: grid;
		gap: 0.6rem;
	}
	input:not([type='checkbox']),
	textarea,
	select {
		padding: 0.65rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		color: var(--automataColor);
		border-radius: 0;
	}
	textarea {
		min-height: 8rem;
		resize: vertical;
	}
	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	button[type='submit'] {
		margin-top: 1rem;
		padding: 0.8rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.25rem;
		background: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	button[type='submit']:hover {
		background: var(--automataColor);
		color: var(--automataBg);
	}
	button[type='submit']:active {
		transform: translateY(1px);
	}
	.message {
		padding: 0.75rem;
		background: var(--automataBgRGBA);
		border: 1px solid var(--automataColor);
	}
	@media (max-width: 800px) {
		.cms-layout {
			grid-template-columns: 1fr;
		}
		.list-panel {
			border-right: 0;
			border-bottom: 1px solid var(--automataColor);
			padding: 0 0 1rem;
		}
	}
</style>
