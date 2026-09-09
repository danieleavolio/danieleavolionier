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
					<form method="POST" action="?/remove" use:enhance>
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
	}
	.list-panel {
		border-right: 1px solid var(--automataColor);
		padding-right: 1rem;
	}
	.list-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	h1 {
		font-size: 1.6rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		margin-block: 0.35rem;
	}
	li.active,
	li:hover {
		background: var(--automataBgRGBA);
	}
	.select-item {
		flex: 1;
		padding: 0;
		background: transparent;
		text-align: left;
		text-transform: none;
		letter-spacing: normal;
	}
	.delete {
		padding: 0.1rem 0.4rem;
		margin: 0;
		background: transparent;
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
	.message {
		padding: 0.75rem;
		background: var(--automataBgRGBA);
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
