<script lang="ts">
	import { formatDate } from '$lib/utils';

	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<!-- TITLE -->
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p> Writing date: {formatDate(data.meta.date)}</p>
	</hgroup>

	<!-- tags -->
	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

	<!-- POST -->
	<div class="prose">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
	article {
		max-inline-size: 80ch;
		margin-inline: auto;
	}

	h1 {
		text-transform: capitalize;
	}

	h1 + p {
		margin-top: var(--size-2);
		color: var(--text-2);
	}

	.prose {
		margin-top: 1rem;
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: var(--size-7);
		flex-wrap: wrap;
	}

	.tags > * {
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radious-round);
	}
</style>
