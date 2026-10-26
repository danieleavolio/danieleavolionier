<script lang="ts">
	import { formatDate, calculateReadingTime } from '$lib/utils';
	import RichContent from '$lib/components/RichContent.svelte';
	import type { EditableContent } from '$lib/server/admin-content';

	export let item: EditableContent;

	$: categories = Array.isArray(item.categories) ? item.categories : [];
</script>

<article class="post-preview">
	<hgroup>
		<h1>{item.title || 'Senza titolo'}</h1>
		<h3>{item.description}</h3>
		<p>
			Data: {formatDate(item.date)} · {calculateReadingTime(item.contentHtml || item.description)}
			min di lettura
		</p>
	</hgroup>

	{#if categories.length}
		<div class="tags">
			{#each categories as category}
				<span class="tag">{category}</span>
			{/each}
		</div>
	{/if}

	{#if item.image}
		<img class="cover" src={item.image} alt={item.title} />
	{/if}

	<RichContent html={item.contentHtml} />
</article>

<style>
	.post-preview {
		max-width: 46rem;
		margin: 0 auto;
	}
	hgroup h1 {
		margin: 0;
		line-height: 1.25;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.tag {
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--automataColor);
		font-size: 0.8rem;
		letter-spacing: 0.05rem;
	}
	.cover {
		width: 100%;
		margin: 1rem 0;
	}
</style>
