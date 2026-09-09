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
					<form method="POST" action="?/remove" use:enhance>
						<input type="hidden" name="slug" value={item.slug} />
						<button type="submit" class="delete" aria-label={`Elimina ${item.title}`}>×</button>
					</form>
				</li>
			{/each}
		</ul>
	</aside>
	<section class="editor-panel"><AdminContentEditor item={selected} {form} /></section>
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
