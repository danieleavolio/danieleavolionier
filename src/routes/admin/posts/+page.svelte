<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminContentEditor from '$lib/components/AdminContentEditor.svelte';
	import type { EditableContent } from '$lib/server/admin-content';

	export let data;
	export let form;

	let selected: EditableContent = data.empty;

	function newItem() {
		selected = { ...data.empty, metadata: { contentType: 'posts' } };
	}

	function edit(item: EditableContent) {
		selected = { ...item, categories: [...item.categories], metadata: { ...item.metadata } };
	}
</script>

<svelte:head><title>Posts admin | Daniele Avolio</title></svelte:head>

<div class="cms-layout">
	<aside class="list-panel">
		<div class="list-heading">
			<h1>Posts</h1>
			<button type="button" on:click={newItem}>Nuovo</button>
		</div>
		<ul>
			{#each data.items as item}
				<li class:active={selected.slug === item.slug}>
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
						<input type="hidden" name="slug" value={item.slug} />
						<button type="submit" class="delete" aria-label={`Elimina ${item.title}`}>×</button>
					</form>
				</li>
			{/each}
		</ul>
	</aside>
	<section class="editor-panel">
		{#key selected.slug || selected}
			<AdminContentEditor item={selected} {form} />
		{/key}
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
